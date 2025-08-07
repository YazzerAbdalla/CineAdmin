import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ExtendedRequest } from 'src/types/extendedRequest';
import { PassportJwtGuard } from './guards/passport-jwt.guard';
import { PassportLocalGuard } from './guards/passport-local.guard';
import { LoginExtendedRequest } from 'src/types/loginExtendedRequest';
import { Throttle } from '@nestjs/throttler';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { SignInDto } from './dto/signInDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  @ApiCreatedResponse({
    description:
      'User registered successfully. Please check your email to verify your account.',
  })
  @ApiBadRequestResponse({ description: 'User with this email already exists' })
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000, blockDuration: 5000 } })
  @HttpCode(HttpStatus.OK)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  @UseGuards(PassportLocalGuard)
  @ApiOkResponse({ description: 'User signed in successfully.' })
  @ApiBadRequestResponse({
    description: 'Bad request - possible reasons',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'Invalid email or password.',
          'Email is not verified, Please check your inbox and verify your account.',
        ],
        error: 'Bad Request',
      },
    },
  })
  async login(
    @Body() body: SignInDto,
    @Request() request: LoginExtendedRequest,
  ) {
    return await this.authService.login(request.user);
  }

  @Get('me')
  @UseGuards(PassportJwtGuard)
  @Throttle({ default: { limit: 100, ttl: 6000 } })
  @ApiOkResponse({ description: 'User info fetched successfully.' })
  @ApiBadRequestResponse({ description: 'Invalid or expired token.' })
  @ApiInternalServerErrorResponse({
    description: 'Something unexpected comes.',
  })
  getInfo(@Request() request: ExtendedRequest) {
    return request.user;
  }
}
