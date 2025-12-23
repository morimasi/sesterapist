
import React, { useState, useEffect, useRef } from 'react';
import { SessionMetadata, Activity, LiveStats } from '../types';
import InteractiveStage from './InteractiveStage';

interface SessionRoomProps {
  session: SessionMetadata | null;
  onEndSession: () => void;
}

const SessionRoom: React.FC<SessionRoomProps> = ({ session, onEndSession }) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [activeActivity, setActiveActivity] = useState<Activity | null>(session?.flow?.[0] || null);
  const [isLiveAiActive, setIsLiveAiActive] = useState(false);
  const [stats, setStats] = useState<LiveStats>({
    articulationScore: 65,
    fluencyScore: 40,
    engagementLevel: 85,
    detectedErrors: []
  });

  if (!session) return null;

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-950 font-sans selection:bg-primary/30">
      {/* Sol Panel: Klinik Kontrol Ünitesi */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Cam & Interactive Stage Container */}
        <div className="flex-1 p-4 md:p-6 flex flex-col gap-4 overflow-hidden">
           <div className="flex-1 bg-slate-900/40 rounded-[48px] border border-white/5 overflow-hidden shadow-2xl relative group">
              <InteractiveStage activity={activeActivity} isAiActive={isLiveAiActive} />
              
              {/* Floating Participant Views */}
              <div className="absolute top-6 left-6 flex flex-col gap-4 pointer-events-none">
                 <div className="w-48 aspect-video bg-slate-800 rounded-3xl border border-white/10 shadow-2xl overflow-hidden ring-4 ring-black/20 pointer-events-auto">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Therapist" />
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] text-white font-bold">UZMAN</div>
                 </div>
                 <div className="w-48 aspect-video bg-slate-800 rounded-3xl border border-white/10 shadow-2xl overflow-hidden ring-4 ring-black/20 pointer-events-auto">
                    <img src="https://images.unsplash.com/photo-1544717297-fa95b3ee51f3?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Client" />
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] text-white font-bold">DANIŞAN</div>
                 </div>
              </div>

              {/* Status Indicators */}
              <div className="absolute top-6 right-6 flex items-center gap-2">
                 {isLiveAiActive && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary/20 backdrop-blur-xl border border-primary/30 rounded-2xl text-primary text-[10px] font-black uppercase tracking-widest animate-pulse">
                       <span className="size-2 bg-primary rounded-full"></span>
                       AI_ANALYSIS_LIVE
                    </div>
                 )}
                 <div className="px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest">
                    REC 12:44
                 </div>
              </div>
           </div>

           {/* Quick Material Switcher */}
           <div className="h-24 bg-slate-900/60 backdrop-blur-md rounded-[32px] border border-white/5 p-3 flex items-center gap-3 overflow-x-auto scrollbar-hide shadow-xl">
              <div className="px-4 border-r border-white/10">
                 <div className="text-[10px] font-black text-slate-500 uppercase">Seans_Akışı</div>
                 <div className="text-xs text-white font-bold">{session.flow?.length || 0} Adım</div>
              </div>
              {session.flow?.map((act) => (
                <button 
                  key={act.id}
                  onClick={() => setActiveActivity(act)}
                  className={`flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-2xl transition-all border ${activeActivity?.id === act.id ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30 scale-105' : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'}`}
                >
                   <div className="size-8 rounded-xl bg-cover bg-center shadow-inner" style={{ backgroundImage: `url(${act.image})` }}></div>
                   <span className="text-xs font-black whitespace-nowrap italic">{act.title}</span>
                </button>
              ))}
           </div>
        </div>

        {/* Master Toolbar */}
        <div className="h-24 flex items-center justify-between px-10 bg-slate-950/90 backdrop-blur-2xl border-t border-white/5">
           <div className="flex items-center gap-3">
              <ToolbarButton icon={isMicOn ? 'mic' : 'mic_off'} active={isMicOn} onClick={() => setIsMicOn(!isMicOn)} />
              <ToolbarButton icon={isCamOn ? 'videocam' : 'videocam_off'} active={isCamOn} onClick={() => setIsCamOn(!isCamOn)} />
              <ToolbarButton icon="screen_share" onClick={() => {}} />
           </div>

           <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-3xl border border-white/5">
              <button 
                onClick={() => setIsLiveAiActive(!isLiveAiActive)}
                className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl font-black transition-all group ${isLiveAiActive ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'bg-transparent text-slate-400 hover:bg-white/5'}`}
              >
                 <span className={`material-symbols-outlined text-xl ${isLiveAiActive ? 'animate-spin-slow' : 'group-hover:rotate-12'}`}>psychology</span>
                 {isLiveAiActive ? 'AI_ASSISTANT_ACTIVE' : 'ACTIVATE_AI_ANALYSIS'}
              </button>
           </div>

           <div className="flex items-center gap-4">
              <button onClick={onEndSession} className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-4 rounded-2xl font-black transition-all flex items-center gap-3 shadow-2xl shadow-rose-500/30 active:scale-95">
                 <span className="material-symbols-outlined font-bold">call_end</span>
                 SEANSI_BİTİR
              </button>
           </div>
        </div>
      </div>

      {/* Sağ Panel: Klinik Veri & Gözlem */}
      <aside className="hidden lg:flex w-[420px] bg-white flex-col border-l border-slate-200 shadow-[-20px_0_40px_rgba(0,0,0,0.05)]">
         <div className="p-10 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter mb-8">Klinik_Veri_Akışı</h3>
            
            <div className="space-y-8">
               <LiveMetric label="Artikülasyon Hassasiyeti" value={stats.articulationScore} unit="%" color="bg-primary" />
               <LiveMetric label="Akıcılık Katsayısı" value={stats.fluencyScore} unit="%" color="bg-secondary" />
               <LiveMetric label="Katılım & Odak" value={stats.engagementLevel} unit="%" color="bg-emerald-500" />
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-10 space-y-10">
            <section className="space-y-4">
               <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Anlık Gözlem Notları</h4>
                  <span className="text-[10px] font-bold text-primary italic">Otomatik Kaydediliyor...</span>
               </div>
               <textarea 
                 className="w-full bg-slate-50 border-none rounded-[32px] p-6 text-sm font-medium focus:ring-4 focus:ring-primary/10 outline-none resize-none min-h-[180px] shadow-inner text-slate-700"
                 placeholder="Seans ilerleyişi, hata örüntüleri ve özel durumlar..."
               ></textarea>
            </section>

            <section className="space-y-4">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gemini_Flash_Tespitleri</h4>
               <div className="space-y-3">
                  {isLiveAiActive ? (
                    <>
                      <LogTag label="/r/ sesi medial konumda artikülasyon hatası" type="error" />
                      <LogTag label="Prozodik vurgu sarsıntılı" type="warning" />
                      <LogTag label="Cümle sonu nefes kontrolü başarılı" type="success" />
                    </>
                  ) : (
                    <div className="py-10 text-center opacity-30 border-2 border-dashed border-slate-200 rounded-[32px]">
                       <span className="material-symbols-outlined text-4xl mb-2">analytics</span>
                       <p className="text-[10px] font-bold">AI ANALİZİ BEKLENİYOR</p>
                    </div>
                  )}
               </div>
            </section>
         </div>

         <div className="p-8 bg-slate-900 rounded-t-[40px] shadow-2xl">
            <button className="w-full py-5 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20">
               <span className="material-symbols-outlined">description</span>
               TASLAK RAPORU HAZIRLA
            </button>
         </div>
      </aside>
    </div>
  );
};

const ToolbarButton: React.FC<{ icon: string, active?: boolean, onClick: () => void }> = ({ icon, active = true, onClick }) => (
  <button onClick={onClick} className={`size-14 rounded-2xl flex items-center justify-center transition-all shadow-xl ${active ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-rose-500 text-white shadow-rose-500/20'}`}>
    <span className="material-symbols-outlined text-2xl font-bold">{icon}</span>
  </button>
);

const LiveMetric: React.FC<{ label: string, value: number, unit: string, color: string }> = ({ label, value, unit, color }) => (
  <div className="space-y-3">
     <div className="flex justify-between items-end">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
        <span className="text-xl font-black text-slate-900 tracking-tighter italic">{value}{unit}</span>
     </div>
     <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${value}%` }}></div>
     </div>
  </div>
);

const LogTag: React.FC<{ label: string, type: 'error' | 'warning' | 'success' }> = ({ label, type }) => (
  <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-[11px] font-bold border transition-all hover:translate-x-1 ${
    type === 'error' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
    type === 'warning' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
    'bg-emerald-50 text-emerald-600 border-emerald-100'
  }`}>
    <span className="material-symbols-outlined text-[16px]">
      {type === 'error' ? 'report' : type === 'warning' ? 'info' : 'check_circle'}
    </span>
    {label}
  </div>
);

export default SessionRoom;
