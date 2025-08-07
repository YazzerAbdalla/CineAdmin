import { PartialType } from '@nestjs/swagger';
import { CreateMovieDto } from './create-movie.dto';

// Define movie genres as enum for validation

export class UpdateMovieDto extends PartialType(CreateMovieDto) {}
