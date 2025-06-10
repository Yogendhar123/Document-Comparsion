import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Difference } from '../types';
import { DifferenceCard } from './DifferenceCard';

interface PaginatedDifferencesProps {
  differences: Difference[];
  searchQuery: string;
  pageNo: number;
}

export const PaginatedDifferences: React.FC<PaginatedDifferencesProps> = ({ 
  differences, 
  searchQuery, 
  pageNo 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredDifferences = useMemo(() => {
    return differences.filter(diff => 
      !searchQuery || 
      diff.Original.toLowerCase().includes(searchQuery.toLowerCase()) ||
      diff.Revised.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [differences, searchQuery]);

  const totalPages = Math.ceil(filteredDifferences.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDifferences = filteredDifferences.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (filteredDifferences.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No differences found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pagination Info */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          Showing {startIndex + 1}-{Math.min(endIndex, filteredDifferences.length)} of {filteredDifferences.length} changes
        </span>
        <span>
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {/* Differences */}
      <div className="space-y-4">
        {currentDifferences.map((difference, index) => (
          <DifferenceCard
            key={`${pageNo}-${startIndex + index}`}
            difference={difference}
            index={startIndex + index}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            disabled={currentPage === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              currentPage === 1
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-3 py-2 text-gray-400">
                    <MoreHorizontal className="w-4 h-4" />
                  </span>
                ) : (
                  <button
                    onClick={() => goToPage(page as number)}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      currentPage === page
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={goToNext}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              currentPage === totalPages
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quick Jump */}
      {totalPages > 10 && (
        <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">Jump to page:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) {
                goToPage(page);
              }
            }}
            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="text-sm text-gray-600">of {totalPages}</span>
        </div>
      )}
    </div>
  );
};