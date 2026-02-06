
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'employees' | 'attendance';
  setActiveTab: (tab: 'dashboard' | 'employees' | 'attendance') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
    { id: 'employees', label: 'Workforce', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'attendance', label: 'Daily Log', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  ] as const;

  return (
    <div className="flex h-screen overflow-hidden p-4 md:p-6 gap-6">
      {/* Floating Glass Sidebar */}
      <aside className="w-80 glass rounded-[48px] hidden md:flex flex-col overflow-hidden shadow-[0_32px_120px_rgba(0,0,0,0.08)]">
        <div className="p-10 pb-8 border-b border-white/30">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-300 ring-4 ring-white/50">
              <span className="text-white font-black text-3xl italic">H</span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 leading-tight tracking-tighter">HRMS<span className="text-indigo-600">CORE</span></h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Enterprise Lab</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-8 space-y-4 mt-12">
          <p className="px-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 opacity-60">System Operations</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-5 text-sm font-black rounded-[28px] transition-all duration-500 group relative ${
                activeTab === item.id
                  ? 'bg-indigo-600 text-white shadow-[0_20px_50px_rgba(79,70,229,0.3)]'
                  : 'text-slate-500 hover:bg-white/70 hover:text-slate-900'
              }`}
            >
              <svg className={`w-6 h-6 mr-5 transition-all duration-500 ${activeTab === item.id ? 'text-white scale-110' : 'text-slate-400 group-hover:text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} />
              </svg>
              {item.label}
              {activeTab === item.id && (
                <div className="absolute right-6 w-2 h-2 bg-white rounded-full animate-pulse shadow-glow"></div>
              )}
            </button>
          ))}
        </nav>
        
        <div className="p-8">
          <div className="glass rounded-[40px] p-6 border-white/60 shadow-xl relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-3">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
              </span>
            </div>
            <div className="flex items-center gap-5 relative z-10">
              <div className="relative">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=SysAdminProfessional" 
                  className="w-14 h-14 rounded-2xl bg-indigo-50 p-0.5 border-2 border-white shadow-lg group-hover:scale-110 transition-transform duration-500"
                  alt="SYS ADMIN"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-slate-900 truncate uppercase tracking-[0.1em]">SYS ADMIN</p>
                <p className="text-[10px] text-slate-500 font-bold opacity-70 tracking-tighter uppercase">Root Controller</p>
              </div>
            </div>
            <button className="w-full mt-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
              Manage Keys
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto custom-scrollbar rounded-[48px]">
          <div className="max-w-6xl mx-auto py-8 px-4 animate-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
