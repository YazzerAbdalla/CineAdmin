import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment content between 2 and 255 letters.',
    minLength: 2,
    maximum: 255,
    example: 'This is swagger comment.',
  })
  @IsString({ message: 'Comment content must be a string' })
  @IsNotEmpty({ message: 'Comment content is missing' })
  @MinLength(2, { message: 'Comment content must have at least 2 characters' })
  @MaxLength(255, { message: 'Comment content must not exceed 255 characters' })
  content: string;
}
