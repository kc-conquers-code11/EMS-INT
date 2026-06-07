import React, { useState } from 'react';
import { Search, Filter, MoreVertical, ArrowLeft, ArrowRight } from 'lucide-react';

import { SearchStudentTab } from '../../../components/screens/COE/ExamFees/SearchStudentTab';
import { OfflinePaymentTab } from '../../../components/screens/COE/ExamFees/OfflinePaymentTab';
import { FeeConfigurationTab } from '../../../components/screens/COE/ExamFees/FeeConfigurationTab';
import { ReportsTab } from '../../../components/screens/COE/ExamFees/ReportsTab';
import { NotificationTab } from '../../../components/screens/COE/ExamFees/NotificationTab';

type ExamFeesTab = 'Search Student' | 'Offline Payment Verification' | 'Fee Configuration' | 'Reports' | 'Notification';
type ViewMode = 'dashboard' | 'tabs';

export const ExamFeesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [activeTab, setActiveTab] = useState<ExamFeesTab>('Search Student');

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  const tabs: ExamFeesTab[] = [
    'Search Student',
    'Offline Payment Verification',
    'Fee Configuration',
    'Reports',
    'Notification',
  ];

  const renderPaginationNumbers = () => {
    const pages: (number | string)[] = [1, 2, 3, '...', 8, 9, 10];
    return pages.map((page, i) => {
      if (page === '...') {
        return (
          <span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-xs font-semibold text-[#98a2b3]">
            ...
          </span>
        );
      }
      return (
        <button
          key={page}
          onClick={() => setCurrentPage(page as number)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            currentPage === page
              ? 'bg-[#f2f4fd] text-[#0e1680] border border-[#d2d6f8]'
              : 'text-[#667085] hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      );
    });
  };

  const inputClass = "px-3.5 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#101828] focus:outline-none focus:ring-1 focus:ring-[#0e1680] shadow-sm appearance-none cursor-pointer";

  return (
    <div className="flex flex-col min-h-full p-8 gap-6 font-['Instrument_Sans'] bg-[#fafafa]">
      
      {viewMode === 'dashboard' ? (
        <>
          {/* ── Header and Top Controls ── */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            
            {/* Page Title */}
            <h1 className="text-[24px] font-bold text-[#101828] tracking-tight">
              Exam Fees Management
            </h1>

            {/* Right Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              
              {/* Search Box */}
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-4 pr-10 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-1 focus:ring-[#0e1680] shadow-sm transition-all"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#98a2b3]">
                  <Search size={16} />
                </div>
              </div>

              {/* Filters */}
              <div className="relative">
                <select className={`${inputClass} pl-3.5 pr-10 py-2.5 w-[140px]`}>
                  <option value="" disabled hidden>Exam event</option>
                  <option value="Event 1">Event 1</option>
                  <option value="Event 2">Event 2</option>
                </select>
                <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" />
              </div>

              <div className="relative">
                <select className={`${inputClass} pl-3.5 pr-10 py-2.5 w-[140px]`}>
                  <option value="" disabled hidden>Request type</option>
                  <option value="Type 1">Type 1</option>
                  <option value="Type 2">Type 2</option>
                </select>
                <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" />
              </div>

              <div className="relative">
                <select className={`${inputClass} pl-3.5 pr-10 py-2.5 w-[120px]`}>
                  <option value="" disabled hidden>Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                </select>
                <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" />
              </div>

              {/* Search Student Button */}
              <button 
                onClick={() => setViewMode('tabs')}
                className="px-5 py-2.5 bg-[#0e1680] hover:bg-blue-900 text-white text-sm font-semibold rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer ml-1"
              >
                Search Student
              </button>
              
            </div>
          </div>

          {/* ── Main Card ── */}
          <div className="bg-white border border-[#eaecf0] rounded-xl shadow-sm flex flex-col flex-1 animate-in fade-in duration-300">
            
            {/* Card Header */}
            <div className="px-6 py-5 border-b border-[#eaecf0] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-[16px] font-bold text-[#101828]">Approval Requests List</h2>
                <div className="bg-[#f2f4fd] text-[#0e1680] text-xs font-semibold px-2 py-0.5 rounded-full border border-[#d2d6f8]">
                  0
                </div>
              </div>
              <button className="text-[#98a2b3] hover:text-[#344054] transition-colors cursor-pointer p-1">
                <MoreVertical size={20} />
              </button>
            </div>

            {/* Table Content */}
            <div className="flex-1 overflow-x-auto min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#f9fafb] border-b border-[#eaecf0]">
                  <tr>
                    <th className="px-6 py-3.5 text-[13px] font-semibold text-[#475467] tracking-wider">Enrollment No</th>
                    <th className="px-6 py-3.5 text-[13px] font-semibold text-[#475467] tracking-wider">Student name</th>
                    <th className="px-6 py-3.5 text-[13px] font-semibold text-[#475467] tracking-wider">Semester</th>
                    <th className="px-6 py-3.5 text-[13px] font-semibold text-[#475467] tracking-wider text-center">Total fees</th>
                    <th className="px-6 py-3.5 text-[13px] font-semibold text-[#475467] tracking-wider text-center">Paid Amount</th>
                    <th className="px-6 py-3.5 text-[13px] font-semibold text-[#475467] tracking-wider text-center">Pending Amount</th>
                    <th className="px-6 py-3.5 text-[13px] font-semibold text-[#475467] tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Empty State */}
                  <tr>
                    <td colSpan={7} className="h-[350px]">
                      <div className="flex items-center justify-center h-full text-[18px] font-medium text-[#98a2b3]">
                        No Data Found
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="px-6 py-3 border-t border-[#eaecf0] bg-white flex items-center justify-between rounded-b-xl">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1.5 px-3.5 py-2 border border-[#d0d5dd] rounded-lg text-[13px] font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ArrowLeft size={14} />
                Previous
              </button>

              <div className="flex items-center gap-1">
                {renderPaginationNumbers()}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1.5 px-3.5 py-2 border border-[#d0d5dd] rounded-lg text-[13px] font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
                <ArrowRight size={14} />
              </button>
            </div>

          </div>
        </>
      ) : (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          
          <div className="flex items-center justify-between">
            <h1 className="text-[24px] font-bold text-[#101828] tracking-tight">
              Exam Fees Management
            </h1>
            <button 
              onClick={() => setViewMode('dashboard')}
              className="px-4 py-2 text-sm font-semibold text-[#344054] border border-[#d0d5dd] rounded-lg hover:bg-gray-50 shadow-sm transition-colors cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>

          {/* ── Horizontal Navigation Tabs (Pill-box style matching Figma) ── */}
          <div className="flex items-center bg-[#f0f1fd] rounded-xl p-1 gap-1 w-fit overflow-x-auto max-w-full">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-lg text-[14px] font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-[#0e1680] text-white shadow-sm font-bold'
                    : 'text-[#687b96] hover:text-[#0e1680]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ── Active Tab Component Rendering ── */}
          <div className="flex flex-col gap-6">
            {activeTab === 'Search Student' && <SearchStudentTab />}
            {activeTab === 'Offline Payment Verification' && <OfflinePaymentTab />}
            {activeTab === 'Fee Configuration' && <FeeConfigurationTab />}
            {activeTab === 'Reports' && <ReportsTab />}
            {activeTab === 'Notification' && <NotificationTab />}
          </div>
        </div>
      )}

    </div>
  );
};
