"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const showMax = 3;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8 mb-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg border transition-all ${
          currentPage === 1 
          ? "text-gray-300 border-gray-100 cursor-not-allowed" 
          : "text-[#00004d] border-[#00004d] hover:bg-gray-50 active:scale-90"
        }`}
      >
        <ChevronLeft size={20} strokeWidth={3} />
      </button>
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all ${
              page === currentPage
                ? "bg-[#00004d] text-white shadow-md"
                : page === "..."
                ? "text-gray-400 cursor-default"
                : "text-[#00004d] hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg border transition-all ${
          currentPage === totalPages 
          ? "text-gray-300 border-gray-100 cursor-not-allowed" 
          : "text-[#00004d] border-[#00004d] hover:bg-gray-50 active:scale-90"
        }`}
      >
        <ChevronRight size={20} strokeWidth={3} />
      </button>
    </div>
  );
}