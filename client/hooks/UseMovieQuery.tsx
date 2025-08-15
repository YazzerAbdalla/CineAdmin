"use client";
import {
  decadeToISODate,
  fetchMovieForUser,
  updateSearchCount,
} from "@/api/movie-services";
import { useQuery } from "@tanstack/react-query";
import useMovieFilters from "./useMovieFilterReducer";
import { IMovie } from "@/types/movies";

const useMovieQuery = ({ page }: { page: number }) => {
  const { genre, searchTerm, selectedYear, dispatch, debouncedSearchTerm } =
    useMovieFilters();

  const normalizedGenre = genre === "All" ? "" : genre;
  const normalizedYear = selectedYear;

  const query: Record<string, string | number> = {
    offset: page * 10,
  };

  if (debouncedSearchTerm) query.title = debouncedSearchTerm;
  if (normalizedGenre) query.genre = normalizedGenre;
  if (normalizedYear && normalizedYear !== "all") {
    query.releaseDate = decadeToISODate(normalizedYear);
  }

  const {
    isError: error,
    data: movies,
    isLoading: isPending,
  } = useQuery({
    queryKey: ["movies", { page, debouncedSearchTerm, genre, selectedYear }],
    queryFn: async () => {
      const response = await fetchMovieForUser(query);
      if (debouncedSearchTerm && response.data[0]) {
        updateSearchCount(response.data[0]);
      }
      return response.data as IMovie[];
    },
  });

  return {
    error,
    movies,
    isPending,
    dispatch,
    genre,
    searchTerm,
    selectedYear,
    debouncedSearchTerm,
  };
};

export default useMovieQuery;
