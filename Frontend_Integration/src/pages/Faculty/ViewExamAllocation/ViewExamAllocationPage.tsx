import React from 'react';
import { ViewExamAllocationTable } from '../../../components/screens/Faculty/ViewExamAllocation/ViewExamAllocationTable';

export const ViewExamAllocationPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-full p-8 gap-6 font-['Instrument_Sans']">
      <h1 className="text-[24px] font-semibold text-[#101828]">View Exam Allocation</h1>
      <ViewExamAllocationTable />
    </div>
  );
};
