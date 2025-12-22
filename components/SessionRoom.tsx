
import React, { useState, useEffect, useRef } from 'react';
import { SessionMetadata, Activity, LiveStats } from '../types';
import { GoogleGenAI } from "@google/genai";
import InteractiveStage from './InteractiveStage';

interface SessionRoomProps {
  session: SessionMetadata | null;
  onEndSession: () => void;
}

const SessionRoom: React.FC<SessionRoomProps> = ({ session, onEndSession }) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [activeActivity, setActiveActivity] = useState<Activity | null>(session?.flow?.[0] || null);
  const [transcription, setTranscription] = useState<{ role: string, text: string }[]>([]);
  const [isLiveAiActive, setIsLiveAiActive] = useState(false);
  const [stats, setStats] = useState<LiveStats>({
    articulationScore: 0,
    fluencyScore: 0,
    engagementLevel: 0,
    detectedErrors: []
  });

  // Audio Context for Live API (Infrastructure)
  const audioContextRef = useRef<AudioContext | null>(null);

  const toggleLiveAi = async () => {
    if (!isLiveAiActive) {
      setIsLiveAiActive(true);
      // Real implementation would use sessionPromise.then((session) => { session.sendRealtimeInput(...) })
      // For now, we simulate the clinical feedback loop
      simulateLiveFeedback();
    } else {
      setIsLiveAiActive(false);
    }
  };

  const simulateLiveFeedback = () => {
    const feedbackInterval = setInterval(() => {
      if (!isLiveAiActive) { clearInterval(feedbackInterval); return; }
      
      const errors = ["R kayması", "Nefes kontrolü"];
      setStats(prev => ({
        ...prev,
        articulationScore: Math.min(100, prev.articulationScore + Math.floor(Math.random() * 5)),
        engagementLevel: 70 + Math.floor(Math.random() * 30),
        detectedErrors: Array.from(new Set([...prev.detectedErrors, errors[Math.floor(Math.random() * errors.length)]]))
      }));
    }, 5000);
  };

  if (!session) return null;

  return (
    <div className="flex-1 flex overflow-hidden bg-[#0F172A]">
      {/* Main Session Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Header - Session Info */}
        <div className="h-16 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-md border-b border-white/5 z-20">
           <div className="flex items-center gap-4">
              <div className="size-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <h2 className="text-white font-black tracking-tight">{session.clientName} ile Canlı Seans</h2>
              <span className="text-slate-500 text-xs font-bold bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest">{session.type}</span>
           </div>
           <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                 <span className="text-[10px] font-black text-slate-500 uppercase">Seans Süresi</span>
                 <span className="text-sm font-mono text-white font-bold">12:45</span>
              </div>
           </div>
        </div>

        {/* Content Area - Videos and Interactive Stage */}
        <div className="flex-1 flex relative">
           {/* Interactive Stage (Center) */}
           <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
              <div className="flex-1 bg-slate-800/50 rounded-[48px] border border-white/5 overflow-hidden shadow-inner relative group">
                 <InteractiveStage activity={activeActivity} isAiActive={isLiveAiActive} />
                 
                 {/* Therapist Small View (PIP) */}
                 <div className="absolute bottom-6 right-6 w-48 aspect-video bg-slate-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden ring-4 ring-white/5">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Therapist" />
                    {!isCamOn && <div className="absolute inset-0 bg-slate-900 flex items-center justify-center"><span className="material-symbols-outlined text-white/20">videocam_off</span></div>}
                 </div>

                 {/* Client Small View (PIP) */}
                 <div className="absolute bottom-6 left-6 w-48 aspect-video bg-slate-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden ring-4 ring-white/5">
                    <img src="https://images.unsplash.com/photo-1544717297-fa95b3ee51f3?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Client" />
                 </div>
              </div>

              {/* Material Switcher / Quick Flow */}
              <div className="h-24 bg-slate-900/40 backdrop-blur-md rounded-[32px] border border-white/5 p-4 flex items-center gap-4 overflow-x-auto scrollbar-hide">
                 <div className="flex-shrink-0 text-slate-500 font-black text-[10px] uppercase vertical-text px-2">Akış</div>
                 {session.flow?.map((act) => (
                   <button 
                     key={act.id}
                     onClick={() => setActiveActivity(act)}
                     className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl transition-all border ${activeActivity?.id === act.id ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'}`}
                   >
                      <div className="size-8 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${act.image})` }}></div>
                      <span className="text-xs font-extrabold whitespace-nowrap">{act.title}</span>
                   </button>
                 ))}
                 <button className="flex-shrink-0 size-12 rounded-2xl border-2 border-dashed border-white/10 text-white/20 flex items-center justify-center hover:border-primary hover:text-primary transition-all">
                    <span className="material-symbols-outlined">add</span>
                 </button>
              </div>
           </div>
        </div>

        {/* Toolbar */}
        <div className="h-24 flex items-center justify-center gap-4 bg-slate-950/80 backdrop-blur-xl border-t border-white/5 z-30">
           <ToolbarButton icon={isMicOn ? 'mic' : 'mic_off'} active={isMicOn} onClick={() => setIsMicOn(!isMicOn)} />
           <ToolbarButton icon={isCamOn ? 'videocam' : 'videocam_off'} active={isCamOn} onClick={() => setIsCamOn(!isCamOn)} />
           <div className="w-px h-8 bg-white/10 mx-2"></div>
           <ToolbarButton 
             icon="psychology" 
             label="Live AI" 
             active={isLiveAiActive} 
             color={isLiveAiActive ? 'bg-primary text-white' : 'bg-white/5 text-slate-400'}
             onClick={toggleLiveAi} 
           />
           <ToolbarButton icon="screen_share" label="Paylaş" onClick={() => {}} />
           <ToolbarButton icon="draw" label="Çizim" onClick={() => {}} />
           <div className="w-px h-8 bg-white/10 mx-2"></div>
           <button 
             onClick={onEndSession}
             className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-4 rounded-2xl font-black transition-all flex items-center gap-2 shadow-xl shadow-rose-500/20 active:scale-95"
           >
              <span className="material-symbols-outlined">call_end</span>
              Seansı Bitir
           </button>
        </div>
      </div>

      {/* Side Panel - Clinical Data */}
      <aside className="w-[400px] bg-white flex flex-col border-l border-slate-200">
         <div className="p-8 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-xl font-black text-slate-900 italic mb-6">Klinik Gözlem</h3>
            
            <div className="space-y-6">
               <LiveMetric label="Artikülasyon Skoru" value={stats.articulationScore} unit="%" color="bg-primary" />
               <LiveMetric label="Katılım Seviyesi" value={stats.engagementLevel} unit="%" color="bg-emerald-500" />
               
               <div className="bg-slate-900 rounded-[32px] p-6 text-white relative overflow-hidden group shadow-xl">
                  <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-6xl text-white/5 group-hover:rotate-12 transition-transform">auto_awesome</span>
                  <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                     <span className="material-symbols-outlined text-[14px]">bolt</span>
                     AI TESPİTLERİ
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {stats.detectedErrors.length > 0 ? stats.detectedErrors.map((err, i) => (
                       <span key={i} className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-bold border border-white/10">{err}</span>
                     )) : (
                       <span className="text-xs text-slate-400 italic">Analiz bekleniyor...</span>
                     )}
                  </div>
               </div>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-8 space-y-8">
            <section>
               <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Seans Notları</h4>
               <textarea 
                 className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-primary/10 outline-none resize-none min-h-[150px]"
                 placeholder="Klinik gözlemlerinizi buraya not edin..."
               ></textarea>
            </section>

            <section>
               <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Transkripsiyon</h4>
               <div className="space-y-4">
                  <div className="text-center py-10 opacity-20">
                     <span className="material-symbols-outlined text-4xl mb-2">graphic_eq</span>
                     <p className="text-[10px] font-bold">Gerçek zamanlı ses analizi aktif değil.</p>
                  </div>
               </div>
            </section>
         </div>

         <div className="p-8 bg-slate-50 border-t border-slate-100">
            <button className="w-full py-4 bg-white border border-slate-200 text-slate-700 font-black rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
               <span className="material-symbols-outlined">save</span>
               Rapor Taslağı Kaydet
            </button>
         </div>
      </aside>
    </div>
  );
};

const ToolbarButton: React.FC<{ icon: string, label?: string, active?: boolean, color?: string, onClick: () => void }> = ({ icon, label, active = true, color, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1 group">
    <div className={`size-12 rounded-xl flex items-center justify-center transition-all shadow-lg ${color || (active ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-rose-500/20 text-rose-500 border border-rose-500/20')}`}>
      <span className="material-symbols-outlined text-xl group-active:scale-90 transition-transform">{icon}</span>
    </div>
    {label && <span className="text-[9px] font-black text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">{label}</span>}
  </button>
);

const LiveMetric: React.FC<{ label: string, value: number, unit: string, color: string }> = ({ label, value, unit, color }) => (
  <div className="space-y-2">
     <div className="flex justify-between items-end">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
        <span className="text-lg font-black text-slate-900 tracking-tighter">{value}{unit}</span>
     </div>
     <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(14,165,233,0.3)]`} style={{ width: `${value}%` }}></div>
     </div>
  </div>
);

export default SessionRoom;
