
import React from 'react';
import { APP_NAME, Icons } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  userRole?: string;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onLogout, activeTab, setActiveTab }) => {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 pb-20 md:pb-0 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar Desktop */}
      <nav className="hidden md:flex bg-white w-72 fixed h-screen z-50 flex-col border-r border-slate-200">
        <div className="p-10 flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-xl text-white shadow-lg">
            <Icons.Plane />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 uppercase">{APP_NAME}</h1>
        </div>

        <div className="flex-1 px-6 space-y-1">
          <NavItem 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
            icon={<Icons.Explore />} 
            label="DASHBOARD" 
          />
          <NavItem 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
            icon={<Icons.Saved />} 
            label="MY TRIPS" 
          />
          <NavItem 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')} 
            icon={<Icons.User />} 
            label="SETTINGS" 
          />
        </div>

        <div className="p-8 border-t border-slate-100">
          <button 
            onClick={onLogout} 
            className="w-full flex items-center gap-3 px-6 py-4 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-red-600 transition-all"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="md:ml-72 min-h-screen">
        <div className="w-full">
          {children}
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-white h-16 rounded-2xl border border-slate-200 shadow-2xl flex items-center justify-around px-8 z-50">
        <MobileNavItem 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
          icon={<Icons.Explore />} 
        />
        <MobileNavItem 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')} 
          icon={<Icons.Saved />} 
        />
        <MobileNavItem 
          active={activeTab === 'profile'} 
          onClick={() => setActiveTab('profile')} 
          icon={<Icons.User />} 
        />
      </nav>
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-200 group ${active ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
  >
    <div className={`${active ? 'scale-110' : 'scale-100 opacity-70 group-hover:opacity-100'}`}>{icon}</div>
    <span className="text-sm font-bold tracking-tight">{label}</span>
  </button>
);

const MobileNavItem = ({ active, onClick, icon }: any) => (
  <button 
    onClick={onClick}
    className={`p-3 rounded-xl transition-all duration-200 ${active ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}
  >
    <div className={`${active ? 'scale-110' : 'scale-100'}`}>{icon}</div>
  </button>
);

export default Layout;
