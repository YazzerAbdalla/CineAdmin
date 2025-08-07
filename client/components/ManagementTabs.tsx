import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import MovieForm from "./MovieForm";
import DashboardSkeleton from "./DashboardSkeleton";
import toast from "react-hot-toast";
import UserTable from "./UserTable";
import MovieTable from "./MovieTable";
import { useDashboard } from "@/contexts/DashboardContext";
import CommentsTable from "./CommentsTable";

const ManagementTabs = () => {
  const {
    isPending,
    error,
    handleAddMovie,
    handleUpdateMovie,
    isMovieFormOpen,
    editingMovie,
    setIsMovieFormOpen,
    setEditingMovie,
  } = useDashboard();

  const handleCloseForm = () => {
    setIsMovieFormOpen(false);
    setEditingMovie(null);
  };

  if (isPending) {
    <DashboardSkeleton />;
  }

  if (error) {
    toast.error(error);
  }

  return (
    <>
      <Card className="bg-gray-900 border-gray-800">
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-green-600"
            >
              Users
            </TabsTrigger>
            <TabsTrigger
              value="movies"
              className="data-[state=active]:bg-green-600"
            >
              Movies
            </TabsTrigger>
            <TabsTrigger
              value="comments"
              className="data-[state=active]:bg-green-600"
            >
              Comments
            </TabsTrigger>
          </TabsList>
          <UserTable />
          <MovieTable />
          <CommentsTable />
        </Tabs>
      </Card>
      <MovieForm
        isOpen={isMovieFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingMovie ? handleUpdateMovie : handleAddMovie}
        movie={editingMovie}
        isEdit={!!editingMovie}
      />
    </>
  );
};

export default ManagementTabs;
