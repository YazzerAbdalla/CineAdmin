export interface IRating {
  id: number;
  userId: number;
  movieId: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}
