import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Settings, LogOut, GraduationCap, BookOpen, Menu, X, Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useUserScope } from '../../hooks/useUserScope';

const NavItem = ({
  to,
  icon: Icon,
  label,
  onClick,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
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

export default function HodLayout() {
  const location = useLocation();
  const { logout } = useAuth();
  const { user, institutionName, departName } = useUserScope();
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
          <span className="text-white font-bold ml-2">HOD</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 bg-[#21234e] border border-[#3b44b2] rounded-lg hover:bg-[#2d2f60] transition-colors hidden sm:flex">
            <Bell size={20} className="text-white" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#02053d]" />
          </button>
          <div className="w-px h-8 bg-[#3b44b2] hidden sm:block" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden shrink-0">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.email || 'HOD')}&background=6366f1&color=fff`}
                alt="HOD"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-white text-sm font-semibold leading-5">{user?.email?.split('@')[0] || 'HOD'}</p>
              <p className="text-[#f2f4f7] text-xs leading-[18px]">Head of Department</p>
            </div>
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

        <aside className={`w-[291px] bg-white fixed left-0 top-0 lg:top-16 bottom-0 flex flex-col pt-[40px] px-[20px] pb-[24px] shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08)] overflow-y-auto custom-scrollbar z-50 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:translate-x-0 flex-shrink-0`}>
          <div className="flex items-center justify-between px-2 mb-[23px]">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-[#0e1680] rounded-xl flex items-center justify-center shadow-sm">
                <GraduationCap className="text-white" size={24} />
              </div>
              <span className="text-[22px] font-bold text-[#101828] tracking-tight">HOD</span>
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

        <div className="flex-1 flex flex-col min-w-0 bg-[#fafafa] lg:ml-0">
          <div className="hidden lg:flex h-[56px] bg-[#0b0f4d] items-center px-8 flex-shrink-0">
            <p className="text-white/80 text-sm">
              {[departName, institutionName].filter(Boolean).join(' · ') || 'Department Portal'}
            </p>
          </div>

          <main className="flex-1 overflow-y-auto pt-[24px] px-4 md:px-[36px] pb-[25px]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
