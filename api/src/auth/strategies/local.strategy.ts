import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    try {
      const user = await this.authService.validateUser({ email, password });

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // if (!user.isEmailVerified) {
      //   throw new UnauthorizedException(
      //     'Email is not verified, Please check your inbox and verify your account.',
      //   );
      // }

      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
    }
  }
}
