import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailController } from './mail.controller';
import { join } from 'node:path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new EjsAdapter(),
      },
    }),
  ],
  providers: [MailService],
  controllers: [MailController],
  exports: [MailService],
})
export class MailModule {}
