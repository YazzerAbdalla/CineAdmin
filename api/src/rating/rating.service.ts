import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from 'src/movie/entities/movie.entity';
import { IMovie } from 'src/types/movie';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  private async updateMovieRatingAvgAndCount(
    userRating: number,
    movie: IMovie,
  ): Promise<void> {
    const previousAvg = movie.ratingAvg || 0;
    const previousCount = movie.ratingCount || 0;

    const updatedCount = previousCount + 1;
    const updatedAvg =
      (previousAvg * previousCount + userRating) / updatedCount;

    movie.ratingCount = Math.ceil(updatedCount);
    movie.ratingAvg = Math.ceil(parseFloat(updatedAvg.toFixed(1)));

    await this.movieRepository.save(movie);
  }

  async create(
    createRatingDto: CreateRatingDto,
    movieId: number,
    userId: number,
  ) {
    try {
      const { rating } = createRatingDto;

      // Validate required IDs and rating
      if (!movieId || typeof movieId !== 'number' || isNaN(movieId)) {
        throw new BadRequestException('Invalid or missing movieId.');
      }

      if (!userId || typeof userId !== 'number' || isNaN(userId)) {
        throw new BadRequestException('Invalid or missing userId.');
      }

      // Check if user already rated the movie
      const existingRating = await this.ratingRepository.findOne({
        where: { userId, movieId },
      });

      if (existingRating) {
        throw new BadRequestException({
          message: 'This user has already rated this movie before.',
          data: existingRating,
        });
      }

      // Ensure the movie exists
      const movie = await this.movieRepository.findOne({
        where: { id: movieId },
      });

      if (!movie) {
        throw new NotFoundException(`Movie with ID ${movieId} not found.`);
      }

      // Create and save the new rating
      const newRating = this.ratingRepository.create({
        ...createRatingDto,
        movieId,
        userId,
      });
      const savedRating = await this.ratingRepository.save(newRating);

      // Update movie rating average and count
      await this.updateMovieRatingAvgAndCount(rating, movie);

      return {
        message: 'Rating created successfully.',
        data: savedRating,
      };
    } catch (error: any) {
      console.error('Error creating rating:', error);

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to create rating.');
    }
  }

  async update(id: number, updateRatingDto: UpdateRatingDto, userId: number) {
    try {
      // Validate rating ID and user ID
      if (!Number.isInteger(id) || id <= 0) {
        throw new BadRequestException('Invalid or missing rating ID.');
      }

      if (!Number.isInteger(userId) || userId <= 0) {
        throw new BadRequestException('Invalid or missing user I.');
      }

      const existingRating = await this.ratingRepository.findOne({
        where: { id },
      });

      if (!existingRating) {
        throw new NotFoundException(`Rating with ID ${id} not found.`);
      }

      // Ensure the rating belongs to the user
      if (userId !== existingRating.userId) {
        throw new UnauthorizedException(
          'You are not authorized to update this rating.',
        );
      }

      // Validate new rating value
      const newRating = updateRatingDto.rating;
      if (
        typeof newRating !== 'number' ||
        !Number.isInteger(newRating) ||
        newRating < 1 ||
        newRating > 5
      ) {
        throw new BadRequestException(
          'Rating must be an integer between 1 and 5.',
        );
      }

      // Update rating
      existingRating.rating = newRating;
      const updatedRating = await this.ratingRepository.save(existingRating);

      return {
        message: 'Rating updated successfully.',
        data: updatedRating,
      };
    } catch (error) {
      console.error('Error updating rating:', error);

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to update rating.');
    }
  }

  findAll() {
    return `This action returns all rating`;
  }

  async findOne(movieId: number, userId: number) {
    try {
      const rate = await this.ratingRepository.findOne({
        where: { movieId, userId },
      });

      if (!rate) {
        return { message: 'There is no rating from this user for this movie.' };
      }

      return { message: 'User rate retrieved successfully.', data: rate };
    } catch (error) {
      console.error('Error fetching user rating:', error);

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to fetch user rating.');
    }
  }
}
