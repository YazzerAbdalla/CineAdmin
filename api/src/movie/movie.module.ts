import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { RatingModule } from 'src/rating/rating.module';
import { MovieSeedService } from './movie-seed.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Movie]), RatingModule, HttpModule],
  controllers: [MovieController],
  providers: [MovieService, MovieSeedService],
})
export class MovieModule {}
