export interface IMovie {
  id: number;
  title: string;
  description: string;
  genre: string[];
  releaseDate: string;
  duration: number;
  posterUrl: string;
  trailerUrl: null;
  authorId: number;
  ratingAvg: number;
  ratingCount: number;
  approved: boolean;
  popularity: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
}
export interface CreateMovie {
  /** Movie title (max 255 characters) */
  title: string;
  /** Movie description */
  description: string;

  /** Genres of the movie (max 10 items, each max 100 chars) */
  genre: string[];

  /** Release date in ISO format */
  releaseDate: Date;

  /** Duration in minutes */
  duration: number;

  /** Optional: URL to movie poster (max 500 characters) */
  posterUrl?: string;

  /** Optional: URL to movie trailer (max 500 characters) */
  trailerUrl: string | null;
}
export interface UpdateMovie {
  /** Movie title (max 255 characters) */
  title?: string;
  /** Movie description */
  description?: string;

  /** Genres of the movie (max 10 items, each max 100 chars) */
  genre?: string[];

  /** Release date in ISO format */
  releaseDate?: Date;

  /** Duration in minutes */
  duration?: number;

  /** Optional: URL to movie poster (max 500 characters) */
  posterUrl?: string;

  /** Optional: URL to movie trailer (max 500 characters) */
  trailerUrl: string | null;
}

export interface IMovieInArray {
  id: number;
  title: string;
  description: string;
  genre: string[];
  releaseDate: string;
  duration: number;
  posterUrl: string;
  trailerUrl: null;
  ratingAvg: number;
  ratingCount: number;
  approved: boolean;
  __author__: Author;
}

interface Author {
  firstName: string;
  lastName: string;
}
