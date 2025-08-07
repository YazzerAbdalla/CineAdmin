import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';

// Define role enum for better type safety and validation
enum UserRole {
  USER = 'user',
  AUTHOR = 'author',
  ADMIN = 'admin',
}

// Fixed regex pattern (was missing backslash before 'd')
const passwordRegEx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name cannot be empty' })
  @MinLength(2, { message: 'First name must have at least 2 characters' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name cannot be empty' })
  @MinLength(2, { message: 'Last name must have at least 2 characters' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  lastName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  email?: string;

  @IsOptional()
  @IsEnum(UserRole, {
    message: `Role must be one of: ${Object.values(UserRole).join(', ')}`,
  })
  role?: UserRole;

  // Note: Password updates should typically be handled by a separate endpoint
  // with additional security measures like current password verification
}

// Separate DTO for password changes (more secure)
export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Current password is required' })
  @IsString({ message: 'Current password must be a string' })
  currentPassword: string;

  @IsNotEmpty({ message: 'New password is required' })
  @IsString({ message: 'New password must be a string' })
  @Matches(passwordRegEx, {
    message:
      'New password must contain 8-20 characters with at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
  })
  newPassword: string;
}

// Export the enum for use in other files
export { UserRole };
