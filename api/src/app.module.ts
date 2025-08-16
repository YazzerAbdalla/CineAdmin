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
      host: 'aws-1-eu-west-3.pooler.supabase.com',
      port: PORT || 5432,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      synchronize: process.env.NODE_ENV === 'production',
      logging: true,
      // ssl: true,
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
