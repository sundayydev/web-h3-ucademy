import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Ensure totalPages is a valid positive integer, defaulting to 1
  const safeTotalPages = totalPages > 0 ? totalPages : 1;

  const [pages, setPages] = useState<(number | '...')[]>([]);

  useEffect(() => {
    const calculateVisiblePages = (): (number | '...')[] => {
      if (safeTotalPages <= 7) {
        return Array.from({ length: safeTotalPages }, (_, i) => i + 1);
      }

      const visible: (number | '...')[] = [1];

      if (currentPage <= 4) {
        visible.push(2, 3, 4, 5, '...', safeTotalPages);
      } else if (currentPage >= safeTotalPages - 3) {
        visible.push(
          '...',
          safeTotalPages - 4,
          safeTotalPages - 3,
          safeTotalPages - 2,
          safeTotalPages - 1,
          safeTotalPages
        );
      } else {
        visible.push(
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          safeTotalPages
        );
      }

      return visible;
    };

    setPages(calculateVisiblePages());
  }, [currentPage, safeTotalPages]);

  return (
    <div className="flex items-center justify-between mt-4 space-x-2">
      {/* First & Previous */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="hidden sm:flex"
        >
          Trang đầu
        </Button>
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Trước
        </Button>
      </div>

      {/* Page Buttons */}
      <div className="hidden md:flex items-center space-x-1">
        {pages.map((page, idx) =>
          page === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-2 select-none">
              ...
            </span>
          ) : (
            <Button
              key={`page-${page}`}
              variant={currentPage === page ? 'default' : 'outline'}
              className={`w-9 h-9 p-0 ${
                currentPage === page ? 'bg-pink-500 hover:bg-pink-600' : ''
              }`}
              onClick={() => onPageChange(page)}
              aria-label={`Go to page ${page}`}
            >
              {page}
            </Button>
          )
        )}
      </div>

      {/* Next & Last */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === safeTotalPages}
        >
          Sau
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
        <Button
          variant="outline"
          onClick={() => onPageChange(safeTotalPages)}
          disabled={currentPage === safeTotalPages}
          className="hidden sm:flex"
        >
          Trang cuối
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
