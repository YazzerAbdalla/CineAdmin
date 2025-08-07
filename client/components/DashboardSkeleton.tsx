"use client";
import React from "react";
import { Card } from "./ui/card";

export default function DashboardSkeleton() {
  const rows = Array.from({ length: 5 });

  return (
    <Card className="bg-gray-900 border-gray-800">
      <div className="animate-pulse">
        {/* Tabs header skeleton */}
        <div className="flex w-full space-x-1 bg-gray-800 p-2 rounded">
          {["users", "movies", "comments"].map((_, i) => (
            <div key={i} className="h-8 flex-1 bg-gray-700 rounded" />
          ))}
        </div>

        {/* Tab content skeleton */}
        <div className="space-y-4 pt-6 px-6 pb-6">
          {/* Header + Search/Button */}
          <div className="flex justify-between items-center">
            <div className="h-6 w-48 bg-gray-700 rounded" />
            <div className="flex space-x-2">
              <div className="h-8 w-32 bg-gray-700 rounded" />
              <div className="h-8 w-64 bg-gray-700 rounded" />
            </div>
          </div>

          {/* Table skeleton */}
          <div className="overflow-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {Array(5)
                    .fill(null)
                    .map((_, i) => (
                      <th key={i} className="px-4 py-2 bg-gray-800">
                        <div className="h-4 bg-gray-700 rounded w-24 mx-auto" />
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((_, ri) => (
                  <tr key={ri} className="border-t border-gray-800">
                    {Array(5)
                      .fill(null)
                      .map((_, ci) => (
                        <td key={ci} className="px-4 py-2">
                          <div className="h-4 bg-gray-700 rounded w-full max-w-xs" />
                        </td>
                      ))}
                    <td className="px-4 py-2">
                      <div className="h-4 bg-gray-700 rounded w-8 mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
}
