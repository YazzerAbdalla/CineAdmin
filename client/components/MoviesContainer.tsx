import { IMovie } from "@/types/movies";
import React from "react";
import MovieCard from "./MovieCard";

interface MoviesContainerProps {
  movies?: IMovie[];
  isLoading: boolean;
}

const MoviesContainer: React.FC<MoviesContainerProps> = ({
  movies,
  isLoading,
}) => {
  return (
    <div>
      {!movies || movies.length == 0 ? (
        <h1 className="text-gray-400 font-bold">
          There is no movies right now.
        </h1>
      ) : isLoading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <>
          {/* Movies Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterUrl={movie.posterUrl}
                ratingAvg={movie.ratingAvg}
                ratingCount={movie.ratingCount}
                genre={movie.genre}
                releaseDate={movie.releaseDate}
                description={movie.description}
                duration={movie.duration}
                trailerUrl={null}
                authorId={0}
                approved={false}
                popularity={0}
                createdAt={""}
                updatedAt={""}
                deletedAt={null}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MoviesContainer;
