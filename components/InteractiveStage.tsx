
import React from 'react';
import { Activity } from '../types';

interface InteractiveStageProps {
  activity: Activity | null;
  isAiActive: boolean;
}

const InteractiveStage: React.FC<InteractiveStageProps> = ({ activity, isAiActive }) => {
  if (!activity) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-12">
        <div className="size-24 bg-white/5 rounded-[40px] flex items-center justify-center mb-6 border border-white/5 animate-pulse">
           <span className="material-symbols-outlined text-5xl text-white/10">auto_fix</span>
        </div>
        <h3 className="text-2xl font-black text-white italic tracking-tight mb-2">Henüz Bir Materyal Seçilmedi</h3>
        <p className="text-slate-500 max-w-sm">Seans akışından bir materyal seçerek interaktif sahneye yansıtabilirsiniz.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-900/50 relative p-8">
      {/* Visual Feedback Overlays */}
      {isAiActive && (
        <div className="absolute inset-0 pointer-events-none z-10">
           <div className="absolute top-4 right-4 flex gap-2">
              <div className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase rounded-lg shadow-xl shadow-primary/20 flex items-center gap-2 border border-white/20 animate-in slide-in-from-right">
                 <span className="size-2 bg-white rounded-full animate-ping"></span>
                 AI VİZYON AKTİF
              </div>
           </div>
           {/* Simulated Face Tracking Mesh Placeholder */}
           <div className="absolute inset-0 border-2 border-primary/10 rounded-[48px] animate-pulse"></div>
        </div>
      )}

      {/* Main Content Render */}
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in duration-500">
         <div className="relative group">
            <div className="absolute -inset-4 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <img 
              src={activity.image} 
              className="size-64 md:size-80 rounded-[48px] object-cover shadow-2xl border-4 border-white/10 relative z-0" 
              alt={activity.title} 
            />
         </div>
         
         <div className="max-w-2xl">
            <h2 className="text-4xl font-black text-white tracking-tighter italic mb-4">{activity.title}</h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">{activity.description}</p>
         </div>

         <div className="flex gap-4 pt-8">
            <ActionButton icon="mic" label="Ses Kaydet" color="bg-white/5 text-white" />
            <ActionButton icon="check_circle" label="Doğru Cevap" color="bg-emerald-500 text-white shadow-xl shadow-emerald-500/20" />
            <ActionButton icon="cancel" label="Hatalı Cevap" color="bg-rose-500 text-white shadow-xl shadow-rose-500/20" />
         </div>
      </div>

      {/* Activity Settings Overlay (Therapist Only Indicator) */}
      <div className="absolute top-8 left-8 flex items-center gap-4 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10">
         <span className="material-symbols-outlined text-primary text-sm">settings_input_component</span>
         <div>
            <div className="text-[9px] font-black text-slate-500 uppercase leading-none mb-1">Konfigürasyon</div>
            <div className="text-xs font-bold text-white leading-none">{activity.settings?.targetSoundPosition} • {activity.settings?.difficulty}</div>
         </div>
      </div>
    </div>
  );
};

const ActionButton: React.FC<{ icon: string, label: string, color: string }> = ({ icon, label, color }) => (
  <button className={`px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-3 transition-all hover:scale-105 active:scale-95 border border-white/5 ${color}`}>
     <span className="material-symbols-outlined">{icon}</span>
     {label}
  </button>
);

export default InteractiveStage;
