export interface JwtPayloadProps {
  sub: number;
  email: string;
  role: 'user' | 'author' | 'admin';
  userName: UserName;
}
export interface UserName {
  firstName: string;
  lastName: string;
}
