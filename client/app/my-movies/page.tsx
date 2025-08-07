/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import MovieForm from "@/components/MovieForm";
import Image from "next/image";
import Link from "next/link";
import { CreateMovie, IMovie, UpdateMovie } from "@/types/movies";
import {
  createMovie,
  fetchMovieForAuthor,
  removeMovie,
  updateMovie,
} from "@/api/movie-services";
import toast from "react-hot-toast";
import { isMovieChanged } from "@/lib/isMovieChanges";

const MyMovies = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<IMovie[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMovieFormOpen, setIsMovieFormOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<any>(null);

  const fetchMovies = async () => {
    const userId = user?.userId;
    if (!userId) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Invalid token");
    }

    try {
      const { data } = await fetchMovieForAuthor(token, { authorId: userId });
      setMovies(data);
      toast.success(`Hello, ${user?.userName?.firstName}`);
    } catch (err: any) {
      console.error("❌ Error fetching movies:", err);
      toast.error(err.message);
      setError("Failed to load movies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchMovies();
  }, [user?.userId]);

  if (!user || (user.userRole !== "author" && user.userRole !== "admin")) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400">
            You need to be an author or admin to access this page.
          </p>
        </div>
      </div>
    );
  }
  if (!movies || loading) {
    return (
      <div className="px-10 py-6">
        <div className="text-xl text-gray-400 ">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-10 py-6">
        <div className="text-xl text-red-500 ">{error}</div>
      </div>
    );
  }
  const refreshMovies = async () => {
    fetchMovies();
  };

  const handleAddMovie = async (movieData: CreateMovie) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    try {
      await createMovie(movieData, token);
      toast.success("Movie added successfully.");
      setIsMovieFormOpen(false);
      refreshMovies();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleUpdateMovie = async (movieData: UpdateMovie) => {
    const token = localStorage.getItem("accessToken");
    if (!token || !editingMovie) return;

    const originalMovie = movies.find((m) => m.id === editingMovie.id);

    if (!originalMovie) {
      toast.error("Original movie not found.");
      return;
    }

    if (!isMovieChanged(movieData, originalMovie)) {
      toast("No changes detected.", { icon: "ℹ️" });
      return;
    }

    try {
      toast.promise(updateMovie(editingMovie.id, token, movieData), {
        loading: "Saving...",
        success: <b>Movie Updated successfully.</b>,
        error: <b>Could not save.</b>,
      });
      setEditingMovie(null);
      setIsMovieFormOpen(false);
      refreshMovies();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteMovie = async (movieId: number) => {
    const token = localStorage.getItem("accessToken");

    if (!token) return;
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        await removeMovie(movieId, token);
        toast.success("Movie deleted successfully.");
        refreshMovies();
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  };

  const handleEditMovie = (movie: IMovie) => {
    setEditingMovie(movie);
    setIsMovieFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsMovieFormOpen(false);
    setEditingMovie(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">My Movies</h1>
            <p className="text-gray-400 mt-2">Manage your movie collection</p>
          </div>
          <Button
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            onClick={() => setIsMovieFormOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Movie
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Movies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {movies.length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Published
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {movies.filter((m) => m.approved).length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">
                {movies.filter((m) => !m.approved).length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Ratings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">
                {movies.reduce((sum, movie) => sum + movie.ratingCount, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Movies List */}
        <div className="space-y-6">
          {movies.map((movie) => (
            <Card key={movie.id} className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {/* Movie Poster */}
                  <div className="w-36 h-[calc(var(--spacing) * 54)] bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                      height={500}
                      width={500}
                    />
                  </div>

                  {/* Movie Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          {movie.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            className={
                              movie.approved
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : movie.approved == null
                                ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                : "bg-red-500/20 text-red-400 border-red-500/30"
                            }
                          >
                            {movie.approved
                              ? "approved"
                              : movie.approved == null
                              ? "pending"
                              : "rejected"}
                          </Badge>
                          <span className="text-gray-400 text-sm">
                            {new Date(movie.releaseDate).getFullYear()} •{" "}
                            {movie.duration}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/movie/${movie.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          onClick={() => {
                            handleEditMovie(movie);
                          }}
                          variant="ghost"
                          size="sm"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleDeleteMovie(movie.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {movie.genre.map((g: string) => (
                        <Badge key={g} variant="outline" className="text-xs">
                          {g}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {movie.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span>{movie.ratingAvg.toFixed(1)}</span>
                      </div>
                      <div>{movie.ratingCount} ratings</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {movies.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">No movies yet</h3>
              <p>Start by adding your first movie to the collection.</p>
            </div>
            <Button
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              onClick={() => setIsMovieFormOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Movie
            </Button>
          </div>
        )}
      </div>

      <MovieForm
        isOpen={isMovieFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingMovie ? handleUpdateMovie : handleAddMovie}
        movie={editingMovie}
        isEdit={!!editingMovie}
      />
    </div>
  );
};

export default MyMovies;
