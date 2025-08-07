import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { UserRequestPayload } from 'src/types/extendedRequest';
import { QueryDto } from './dto/query.dto';
import { AdminQueryDto } from 'src/admin/dto/admin-movie-query.dto';
import { rethrowIfKnown } from 'src/common/libs/errorHandler';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async create(createMovieDto: CreateMovieDto, authorId: number) {
    try {
      const movie = this.movieRepository.create({
        ...createMovieDto,
        authorId,
        approved: null,
      });
      await this.movieRepository.save(movie);

      return {
        message: 'Movie created successfully.',
        data: movie,
      };
    } catch (error) {
      console.error('Error creating movie:', error);
      throw new InternalServerErrorException('Failed to create movie.');
    }
  }

  async remove(id: number, user: UserRequestPayload) {
    try {
      const movie = await this.movieRepository.findOne({ where: { id } });

      if (!movie) {
        throw new NotFoundException(`Movie with ID ${id} not found.`);
      }

      const isAllowed =
        user.userRole === 'admin' || movie.authorId === user.userId;
      if (!isAllowed) {
        throw new UnauthorizedException(
          'You are not authorized to perform this action.',
        );
      }

      const result = await this.movieRepository.softDelete(id);

      if (result.affected === 0) {
        throw new InternalServerErrorException(
          'Something went wrong in movie delete.',
        );
      }
      return {
        message: 'Movie deleted successfully.',
      };
    } catch (error) {
      console.error('Error deleting movie:', error);
      rethrowIfKnown(error);
      throw new InternalServerErrorException('Failed to delete movie.');
    }
  }

  async update(
    id: number,
    updateMovieDto: UpdateMovieDto,
    user: UserRequestPayload,
  ) {
    try {
      const movie = await this.movieRepository.findOne({ where: { id } });

      if (!movie) {
        throw new NotFoundException(`Movie with ID ${id} not found.`);
      }

      const isAllowed =
        user.userRole !== 'admin' || movie.authorId !== user.userId;
      if (!isAllowed) {
        throw new UnauthorizedException(
          'You are not authorized to perform this action.',
        );
      }

      const updatedMovie = this.movieRepository.merge(movie, updateMovieDto);
      await this.movieRepository.save(updatedMovie);

      return {
        message: 'Movie updated successfully.',
        data: updatedMovie,
      };
    } catch (error) {
      console.error('Error updating movie:', error);
      rethrowIfKnown(error);

      throw new InternalServerErrorException('Failed to update movie.');
    }
  }

  private buildMovieQuery(query: QueryDto | AdminQueryDto) {
    const { title, genre, releaseDate, limit = 10, offset = 0 } = query;

    const queryBuilder = this.movieRepository
      .createQueryBuilder('movie')
      .innerJoin('movie.author', 'user')
      .select([
        'movie.id',
        'movie.title',
        'movie.genre',
        'movie.description',
        'movie.releaseDate',
        'movie.ratingAvg',
        'movie.ratingCount',
        'movie.posterUrl',
        'movie.trailerUrl',
        'movie.duration',
        'movie.approved',
        'user.firstName',
        'user.lastName',
      ]);

    // Optional filters
    if ('approved' in query && typeof query.approved === 'boolean') {
      queryBuilder.andWhere('movie.approved = :approved', {
        approved: query.approved,
      });
    } else if (!('approved' in query)) {
      queryBuilder.andWhere('movie.approved = :approved', {
        approved: true, // default for public queries
      });
    } else if ('approved' in query && query.approved == 'null') {
      queryBuilder.andWhere('movie.approved IS NULL');
    }

    if (title) {
      queryBuilder.andWhere('movie.title ILIKE :title', {
        title: `%${title}%`,
      });
    }

    if (genre) {
      queryBuilder.andWhere(':genre = ANY(movie.genre)', {
        genre,
      });
    }

    if (releaseDate) {
      const startDate = `${releaseDate}-01-01`;
      const endDate = `${releaseDate + 9}-12-31`;

      queryBuilder.andWhere('movie.releaseDate BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      });
    }

    if (query.authorId) {
      queryBuilder.andWhere('user.id = :authorId', {
        authorId: query.authorId,
      });
    }

    queryBuilder.orderBy('movie.ratingAvg', 'DESC');

    queryBuilder.take(limit).skip(offset);

    return queryBuilder;
  }

  async findAll(query: QueryDto) {
    try {
      const queryBuilder = this.buildMovieQuery(query);
      const [movies, total] = await queryBuilder.getManyAndCount();
      return {
        message: 'Movies retrieved successfully.',
        data: movies,
        total,
      };
    } catch (error) {
      console.error('Error retrieving movies:', error);
      throw new InternalServerErrorException('Failed to retrieve movies.');
    }
  }

  async findOne(id: number) {
    try {
      if (!id || isNaN(+id)) {
        throw new BadRequestException('Invalid movie ID');
      }
      const movie = await this.movieRepository.findOne({ where: { id } });

      if (!movie) {
        throw new NotFoundException(`Movie with ID ${id} not found.`);
      }

      return {
        message: 'Movie retrieved successfully.',
        data: movie,
      };
    } catch (error) {
      console.error('Error finding movie:', error);
      rethrowIfKnown(error);
      throw new InternalServerErrorException('Failed to retrieve movie.');
    }
  }

  // Admin services
  async findAllForAdmin(query: AdminQueryDto) {
    try {
      const modifiedQuery = { ...query, approved: 'All' };
      const queryBuilder = this.buildMovieQuery(modifiedQuery);
      const [movies, total] = await queryBuilder.getManyAndCount();
      return {
        message: 'Admin movie list retrieved successfully.',
        data: movies,
        total,
      };
    } catch (error) {
      console.error('Error retrieving movies (admin):', error);
      throw new InternalServerErrorException(
        'Failed to retrieve admin movies.',
      );
    }
  }

  async updateMovieStatus(movieId: number, status: boolean) {
    try {
      if (!movieId || typeof movieId !== 'number' || isNaN(movieId)) {
        throw new BadRequestException('Invalid movie ID.');
      }

      if (typeof status !== 'boolean') {
        throw new BadRequestException('Invalid passed status type.');
      }

      const movie = await this.movieRepository.findOne({
        where: { id: movieId },
      });

      if (!movie) {
        throw new NotFoundException(`Movie with ID ${movieId} not found.`);
      }

      movie.approved = status;
      const updatedMovie = await this.movieRepository.save(movie);

      return {
        message: `Movie has been updated successfully to status ${status}.`,
        data: updatedMovie,
      };
    } catch (error) {
      console.error('Error updating movie approval status:', error);

      rethrowIfKnown(error);

      throw new InternalServerErrorException('Failed to update movie status.');
    }
  }

  async updateMoviePopularity(movieId: number) {
    try {
      const movie = await this.movieRepository.findOne({
        where: { id: movieId },
      });
      if (!movie) {
        throw new BadRequestException();
      }
      movie.popularity += 1;
      await this.movieRepository.save(movie);
      return { message: 'Movie popularity updated successfully.' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Field to update the movie popularity prop.',
      );
    }
  }

  async fetchPopularMovies() {
    try {
      const result = await this.movieRepository.find({
        where: {
          approved: true,
        },
        order: { popularity: 'DESC' },
        take: 5,
      });
      return result;
    } catch (error) {
      console.error('Failed to fetch popular movies:', error);
      throw new InternalServerErrorException('Failed to fetch popular movies');
    }
  }

  //TODO: Add file upload for movie posters
}
