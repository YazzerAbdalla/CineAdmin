import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const passwordRegEx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

export class CreateUserDto {
  @ApiProperty({
    example: 'John',
    description: 'First name of the user',
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  @MinLength(2, { message: 'First name must have at least 2 characters' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name of the user',
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  @MinLength(2, { message: 'Last name must have at least 2 characters' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  lastName: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Email address of the user',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  email: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description:
      'Password must be 8–20 characters long with at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
    minLength: 8,
    maxLength: 20,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @Matches(passwordRegEx, {
    message:
      'Password must contain 8–20 characters with at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
  })
  password: string;
}
