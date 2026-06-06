import React from 'react';
import { BlockwiseAllocationTable } from '../../../components/screens/Faculty/BlockwiseAllocation/BlockwiseAllocationTable';

export const BlockwiseAllocationPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-full p-8 gap-6 font-['Instrument_Sans']">
      <h1 className="text-[24px] font-semibold text-[#101828]">View Blockwise Allocation</h1>
      <BlockwiseAllocationTable />
    </div>
  );
};
