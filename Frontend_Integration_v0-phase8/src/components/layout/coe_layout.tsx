import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Users, Monitor, Settings, LogOut, ChevronDown, LayoutGrid,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

/* ─── Nav Item ───────────────────────────────────────────────────── */
const NavItem = ({
  to, icon: Icon, label, onClick
}: { to: string; icon: React.ElementType; label: string; onClick?: (e: React.MouseEvent) => void }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] transition-colors ${
        isActive
          ? 'bg-gradient-to-r from-[rgba(204,208,248,0.6)] to-[rgba(204,208,248,0.2)] text-[#0e1680] font-semibold'
          : 'text-[#687b96] hover:bg-gray-50 hover:text-[#0e1680] font-normal'
      }`}
    >
      <Icon size={20} strokeWidth={1.5} className={isActive ? 'text-[#0e1680]' : 'text-[#687b96]'} />
      <span className="leading-tight">{label}</span>
    </Link>
  );
};

/* ─── Accordion Section ──────────────────────────────────────────── */
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
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[14px] transition-colors ${
          isAnyChildActive
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

/* ─── Sub Link ───────────────────────────────────────────────────── */
const SubLink = ({ to, label }: { to: string; label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-colors ${
        isActive
          ? 'bg-gradient-to-r from-[rgba(204,208,248,0.6)] to-[rgba(204,208,248,0.2)] text-[#0e1680] font-semibold'
          : 'text-[#687b96] hover:bg-gray-50 hover:text-[#0e1680] font-normal'
      }`}
    >
      <Monitor size={18} strokeWidth={1.5} className={isActive ? 'text-[#0e1680]' : 'text-[#687b96]'} />
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
  const navigate = useNavigate();
  const { logout } = useAuth();
  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col font-['Instrument_Sans']">

      {/* ── Top Bar ── */}
      <header className="h-16 bg-[#02053d] flex items-center justify-end px-6 gap-6 fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center gap-2.5">
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
        <div className="w-px h-8 bg-[#3b44b2]" />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
              <img src="https://i.pravatar.cc/32" alt="User avatar" className="w-full h-full object-cover" />
            </div>
            <div>
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
      </header>

      <div className="flex flex-1 pt-16">
        {/* ── Sidebar ── */}
        <aside className="w-[291px] bg-white fixed left-0 top-16 bottom-0 flex flex-col pt-[40px] px-[20px] pb-[24px] shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08)] overflow-y-auto custom-scrollbar z-30">

          {/* Logo */}
          <div className="flex items-center gap-2.5 px-2 mb-[23px]">
            <div className="w-9 h-9 bg-[#0e1680] rounded-xl flex items-center justify-center shrink-0">
              <LayoutGrid size={18} className="text-white" fill="currentColor" />
            </div>
            <span className="text-[22px] font-bold text-[#1d2939] tracking-tight">COE</span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-[16px]">
            <nav className="flex flex-col gap-0.5">

            {/* Academic Setup accordion */}
            <AccordionSection
              icon={Users}
              label="Academic Setup"
              activeRoutes={ACADEMIC_ROUTES}
              defaultOpen={true}
            >
              <SubLink to="/programme"        label="Programme" />
              <SubLink to="/semester"         label="Semester" />
              <SubLink to="/scheme"           label="Scheme" />
              <SubLink to="/department"       label="Department" />
              <SubLink to="/branch-management" label="Branch" />
              <SubLink to="/course"           label="Course" />
              <SubLink to="/academic-year"    label="Academic Year" />
              <SubLink to="/exam-pattern"     label="Exam Pattern Configuration" />
              <SubLink to="/co-po-mapping"    label="CO-PO Mapping Setup" />
            </AccordionSection>

            <NavItem to="/exam"               icon={Users}   label="Exam Event Scheduler" />
            <NavItem to="/student-management" icon={Users}   label="Student MGMT" />
            <NavItem to="/timetable"          icon={Users}   label="Timetable Creation" />

            {/* Blockwise Allocation accordion */}
            <AccordionSection
              icon={Users}
              label="Blockwise Allocation"
              activeRoutes={BLOCKWISE_ROUTES}
            >
              <SubLink to="/allocation"            label="Student Allocation" />
              <SubLink to="/supervisor-allocation" label="Supervisor Allocation" />
            </AccordionSection>

            <NavItem to="/paper-request-trigger"       icon={Users}   label="Question Paper Generation" />
            <NavItem to="/user-finalization"    icon={Users}   label="User Finalization" />
            <NavItem to="/marks-finalization"   icon={Users}   label="Marks Finalization" />
            <NavItem to="/hall-ticket"          icon={Users}   label="Hall Ticket Generation" />
            <NavItem to="/on-exam-monitoring"   icon={Monitor} label="On-exam Monitoring" />
            <NavItem to="/emergency-handling"   icon={Users}   label="Emergency Handling" />
            <NavItem to="/inventory-management" icon={Monitor} label="Inventory Management" />
            <NavItem to="/result-management"    icon={Monitor} label="Result Management" />
            <NavItem to="/marksheet-finalization" icon={Monitor} label="Marksheet Finalization" />
            <NavItem to="/publish-result"       icon={Monitor} label="Publish Result" />
            <NavItem to="/unlock-marksheet"     icon={Monitor} label="Unlock Marksheet" />
            <NavItem to="/exam-fees"            icon={Monitor} label="Exam Fees mapping" />
            <NavItem to="/approval-request"     icon={Monitor} label="Approval Request" />
            <NavItem to="/reval-assignment"     icon={Users}   label="Reval Assignment" />
            <NavItem to="/copy-case"            icon={Users}   label="Copy Case Processing" />
            {/* Divider */}
            <div className="h-px bg-gray-100 my-2" />

            <NavItem to="/settings" icon={Settings} label="Settings" />
            </nav>
          </div>
          
          <div className="pt-4 border-t border-[#e4e7ec] flex flex-col gap-0.5">
            <NavItem to="#" onClick={(e) => { e.preventDefault(); logout('/login'); }} icon={LogOut} label="Log Out" />
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="ml-[291px] flex-1 pt-[24px] px-[36px] pb-[25px] overflow-auto bg-[#fcfcfd] min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};