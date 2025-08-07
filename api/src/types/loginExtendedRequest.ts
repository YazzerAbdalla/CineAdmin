import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';

export interface LoginExtendedRequest extends Request {
  user: User;
}
