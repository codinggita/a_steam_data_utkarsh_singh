import React from 'react';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalResults = 0,
  pageSize = 10
}) => {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const getPagesArray = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show page 1
      pages.push(1);
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 2) {
        end = 4;
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }
      
      if (start > 2) pages.push('...');
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages - 1) pages.push('...');
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  const startIdx = Math.min((currentPage - 1) * pageSize + 1, totalResults);
  const endIdx = Math.min(currentPage * pageSize, totalResults);

  return (
    <div className="p-4 border-t-4 border-black dark:border-white bg-[#EAE7DC] dark:bg-neutral-900 flex flex-col sm:flex-row justify-between items-center font-label font-bold uppercase gap-4 text-black dark:text-white select-none">
      <div className="flex gap-2 flex-wrap justify-center">
        {/* PREV button */}
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-3 py-1 border-2 border-black dark:border-white disabled:opacity-50 disabled:pointer-events-none hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-none cursor-crosshair text-xs"
        >
          PREV
        </button>

        {/* Page numbers */}
        {getPagesArray().map((page, idx) => {
          if (page === '...') {
            return (
              <span key={`dots-${idx}`} className="px-2 py-1 text-xs">
                ...
              </span>
            );
          }
          
          const isActive = page === currentPage;
          return (
            <button
              key={`page-${page}`}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 border-2 border-black dark:border-white text-xs cursor-crosshair transition-none ${
                isActive
                  ? 'bg-black text-white dark:bg-white dark:text-black font-black'
                  : 'hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black bg-white dark:bg-neutral-800'
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* NEXT button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border-2 border-black dark:border-white disabled:opacity-50 disabled:pointer-events-none hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-none cursor-crosshair text-xs"
        >
          NEXT
        </button>
      </div>

      <div className="text-xs font-mono font-bold tracking-tight">
        SHOWING {startIdx}-{endIdx} OF {totalResults.toLocaleString()} RESULTS
      </div>
    </div>
  );
};

export default Pagination;
