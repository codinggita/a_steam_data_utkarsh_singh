import React from 'react';

export const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  const renderCardSkeleton = (key) => (
    <div 
      key={key} 
      className="border-2 border-black dark:border-white bg-white dark:bg-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full flex flex-col gap-4 animate-pulse mb-4"
    >
      <div className="h-4 bg-neutral-300 dark:bg-neutral-800 w-1/3" />
      <div className="h-8 bg-neutral-300 dark:bg-neutral-800 w-2/3" />
      <div className="space-y-2">
        <div className="h-3 bg-neutral-300 dark:bg-neutral-800 w-full" />
        <div className="h-3 bg-neutral-300 dark:bg-neutral-800 w-4/5" />
      </div>
    </div>
  );

  const renderTableSkeleton = () => (
    <div className="border-2 border-black dark:border-white bg-white dark:bg-black w-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse">
      <div className="h-10 bg-black dark:bg-neutral-900 border-b border-black" />
      <div className="p-4 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-4 bg-neutral-300 dark:bg-neutral-800 flex-1" />
            <div className="h-4 bg-neutral-300 dark:bg-neutral-800 flex-1" />
            <div className="h-4 bg-neutral-300 dark:bg-neutral-800 flex-1" />
            <div className="h-4 bg-neutral-300 dark:bg-neutral-800 flex-1 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {type === 'table' ? (
        renderTableSkeleton()
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(count)].map((_, i) => renderCardSkeleton(i))}
        </div>
      )}
    </div>
  );
};

export default LoadingSkeleton;
