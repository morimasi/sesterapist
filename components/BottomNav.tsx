
import React from 'react';
import { AppView } from '../types';

interface BottomNavProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-6 py-3 pb-8 flex items-center justify-between shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
      <BottomNavItem 
        icon="dashboard" 
        label="Panel" 
        active={currentView === 'dashboard'} 
        onClick={() => onNavigate('dashboard')} 
      />
      <BottomNavItem 
        icon="book" 
        label="Kütüphane" 
        active={currentView === 'library'} 
        onClick={() => onNavigate('library')} 
      />
      <BottomNavItem 
        icon="trending_up" 
        label="Gelişim" 
        active={currentView === 'progress'} 
        onClick={() => onNavigate('progress')} 
      />
      <BottomNavItem 
        icon="settings" 
        label="Ayarlar" 
        active={currentView === 'settings'} 
        onClick={() => onNavigate('settings')} 
      />
    </nav>
  );
};

const BottomNavItem: React.FC<{ icon: string, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-primary scale-110' : 'text-slate-400'}`}
  >
    <span className={`material-symbols-outlined text-2xl ${active ? 'filled' : ''}`}>{icon}</span>
    <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
  </button>
);

export default BottomNav;
