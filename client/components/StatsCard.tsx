import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Film, MessageSquare, Star, Users } from "lucide-react";
import useFetchStats from "@/hooks/UseFetchStats";
import StatsCardsSkeleton from "./StatsCardsSkeleton";

const StatsCard = () => {
  const [isPending, stats] = useFetchStats();
  if (isPending) {
    return <StatsCardsSkeleton />;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">
            Total Users
          </CardTitle>
          <Users className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {stats?.userCount}
          </div>
          <p className="text-xs text-green-400">+12% from last month</p>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">
            Pending Movies
          </CardTitle>
          <Film className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {stats?.pendingMovieCount}
          </div>
          <p className="text-xs text-green-400">+8% from last month</p>
        </CardContent>
      </Card>
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">
            Total Movies
          </CardTitle>
          <Film className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {stats?.movieCount}
          </div>
          <p className="text-xs text-green-400">+8% from last month</p>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">
            Total Comments
          </CardTitle>
          <MessageSquare className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {stats?.commentCount}
          </div>
          <p className="text-xs text-green-400">+23% from last month</p>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">
            Avg Rating
          </CardTitle>
          <Star className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {stats?.averageRating.toFixed(1)}
          </div>
          <p className="text-xs text-green-400">+0.2 from last month</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCard;
