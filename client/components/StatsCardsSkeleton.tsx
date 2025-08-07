'use client';
import { CustomSkeleton } from './CustomSkeleton';

export default function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {Array(5).fill(null).map((_, idx) => (
        <div
          key={idx}
          className="bg-gray-900 border-gray-800 p-4 space-y-2 rounded"
        >
          <div className="flex items-center justify-between">
            <CustomSkeleton className="h-4 w-24" />
            <CustomSkeleton className="h-4 w-4 rounded-full" />
          </div>
          <CustomSkeleton className="h-8 w-3/4" />
          <CustomSkeleton className="h-4 w-1/3" />
        </div>
      ))}
    </div>
  );
}
