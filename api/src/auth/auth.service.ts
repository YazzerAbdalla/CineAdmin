import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { SignInDto } from 'src/auth/dto/signInDto';
import { JwtPayloadProps } from 'src/types/jwtPayload';
import { randomBytes } from 'node:crypto';
import * as dotenv from 'dotenv';
import { MailService } from 'src/mail/mail.service';
import { UserRole } from 'src/types/user';
import { rethrowIfKnown } from 'src/common/libs/errorHandler';
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      // checks if email already exist
      const isUserExist = await this.userService.getUserByEmail(
        createUserDto.email,
      );

      if (isUserExist) {
        throw new BadRequestException('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

      // Create and save user's data
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
        verificationToken: randomBytes(32).toString('hex'),
        role: UserRole.USER,
      });
      await this.userRepository.save(user);

      // Create the user verification link
      const link = `${process.env.DOMAIN}/api/users/verify-email/${user.id}/${user.verificationToken}`;

      // Send the verification email to user
      await this.mailService.sendEmailVerification(user.email, link);

      return {
        message:
          'User registered successfully. Please check your email to verify your account.',
      };
    } catch (error) {
      // Handle different types of errors
      if (error instanceof BadRequestException) {
        // Re-throw validation errors with original message
        throw error;
      }

      // Generic error message for unexpected errors
      throw new InternalServerErrorException(
        'Something went wrong during registration. Please try again.',
      );
    }
  }
  // Used local strategy
  async validateUser(signInDto: SignInDto) {
    const user = await this.userService.getUserByEmail(signInDto.email);

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      return null;
    }
    return user;
  }

  async login(user: User | null) {
    try {
      if (!user) {
        throw new UnauthorizedException('Invalid email or password.');
      }

      const payload: JwtPayloadProps = {
        sub: user.id,
        email: user.email,
        role: user.role ?? 'user',
        userName: { firstName: user.firstName, lastName: user.lastName },
      };

      const accessToken = await this.jwtService.signAsync(payload);

      return {
        message: 'User signed in successfully.',
        accessToken,
        userId: user.id,
        userName: { firstName: user.firstName, lastName: user.lastName },
        userRole: user.role,
        userEmail: user.email,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      console.error('Login error:', error); // Optional: log the full error in dev

      throw new InternalServerErrorException(
        'An unexpected error occurred. Please try again later.',
      );
    }
  }

  async verifyEmail(id: number, token: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id, verificationToken: token },
      });

      if (!user) {
        throw new UnauthorizedException(
          'Invalid or expired verification link.',
        );
      }

      // Optional: Mark user as verified
      user.verificationToken = null;
      user.isEmailVerified = true; // if you have this column
      await this.userRepository.save(user);

      return {
        message: 'Email verified successfully, Please log in to your account.',
      };
    } catch (error) {
      // If it's already an HTTP exception, rethrow it
      if (error instanceof UnauthorizedException) throw error;

      // Unexpected error
      throw new InternalServerErrorException(
        'Something went wrong during email verification.',
      );
    }
  }

  async createResetPasswordLinkAndSendEmail(email: string) {
    try {
      const user = await this.userService.getUserByEmail(email);

      if (!user) {
        throw new BadRequestException(
          'No account found with this email address.',
        );
      }

      // Generate and save reset token
      const resetToken = randomBytes(32).toString('hex');
      user.resetPasswordToken = resetToken;
      await this.userRepository.save(user);

      // Build reset password link
      // TODO: change this to the real frontend domain
      const resetLink = `${process.env.FRONTEND_DOMAIN}/reset-password/${user.id}/${resetToken}`;

      // Send reset email
      await this.mailService.sendResetPasswordEmail(
        user.email,
        user.firstName,
        resetLink,
      );

      return {
        message: 'Reset password email has been sent. Please check your inbox.',
      };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      throw new InternalServerErrorException(
        'An error occurred while processing the password reset request.',
      );
    }
  }

  async resetUserPassword(
    userId: number,
    resetPasswordToken: string,
    newPassword: string,
  ) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId, resetPasswordToken },
      });
      if (!user) {
        throw new BadRequestException(
          'Invalid or expired password reset token. Please request a new one.',
        );
      }

      // Reset the users password and set the reset password token null
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.resetPasswordToken = null;
      user.password = hashedPassword;
      await this.userRepository.save(user);

      return { message: 'Password changed successfully.' };
    } catch (error: any) {
      console.error('Field to reset user password', error);
      rethrowIfKnown(error);
    }
  }
}
