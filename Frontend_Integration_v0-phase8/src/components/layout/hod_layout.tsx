import { Link, Outlet, useLocation } from 'react-router-dom';
import { Settings, LogOut, GraduationCap, BookOpen } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useUserScope } from '../../hooks/useUserScope';

const NavItem = ({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
}) => {
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

export default function HodLayout() {
  const { logout } = useAuth();
  const { user, institutionName, departName } = useUserScope();

  return (
    <div className="flex h-screen bg-gray-50 font-['Instrument_Sans']">
      <aside className="w-[291px] bg-white border-r border-[#e4e7ec] flex flex-col shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08)] flex-shrink-0 z-20 pt-[40px] px-[20px] pb-[24px]">
        <div className="flex items-center mb-[23px] px-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-[#0e1680] rounded-xl flex items-center justify-center shadow-sm">
              <GraduationCap className="text-white" size={24} />
            </div>
            <span className="text-[22px] font-bold text-[#101828] tracking-tight">HOD</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-[16px]">
          <nav className="flex flex-col gap-0.5">
            <NavItem
              to="/hod/subject-faculty-mapping"
              icon={BookOpen}
              label="Subject-Faculty Mapping"
            />
          </nav>
        </div>

        <div className="pt-4 border-t border-[#e4e7ec] flex flex-col gap-0.5">
          <NavItem to="/hod/settings" icon={Settings} label="Settings" />
          <button
            onClick={() => logout('/faculty-login')}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] text-[#687b96] hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left"
          >
            <LogOut size={20} strokeWidth={1.5} />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 bg-[#fafafa]">
        <header className="h-[72px] bg-[#0b0f4d] flex items-center justify-between px-8 flex-shrink-0">
          <p className="text-white/80 text-sm">
            {[departName, institutionName].filter(Boolean).join(' · ') || 'Department Portal'}
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden border-2 border-white/20">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.email || 'HOD')}&background=6366f1&color=fff`}
                alt="HOD"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-white leading-tight">
                {user?.email?.split('@')[0] || 'HOD'}
              </span>
              <span className="text-[12px] text-white/70 leading-tight">Head of Department</span>
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
