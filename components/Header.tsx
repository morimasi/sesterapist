
import React, { useState } from 'react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isSession = currentView === 'session';
  if (isSession) return null;

  const navModules = modules.filter(m => {
    if (!m.enabled && user?.role !== 'admin') return false;
    if (user?.role === 'admin') return true;
    if (m.minRole === 'therapist' && user?.role === 'client') return false;
    return m.category === 'core' || m.category === 'clinical';
  });

  return (
    <header className="sticky top-0 left-0 right-0 z-[100] bg-white dark:bg-[#080B12] border-b border-slate-200 dark:border-white/5 shadow-sm transition-all duration-300">
      <div className="max-w-[1920px] mx-auto h-20 md:h-24 flex items-center justify-between px-6 md:px-12">
        
        {/* Logo & Brand */}
        <div 
          className="flex items-center gap-5 cursor-pointer group shrink-0" 
          onClick={() => { onNavigate(user ? 'dashboard' : 'landing'); setIsMobileMenuOpen(false); }}
        >
          <div className="size-11 md:size-12 bg-primary text-white rounded-[16px] flex items-center justify-center shadow-primary-glow group-hover:rotate-[15deg] transition-all duration-500">
            <span className="material-symbols-outlined text-2xl md:text-3xl font-black">graphic_eq</span>
          </div>
          <div className="flex flex-col">
             <h1 className="font-black text-xl md:text-2xl tracking-tighter uppercase leading-none text-slate-900 dark:text-white">
               Thera<span className="text-primary italic">Speech</span>
             </h1>
             <div className="flex items-center gap-2 mt-1">
                <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[8px] md:text-[9px] font-black text-primary uppercase tracking-[0.3em]">GEMINI_3.0_MULDIMODAL</span>
             </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        {user && (
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/50 dark:bg-white/5 p-1.5 rounded-[24px] border border-slate-200/50 dark:border-white/5 shadow-inner mx-4">
            {navModules.slice(0, 7).map(mod => (
              <NavBtn 
                key={mod.id}
                icon={mod.icon} 
                label={mod.name} 
                active={currentView === mod.id} 
                onClick={() => onNavigate(mod.id)} 
              />
            ))}
          </nav>
        )}

        {/* Right Side Actions */}
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <button 
            onClick={toggleTheme}
            className="size-10 md:size-12 rounded-xl md:rounded-2xl flex items-center justify-center bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all"
          >
             <span className="material-symbols-outlined text-[20px] md:text-[24px]">
               {theme === 'light' ? 'dark_mode' : 'light_mode'}
             </span>
          </button>

          {user ? (
            <div className="flex items-center gap-3 md:gap-5 pl-3 md:pl-5 border-l border-slate-200 dark:border-white/10">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white">{user.name}</span>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">{user.role}</span>
              </div>
              <div 
                onClick={() => onNavigate('settings')}
                className="size-10 md:size-12 rounded-xl md:rounded-2xl border-2 border-white dark:border-white/10 shadow-lg cursor-pointer hover:ring-4 ring-primary/20 transition-all overflow-hidden"
              >
                <img src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`} alt="avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          ) : (
            <button 
              onClick={() => onNavigate('login')} 
              className="hidden md:block bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              OTURUM AÇ
            </button>
          )}

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden size-10 md:size-12 rounded-xl md:rounded-2xl flex items-center justify-center bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl"
          >
            <span className="material-symbols-outlined font-black text-xl">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-[#0C0F16] border-b border-slate-200 dark:border-white/10 p-6 shadow-3xl animate-in fade-in slide-in-from-top-2 duration-300 z-50 overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-2 gap-3">
             {user && navModules.map(mod => (
               <button 
                 key={mod.id}
                 onClick={() => { onNavigate(mod.id); setIsMobileMenuOpen(false); }}
                 className={`flex flex-col items-center gap-3 p-6 rounded-[24px] transition-all border ${currentView === mod.id ? 'bg-primary text-white border-primary shadow-lg' : 'bg-slate-50 dark:bg-white/5 border-transparent text-slate-500'}`}
               >
                 <span className="material-symbols-outlined text-3xl">{mod.icon}</span>
                 <span className="text-[10px] font-black uppercase tracking-widest text-center">{mod.name}</span>
               </button>
             ))}
          </div>
          {!user && (
            <button onClick={() => { onNavigate('login'); setIsMobileMenuOpen(false); }} className="w-full mt-6 py-5 bg-primary text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl">GİRİŞ YAP</button>
          )}
        </div>
      )}
    </header>
  );
};

const NavBtn: React.FC<{ icon: string, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`text-[10px] font-black transition-all flex items-center gap-2.5 px-5 py-2.5 rounded-[18px] uppercase tracking-[0.15em] group ${active ? 'text-white bg-slate-900 dark:bg-white dark:text-slate-900 shadow-lg' : 'text-slate-500 hover:text-primary dark:text-slate-400'}`}
  >
    <span className={`material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform ${active ? 'filled' : ''}`}>{icon}</span>
    <span className="hidden xl:block whitespace-nowrap">{label}</span>
  </button>
);

export default Header;
