import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MovieModule } from './movie/movie.module';
import { RatingModule } from './rating/rating.module';
import { CommentModule } from './comment/comment.module';
import * as dotenv from 'dotenv';
import { User } from './user/entities/user.entity';
import { Movie } from './movie/entities/movie.entity';
import { Comment } from './comment/entities/comment.entity';
import { Rating } from './rating/entities/rating.entity';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { AdminModule } from './admin/admin.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { HttpModule } from '@nestjs/axios';
import { TrendsModule } from './trends/trends.module';
import { Trend } from './trends/entities/trend.entity';
dotenv.config();

const PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : '';
@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || '172.17.0.2',
      port: PORT || 5432,
      password: process.env.DB_PASSWORD,
      username: process.env.DB_USER,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== 'production',
      logging: true,
      entities: [User, Movie, Comment, Rating, Trend],
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 15 * 60 * 1000,
          limit: 100,
        },
      ],
    }),
    UserModule,
    MovieModule,
    RatingModule,
    CommentModule,
    AuthModule,
    MailModule,
    AdminModule,
    TrendsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
