import React, { useState } from 'react';
import { CourseSelectionTab } from '../../../components/screens/COE/CoPoMapping/CourseSelectionTab';
import { CoAttainmentTab } from '../../../components/screens/COE/CoPoMapping/CoAttainmentTab';
import { PoAttainmentTab } from '../../../components/screens/COE/CoPoMapping/PoAttainmentTab';
import { CoPoMappingMatrixTab } from '../../../components/screens/COE/CoPoMapping/CoPoMappingMatrixTab';
import { GenerateReportsTab } from '../../../components/screens/COE/CoPoMapping/GenerateReportsTab';

const TABS = [
  { id: 'course_selection', label: 'Course Selection' },
  { id: 'co_attainment', label: 'CO Attainment' },
  { id: 'po_attainment', label: 'PO Attainment' },
  { id: 'copo_mapping', label: 'CO-PO Mapping Matrix' },
  { id: 'generate_reports', label: 'Generate Reports' }
];

export const CoPoMappingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('course_selection');

  return (
    <div className="flex flex-col gap-6 w-full p-6 bg-white min-h-[calc(100vh-64px)] font-['Instrument_Sans'] select-none">
      
      {/* ── Page Header ── */}
      <h1 className="text-[24px] font-bold text-[#1d2939] tracking-tight">
        COPO Mapping
      </h1>

      {/* ── Custom Pills Tab Navigation (Matching Figma perfectly) ── */}
      <div className="flex items-center bg-[#f9fafb] border border-[#e4e7ec] rounded-lg p-1.5 w-fit">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 text-[14px] font-semibold rounded-md transition-all duration-200 cursor-pointer flex-1 text-center whitespace-nowrap ${
                isActive
                  ? 'bg-[#0E1680] text-white shadow-sm'
                  : 'text-[#667085] hover:text-[#344054] hover:bg-gray-100/50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ── */}
      <div className="animate-in fade-in zoom-in-95 duration-200 mt-2">
        {activeTab === 'course_selection' && (
          <CourseSelectionTab onNext={() => setActiveTab('co_attainment')} />
        )}
        
        {activeTab === 'co_attainment' && (
          <CoAttainmentTab />
        )}

        {/* Placeholders for remaining tabs */}
        {activeTab === 'po_attainment' && (
          <PoAttainmentTab onNext={() => setActiveTab('copo_mapping')} />
        )}
        
        {activeTab === 'copo_mapping' && (
          <CoPoMappingMatrixTab onNext={() => setActiveTab('generate_reports')} />
        )}
        
        {activeTab === 'generate_reports' && (
          <GenerateReportsTab />
        )}
      </div>

    </div>
  );
};
