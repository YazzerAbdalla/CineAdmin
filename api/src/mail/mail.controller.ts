import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service';
import { PassportJwtGuard } from 'src/auth/guards/passport-jwt.guard';
import { ExtendedRequest } from 'src/types/extendedRequest';
import { ApiInternalServerErrorResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('test')
  @UseGuards(PassportJwtGuard)
  @ApiOkResponse({
    description: 'The mail sent successfully. Check your inbox',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something unexpected went wrong.',
  })
  async sendMailer(@Request() request: ExtendedRequest) {
    await this.mailService.sendMail(request.user.userEmail);
    return { message: 'The mail sent successfully. Check your inbox' };
  }
}
