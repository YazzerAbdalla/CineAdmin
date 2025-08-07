import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsInt,
  IsUrl,
  MaxLength,
  IsArray,
  ArrayNotEmpty,
  ArrayMaxSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({ description: 'Movie title', example: 'Inception' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'Movie description',
    example: 'A thief who steals corporate secrets ...',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Genres of the movie',
    example: ['Action', 'Drama'],
    isArray: true,
    type: String,
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true }) // 👈 validates each item is string
  @MaxLength(100, { each: true }) // 👈 each genre max 100 chars
  @ArrayMaxSize(10) // optional: limit to 10 genres max
  genre: string[];

  @ApiProperty({
    description: 'Release date (ISO format)',
    example: '2025-12-31',
  })
  @IsDateString()
  releaseDate: Date;

  @ApiProperty({ description: 'Duration in minutes', example: 120 })
  @IsInt()
  duration: number;

  @ApiPropertyOptional({
    description: 'URL to movie poster',
    example: 'https://example.com/poster.jpg',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  @MaxLength(500)
  posterUrl?: string;

  @ApiPropertyOptional({
    description: 'URL to movie trailer',
    example: 'https://example.com/trailer.mp4',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  @MaxLength(500)
  trailerUrl?: string;
}
