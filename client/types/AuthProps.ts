export interface IUser {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  verificationToken: null;
  resetPasswordToken: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
}
export interface User {
  userId: number;
  userRole: UserRoles;
  userName: UserName;
  userEmail: string;
}
interface UserName {
  firstName: string;
  lastName: string;
}

export interface LoginResponseProps extends User {
  accessToken: string;
  message: string;
}

export interface RegisterProps {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export enum UserRoles {
  admin = "admin",
  author = "author",
  user = "user",
}
