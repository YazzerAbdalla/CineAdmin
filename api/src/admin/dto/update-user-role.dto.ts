import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/user/dto/update-user.dto';

export class UpdateUserRoleDto {
  @ApiProperty({
    description: 'New role to assign to the user',
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  @IsEnum(UserRole, { message: 'Invalid role provided' })
  newRole: UserRole;
}
