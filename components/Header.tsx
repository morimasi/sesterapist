
import React from 'react';
import { AppView, User, PlatformModule } from '../types';

interface HeaderProps {
  currentView: AppView;
  user: User | null;
  onNavigate: (view: AppView) => void;
  modules: PlatformModule[];
}

const Header: React.FC<HeaderProps> = ({ currentView, user, onNavigate, modules }) => {
  const isLanding = currentView === 'landing';
  const isSession = currentView === 'session';

  if (isSession) return null;

  // Sadece aktif olan ve kullanıcının rolüne izin verilen modülleri filtrele
  const visibleModules = modules.filter(m => {
    if (!m.enabled && user?.role !== 'admin') return false;
    if (!user) return false;
    
    // Admin her şeyi görür, diğerleri yetkiye göre
    if (user.role === 'admin') return true;
    if (m.minRole === 'admin') return false;
    if (m.minRole === 'therapist' && user.role === 'client') return false;
    
    return true;
  });
  
  const coreModules = visibleModules.filter(m => m.category === 'core' || m.category === 'clinical');
  const adminModules = visibleModules.filter(m => m.category === 'admin' || m.category === 'growth');

  return (
    <header className={`h-16 flex items-center justify-between px-6 shrink-0 z-30 transition-all ${isLanding ? 'bg-transparent border-transparent' : 'bg-surface border-b border-border shadow-sm'}`}>
      <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => onNavigate('dashboard')}>
        <div className="size-9 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
          <span className="material-symbols-outlined text-2xl font-bold">graphic_eq</span>
        </div>
        <h1 className="font-extrabold text-xl tracking-tight text-slate-900">
          Thera<span className="text-primary">Speech</span>
        </h1>
      </div>

      {user && (
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {coreModules.map(mod => (
            <HeaderLink 
              key={mod.id}
              icon={mod.icon} 
              label={mod.name} 
              active={currentView === mod.id} 
              onClick={() => onNavigate(mod.id)} 
            />
          ))}
          
          {adminModules.length > 0 && (
            <div className="flex items-center gap-1 border-l border-border ml-2 pl-2">
              {adminModules.map(mod => (
                <button 
                  key={mod.id}
                  onClick={() => onNavigate(mod.id)}
                  className={`p-2 rounded-lg transition-all ${currentView === mod.id ? 'text-primary bg-primary/10' : 'text-slate-300 hover:text-slate-600'}`}
                  title={mod.name}
                >
                  <span className="material-symbols-outlined text-[18px]">{mod.icon}</span>
                </button>
              ))}
            </div>
          )}
        </nav>
      )}

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
             <div className="hidden lg:block text-right">
                <div className="text-xs font-bold text-slate-900 leading-none">{user.name}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                  {user.role === 'admin' ? 'Sistem Yöneticisi' : user.role === 'therapist' ? 'Uzman Terapist' : 'Danışan'}
                </div>
             </div>
            <div 
              onClick={() => onNavigate('settings')}
              className="size-9 rounded-full bg-slate-200 border-2 border-white shadow-sm cursor-pointer hover:ring-2 ring-primary transition-all overflow-hidden"
            >
              <img src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`} alt="avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        ) : (
          <button onClick={() => onNavigate('login')} className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">Hemen Başla</button>
        )}
      </div>
    </header>
  );
};

const HeaderLink: React.FC<{ icon: string, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`text-sm font-bold transition-all flex items-center gap-2 px-3 py-1.5 rounded-xl ${active ? 'text-primary bg-primary/5' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
  >
    <span className="material-symbols-outlined text-[20px]">{icon}</span>
    <span className="hidden xl:inline">{label}</span>
  </button>
);

export default Header;
