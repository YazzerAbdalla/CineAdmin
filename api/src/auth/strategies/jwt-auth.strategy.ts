import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadProps, UserName } from 'src/types/jwtPayload';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class PassportJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'fallback-secret-key',
    });
  }

  validate(payload: JwtPayloadProps): {
    userId: number;
    userEmail: string;
    userRole: string;
    userName: UserName;
  } {
    try {
      if (!payload || typeof payload !== 'object') {
        throw new UnauthorizedException('Invalid token structure.');
      }

      const {
        sub: userId,
        email: userEmail,
        role: userRole,
        userName,
      } = payload;

      if (!userId || !userEmail) {
        throw new UnauthorizedException('Invalid or missing token data.');
      }

      return {
        userId,
        userEmail,
        userRole: userRole ?? 'user',
        userName,
      };
    } catch (error) {
      console.error('Unexpected error.', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw error;
    }
  }
}
