import { Request } from 'express';
export interface UserRequestPayload {
  userId: number;
  userEmail: string;
  userRole: 'author' | 'admin' | 'user';
}

export interface ExtendedRequest extends Request {
  user: UserRequestPayload;
}
