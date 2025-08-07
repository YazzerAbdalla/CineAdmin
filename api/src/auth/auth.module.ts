import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import * as dotenv from 'dotenv';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportJwtStrategy } from './strategies/jwt-auth.strategy';
import { MailModule } from 'src/mail/mail.module';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
dotenv.config();

@Module({
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => UserModule),
    MailModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService, LocalStrategy, PassportJwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
