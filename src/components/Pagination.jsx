import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
        className={`p-2 rounded-[10px] transition-all ${currentPage === 1 ? 'text-[#D1D6DB] cursor-not-allowed' : 'text-[#4E5968] hover:bg-white hover:text-[#4E5968]'}`}
      >
        <ChevronLeft size={18} />
      </button>

      <div className="flex items-center gap-1">
        {pages.map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-9 h-9 flex items-center justify-center rounded-[10px] text-[13px] font-bold transition-all ${currentPage === page
              ? 'bg-[#F2F4F6] text-[#4E5968]'
              : 'text-[#8B95A1] hover:bg-white hover:text-[#4E5968]'
              }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-[10px] transition-all ${currentPage === totalPages ? 'text-[#D1D6DB] cursor-not-allowed' : 'text-[#8B95A1] hover:bg-white hover:text-[#4E5968]'}`}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
