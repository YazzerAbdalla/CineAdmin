import { IsInt, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTrendDto {
  @ApiProperty({
    description: 'The search keyword used by users',
    example: 'Inception',
  })
  @IsString()
  @IsNotEmpty()
  searchTerm: string;

  @ApiProperty({
    description: 'URL to the movie poster',
    example: 'https://image.tmdb.org/t/p/w500/xyz123.jpg',
  })
  @IsUrl()
  posterUrl: string;

  @ApiProperty({
    description: 'The ID of the related movie',
    example: 42,
  })
  @IsInt()
  movieId: number;
}
