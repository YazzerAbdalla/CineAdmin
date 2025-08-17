import { apiErrorHandler } from "@/lib/api-error-handling";
import { CreateMovie, IMovie, UpdateMovie } from "@/types/movies";
import { UserQueryProps } from "@/types/query";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";

const headerOptions = (token: string) => {
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};
const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/movies`;
export const fetchMovieForAuthor = async (
  token?: string,
  query?: UserQueryProps
) => {
  let url = `${baseUrl}/author`;
  if (query) {
    const params = new URLSearchParams(
      query as Record<string, string>
    ).toString();
    url = `${url}?${params}`;
  }
  if (!token) {
    throw new Error("Invalid token");
  }

  try {
    const result = await axios(url, headerOptions(token));
    return result.data;
  } catch (error) {
    console.error("Something went wrong while fetching movies.", error);
    apiErrorHandler(error);
  }
};
export const fetchMovieForUser = async (query?: UserQueryProps) => {
  let url = baseUrl;
  if (query) {
    const params = new URLSearchParams(
      query as Record<string, string>
    ).toString();
    url = `${baseUrl}?${params}`;
  }

  try {
    const result = await axios(url);
    return result.data;
  } catch (error) {
    console.error("Something went wrong while fetching movies.", error);
    apiErrorHandler(error);
  }
};

export const loadMoreMovies = async (
  page: number,
  setMovies: Dispatch<SetStateAction<IMovie[] | undefined>>
): Promise<void> => {
  const limit = page + 1 * 10;

  try {
    const response = await fetchMovieForUser({ limit });

    if (response?.data) {
      setMovies(() => [...response.data]);
    }
  } catch (error) {
    console.error("❌ Failed to load more movies:", error);
    apiErrorHandler(error);
  }
};

export const decadeToISODate = (decade: string): number | string => {
  if (!decade || decade.toLowerCase() === "all") return "";
  const year = decade.replace("s", ""); // "2010s" => "2010"
  return parseInt(year);
};

export const updateSearchCount = async (movie: IMovie) => {
  try {
    if (!movie) {
      return;
    }
    const { id } = movie;
    const url = `${baseUrl}/${id}/trend`;
    const result = await axios.put(url);
    return result;
  } catch (error) {
    console.error("Error while update search count ", error);
    apiErrorHandler(error);
  }
};

export const fetchTrendingMovies = async () => {
  try {
    const url = `${baseUrl}/trends`;

    const trendsMovies = await axios.get(url);

    return trendsMovies.data;
  } catch (error) {
    console.error("Error while fetching trending movies.", error);
    apiErrorHandler(error);
  }
};

export const fetchOneMovieWithId = async (id: number) => {
  try {
    const result = await axios.get(`${baseUrl}/${id}`);
    return result.data;
  } catch (error) {
    console.error("Error while fetching movie by id.", error);
    apiErrorHandler(error);
  }
};

export const createMovie = async (
  createMovieProps: CreateMovie,
  token: string
) => {
  try {
    const url = baseUrl;
    const { data } = await axios.post(url, createMovieProps, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("Some thing went wrong while updating user comment.", error);

    apiErrorHandler(error);
  }
};

export const removeMovie = async (movieId: number, token: string) => {
  try {
    const url = `${baseUrl}/${movieId}`;
    const { data } = await axios.delete(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("Some thing went wrong while deleting user comment.", error);

    apiErrorHandler(error);
  }
};

export const updateMovie = async (
  movieId: number,
  token: string,
  updatedMovieProps: UpdateMovie
) => {
  try {
    const url = `${baseUrl}/${movieId}`;
    const { data } = await axios.patch(url, updatedMovieProps, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("Some thing went wrong while deleting user comment.", error);

    apiErrorHandler(error);
  }
};
