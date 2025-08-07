import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

const passwordRegEx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
export class resetPasswordDto {
  @ApiProperty({
    description: 'The new account password',
    example: '213$uperM@n',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @Matches(passwordRegEx, {
    message:
      'Password must contain 8-20 characters with at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
  })
  newPassword: string;
}
