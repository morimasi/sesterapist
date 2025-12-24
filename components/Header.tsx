
import React from 'react';
import { AppView, User, PlatformModule } from '../types';

interface HeaderProps {
  currentView: AppView;
  user: User | null;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onNavigate: (view: AppView) => void;
  modules: PlatformModule[];
}

const Header: React.FC<HeaderProps> = ({ currentView, user, theme, toggleTheme, onNavigate, modules }) => {
  const isLanding = currentView === 'landing';
  const isSession = currentView === 'session';

  if (isSession) return null;

  const visibleModules = modules.filter(m => {
    if (!m.enabled && user?.role !== 'admin') return false;
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (m.minRole === 'admin') return false;
    if (m.minRole === 'therapist' && user.role === 'client') return false;
    return true;
  });
  
  const coreModules = visibleModules.filter(m => m.category === 'core' || m.category === 'clinical');

  return (
    <header className={`h-20 flex items-center justify-between px-8 shrink-0 z-50 transition-all duration-500 sticky top-0 ${isLanding ? 'bg-transparent' : 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5'}`}>
      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate(user ? 'dashboard' : 'landing')}>
        <div className="size-10 bg-primary text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/30 group-hover:rotate-12 transition-all">
          <span className="material-symbols-outlined text-2xl font-black">graphic_eq</span>
        </div>
        <div className="hidden sm:block">
           <h1 className="font-black text-xl tracking-tighter text-slate-900 dark:text-white leading-none">
             Thera<span className="text-primary italic">Speech</span>
           </h1>
           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Clinical AI</span>
        </div>
      </div>

      {user && (
        <nav className="hidden lg:flex items-center bg-slate-100/50 dark:bg-white/5 p-1 rounded-[24px] border border-slate-200/50 dark:border-white/5">
          {coreModules.map(mod => (
            <HeaderLink 
              key={mod.id}
              icon={mod.icon} 
              label={mod.name} 
              active={currentView === mod.id} 
              onClick={() => onNavigate(mod.id)} 
            />
          ))}
        </nav>
      )}

      <div className="flex items-center gap-5">
        <button 
          onClick={toggleTheme}
          className="size-10 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
        >
           <span className="material-symbols-outlined text-[20px]">
             {theme === 'light' ? 'dark_mode' : 'light_mode'}
           </span>
        </button>

        {user ? (
          <div className="flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-white/10">
             <div className="hidden md:block text-right">
                <div className="text-xs font-black text-slate-900 dark:text-white leading-none mb-1">{user.name}</div>
                <div className={`text-[9px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'text-rose-500' : 'text-primary'}`}>
                  {user.role === 'admin' ? 'SYSTEM_ROOT' : user.role === 'therapist' ? 'CLINICAL_PRO' : 'CLIENT_ACCESS'}
                </div>
             </div>
            <div 
              onClick={() => onNavigate('settings')}
              className="size-10 rounded-[14px] bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-white/10 shadow-xl cursor-pointer hover:ring-4 ring-primary/20 transition-all overflow-hidden"
            >
              <img src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`} alt="avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        ) : (
          <button onClick={() => onNavigate('login')} className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95">Hemen Başla</button>
        )}
      </div>
    </header>
  );
};

const HeaderLink: React.FC<{ icon: string, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`text-[10px] font-black transition-all flex items-center gap-2.5 px-6 py-2.5 rounded-[20px] uppercase tracking-widest ${active ? 'text-primary bg-white dark:bg-slate-950 shadow-xl shadow-black/5 dark:shadow-primary/5 border border-slate-100 dark:border-white/5' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
  >
    <span className="material-symbols-outlined text-[18px]">{icon}</span>
    <span className="hidden xl:inline">{label}</span>
  </button>
);

export default Header;
