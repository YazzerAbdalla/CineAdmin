import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as dotenv from 'dotenv';
import { UserRole } from './dto/update-user.dto';
dotenv.config();

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }
  // Admin services
  async listAllUsers() {
    try {
      const users = await this.userRepository.find({ withDeleted: true });
      if (!users) {
        throw new InternalServerErrorException();
      }
      const total = users.length;
      return {
        message: 'Users retrieved successfully.',
        data: users,
        total,
      };
    } catch (error) {
      console.error('Unexpected error retrieve all users.', error);

      throw new InternalServerErrorException(
        'Something went wrong while retrieving all users.',
      );
    }
  }

  async updateUserRole(userId: number, updatedRole: UserRole) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`This user ID #${userId} not found.`);
      }
      user.role = updatedRole;
      await this.userRepository.save(user);
      return { message: "User's role updated successfully.", data: user };
    } catch (error) {
      console.error('Unexpected error while updating user role.', error);

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Something went wrong while updating user's role.",
      );
    }
  }

  async deleteUser(userId: number) {
    try {
      const result = await this.userRepository.softDelete(userId);
      if (result.affected === 0 || !result.affected) {
        throw new NotFoundException(`This user ID #${userId} not found.`);
      }
      return {
        message: 'User deleted successfully.',
      };
    } catch (error) {
      console.error('Unexpected error while deleting user.', error);

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Something went wrong while deleting user.',
      );
    }
  }
}
