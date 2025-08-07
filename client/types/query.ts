export interface UserQueryProps {
  limit?: number; // Number of results to return (pagination limit)
  offset?: number; // Number of results to skip (pagination offset)
  title?: string; // Filter movies by title (partial match)
  genre?: string; // Filter movies by genre (partial match)
  releaseDate?: string | number; // Filter by release date (ISO format)
  sort?: "ASC" | "DESC"; // Sort order by ratingAvg
  authorId?: number;
}

export interface AdminQueryProps extends UserQueryProps {
  approve?: boolean;
}
