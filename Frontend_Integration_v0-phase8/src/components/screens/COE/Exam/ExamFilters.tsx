import React from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';

interface ExamFiltersProps {
  onAddClick: () => void;
  onSearchChange: (query: string) => void;
  onCourseTitleChange: (title: string) => void;
  onCourseCodeChange: (code: string) => void;
  onDateChange: (date: string) => void;
  selectedCourseTitle: string;
  selectedCourseCode: string;
  selectedDate: string;
  isDemoPopulated: boolean;
  onPopulateDemo: () => void;
  courseTitles: string[];
  courseCodes: string[];
  dates: string[];
}

export const ExamFilters: React.FC<ExamFiltersProps> = ({
  onAddClick,
  onSearchChange,
  onCourseTitleChange,
  onCourseCodeChange,
  onDateChange,
  selectedCourseTitle,
  selectedCourseCode,
  selectedDate,
  isDemoPopulated,
  onPopulateDemo,
  courseTitles,
  courseCodes,
  dates,
}) => {
  const selectWrapperClass = "relative flex items-center";
  const selectClass = "appearance-none bg-white border border-[#d0d5dd] rounded-lg px-4 py-2 pr-10 text-sm font-semibold text-[#344054] hover:bg-gray-50 shadow-sm transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0e1680]";

  return (
    <div className="flex flex-col gap-6 w-full font-sans">
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
          {isDemoPopulated ? "Show Empty State (Figma)" : "Load Demo Data"}
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

          {/* Course Title Filter */}
          <div className={selectWrapperClass}>
            <select
              value={selectedCourseTitle}
              onChange={(e) => onCourseTitleChange(e.target.value)}
              className={selectClass}
            >
              <option value="">Course Title</option>
              {courseTitles.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
            <Filter size={16} className="absolute right-3 text-[#344054] pointer-events-none" />
          </div>

          {/* Course Code Filter */}
          <div className={selectWrapperClass}>
            <select
              value={selectedCourseCode}
              onChange={(e) => onCourseCodeChange(e.target.value)}
              className={selectClass}
            >
              <option value="">Course Code</option>
              {courseCodes.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
            <Filter size={16} className="absolute right-3 text-[#344054] pointer-events-none" />
          </div>

          {/* Date Filter */}
          <div className={selectWrapperClass}>
            <select
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className={selectClass}
            >
              <option value="">Date</option>
              {dates.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
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
          className="flex items-center gap-2 px-6 py-2.5 bg-[#0e1680] text-white text-[16px] font-semibold rounded-lg hover:bg-blue-900 transition-all shadow-md active:scale-95 cursor-pointer"
        >
          Add Exam Event Scheduler
        </button>
      </div>
    </div>
  );
};
