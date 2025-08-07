export interface IComment {
  id: number;
  content: string;
  createdAt: string;
  __user__: User;
}
interface User {
  firstName: string;
  lastName: string;
}

export interface IAdminComment extends IComment {
  movieId: number;
}
