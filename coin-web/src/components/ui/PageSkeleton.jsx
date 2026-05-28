import React from 'react';

const PageSkeleton = () => {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-32 mt-4 md:mt-0"></div>
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-28 bg-gray-200 rounded-2xl"></div>
        <div className="h-28 bg-gray-200 rounded-2xl"></div>
        <div className="h-28 bg-gray-200 rounded-2xl"></div>
      </div>

      {/* Main Content Skeleton */}
      <div className="space-y-4 mt-8">
        <div className="h-20 bg-gray-200 rounded-2xl w-full"></div>
        <div className="h-20 bg-gray-200 rounded-2xl w-full"></div>
        <div className="h-20 bg-gray-200 rounded-2xl w-full"></div>
      </div>
    </div>
  );
};

export default PageSkeleton;
