import React from 'react';
import { HelpCircle, Bell, MoreHorizontal } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="h-[72px] bg-[#02053d] flex items-center justify-end px-6 relative z-20">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5">
          <button className="p-2 bg-[#21234e] border border-[#3b44b2] rounded-lg text-white hover:bg-[#2c2f63] transition-colors">
            <HelpCircle size={20} />
          </button>
          <button className="p-2 bg-[#21234e] border border-[#3b44b2] rounded-lg text-white hover:bg-[#2c2f63] transition-colors">
            <Bell size={20} />
          </button>
        </div>
        
        <div className="h-8 w-px bg-[#3b44b2]"></div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden ring-2 ring-white/10">
              <img 
                src="https://ui-avatars.com/api/?name=ABC+Faculty&background=6366f1&color=fff" 
                alt="User Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">ABC</span>
              <span className="text-xs text-[#f2f4f7]">Faculty</span>
            </div>
          </div>
          
          <button className="p-2 bg-[#21234e] border border-[#3b44b2] rounded-lg text-white hover:bg-[#2c2f63] transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
