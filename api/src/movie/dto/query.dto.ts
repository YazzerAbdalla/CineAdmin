import { IsOptional, IsString, IsInt, Min, IsIn, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryDto {
  @ApiPropertyOptional({
    description: 'Number of results to return (pagination limit)',
    example: 10,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Number of results to skip (pagination offset)',
    example: 0,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;

  @ApiPropertyOptional({
    description: 'Filter movies by title (partial match)',
    example: 'Inception',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Filter movies by genre (partial match)',
    example: 'Action',
  })
  @IsOptional()
  @IsString()
  genre?: string;

  // ... other fields

  @ApiPropertyOptional({
    description: 'Filter by release year (4-digit)',
    example: 2024,
    minimum: 1800,
    maximum: 2100,
  })
  @IsOptional()
  @Type(() => Number) // ensures query string is converted to number
  @IsInt({ message: 'releaseYear must be an integer' })
  @Min(1800, { message: 'releaseYear must be after 1800' })
  @Max(2100, { message: 'releaseYear must be before 2100' })
  releaseDate?: number;

  @ApiPropertyOptional({
    description: 'Sort order by ratingAvg',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'], { message: 'sort must be ASC or DESC' })
  sort?: 'ASC' | 'DESC';

  @ApiPropertyOptional({
    description: 'Filter by author user ID',
    example: 5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'authorId must be an integer' })
  authorId?: number;
}
