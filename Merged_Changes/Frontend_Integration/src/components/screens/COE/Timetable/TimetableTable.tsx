import React from 'react';
import { MoreVertical, ChevronLeft, ChevronRight, Eye, Trash2, Calendar } from 'lucide-react';
import type { Timetable } from '../../../../types/COE/timetable';

interface TimetableTableProps {
  timetables: Timetable[];
  onViewClick: (timetable: Timetable) => void;
  onDeleteClick: (timetable: Timetable) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const TimetableTable: React.FC<TimetableTableProps> = ({
  timetables,
  onViewClick,
  onDeleteClick,
  currentPage,
  totalPages,
  onPageChange
}) => {
  const isEmpty = timetables.length === 0;

  const getPageNumbers = () => {
    if (totalPages === 0) return [];
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
    if (currentPage >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-300">
      <div className="bg-white border border-[#eaecf0] rounded-xl overflow-hidden shadow-sm">
        {/* Table Header Section */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-[#eaecf0]">
          <div className="flex items-center gap-2">
            <h3 className="text-[18px] font-bold text-[#101828]">Timetable Generation List</h3>
            <span className="flex items-center justify-center min-w-[24px] h-[24px] rounded-full bg-[#f2f4fe] text-[#0e1680] text-xs font-bold px-1.5">
              {timetables.length}
            </span>
          </div>
          <button className="text-[#98a2b3] hover:text-[#475467] cursor-pointer">
            <MoreVertical size={20} />
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f9fafb] border-b border-[#eaecf0]">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-[#475467] uppercase tracking-wider">Timetable No.</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#475467] uppercase tracking-wider text-center">Year</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#475467] uppercase tracking-wider text-center">Branch</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#475467] uppercase tracking-wider text-center">Semester</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#475467] uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaecf0]">
              {isEmpty ? (
                <tr>
                  <td colSpan={5} className="h-[300px] text-center align-middle">
                    <span className="text-[18px] font-medium text-[#98a2b3]">No Data Found</span>
                  </td>
                </tr>
              ) : (
                timetables.map((tt) => (
                  <tr key={tt.id} className="hover:bg-gray-50/50 transition-colors h-[72px]">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#0e1680]">
                      {tt.timetableNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#475467] text-center">
                      {tt.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#475467] text-center">
                      {tt.branch}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#475467] text-center font-medium">
                      {tt.semester} Sem
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-4">
                        <button
                          onClick={() => onViewClick(tt)}
                          className="flex items-center gap-1.5 text-[#0e1680] font-semibold text-sm hover:text-blue-900 transition-colors cursor-pointer"
                          title="View Grid"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => onDeleteClick(tt)}
                          className="flex items-center gap-1.5 text-[#d92d20] font-semibold text-sm hover:text-red-700 transition-colors cursor-pointer"
                          title="Delete Schedule"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-[#eaecf0]">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={isEmpty || currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {pages.map((page, i) => (
              <button
                key={i}
                type="button"
                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${page === currentPage
                    ? 'bg-[#f9fafb] text-[#101828] font-semibold border border-[#eaecf0]'
                    : 'text-[#667085] hover:bg-gray-50'
                  } disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent`}
                onClick={() => typeof page === 'number' && onPageChange(page)}
                disabled={isEmpty || page === '...'}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={isEmpty || currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
