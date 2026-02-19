
import React, { useState } from 'react';
import { Activity } from '../types';

interface InteractiveStageProps {
  activity: Activity | null;
  isAiActive: boolean;
}

const InteractiveStage: React.FC<InteractiveStageProps> = ({ activity, isAiActive }) => {
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  if (!activity) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-12">
        <div className="size-24 bg-white/5 rounded-[40px] flex items-center justify-center mb-6 border border-white/5 animate-pulse">
           <span className="material-symbols-outlined text-5xl text-white/10">auto_fix</span>
        </div>
        <h3 className="text-2xl font-black text-white italic tracking-tight mb-2 uppercase">Materyal Bekleniyor</h3>
        <p className="text-slate-500 max-w-sm font-medium">Seans akışından bir çalışma seçerek interaktif sahneye yansıtabilirsiniz.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative bg-slate-900/40">
      
      {/* Clinical Toolbox / Overlay */}
      <div className="absolute top-10 left-10 right-10 flex justify-between items-start z-10 pointer-events-none">
         <div className="flex flex-col gap-4 pointer-events-auto">
            <div className="bg-black/40 backdrop-blur-xl px-6 py-4 rounded-3xl border border-white/10 flex items-center gap-6 shadow-2xl">
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Doğru Üretim</span>
                  <span className="text-2xl font-black text-emerald-500 italic leading-none">{correctCount}</span>
               </div>
               <div className="w-px h-8 bg-white/10"></div>
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Hatalı Üretim</span>
                  <span className="text-2xl font-black text-rose-500 italic leading-none">{wrongCount}</span>
               </div>
            </div>
         </div>

         {isAiActive && (
           <div className="bg-primary/10 border border-primary/20 backdrop-blur-xl px-6 py-3 rounded-2xl flex items-center gap-4 animate-in slide-in-from-right">
              <div className="size-2 bg-primary rounded-full animate-ping"></div>
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Canlı Vizyon Analitiği</span>
           </div>
         )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-10 animate-in zoom-in duration-700">
         <div className="relative group">
            <div className="absolute -inset-8 bg-primary/10 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="size-64 md:size-[400px] rounded-[64px] overflow-hidden border-8 border-white/5 shadow-3xl relative z-0 group-hover:scale-[1.02] transition-transform duration-1000">
               <img src={activity.image} className="w-full h-full object-cover" alt={activity.title} />
            </div>
            {/* Action Buttons Overlay on Image */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm rounded-[64px] gap-6">
                <button onClick={() => setCorrectCount(c => c + 1)} className="size-20 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all">
                   <span className="material-symbols-outlined text-4xl font-black">check</span>
                </button>
                <button onClick={() => setWrongCount(c => c + 1)} className="size-20 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all">
                   <span className="material-symbols-outlined text-4xl font-black">close</span>
                </button>
            </div>
         </div>

         <div className="max-w-3xl space-y-4">
            <div className="inline-flex px-4 py-1.5 bg-white/5 rounded-full text-[10px] font-black text-primary uppercase tracking-widest border border-white/10 mb-2">
               {activity.category}
            </div>
            <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">{activity.title}</h2>
            <p className="text-xl text-slate-400 font-medium italic max-w-2xl mx-auto leading-relaxed">"{activity.description}"</p>
         </div>
      </div>

      {/* Waveform Visualization (Simulated) */}
      <div className="h-32 flex items-center justify-center gap-1.5 px-20 opacity-30">
         {new Array(60).fill(0).map((_, i) => (
           <div 
             key={i} 
             className="w-1.5 bg-primary rounded-full transition-all duration-300" 
             style={{ height: `${20 + Math.random() * 80}%`, animation: `pulse-slow 2s infinite ${i * 50}ms` }}
           ></div>
         ))}
      </div>
    </div>
  );
};

export default InteractiveStage;
