import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'The email address used to sign in',
  })
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  email: string;

  @ApiProperty({
    example: 'StrongPass123!',
    description: 'Password must be at least 6 characters long.',
    minLength: 6,
  })
  @IsString({ message: 'Password must be a string.' })
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  password: string;
}
