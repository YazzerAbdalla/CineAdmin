import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { ForgotPasswordDto } from 'src/auth/dto/forgot-password.dto';
import { resetPasswordDto } from 'src/auth/dto/reset-password.dto';

@ApiTags('User')
@Controller('api/users')
export class UserController {
  constructor(private readonly authService: AuthService) {}
  @Get('verify-email/:id/:verificationToken')
  @ApiOkResponse({
    description: 'Email verified successfully, Please log in to your account.',
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  verifyEmail(
    @Param('id') id: number,
    @Param('verificationToken') token: string,
  ) {
    return this.authService.verifyEmail(id, token);
  }

  @ApiOkResponse({
    description: 'Reset password email has been sent. Please check your inbox.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post('forgot-password')
  async forgotPasswordEmail(@Body() body: ForgotPasswordDto) {
    return this.authService.createResetPasswordLinkAndSendEmail(body.email);
  }

  @Post('reset-password/:id/:resetPasswordToken')
  @ApiOkResponse({ description: 'Password changed successfully.' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async resetPassword(
    @Param('id') id: number,
    @Param('resetPasswordToken') resetPasswordToken: string,
    @Body() body: resetPasswordDto,
  ) {
    return this.authService.resetUserPassword(
      id,
      resetPasswordToken,
      body.newPassword,
    );
  }
}
