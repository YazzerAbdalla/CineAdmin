import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MailModule } from 'src/mail/mail.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MailModule,
    forwardRef(() => AuthModule),
  ],
  providers: [UserService],
  controllers: [UserController], // Remove if you don't have a controller
  exports: [UserService, TypeOrmModule], // Export if other modules need to use UserService
})
export class UserModule {}
