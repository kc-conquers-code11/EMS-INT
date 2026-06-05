import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const AdminLayout = () => {
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error('Logout error:', err);
        }
    };
    return (
        <div className="min-h-screen bg-[#fcfcfd] flex flex-col">
            {/* Top Bar */}
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
                {/* Sidebar */}
                <aside className="w-[291px] bg-white fixed left-0 top-16 bottom-0 flex flex-col items-center py-10 px-5 shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08),0px_4px_6px_0px_rgba(16,24,40,0.03)]">
                    <div className="flex flex-col items-center gap-6 w-full">
                        {/* Logo Icon */}
                        <div className="w-[45px] h-[45px] bg-[#0e1680] rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <p className="font-semibold text-[#1d2939] text-[22px] tracking-tight">Super Admin</p>

                        <div className="w-full border-t border-gray-200" />

                        {/* Nav Items */}
                        <nav className="w-full flex flex-col gap-4">
                            <div className="w-full border-t border-gray-100" />
                            {/* Add Institution Details */}
                            <Link to="/add-institution" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname === '/add-institution' ? 'bg-gradient-to-r from-[rgba(204,208,248,0.6)] to-[rgba(204,208,248,0.2)]' : 'hover:bg-gray-50'}`}>
                                <svg className="w-6 h-6 text-[#687b96]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18M10 3v18M14 3v18M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6z" />
                                </svg>
                                <span className="text-[#687b96] font-normal text-base">Add Institution Details</span>
                            </Link>
                            {/* Institute List */}
                            <Link to="/institution-list" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname === '/institution-list' ? 'bg-gradient-to-r from-[rgba(204,208,248,0.6)] to-[rgba(204,208,248,0.2)]' : 'hover:bg-gray-50'}`}>
                                <svg className="w-6 h-6 text-[#687b96]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                                <span className="text-[#687b96] font-normal text-base">Institute List</span>
                            </Link>
                            <div className="w-full border-t border-gray-100" />
                        </nav>

                        {/* Bottom nav */}
                        <div className="w-full flex flex-col gap-1">
                            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors">
                                <svg className="w-6 h-6 text-[#687b96]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-[#687b96] font-normal text-base">Settings</span>
                            </a>
                            <button onClick={handleLogout} className="cursor-pointer flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors">
                                <svg className="w-6 h-6 text-[#687b96]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="text-[#687b96] font-normal text-base">Log Out</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="ml-[291px] flex-1 p-8 overflow-auto bg-[#fcfcfd]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};