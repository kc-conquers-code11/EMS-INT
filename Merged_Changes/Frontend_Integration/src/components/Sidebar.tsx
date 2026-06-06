import { useState } from "react";
import { 
  Table, CalendarDays, Users, UserSquare, LayoutTemplate, 
  UserCheck, CheckSquare, Unlock, FileLock2, Hand,
  GraduationCap, Settings, GitBranch, ChevronDown, User, LogIn,
  LogOut, LayoutGrid
} from "lucide-react";
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const NavItem = ({ icon: Icon, label, isActive = false, hasDropdown = false, isOpen = false, onClick }: any) => {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive 
          ? "bg-gradient-to-r from-[#cccef8]/60 to-[#cccef8]/20 text-[#0e1680] font-semibold shadow-sm" 
          : "text-[#687b96] hover:bg-gray-50/80 hover:text-[#0e1680]"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className={isActive ? "text-[#0e1680]" : "text-[#687b96]"} />
        <span className="text-[16px] leading-tight font-medium">{label}</span>
      </div>
      {hasDropdown && (
        <ChevronDown 
          size={18} 
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""} ${isActive ? "text-[#0e1680]" : "text-[#687b96]"}`} 
        />
      )}
    </div>
  );
};

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const { logout } = useAuth();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    academic: true,
    student: false,
    faculty: false
  });

  const toggleDropdown = (key: string) => {
    setOpenDropdowns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const academicItems = [
    { id: 'programme', label: 'Programme' },
    { id: 'branch', label: 'Branch' },
    { id: 'scheme', label: 'Scheme' },
    { id: 'academic-year', label: 'Academic Year' },
    { id: 'semester', label: 'Semester' },
    { id: 'subject', label: 'Subject' },
  ];

  return (
    <div className="w-[291px] h-screen bg-[#fcfcfd] border-r border-gray-100 flex flex-col shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08)] overflow-y-auto custom-scrollbar sticky top-0">
      {/* Logo Area */}
      <div className="flex items-center gap-3 px-5 pt-10 pb-12">
        <div className="w-8 h-8 bg-[#0e1680] rounded-lg flex items-center justify-center text-white shadow-lg shadow-[#0e1680]/20">
          <LayoutGrid size={20} fill="currentColor" />
        </div>
        <span className="text-[32px] font-bold text-[#1d2939] tracking-tighter">COE</span>
      </div>

      <div className="flex flex-col px-5 pb-10 space-y-4">
        
        {/* Main Menu */}
        <div className="flex flex-col space-y-1">
          <NavItem icon={Table} label="Timetable Generation" />
          <NavItem icon={CalendarDays} label="Exam Event Scheduler" />
          <NavItem icon={Users} label="Student Allocation" />
          <NavItem icon={UserSquare} label="Faculty Allocation" />
          <NavItem icon={LayoutTemplate} label="COPO Attainment" />
          <NavItem icon={UserCheck} label="User Finalization" />
          <NavItem icon={CheckSquare} label="Publish Results" />
          <NavItem icon={Unlock} label="Unlock Marksheet" />
          <NavItem icon={FileLock2} label="Marksheet Finalization" />
          <NavItem icon={Hand} label="Results On Hold" />
        </div>

        <div className="h-px bg-gray-200/60 my-2"></div>

        {/* Academic Setup Section */}
        <div className="flex flex-col space-y-1">
          <NavItem 
            icon={GraduationCap} 
            label="Academic Setup" 
            hasDropdown={true} 
            isOpen={openDropdowns.academic}
            onClick={() => toggleDropdown('academic')}
          />
          {openDropdowns.academic && (
            <div className="flex flex-col space-y-1 mt-1">
              {academicItems.map(item => (
                <NavItem 
                  key={item.id}
                  icon={Settings} 
                  label={item.label} 
                  isActive={activePage === item.id}
                  onClick={() => onNavigate(item.id)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="h-px bg-gray-200/60 my-2"></div>

        {/* Student & Faculty Sections */}
        <div className="flex flex-col space-y-1">
          <NavItem 
            icon={Users} 
            label="Student Portal" 
            hasDropdown={true} 
            isOpen={openDropdowns.student}
            onClick={() => toggleDropdown('student')}
          />
          {openDropdowns.student && (
            <div className="flex flex-col space-y-1 mt-1">
              <NavItem icon={LogIn} label="Student MGMT" />
            </div>
          )}
          
          <NavItem 
            icon={User} 
            label="Faculty Portal" 
            hasDropdown={true} 
            isOpen={openDropdowns.faculty}
            onClick={() => toggleDropdown('faculty')}
          />
          {openDropdowns.faculty && (
            <div className="flex flex-col space-y-1 mt-1">
              <NavItem icon={GitBranch} label="Faculty MGMT" />
            </div>
          )}
        </div>

        <div className="h-px bg-gray-200/60 my-2"></div>

        {/* Footer Actions */}
        <div className="flex flex-col space-y-1 pt-2">
          <NavItem icon={Settings} label="Settings" />
          <NavItem icon={LogOut} label="Log Out" onClick={() => logout('/login')} />
        </div>
        
      </div>
    </div>
  );
}
