import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Movie } from 'src/movie/entities/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Movie])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
