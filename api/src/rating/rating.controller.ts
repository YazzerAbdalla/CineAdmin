import {
  Controller,
  Body,
  Param,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
  Post,
  Get,
  ParseIntPipe,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PassportJwtGuard } from 'src/auth/guards/passport-jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { ExtendedRequest } from 'src/types/extendedRequest';
import { CreateRatingDto } from './dto/create-rating.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

@ApiTags('Ratings')
@ApiBearerAuth()
@Controller()
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post('movies/:id/ratings')
  @ApiOperation({ summary: 'Create a rating for a movie' })
  @ApiParam({
    name: 'id',
    description: 'ID of the movie to rate',
    type: Number,
  })
  @ApiBody({ type: CreateRatingDto })
  @ApiOkResponse({ description: 'Rating created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid rating data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  @Roles('user')
  @UseGuards(PassportJwtGuard, RoleGuard)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  createRating(
    @Body() createRatingDto: CreateRatingDto,
    @Request() request: ExtendedRequest,
    @Param() params: { id: number },
  ) {
    const movieId = +params.id;
    const userId = request.user.userId;
    return this.ratingService.create({ ...createRatingDto }, movieId, userId);
  }

  @Put('ratings/:id')
  @ApiOperation({ summary: 'Update an existing rating' })
  @ApiParam({
    name: 'id',
    description: 'ID of the rating to update',
    type: Number,
  })
  @ApiBody({ type: UpdateRatingDto })
  @ApiOkResponse({ description: 'Rating updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid rating update data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user or invalid role' })
  @ApiNotFoundResponse({ description: 'Rating or movie not found' })
  @Roles('user')
  @UseGuards(PassportJwtGuard, RoleGuard)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  updateRating(
    @Body() updateRatingDto: UpdateRatingDto,
    @Request() request: ExtendedRequest,
    @Param() params: { id: number },
  ) {
    const userId = request.user.userId;
    const rateId = +params.id;

    return this.ratingService.update(
      rateId,
      {
        ...updateRatingDto,
      },
      userId,
    );
  }

  @Get('movies/:id/ratings')
  @UseGuards(PassportJwtGuard)
  @ApiOperation({ summary: 'Get user’s rating for a movie' })
  @ApiParam({ name: 'id', description: 'Movie ID', type: Number })
  @ApiOkResponse({ description: 'User rating fetched successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  getUserRate(
    @Param('id', ParseIntPipe) movieId: number,
    @Request() request: ExtendedRequest,
  ) {
    return this.ratingService.findOne(movieId, request.user.userId);
  }
}
