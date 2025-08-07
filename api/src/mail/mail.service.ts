import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, RequestTimeoutException } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}

  async sendMail(email: string) {
    try {
      await this.mailService.sendMail({
        from: 'Mail Nest App <yasserabdalla149@gmail.com>',
        to: email,
        subject: 'Email test',
        template: 'test',
        context: { email },
      });
    } catch (error) {
      if (error) throw new RequestTimeoutException();
    }
  }
  async sendEmailVerification(email: string, verificationLink: string) {
    try {
      await this.mailService.sendMail({
        from: 'Mail Nest App <no-reply@nestjs-movie-platform.com>',
        to: email,
        subject: 'Email Verification',
        template: 'verify-email',
        context: { email, verificationLink },
      });
    } catch (error) {
      if (error) throw new RequestTimeoutException();
    }
  }

  async sendResetPasswordEmail(
    email: string,
    firstName: string,
    resetLink: string,
  ) {
    try {
      await this.mailService.sendMail({
        from: 'Mail Nest App <no-reply@nestjs-movie-platform.com>',
        to: email,
        subject: 'Reset Password',
        template: 'reset-password',
        context: { firstName, resetLink },
      });
    } catch (error) {
      console.error('Unexpected error.', error);

      if (error) throw new RequestTimeoutException();
    }
  }
}
