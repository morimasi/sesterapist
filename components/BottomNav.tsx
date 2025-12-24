
import React from 'react';
import { AppView } from '../types';

interface BottomNavProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="md:hidden fixed bottom-6 left-6 right-6 z-[100] bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-white/5 p-2 rounded-[32px] flex items-center justify-around shadow-[0_30px_60px_rgba(0,0,0,0.2)]">
      <BottomNavItem 
        icon="dashboard" 
        label="PANEL" 
        active={currentView === 'dashboard'} 
        onClick={() => onNavigate('dashboard')} 
      />
      <BottomNavItem 
        icon="book" 
        label="STÜDYO" 
        active={currentView === 'library'} 
        onClick={() => onNavigate('library')} 
      />
      <BottomNavItem 
        icon="trending_up" 
        label="ANALIZ" 
        active={currentView === 'progress'} 
        onClick={() => onNavigate('progress')} 
      />
      <BottomNavItem 
        icon="settings" 
        label="HESAP" 
        active={currentView === 'settings'} 
        onClick={() => onNavigate('settings')} 
      />
    </nav>
  );
};

const BottomNavItem: React.FC<{ icon: string, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-4 flex flex-col items-center gap-1.5 transition-all rounded-[24px] ${active ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-110' : 'text-slate-400'}`}
  >
    <span className={`material-symbols-outlined text-[20px] ${active ? 'filled' : ''}`}>{icon}</span>
    <span className="text-[8px] font-black uppercase tracking-[0.2em]">{label}</span>
  </button>
);

export default BottomNav;
