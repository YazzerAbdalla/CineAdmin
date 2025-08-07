import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CommentQueryDto {
  @ApiPropertyOptional({
    description: 'Maximum number of comments to return',
    example: 10,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer.' })
  @Min(1, { message: 'Limit must be at least 1.' })
  limit?: number;

  @ApiPropertyOptional({
    description:
      'Number of comments to skip before starting to collect the result set',
    example: 0,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Offset must be an integer.' })
  @Min(0, { message: 'Offset must be at least 0.' })
  offset?: number;
}
