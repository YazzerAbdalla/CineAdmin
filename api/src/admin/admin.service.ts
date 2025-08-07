import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/comment/entities/comment.entity';
import { Movie } from 'src/movie/entities/movie.entity';
import { Rating } from 'src/rating/entities/rating.entity';
import { User } from 'src/user/entities/user.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,

    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}
  async getSystemStatistics() {
    try {
      const [
        userCount,
        movieCount,
        approvedCount,
        pendingCount,
        ratingCount,
        avgRating,
        commentCount,
      ] = await Promise.all([
        this.userRepository.count(),
        this.movieRepository.count(),
        this.movieRepository.count({ where: { approved: true } }),
        this.movieRepository.count({ where: { approved: IsNull() } }),
        this.ratingRepository.count(),
        this.ratingRepository
          .createQueryBuilder('rating')
          .select('AVG(rating.rating)', 'avg')
          .getRawOne<{ avg: string }>()
          .then((res) => parseFloat(res?.avg ?? '0')), // 👈 fallback to '0' if null
        this.commentRepository.count(),
      ]);

      return {
        message: 'System statistics retrieved successfully.',
        data: {
          userCount,
          movieCount,
          approvedMovieCount: approvedCount,
          pendingMovieCount: pendingCount,
          ratingCount,
          averageRating: parseFloat(avgRating.toFixed(1)),
          commentCount,
        },
      };
    } catch (error) {
      console.error('Error fetching system statistics:', error);
      throw new InternalServerErrorException(
        'Failed to fetch system statistics.',
      );
    }
  }
}
