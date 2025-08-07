"use client";
import {
  deleteComment,
  deleteMovie,
  deleteUser,
  fetchAllComments,
  fetchAllMovies,
  fetchAllUsers,
  updateMovieStatus,
  updateUserRole,
} from "@/api/admin-service";
import { createMovie, updateMovie } from "@/api/movie-services";
import { IUser, UserRoles } from "@/types/AuthProps";
import { IAdminComment } from "@/types/Comment";
import { CreateMovie, IMovieInArray, UpdateMovie } from "@/types/movies";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import toast from "react-hot-toast";
import { useDebounce } from "react-use";

interface UseDashboardReturns {
  isPending: boolean;
  error: string | null;
  users: IUser[];
  comments: IAdminComment[];
  movies: IMovieInArray[];
  handleAddMovie: (movieData: CreateMovie) => Promise<void>;
  handleDeleteMovie: (movieId: number) => Promise<void>;
  handleUpdateMovie: (movieData: UpdateMovie) => Promise<void>;
  handleEditMovie: (movie: IMovieInArray) => void;
  handleApproveMovie: (movieId: number) => Promise<void>;
  handleRejectMovie: (movieId: number) => void;

  handleDeleteUser: (userId: number) => Promise<void>;
  handleUpdateUserRole: (userId: number, newRole: UserRoles) => Promise<void>;
  handleDeleteComment: (commentId: number) => Promise<void>;
  isMovieFormOpen: boolean;
  editingMovie: IMovieInArray | null | undefined;
  setIsMovieFormOpen: Dispatch<SetStateAction<boolean>>;
  setEditingMovie: Dispatch<SetStateAction<IMovieInArray | null | undefined>>;
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
}

export const DashboardContext = createContext<UseDashboardReturns | undefined>(
  undefined
);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be provided with DashboardProvider");
  }
  return context;
};

export const DashboardProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState<IUser[]>([]);
  const [movies, setMovies] = useState<IMovieInArray[]>([]);
  const [comments, setComments] = useState<IAdminComment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isMovieFormOpen, setIsMovieFormOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<IMovieInArray | null>();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 800, [searchTerm]);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";

  // 🔽 Fetch All Data
  const fetchData = async () => {
    if (!token) {
      setError("No token found");
      return;
    }

    const [userData, moviesData, commentsData] = await Promise.all([
      fetchAllUsers(token),
      fetchAllMovies(token, {}),
      fetchAllComments(token),
    ]);

    setUsers(userData || []);
    setMovies(moviesData || []);
    setComments(commentsData || []);
  };

  useEffect(() => {
    startTransition(() => {
      fetchData();
    });
  }, []);

  const fetchMovies = useCallback(async () => {
    const data = await fetchAllMovies(token, { title: debouncedSearchTerm });
    setMovies(data || []);
  }, [token, debouncedSearchTerm]);

  useEffect(() => {
    fetchMovies(); // refetch only movies when search changes
  }, [debouncedSearchTerm]);

  const handleApproveMovie = async (movieId: number) => {
    toast.promise(updateMovieStatus(token, true, movieId), {
      loading: "loading...",
      success: () => {
        // 🔽 Optimistically update the movie in local state
        setMovies((prevMovies) =>
          prevMovies.map((movie) =>
            movie.id === movieId ? { ...movie, approved: true } : movie
          )
        );
        return "Movie approved successfully";
      },
      error: `Failed to approve this movie with ID ${movieId}`,
    });
  };

  const handleRejectMovie = (movieId: number) => {
    toast.promise(updateMovieStatus(token, false, movieId), {
      loading: "loading...",
      success: () => {
        // 🔽 Optimistically update the movie in local state
        setMovies((prevMovies) =>
          prevMovies.map((movie) =>
            movie.id === movieId ? { ...movie, approved: false } : movie
          )
        );
        return "Movie rejected successfully";
      },
      error: `Failed to reject this movie with ID ${movieId}`,
    });
    fetchData();
  };

  const handleUpdateUserRole = async (userId: number, newRole: UserRoles) => {
    toast.promise(updateUserRole(token, newRole, userId), {
      loading: "loading...",
      success: () => {
        setUsers((users) =>
          users.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
        return `User role updated successfully to ${newRole}.`;
      },
      error: `Failed to update user role to ${newRole}.`,
    });
  };

  const handleDeleteMovie = async (movieId: number) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      toast.promise(deleteMovie(token, movieId), {
        loading: "loading...",
        success: () => {
          setMovies(() => movies.filter((movie) => movie.id !== movieId));
          return "Movie deleted successfully.";
        },
        error: "Failed to deleted movie.",
      });
    }
  };
  const handleDeleteUser = async (userId: number) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      toast.promise(deleteUser(token, userId), {
        loading: "loading...",
        success: () => {
          setUsers(() => users.filter((user) => user.id !== userId));
          return "User deleted successfully.";
        },
        error: "Failed to deleted user.",
      });
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      toast.promise(deleteComment(token, commentId), {
        loading: "loading...",
        success: () => {
          setComments(() =>
            comments.filter((comment) => comment.id !== commentId)
          );
          return "Comment deleted successfully.";
        },
        error: "Failed to deleted comment.",
      });
    }
  };

  const handleEditMovie = (movie: IMovieInArray) => {
    setEditingMovie(movie);
    setIsMovieFormOpen(true);
  };

  const handleAddMovie = async (movieData: CreateMovie) => {
    toast.promise(createMovie({ ...movieData }, token), {
      loading: "loading...",
      success: () => {
        const newMovie = { ...movieData } as unknown as IMovieInArray;
        setMovies(() => [...movies, newMovie]);
        return "Movie added successfully.";
      },
      error: "Failed to add this movie.",
    });
    await createMovie({ ...movieData }, token);
    toast.success("Movie added");
    fetchData();
  };

  const handleUpdateMovie = async (movieData: UpdateMovie) => {
    if (editingMovie) {
      toast.promise(updateMovie(editingMovie.id, token, movieData), {
        loading: "loading...",
        success: "Movie updated successfully.",
        error: "Failed to update this movie.",
      });
      setEditingMovie(null);
      toast.success("Movie updated");
      fetchData();
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        isPending,
        error,
        users,
        comments,
        movies,
        handleApproveMovie,
        handleRejectMovie,
        handleUpdateUserRole,
        handleDeleteMovie,
        handleDeleteUser,
        handleDeleteComment,
        handleEditMovie,
        handleAddMovie,
        handleUpdateMovie,
        isMovieFormOpen,
        editingMovie,
        setIsMovieFormOpen,
        setEditingMovie,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
