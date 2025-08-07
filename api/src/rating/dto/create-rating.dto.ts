import { IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty({
    description: 'Rating value between 1 and 5 (allows max one decimal place)',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsNumber(
    { maxDecimalPlaces: 1 },
    { message: 'Rating must be a number with max one decimal place' },
  )
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must not exceed 5' })
  rating: number;
}
