"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateMovie, IMovieInArray } from "@/types/movies";

const movieSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().min(1, "Description is required"),
  posterUrl: z.string().url("Poster must be a valid URL"),
  trailerUrl: z
    .string()
    .url("Trailer must be a valid URL")
    .nullable()
    .optional(),
  releaseDate: z
    .string()
    .regex(/\d{4}-\d{2}-\d{2}/, "Release date must be in yyyy-mm-dd format"),
  duration: z.coerce
    .number()
    .int()
    .min(1, "Duration must be a positive number"),
  genre: z
    .array(z.string().min(1).max(100))
    .min(1, "At least one genre is required")
    .max(10, "You can add up to 10 genres"),
});

type MovieFormValues = z.infer<typeof movieSchema>;

interface MovieFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (movie: Omit<CreateMovie, "id">) => void;
  movie?: IMovieInArray | null;
  isEdit?: boolean;
}

const MovieForm: React.FC<MovieFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  movie,
  isEdit = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    watch,
  } = useForm<MovieFormValues>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      title: "",
      description: "",
      posterUrl: "",
      trailerUrl: "",
      releaseDate: new Date().toISOString().split("T")[0],
      duration: 0,
      genre: [],
    },
  });

  const [genreInput, setGenreInput] = useState("");
  const [loading, setLoading] = useState(false);
  const genres = watch("genre");

  useEffect(() => {
    if (movie && isEdit) {
      reset({
        title: movie.title,
        description: movie.description,
        posterUrl: movie.posterUrl,
        trailerUrl: movie.trailerUrl,
        releaseDate: new Date(movie.releaseDate).toISOString().split("T")[0],
        duration: movie.duration,
        genre: movie.genre,
      });
    } else {
      reset();
    }
  }, [movie, isEdit, isOpen, reset]);

  const addGenre = () => {
    const val = genreInput.trim();
    if (val && !genres.includes(val)) {
      setValue("genre", [...genres, val]);
      setGenreInput("");
    }
  };

  const removeGenre = (g: string) => {
    setValue(
      "genre",
      genres.filter((item) => item !== g)
    );
  };

  const onValidSubmit = (data: MovieFormValues) => {
    setLoading(true);
    const trailerUrlCheck = !data.trailerUrl ? null : data.trailerUrl;
    const modifiedData = {
      ...data,
      releaseDate: new Date(data.releaseDate),
      trailerUrl: trailerUrlCheck,
    };
    onSubmit(modifiedData);
    onClose();
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Movie" : "Add New Movie"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-4">
          {[
            { label: "Title", name: "title", type: "text" },
            { label: "Description", name: "description", component: Textarea },
            { label: "Poster URL", name: "posterUrl", type: "url" },
            { label: "Trailer URL", name: "trailerUrl", type: "url" },
          ].map(({ label, name, type, component: Component = Input }) => (
            <div key={name}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              <Component
                {...register(name as keyof MovieFormValues)}
                className="bg-gray-800 text-white"
                type={type}
              />
              {errors[name as keyof MovieFormValues] && (
                <p className="text-red-500 text-sm">
                  {errors[name as keyof MovieFormValues]?.message as string}
                </p>
              )}
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Release Date
              </label>
              <Input
                type="date"
                {...register("releaseDate")}
                className="bg-gray-800 text-white"
              />
              {errors.releaseDate && (
                <p className="text-red-500 text-sm">
                  {errors.releaseDate.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Duration (min)
              </label>
              <Input
                type="number"
                {...register("duration")}
                className="bg-gray-800 text-white"
              />
              {errors.duration && (
                <p className="text-red-500 text-sm">
                  {errors.duration.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Genres</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={genreInput}
                onChange={(e) => setGenreInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addGenre())
                }
                className="bg-gray-800 text-white"
              />
              <Button
                type="button"
                onClick={addGenre}
                className="bg-green-600 hover:bg-green-700"
              >
                Add
              </Button>
            </div>
            {errors.genre && (
              <p className="text-red-500 text-sm">{errors.genre.message}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {genres.map((g) => (
                <Badge
                  key={g}
                  className="bg-green-500/20 text-green-400 border-green-500/30"
                >
                  {g}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => removeGenre(g)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              disabled={loading}
              type="submit"
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : isEdit ? (
                "Update Movie"
              ) : (
                "Add Movie"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MovieForm;
