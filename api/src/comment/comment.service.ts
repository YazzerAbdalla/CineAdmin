import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from 'src/movie/entities/movie.entity';
import { UserRequestPayload } from 'src/types/extendedRequest';
import { CommentQueryDto } from './dto/comments-query.dto';
import { rethrowIfKnown } from 'src/common/libs/errorHandler';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    movieId: number,
    userId: number,
  ) {
    try {
      const isMovieExist = await this.movieRepository.findOne({
        where: { id: movieId },
      });

      if (!isMovieExist) {
        throw new NotFoundException(`Movie with ID ${movieId} not found.`);
      }

      const newComment = this.commentRepository.create({
        ...createCommentDto,
        movieId,
        userId,
      });

      const savedComment = await this.commentRepository.save(newComment);

      return {
        message: 'Comment posted successfully.',
        data: savedComment,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      console.error('Error creating comment:', error);
      throw new InternalServerErrorException('Failed to post comment.');
    }
  }

  async remove(id: number, user: UserRequestPayload) {
    try {
      const comment = await this.commentRepository.findOne({ where: { id } });

      if (!comment) {
        throw new NotFoundException(`Comment with ID ${id} not found.`);
      }

      const { userId, userRole } = user;
      const isOwner = userId === comment.userId;
      const isAdmin = userRole === 'admin';

      if (!isOwner && !isAdmin) {
        throw new ForbiddenException(
          'You do not have permission to do this action.',
        );
      }

      await this.commentRepository.softDelete(id);

      return { message: 'Comment deleted successfully.' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      console.error('Error removing comment:', error);
      throw new InternalServerErrorException('Failed to delete comment.');
    }
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
    user: UserRequestPayload,
  ) {
    try {
      const comment = await this.commentRepository.findOne({ where: { id } });

      if (!comment) {
        throw new NotFoundException(`Comment with ID ${id} not found.`);
      }

      const { userId } = user;
      const isOwner = userId === comment.userId;

      if (!isOwner) {
        throw new ForbiddenException(
          'You are not authorized to update this comment.',
        );
      }
      if (!updateCommentDto.content) {
        throw new BadRequestException('Comment content is missing.');
      }

      comment.content = updateCommentDto.content;
      const updatedComment = await this.commentRepository.save(comment);

      return {
        message: 'Comment updated successfully.',
        data: updatedComment,
      };
    } catch (error) {
      console.error('Error updating comment:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update comment.');
    }
  }

  async findAll(id: number, userQuery: CommentQueryDto) {
    try {
      const { limit, offset } = userQuery;
      const query = this.commentRepository
        .createQueryBuilder('comment')
        .innerJoin('comment.user', 'user')
        .select([
          'comment.id',
          'comment.content',
          'comment.createdAt',
          'user.firstName',
          'user.lastName',
        ])
        .take(limit)
        .skip(offset);

      if (id) {
        query.andWhere('comment.movieId = :id', { id });
      }

      const [comments, total] = await query.getManyAndCount();

      return {
        message: 'Comments retrieved successfully.',
        data: comments,
        total,
        limit,
        offset,
      };
    } catch (error) {
      console.error('Error retrieving comments:', error);
      rethrowIfKnown(error);
      throw new InternalServerErrorException('Failed to retrieve comments.');
    }
  }

  async findAllComments() {
    try {
      const query = this.commentRepository
        .createQueryBuilder('comment')
        .innerJoin('comment.user', 'user')
        .select([
          'comment.id',
          'comment.content',
          'comment.createdAt',
          'comment.movieId',
          'user.firstName',
          'user.lastName',
        ]);

      const [comments, total] = await query.getManyAndCount();

      return {
        message: 'Comments retrieved successfully.',
        data: comments,
        total,
      };
    } catch (error) {
      rethrowIfKnown(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }
}
