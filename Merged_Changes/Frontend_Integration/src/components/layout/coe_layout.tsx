import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  Users, Monitor, Settings, LogOut, ChevronDown, LayoutGrid,
  Calendar, Building2, GraduationCap, GitBranch, Book, Layers, Clock, Share2, ClipboardList, Menu, X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const NavItem = ({
  to, icon: Icon, label, onClick
}: { to: string; icon: React.ElementType; label: string; onClick?: (e: React.MouseEvent) => void }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] transition-colors ${isActive
        ? 'bg-gradient-to-r from-[rgba(204,208,248,0.6)] to-[rgba(204,208,248,0.2)] text-[#0e1680] font-semibold'
        : 'text-[#687b96] hover:bg-gray-50 hover:text-[#0e1680] font-normal'
        }`}
    >
      <Icon size={20} strokeWidth={1.5} className={isActive ? 'text-[#0e1680]' : 'text-[#687b96]'} />
      <span className="leading-tight">{label}</span>
    </Link>
  );
};

const AccordionSection = ({
  icon: Icon,
  label,
  children,
  defaultOpen = false,
  activeRoutes = [],
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  activeRoutes?: string[];
}) => {
  const location = useLocation();
  const isAnyChildActive = activeRoutes.includes(location.pathname);
  const [open, setOpen] = useState(defaultOpen || isAnyChildActive);

  useEffect(() => {
    if (isAnyChildActive) setOpen(true);
  }, [isAnyChildActive]);

  return (
    <div>
      <button
        onClick={() => setOpen((prev: boolean) => !prev)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[14px] transition-colors ${isAnyChildActive
          ? 'text-[#0e1680] font-semibold'
          : 'text-[#687b96] hover:bg-gray-50 hover:text-[#0e1680] font-normal'
          }`}
      >
        <div className="flex items-center gap-3">
          <Icon size={20} strokeWidth={1.5} className={isAnyChildActive ? 'text-[#0e1680]' : 'text-[#687b96]'} />
          <span className="leading-tight">{label}</span>
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="flex flex-col gap-0.5 mt-0.5 pl-4">
          {children}
        </div>
      )}
    </div>
  );
};

