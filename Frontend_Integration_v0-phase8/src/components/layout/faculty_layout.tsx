import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Settings, LogOut,
  FileText, ClipboardList, CheckSquare, Copy,
  Users, UserCheck, AlertCircle, Grid, Calendar, Monitor, GraduationCap,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

/* ── NavItem ─────────────────────────────────────────────────────── */
const NavItem = ({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
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

export default function FacultyLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  return (
    <div className="flex h-screen bg-gray-50 font-['Instrument_Sans']">
      {/* ── Sidebar ── */}
      <aside className="w-[291px] bg-white border-r border-[#e4e7ec] flex flex-col shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08)] flex-shrink-0 z-20 pt-[40px] px-[20px] pb-[24px]">
        {/* Logo */}
        <div className="flex items-center mb-[23px] px-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-[#0e1680] rounded-xl flex items-center justify-center shadow-sm">
              <GraduationCap className="text-white" size={24} />
            </div>
            <span className="text-[22px] font-bold text-[#101828] tracking-tight">Faculty</span>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-[16px]">
          <nav className="flex flex-col gap-0.5">
          <NavItem to="/faculty/paper-requests"      icon={FileText}      label="Question Paper Creation" />
          <NavItem to="/faculty/marks-entry"         icon={ClipboardList} label="Marks Entry" />
          <NavItem to="/faculty/marksheet-verify"    icon={CheckSquare}   label="Marksheet Verification" />
          <NavItem to="/faculty/copy-case"           icon={Copy}          label="Copy Case Process records" />
          <NavItem to="/faculty/blockwise-attendance" icon={Users}        label="Blockwise attendence" />
          <NavItem to="/faculty/accept-supervisor"   icon={UserCheck}     label="Accept supervisor duty" />
          <NavItem to="/faculty/absent-reporting"    icon={AlertCircle}   label="Absent Reporting" />
          <NavItem to="/faculty/blockwise-allocation" icon={Grid}         label="View Blockwise allocation" />
          <NavItem to="/faculty/exam-allocation"     icon={Calendar}      label="View Exam allocation" />
          <NavItem to="/faculty/onscreen-evaluation" icon={Monitor}       label="On screen Evaluation" />
          </nav>
        </div>

        {/* Bottom */}
        <div className="pt-4 border-t border-[#e4e7ec] flex flex-col gap-0.5">
          <NavItem to="/faculty/settings" icon={Settings} label="Settings" />
          <button onClick={() => logout('/faculty-login')} className="flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] text-[#687b96] hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left">
            <LogOut size={20} strokeWidth={1.5} />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#fafafa]">
        {/* Header */}
        <header className="h-[72px] bg-[#0b0f4d] flex items-center justify-end px-8 flex-shrink-0">
          <div className="flex items-center gap-6">
            <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/10 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            </button>
            <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/10 transition-colors relative">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0b0f4d]" />
            </button>
            <div className="w-px h-8 bg-white/20" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden border-2 border-white/20">
                <img src="https://i.pravatar.cc/150?u=faculty_abc" alt="Faculty" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-bold text-white leading-tight">ABC</span>
                <span className="text-[12px] text-white/70 leading-tight">Faculty</span>
              </div>
              <button className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/10 ml-2">
                <Settings size={16} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pt-[24px] px-[36px] pb-[25px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
