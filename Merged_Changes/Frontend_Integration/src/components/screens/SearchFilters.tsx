// src/components/screens/SearchFilters.tsx
import { Search, Filter } from "lucide-react";

interface FilterOption {
  label: string;
  onClick: () => void;
}

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  filters: FilterOption[];
  placeholder?: string;
  customFilters?: React.ReactNode;
}

export const SearchFilters = ({ onSearch, filters, placeholder = "Search", customFilters }: SearchFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-start md:justify-end gap-3 mb-4">
      <div className="relative w-full md:w-[320px]">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#667085]" size={20} />
        <input 
          type="text" 
          placeholder={placeholder} 
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-[#d0d5dd] rounded-lg shadow-sm text-[15px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 transition-all"
        />
      </div>
      {customFilters}
      {filters.map((filter, idx) => (
        <button 
          key={idx}
          onClick={filter.onClick}
          className="flex items-center gap-2 px-5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[15px] font-semibold text-[#344054] hover:bg-gray-50 transition-all shadow-sm"
        >
          {filter.label}
          <Filter size={18} className="text-[#667085]" />
        </button>
      ))}
    </div>
  );
};
