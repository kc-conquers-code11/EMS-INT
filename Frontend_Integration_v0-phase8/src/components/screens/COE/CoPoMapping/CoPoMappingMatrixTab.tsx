import React from 'react';
import { Search, Filter } from 'lucide-react';

interface CoPoMappingMatrixTabProps {
  onNext: () => void;
}

export const CoPoMappingMatrixTab: React.FC<CoPoMappingMatrixTabProps> = ({ onNext }) => {
  const COs = ['CO1', 'CO2', 'CO3'];
  const POs = ['PO1', 'PO2', 'PO3', 'PO4'];

  const ChevronDown = () => (
    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );

  return (
    <div className="flex flex-col gap-6 w-full font-['Instrument_Sans'] select-none p-2 animate-in fade-in zoom-in-95 duration-200">

      {/* ── TOOLBAR ── */}
      <div className="flex items-center justify-end gap-3 w-full">
        <div className="relative">
          <input type="text" placeholder="Search" className="pl-3.5 pr-10 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] focus:outline-none shadow-sm w-[200px]" />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085]" size={16} />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] font-medium text-[#344054] hover:bg-gray-50 shadow-sm transition-colors cursor-pointer">
          Semester
          <Filter size={16} className="text-[#667085]" />
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] font-medium text-[#344054] hover:bg-gray-50 shadow-sm transition-colors cursor-pointer">
          Course
          <Filter size={16} className="text-[#667085]" />
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] font-medium text-[#344054] hover:bg-gray-50 shadow-sm transition-colors cursor-pointer">
          Scheme
          <Filter size={16} className="text-[#667085]" />
        </button>
      </div>

      {/* ── MATRIX TABLE ── */}
      <div className="bg-white border border-[#e4e7ec] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-[#f9fafb] border-b border-[#e4e7ec]">
                <th className="py-4 px-4 text-[12px] font-semibold text-[#667085]">CO/PO</th>
                {POs.map(po => (
                  <th key={po} className="py-4 px-4 text-[12px] font-semibold text-[#667085]">{po}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e7ec]">
              {COs.map((co, idx) => (
                <tr key={co} className="hover:bg-gray-50/50">
                  <td className="py-4 px-4 text-[14px] font-semibold text-[#475467] border-r border-[#e4e7ec]">{co}</td>
                  {POs.map(po => (
                    <td key={`${co}-${po}`} className="py-4 px-4">
                      <div className="relative w-fit mx-auto">
                        <select
                          className="w-[72px] h-[38px] pl-4 pr-8 bg-white border border-[#d0d5dd] rounded-lg text-[14px] font-medium text-[#344054] appearance-none focus:outline-none focus:border-[#0E1680] cursor-pointer"
                          defaultValue={idx === 1 && po === 'PO1' ? '3' : idx === 2 && po === 'PO1' ? '2' : '1'}
                        >
                          <option value="0">0</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                        </select>
                        <ChevronDown />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── LEGEND ── */}
      <div className="flex items-center text-[14px] font-semibold text-[#344054]">
        Legend: 0 = No Mapping | 1 = Low | 2 = Moderate | 3 = High
      </div>

      {/* ── NEXT BUTTON ── */}
      <div className="flex justify-end mt-2">
        <button onClick={onNext} className="flex items-center justify-center gap-2 px-8 py-2.5 bg-[#0E1680] hover:bg-blue-900 text-white text-[14px] font-semibold rounded-lg shadow-sm transition-all cursor-pointer">
          <span>Next</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12H19M19 12L12 5M19 12L12 19" /></svg>
        </button>
      </div>

    </div>
  );
};
