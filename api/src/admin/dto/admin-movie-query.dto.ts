import { Transform } from 'class-transformer';
import { IsOptional, IsIn } from 'class-validator';
import { QueryDto } from 'src/movie/dto/query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AdminQueryDto extends QueryDto {
  @ApiPropertyOptional({
    description: 'Filter movies by approval status (true, false, or "null")',
    type: String,
    example: 'true',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === 'null') return 'null';
    return undefined;
  })
  @IsIn([true, false, 'null'], {
    message: 'approved must be true, false, or "null"',
  })
  approved?: boolean | 'null';
}
