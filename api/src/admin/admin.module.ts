import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from 'src/movie/entities/movie.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CommentService } from 'src/comment/comment.service';
import { MovieService } from 'src/movie/movie.service';
import { AdminService } from './admin.service';
import { Rating } from 'src/rating/entities/rating.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Movie, Comment, Rating])],
  providers: [UserService, CommentService, MovieService, AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
