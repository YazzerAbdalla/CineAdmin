export interface IComment {
  id: number;
  userId: number;
  movieId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
