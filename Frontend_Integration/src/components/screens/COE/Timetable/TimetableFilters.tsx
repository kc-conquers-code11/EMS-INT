import React from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { MOCK_BRANCHES, MOCK_SEMESTERS } from './mockData';

interface TimetableFiltersProps {
  onAddClick: () => void;
  onSearchChange: (query: string) => void;
  onBranchChange: (branch: string) => void;
  onSemesterChange: (semester: string) => void;
  onYearChange: (year: string) => void;
  selectedBranch: string;
  selectedSemester: string;
  selectedYear: string;
  isDemoPopulated: boolean;
  onPopulateDemo: () => void;
}

export const TimetableFilters: React.FC<TimetableFiltersProps> = ({
  onAddClick,
  onSearchChange,
  onBranchChange,
  onSemesterChange,
  onYearChange,
  selectedBranch,
  selectedSemester,
  selectedYear,
  isDemoPopulated,
  onPopulateDemo
}) => {
  const selectWrapperClass = "relative flex items-center";
  const selectClass = "appearance-none bg-white border border-[#d0d5dd] rounded-lg px-4 py-2 pr-10 text-sm font-semibold text-[#344054] hover:bg-gray-50 shadow-sm transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0e1680]";

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Search and Dropdowns Row */}
      <div className="flex flex-wrap gap-4 items-center justify-between w-full">
        {/* Left Side: Demo helper button */}
        <button
          type="button"
          onClick={onPopulateDemo}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-semibold shadow-sm transition-all cursor-pointer ${
            isDemoPopulated
              ? 'bg-[#f0f9ff] border-[#b9e6fe] text-[#026aa2] hover:bg-[#e0f2fe]'
              : 'bg-white border-[#d0d5dd] text-[#344054] hover:bg-gray-50'
          }`}
        >
          <RefreshCw size={16} className={`text-current ${isDemoPopulated ? '' : 'animate-spin'}`} />
          {isDemoPopulated ? "Show Empty State" : "Load Demo Data"}
        </button>

        {/* Right Side: Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative w-[280px]">
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-3 pr-10 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680] shadow-sm text-[#101828] placeholder-[#98a2b3]"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search size={18} className="text-[#687b96]" />
            </div>
          </div>

          {/* Year Filter */}
          <div className={selectWrapperClass}>
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(e.target.value)}
              className={selectClass}
            >
              <option value="">Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
            <Filter size={16} className="absolute right-3 text-[#344054] pointer-events-none" />
          </div>

          {/* Branch Filter */}
          <div className={selectWrapperClass}>
            <select
              value={selectedBranch}
              onChange={(e) => onBranchChange(e.target.value)}
              className={selectClass}
            >
              <option value="">Branch</option>
              {MOCK_BRANCHES.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
            <Filter size={16} className="absolute right-3 text-[#344054] pointer-events-none" />
          </div>

          {/* Semester Filter */}
          <div className={selectWrapperClass}>
            <select
              value={selectedSemester}
              onChange={(e) => onSemesterChange(e.target.value)}
              className={selectClass}
            >
              <option value="">Semester</option>
              {MOCK_SEMESTERS.map(sem => (
                <option key={sem} value={sem}>{sem} Sem</option>
              ))}
            </select>
            <Filter size={16} className="absolute right-3 text-[#344054] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Add Button Row */}
      <div className="flex justify-end w-full">
        <button
          type="button"
          onClick={onAddClick}
          className="flex items-center justify-center px-6 py-2.5 bg-[#0e1680] text-white text-[16px] font-semibold rounded-lg hover:bg-blue-900 transition-all shadow-md active:scale-95 cursor-pointer"
        >
          Add Timetable Generation
        </button>
      </div>
    </div>
  );
};
