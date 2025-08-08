"use client";
import { Filter, Search } from "lucide-react";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import MoviesContainer from "@/components/MoviesContainer";
import { parseAsInteger, useQueryState } from "nuqs";
import useMovieQuery from "@/hooks/UseMovieQuery";
import MoviePagination from "./MoviePagination";

const genres = [
  "All",
  "Action",
  "Sci-Fi",
  "Drama",
  "Crime",
  "Thriller",
  "Romance",
];
const years = ["All", "2020s", "2010s", "2000s", "1990s"];

const MoviesFilterContainer = () => {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(0));

  const {
    error,
    movies,
    isPending,
    dispatch,
    genre,
    searchTerm,
    selectedYear,
  } = useMovieQuery({ page });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gray-900 rounded-2xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Filter className="w-6 h-6 mr-2 text-green-400" />
          Discover Movies
        </h2>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search Bar */}
          <div className="relative w-full md:w-[70%]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) =>
                dispatch({ type: "setSearchTerm", payload: e.target.value })
              }
              className="pl-10 bg-gray-800 border-gray-700 text-white w-full"
            />
          </div>

          {/* Genre Filter */}
          <div className="w-full md:w-[15%]">
            <Select
              value={genre}
              onValueChange={(value) =>
                dispatch({ type: "setGenre", payload: value })
              }
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-green-400 w-full font-semibold">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year Filter */}
          <div className="w-full md:w-[15%]">
            <Select
              value={selectedYear}
              onValueChange={(value) =>
                dispatch({ type: "setSelectedYear", payload: value })
              }
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 font-semibold text-green-400 w-full">
                <SelectValue placeholder="Release Year" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {years.map((year) => (
                  <SelectItem key={year} value={year.toLowerCase()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      {error ? (
        <h1 className="text-red-400 font-semibold">Some thing went wrong.</h1>
      ) : (
        <div className="flex flex-col gap-3">
          <MoviesContainer movies={movies} isLoading={isPending} />
          <MoviePagination page={page} setPage={setPage} />
        </div>
      )}
    </div>
  );
};

export default MoviesFilterContainer;
