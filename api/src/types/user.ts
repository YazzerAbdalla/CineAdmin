// types/entities.types.ts
export enum UserRole {
  AUTHOR = 'author',
  USER = 'user',
  ADMIN = 'admin',
}

// Base interfaces for type safety
export interface IUser {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  verificationToken?: string | null;
  resetPasswordToken?: string | null;
  isEmailVerified: boolean;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
