import React from "react";
import dayjs from "@/lib/dayjs-config";
import { TabsContent } from "./ui/tabs";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Badge,
  CheckCircle,
  Edit,
  Eye,
  MoreHorizontal,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useDashboard } from "@/contexts/DashboardContext";
import { Input } from "./ui/input";
import Link from "next/link";

const MovieTable = () => {
  const {
    movies,
    handleApproveMovie,
    handleDeleteMovie,
    handleRejectMovie,
    handleEditMovie,
    setSearchTerm,
    setIsMovieFormOpen,
    comments,
  } = useDashboard();

  const getStatusColor = (status: boolean | null) => {
    switch (status) {
      case true:
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case null:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case false:
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <TabsContent value="movies" className="space-y-4">
      <div className="flex justify-between items-center p-6 pb-4">
        <h3 className="text-lg font-semibold text-white">Movie Management</h3>
        <div className="flex space-x-2">
          <Button
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            onClick={() => setIsMovieFormOpen(true)}
          >
            Add Movie
          </Button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search movies..."
              className="pl-10 bg-gray-800 border-gray-700 text-white w-64"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="px-6 pb-6">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800">
              <TableHead className="text-gray-400">Title</TableHead>
              <TableHead className="text-gray-400">Author</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400">Rating</TableHead>
              <TableHead className="text-gray-400">Comments</TableHead>
              <TableHead className="text-gray-400">Created</TableHead>
              <TableHead className="text-gray-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movies?.map((movie) => (
              <TableRow key={movie.id} className="border-gray-800">
                <TableCell className="text-white font-medium">
                  {movie.title}
                </TableCell>
                <TableCell className="text-gray-300">
                  {movie.__author__.firstName + " " + movie.__author__.lastName}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(movie.approved)}>
                      {movie.approved
                        ? "approved"
                        : movie.approved === false
                        ? "rejected"
                        : "pending"}
                    </Badge>
                    {movie.approved === null && (
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApproveMovie(movie.id)}
                          className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRejectMovie(movie.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">
                  {movie.ratingAvg}
                </TableCell>
                <TableCell className="text-gray-300">
                  {comments?.filter((c) => c.movieId === movie.id).length}
                </TableCell>
                <TableCell className="text-gray-300">
                  {dayjs(movie.releaseDate)
                    .tz("Africa/Cairo") // or "Asia/Riyadh", "UTC", etc.
                    .format("MMMM D, YYYY h:mm A")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-800 border-gray-700">
                      <DropdownMenuItem
                        className="text-gray-300 hover:bg-gray-700"
                        asChild
                      >
                        <Link href={`/movie/${movie.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-gray-300 hover:bg-gray-700"
                        onClick={() => handleEditMovie(movie)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {movie.approved === null && (
                        <>
                          <DropdownMenuItem
                            className="text-green-400 hover:bg-green-500/10"
                            onClick={() => handleApproveMovie(movie.id)}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-400 hover:bg-red-500/10"
                            onClick={() => handleRejectMovie(movie.id)}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                      {movie.approved && (
                        <DropdownMenuItem
                          className="text-red-400 hover:bg-red-500/10"
                          onClick={() => handleRejectMovie(movie.id)}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </DropdownMenuItem>
                      )}
                      {movie.approved === false && (
                        <DropdownMenuItem
                          className="text-green-400 hover:bg-green-500/10"
                          onClick={() => handleApproveMovie(movie.id)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-red-400 hover:bg-red-500/10"
                        onClick={() => handleDeleteMovie(movie.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TabsContent>
  );
};

export default MovieTable;