const SubLink = ({ to, label, icon: Icon }: { to: string; label: string; icon?: React.ElementType }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const SelectedIcon = Icon || Monitor;
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-colors ${isActive
        ? 'bg-gradient-to-r from-[rgba(204,208,248,0.6)] to-[rgba(204,208,248,0.2)] text-[#0e1680] font-semibold'
        : 'text-[#687b96] hover:bg-gray-50 hover:text-[#0e1680] font-normal'
        }`}
    >
      <SelectedIcon size={18} strokeWidth={1.5} className={isActive ? 'text-[#0e1680]' : 'text-[#687b96]'} />
      {label}
    </Link>
  );
};

const ACADEMIC_ROUTES = [
  '/programme', '/semester', '/scheme', '/department',
  '/branch-management', '/course', '/academic-year',
  '/exam-pattern', '/co-po-mapping',
];

const BLOCKWISE_ROUTES = ['/allocation', '/supervisor-allocation'];

export const COELayout = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col font-['Instrument_Sans']">

      <header className="h-16 bg-[#02053d] flex items-center justify-between lg:justify-end px-4 lg:px-6 fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center lg:hidden">
          <button
            className="p-2 text-white hover:bg-[#2d2f60] rounded-lg transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <span className="text-white font-bold ml-2">COE</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 hidden sm:flex">
            <button className="p-2 bg-[#21234e] border border-[#3b44b2] rounded-lg hover:bg-[#2d2f60] transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button className="p-2 bg-[#21234e] border border-[#3b44b2] rounded-lg hover:bg-[#2d2f60] transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </button>
          </div>
          <div className="w-px h-8 bg-[#3b44b2] hidden sm:block" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden shrink-0">
                <img src="https://i.pravatar.cc/32" alt="User avatar" className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:block">
                <p className="text-white text-sm font-semibold leading-5">ABC</p>
                <p className="text-[#f2f4f7] text-xs leading-[18px]">Faculty</p>
              </div>
            </div>
            <button className="p-2 bg-[#21234e] border border-[#3b44b2] rounded-lg hover:bg-[#2d2f60] transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-16">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <aside className={`w-[291px] bg-white fixed left-0 top-0 lg:top-16 bottom-0 flex flex-col pt-[40px] px-[20px] pb-[24px] shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08)] overflow-y-auto custom-scrollbar z-50 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

          <div className="flex items-center justify-between px-2 mb-[23px]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-[#0e1680] rounded-xl flex items-center justify-center shrink-0">
                <LayoutGrid size={18} className="text-white" fill="currentColor" />
              </div>
              <span className="text-[22px] font-bold text-[#1d2939] tracking-tight">COE</span>
            </div>
            <button
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-[16px]">
            <nav className="flex flex-col gap-0.5">

              <AccordionSection
                icon={Users}
                label="Academic Setup"
                activeRoutes={ACADEMIC_ROUTES}
                defaultOpen={true}
              >
                <SubLink to="/programme" label="Programme" icon={GraduationCap} />
                <SubLink to="/semester" label="Semester" icon={Clock} />
                <SubLink to="/scheme" label="Scheme" icon={Layers} />
                <SubLink to="/department" label="Department" icon={Building2} />
                <SubLink to="/branch-management" label="Branch" icon={GitBranch} />
                <SubLink to="/course" label="Course" icon={Book} />
                <SubLink to="/academic-year" label="Academic Year" icon={Calendar} />
                <SubLink to="/exam-pattern" label="Exam Pattern Configuration" icon={ClipboardList} />
                <SubLink to="/co-po-mapping" label="CO-PO Mapping Setup" icon={Share2} />
              </AccordionSection>

              <NavItem to="/exam" icon={Users} label="Exam Event Scheduler" />
              <NavItem to="/student-management" icon={Users} label="Student MGMT" />
              <NavItem to="/timetable" icon={Users} label="Timetable Creation" />

              <AccordionSection
                icon={Users}
                label="Blockwise Allocation"
                activeRoutes={BLOCKWISE_ROUTES}
              >
                <SubLink to="/allocation" label="Student Allocation" />
                <SubLink to="/supervisor-allocation" label="Supervisor Allocation" />
              </AccordionSection>

              <NavItem to="/paper-request-trigger" icon={Users} label="Question Paper Generation" />
              <NavItem to="/user-finalization" icon={Users} label="User Finalization" />
              <NavItem to="/marks-finalization" icon={Users} label="Marks Finalization" />
              <NavItem to="/hall-ticket" icon={Users} label="Hall Ticket Generation" />
              <NavItem to="/on-exam-monitoring" icon={Monitor} label="On-exam Monitoring" />
              <NavItem to="/emergency-handling" icon={Users} label="Emergency Handling" />
              <NavItem to="/inventory-management" icon={Monitor} label="Inventory Management" />
              <NavItem to="/result-management" icon={Monitor} label="Result Management" />
              <NavItem to="/marksheet-finalization" icon={Monitor} label="Marksheet Finalization" />
              <NavItem to="/publish-result" icon={Monitor} label="Publish Result" />
              <NavItem to="/unlock-marksheet" icon={Monitor} label="Unlock Marksheet" />
              <NavItem to="/exam-fees" icon={Monitor} label="Exam Fees mapping" />
              <NavItem to="/approval-request" icon={Monitor} label="Approval Request" />

              <div className="h-px bg-gray-100 my-2" />

              <NavItem to="/settings" icon={Settings} label="Settings" />
            </nav>
          </div>

          <div className="pt-4 border-t border-[#e4e7ec] flex flex-col gap-0.5">
            <NavItem to="#" onClick={(e) => { e.preventDefault(); logout('/login'); }} icon={LogOut} label="Log Out" />
          </div>
        </aside>

        <main className="lg:ml-[291px] flex-1 pt-[24px] px-4 md:px-[36px] pb-[25px] overflow-auto bg-[#fcfcfd] min-h-screen w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
