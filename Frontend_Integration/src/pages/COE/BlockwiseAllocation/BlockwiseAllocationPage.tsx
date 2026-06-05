import React, { useState } from 'react';
import { BuildingCreation } from '../../../components/screens/COE/BlockwiseAllocation/BuildingCreation';
import { FloorDetails } from '../../../components/screens/COE/BlockwiseAllocation/FloorDetails';
import { StudentAllocation } from '../../../components/screens/COE/BlockwiseAllocation/StudentAllocation';

type TabName = 'Building creation' | 'Floor details' | 'Student allocation';

export const BlockwiseAllocationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabName>('Building creation');

  return (
    <div className="flex flex-col min-h-full p-8 gap-8 font-['Instrument_Sans']">
      
      {/* ── Page Title ── */}
      <h1 className="text-[24px] font-semibold text-[#101828]">Blockwise allocation</h1>

      {/* ── Tabs Navigation ── */}
      <div className="flex items-center bg-[#f2f4f7] rounded-xl p-1 gap-1 w-fit">
        {(['Building creation', 'Floor details', 'Student allocation'] as TabName[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-lg text-[14px] font-semibold transition-all duration-200 ${
              activeTab === tab
                ? 'bg-[#0e1680] text-white shadow-sm'
                : 'text-[#667085] hover:text-[#0e1680]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Active Tab Rendering ── */}
      <div className="flex-1">
        {activeTab === 'Building creation' && <BuildingCreation />}

        {activeTab === 'Floor details' && <FloorDetails />}

        {activeTab === 'Student allocation' && <StudentAllocation />}
      </div>

    </div>
  );
};
