import React from 'react';
import { 
  Table, Calendar, Users, UserSquare, Layout, 
  UserCheck, CheckCircle, Lock, FileCheck, Hand, 
  GraduationCap, ChevronDown, User, LogIn, Settings,
  LogOut, Hexagon
} from 'lucide-react';

interface SidebarProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage = 'department', onNavigate }) => {
  const menuItems = [
    { icon: <Table size={20} />, label: 'Time table Generation' },
    { icon: <Calendar size={20} />, label: 'Exam Event Scheduler' },
    { icon: <Users size={20} />, label: 'Student Allocation' },
    { icon: <UserSquare size={20} />, label: 'Faculty Allocation' },
    { icon: <Layout size={20} />, label: 'COPO Attainment' },
    { icon: <UserCheck size={20} />, label: 'User Finalization' },
    { icon: <CheckCircle size={20} />, label: 'Publish Results' },
    { icon: <Lock size={20} />, label: 'Unlock Marksheet' },
    { icon: <FileCheck size={20} />, label: 'Pre Marksheet Finalization' },
    { icon: <Hand size={20} />, label: 'Result Held On Hold' },
  ];

  const academicSetupItems = [
    { label: 'Programme' },
    { label: 'Branch', active: currentPage === 'department', id: 'department' },
    { label: 'Scheme', active: currentPage === 'scheme', id: 'scheme' },
    { label: 'Academic Year' },
    { label: 'Semester' },
    { label: 'Subject Type' },
    { label: 'Subject' },
  ];

  return (
    <aside className="w-[291px] bg-[#fcfcfd] rounded-[10px] shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08),0px_4px_6px_0px_rgba(16,24,40,0.03)] flex flex-col h-[calc(100vh-130px)] my-8 ml-6 overflow-hidden font-sans">
      <div className="p-10 flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-9">
          <div className="w-8 h-8 bg-[#0E1680] rounded-md flex items-center justify-center text-white">
            <Hexagon size={20} fill="white" />
          </div>
          <span className="text-[31px] font-semibold text-[#1d2939] tracking-tight">COE</span>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
          <div className="h-px bg-[#eaecf0] w-full"></div>
          
          {/* Main Menu */}
          <div className="space-y-1">
            {menuItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#687b96] hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <span className="text-[#687b96]">{item.icon}</span>
                <span className="text-base font-normal">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="h-px bg-[#eaecf0] w-full"></div>

          {/* Academic Setup Section */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 py-2 text-[#687b96] cursor-pointer">
              <div className="flex items-center gap-3">
                <GraduationCap size={20} />
                <span className="text-base font-normal">Academic Setup</span>
              </div>
              <ChevronDown size={16} />
            </div>
            
            <div className="space-y-1">
              {academicSetupItems.map((subItem, idx) => (
                <div
                  key={idx}
                  onClick={() => subItem.id && onNavigate?.(subItem.id)}
                  className={`flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all ${
                    subItem.active 
                    ? 'bg-gradient-to-r from-[rgba(204,208,248,0.6)] to-[rgba(204,208,248,0.2)]' 
                    : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="w-5 h-5 mr-3 flex items-center justify-center">
                    <Settings size={18} className="text-[#687b96]" />
                  </div>
                  <span className={`text-base ${subItem.active ? 'text-[#687b96]' : 'text-[#687b96]'}`}>
                    {subItem.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Portal Sections */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 py-2 text-[#687b96] cursor-pointer">
              <div className="flex items-center gap-3">
                <User size={20} />
                <span className="text-base font-normal">Student Portal</span>
              </div>
              <ChevronDown size={16} />
            </div>
            <div 
              onClick={() => onNavigate?.('student')}
              className={`flex items-center gap-3 px-3 py-2 text-[#687b96] cursor-pointer rounded-lg transition-all ${
                currentPage === 'student' 
                ? 'bg-gradient-to-r from-[rgba(204,208,248,0.6)] to-[rgba(204,208,248,0.2)]' 
                : 'hover:bg-gray-50'
              }`}
            >
              <LogIn size={20} />
              <span className="text-base font-normal">Student MGMT</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 text-[#687b96] cursor-pointer">
              <div className="flex items-center gap-3">
                <User size={20} />
                <span className="text-base font-normal">Faculty Portal</span>
              </div>
              <ChevronDown size={16} />
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-[#687b96] cursor-pointer transition-colors hover:bg-gray-50 rounded-lg">
              <Settings size={20} />
              <span className="text-base font-normal">Faculty MGMT</span>
            </div>
          </div>

          <div className="h-px bg-[#eaecf0] w-full"></div>

          {/* Settings & Logout */}
          <div className="space-y-1 pb-4">
            <div className="flex items-center gap-3 px-3 py-2 text-[#687b96] cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
              <Settings size={20} />
              <span className="text-base font-normal">Settings</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-[#687b96] cursor-pointer hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
              <LogOut size={20} />
              <span className="text-base font-normal">Log Out</span>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #eaecf0;
          border-radius: 20px;
        }
      `}</style>
    </aside>
  );
};
