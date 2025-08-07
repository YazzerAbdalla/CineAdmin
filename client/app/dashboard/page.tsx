"use client";
import React from "react";

import { useAuth } from "@/contexts/AuthContext";

import StatsCard from "@/components/StatsCard";
import ManagementTabs from "@/components/ManagementTabs";
import { DashboardProvider } from "@/contexts/DashboardContext";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user || user.userRole !== "admin") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400">
            You need to be an admin to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Manage your movie review platform</p>
        </div>

        {/* Stats Cards */}
        <StatsCard />

        {/* Management Tabs */}
        <DashboardProvider>
          <ManagementTabs />
        </DashboardProvider>
      </div>
    </div>
  );
};

export default Dashboard;
