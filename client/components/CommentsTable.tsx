import React from "react";
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
import { Eye, Link, MoreHorizontal, Search, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { useDashboard } from "@/contexts/DashboardContext";

const CommentsTable = () => {
  const { comments, handleDeleteComment } = useDashboard();
  return (
    <TabsContent value="comments" className="space-y-4">
      <div className="flex justify-between items-center p-6 pb-4">
        <h3 className="text-lg font-semibold text-white">Comment Management</h3>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search comments..."
              className="pl-10 bg-gray-800 border-gray-700 text-white w-64"
            />
          </div>
        </div>
      </div>
      <div className="px-6 pb-6">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800">
              <TableHead className="text-gray-400">User</TableHead>
              <TableHead className="text-gray-400">Movie</TableHead>
              <TableHead className="text-gray-400">Comment</TableHead>
              <TableHead className="text-gray-400">Date</TableHead>
              <TableHead className="text-gray-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments?.map((comment) => {
              return (
                <TableRow key={comment.id} className="border-gray-800">
                  <TableCell className="text-white font-medium">
                    {comment.__user__.firstName +
                      " " +
                      comment.__user__.lastName}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {comment.movieId || "Unknown Movie"}
                  </TableCell>
                  <TableCell className="text-gray-300 max-w-xs truncate">
                    {comment.content}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {comment.createdAt}
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
                          <Link href={`/movie/${comment.movieId}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Full
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-400 hover:bg-red-500/10"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </TabsContent>
  );
};

export default CommentsTable;
