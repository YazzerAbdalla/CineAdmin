"use client";
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import CommentEditDialog from "@/components/CommentEditDialog";
import {
  Star,
  Calendar,
  Clock,
  Edit,
  Trash2,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  createUserRating,
  fetchUserRating,
  updateUserRating,
} from "@/api/rating-service";
import { IMovie } from "@/types/movies";
import { IComment } from "@/types/Comment";
import { RatingProps } from "@/types/RatingProps";
import { fetchOneMovieWithId } from "@/api/movie-services";
import {
  fetchMovieComments,
  postComment,
  removeUserComment,
  updateUserComment,
} from "@/api/comment-service";
import dayjs from "@/lib/dayjs-config";

const MovieDetails = ({ params }: { params: Promise<{ id: number }> }) => {
  const [movie, setMovie] = useState<IMovie | null>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const [comment, setComment] = useState<string>("");
  const [editingComment, setEditingComment] = useState<IComment | null>(null);
  const [userRating, setUserRating] = useState<RatingProps | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    params.then(async ({ id }) => {
      await Promise.all([loadMovie(id), loadComments(id), loadUserRating(id)]);
    });
  }, []);

  const loadMovie = async (id: number) => {
    try {
      const { data } = await fetchOneMovieWithId(id);
      setMovie({ ...data, releaseDate: new Date(data.releaseDate) });
    } catch (err: any) {
      toast.error(err?.message || "Failed to load movie");
    }
  };

  const loadComments = async (id: number) => {
    try {
      const { data } = await fetchMovieComments(id);
      setComments(data);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load comments");
    }
  };

  const loadUserRating = async (id: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      const { data } = await fetchUserRating(+id, token);
      setUserRating(data);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load rating");
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!movie?.id || !comment || !token) return toast.error("Missing data");

    try {
      const { data } = await postComment(movie.id, comment, token);
      setComments((prev) => [...prev, { ...data, __user__: user!.userName }]);
      setComment("");
      toast.success("Comment posted");
    } catch (err: any) {
      toast.error(err?.message || "Failed to post comment");
    }
  };

  const handleEditComment = (commentToEdit: any) => {
    setEditingComment(commentToEdit);
  };

  const handleRating = async (rating: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token || !movie?.id) return;

    try {
      if (userRating) {
        await updateUserRating(userRating.id, rating, token);
        toast.success("Rating updated");
        setUserRating({ ...userRating, rating });
      } else {
        const { data } = await createUserRating(movie.id, token, rating);
        toast.success("Movie rated");
        setUserRating(data);
      }
    } catch (err: any) {
      toast.error(err?.message || "Rating failed");
    }
  };

  const handleSaveComment = async (id: number, content: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      await updateUserComment(id, content, token);
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, content } : c))
      );
      setEditingComment(null);
      toast.success("Comment updated");
    } catch (err: any) {
      toast.error(err?.message || "Update failed");
    }
  };

  const handleDeleteComment = async (id: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token || !window.confirm("Are you sure?")) return;

    try {
      await removeUserComment(id, token);
      setComments((prev) => prev.filter((c) => c.id !== id));
      toast.success("Comment deleted");
    } catch (err: any) {
      toast.error(err?.message || "Delete failed");
    }
  };

  const canEdit = (commentUser: string) =>
    user &&
    (user.userName.firstName === commentUser || user.userRole === "admin");

  const renderStars = (rating: number, interactive = false) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
        } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
        onClick={interactive ? () => handleRating(i + 1) : undefined}
      />
    ));

  if (!movie) return <p className="text-white text-center">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Movie Poster */}
          <div className="lg:col-span-1">
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full rounded-lg shadow-lg"
              width={500}
              height={500}
            />
          </div>

          {/* Movie Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center space-x-1">
                  {renderStars(Math.floor(movie.ratingAvg))}
                  <span className="text-white ml-2">{movie.ratingAvg}</span>
                  <span className="text-gray-400">
                    ({movie.ratingCount} reviews)
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {dayjs(movie.releaseDate)
                      .tz("Africa/Cairo") // or "Asia/Riyadh", "UTC", etc.
                      .format("MMMM D, YYYY h:mm A")}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{movie.duration}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genre.map((g) => (
                  <Badge
                    key={g}
                    className="bg-green-500/20 text-green-400 border-green-500/30"
                  >
                    {g}
                  </Badge>
                ))}
              </div>

              <p className="text-gray-300 text-lg leading-relaxed">
                {movie.description}
              </p>
            </div>

            {/* Trailer */}
            {movie.trailerUrl && (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Trailer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video">
                    <iframe
                      src={movie.trailerUrl}
                      title="Movie Trailer"
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* User Rating */}
            {user && (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Rate this movie</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    {userRating
                      ? renderStars(userRating.rating, true)
                      : renderStars(0, true)}
                    <span className="text-white ml-2">
                      {userRating && userRating.rating > 0
                        ? `${userRating.rating}/5`
                        : "Click to rate"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <MessageSquare className="w-6 h-6 mr-2" />
            Comments ({comments.length})
          </h2>

          {/* Comment Form */}
          {user && (
            <Card className="bg-gray-900 border-gray-800 mb-8">
              <CardContent className="pt-6">
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-white">Your rating:</span>
                    {userRating && renderStars(userRating?.rating, true)}
                  </div>
                  <Textarea
                    placeholder="Share your thoughts about this movie..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                    required
                  />
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    Post Comment
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <Card key={comment.id} className="bg-gray-900 border-gray-800">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-white font-semibold">
                        {`${comment.__user__.firstName} ${comment.__user__.lastName}`}
                      </h4>
                    </div>

                    {canEdit(comment.__user__.firstName) && (
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditComment(comment)}
                          className="text-gray-400 hover:text-green-400"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-300 mb-4">{comment.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <CommentEditDialog
        isOpen={!!editingComment}
        onClose={() => setEditingComment(null)}
        onSave={handleSaveComment}
        comment={editingComment}
      />
    </div>
  );
};

export default MovieDetails;
