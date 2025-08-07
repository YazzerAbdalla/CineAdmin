import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
  Query,
  Put,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieSeedService } from './movie-seed.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { QueryDto } from './dto/query.dto';
import { PassportJwtGuard } from 'src/auth/guards/passport-jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ExtendedRequest } from 'src/types/extendedRequest';
import { Throttle } from '@nestjs/throttler';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Movies')
@Throttle({ default: { limit: 100, ttl: 6000 } })
@Controller('movies')
export class MovieController {
  constructor(
    private readonly movieService: MovieService,
    private readonly movieSeedService: MovieSeedService,
  ) {}

  // ========== PUBLIC ROUTES ==========

  @Get()
  @ApiOperation({ summary: 'Get all approved movies with optional filters' })
  @ApiResponse({
    status: 200,
    description: 'List of movies retrieved successfully.',
  })
  @Throttle({ default: { limit: 1000, ttl: 6000 } })
  findAll(@Query() queryDto: QueryDto) {
    const modifiedQuery = { ...queryDto, approved: true };

    return this.movieService.findAll(modifiedQuery);
  }

  @Get('author')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all approved movies with optional filters' })
  @ApiResponse({
    status: 200,
    description: 'List of movies retrieved successfully.',
  })
  @Roles('author')
  @UseGuards(PassportJwtGuard, RoleGuard)
  @Throttle({ default: { limit: 1000, ttl: 6000 } })
  findAllForAuthor(@Query() queryDto: QueryDto) {
    const modifiedQuery = { ...queryDto, approved: null };

    return this.movieService.findAll(modifiedQuery);
  }

  @Get('trends')
  @ApiOperation({ summary: 'Fetch top 5 trending/popular movies' })
  @Throttle({ default: { limit: 1000, ttl: 6000 } })
  fetchTrendMovies() {
    return this.movieService.fetchPopularMovies();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get movie by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Movie retrieved successfully.' })
  findOne(@Param('id') id: number) {
    return this.movieService.findOne(+id);
  }

  // ========== PROTECTED ROUTES (AUTHOR/ADMIN) ==========

  @Post()
  @ApiBearerAuth()
  @Roles('author', 'admin')
  @UseGuards(PassportJwtGuard, RoleGuard)
  @ApiOperation({ summary: 'Create a new movie (Author/Admin only)' })
  @ApiResponse({ status: 201, description: 'Movie created successfully.' })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  create(
    @Body() createMovieDto: CreateMovieDto,
    @Request() request: ExtendedRequest,
  ) {
    return this.movieService.create(createMovieDto, request.user.userId);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles('author', 'admin')
  @UseGuards(PassportJwtGuard, RoleGuard)
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Update a movie by ID (Author/Admin only)' })
  @ApiResponse({ status: 200, description: 'Movie updated successfully.' })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  update(
    @Param('id') id: number,
    @Body() updateMovieDto: UpdateMovieDto,
    @Request() request: ExtendedRequest,
  ) {
    return this.movieService.update(id, updateMovieDto, request.user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles('author', 'admin')
  @UseGuards(PassportJwtGuard, RoleGuard)
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Delete a movie by ID (Author/Admin only)' })
  @ApiResponse({ status: 200, description: 'Movie deleted successfully.' })
  remove(@Param('id') id: number, @Request() request: ExtendedRequest) {
    return this.movieService.remove(id, request.user);
  }

  // ========== ADMIN ONLY ROUTES ==========

  @Post('add-seed')
  @ApiBearerAuth()
  @Roles('admin')
  @UseGuards(PassportJwtGuard, RoleGuard)
  @ApiOperation({ summary: 'Add seed data from TMDB (Admin only)' })
  @ApiResponse({ status: 201, description: 'Seed added successfully.' })
  fetchMoviesFromTmdb() {
    return this.movieSeedService.fetchMoviesFromTmdb();
  }

  // ========== TRENDING LOGIC ==========
  @Put(':id/trend')
  @ApiOperation({ summary: 'Update movie popularity score by ID' })
  updateMoviePopularity(@Param('id') id: number) {
    return this.movieService.updateMoviePopularity(id);
  }
}
