export interface IMovie {
  id: number;
  title: string;
  description: string;
  genre: string[];
  releaseDate: Date;
  duration: number;
  posterUrl?: string;
  trailerUrl?: string | null;
  authorId: number;
  ratingCount: number;
  ratingAvg: number;
  approved?: boolean | null;
  createdAt: Date;
  updatedAt: Date;
}
