
import React, { useState, useEffect, useRef } from 'react';
import { SessionMetadata, Activity } from '../types';
import InteractiveStage from './InteractiveStage';
import { aiService } from '../services/aiService';

interface SessionRoomProps {
  session: SessionMetadata | null;
  onEndSession: () => void;
}

const SessionRoom: React.FC<SessionRoomProps> = ({ session, onEndSession }) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [activeActivity, setActiveActivity] = useState<Activity | null>(session?.flow?.[0] || null);
  const [isLiveAiActive, setIsLiveAiActive] = useState(false);
  const [aiObservations, setAiObservations] = useState<{ text: string; time: string }[]>([]);
  
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSessionTime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addObservation = (text: string) => {
    setAiObservations(prev => [{ text, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }, ...prev.slice(0, 9)]);
  };

  useEffect(() => {
    if (isLiveAiActive) {
      const interval = setInterval(() => {
        const phrases = [
          "Dil ucu titreşimi stabil gözlemlendi.",
          "Vokal kord gerilimi normal sınırlarda.",
          "Artikülasyon hızı optimize ediliyor.",
          "Danışan motivasyonu yüksek (%85).",
          "Hedef ses üretimi /r/ başlangıç pozisyonu başarılı."
        ];
        addObservation(phrases[Math.floor(Math.random() * phrases.length)]);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isLiveAiActive]);

  if (!session) return null;

  return (
    <div className="flex-1 flex overflow-hidden bg-[#020408] font-sans selection:bg-primary/30">
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Top Header / Status Bar */}
        <div className="h-16 px-10 flex items-center justify-between bg-white/5 border-b border-white/5 backdrop-blur-3xl shrink-0 z-20">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <div className="size-2 bg-emerald-500 rounded-full animate-pulse"></div>
                 <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Canlı Seans</span>
              </div>
              <div className="h-4 w-px bg-white/10"></div>
              <div className="flex items-center gap-3">
                 <span className="material-symbols-outlined text-primary text-lg">timer</span>
                 <span className="text-sm font-mono font-black text-white">{formatTime(sessionTime)}</span>
              </div>
           </div>
           
           <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Danışan:</span>
                 <span className="text-sm font-black text-white italic uppercase">{session.clientName}</span>
              </div>
              <button onClick={onEndSession} className="px-6 py-2 bg-rose-500/10 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all">Seansı Bitir</button>
           </div>
        </div>

        {/* Main Workspace Area */}
        <div className="flex-1 p-6 flex gap-6 overflow-hidden">
           
           {/* Left Sidebar: Videos */}
           <div className="w-80 flex flex-col gap-6 shrink-0">
              {/* Therapist Video Container */}
              <div className="flex-1 bg-slate-900 rounded-[48px] border border-white/5 overflow-hidden relative shadow-2xl">
                 <img src="https://i.pravatar.cc/300?u=therapist" className={`w-full h-full object-cover transition-all duration-700 ${isVideoOn ? 'opacity-80 scale-100' : 'opacity-0 scale-110 grayscale'}`} alt="Therapist" />
                 {!isVideoOn && <div className="absolute inset-0 flex items-center justify-center"><span className="material-symbols-outlined text-5xl text-slate-700">videocam_off</span></div>}
                 <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                    <span className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-lg text-[9px] font-black text-white uppercase tracking-widest">Uzman (Siz)</span>
                    <div className="flex gap-1">
                       {[1,2,3,4].map(i => <div key={i} className="w-1 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i*100}ms` }}></div>)}
                    </div>
                 </div>
              </div>

              {/* Client Video Container */}
              <div className="flex-1 bg-slate-900 rounded-[48px] border border-white/5 overflow-hidden relative shadow-2xl">
                 <img src={`https://i.pravatar.cc/300?u=${session.clientName}`} className="w-full h-full object-cover opacity-80" alt="Client" />
                 <div className="absolute bottom-6 left-6">
                    <span className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-lg text-[9px] font-black text-white uppercase tracking-widest">Danışan</span>
                 </div>
                 {/* Visual AI Overlay (Simulated) */}
                 {isLiveAiActive && (
                   <div className="absolute inset-0 border-2 border-primary/20 animate-pulse pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-32 border border-primary/40 rounded-full flex items-center justify-center">
                         <div className="size-2 bg-primary rounded-full"></div>
                      </div>
                   </div>
                 )}
              </div>
           </div>

           {/* Center Area: Interactive Stage */}
           <div className="flex-1 flex flex-col gap-6 overflow-hidden">
              <div className="flex-1 bg-slate-900/40 rounded-[64px] border border-white/5 shadow-3xl overflow-hidden relative">
                 <InteractiveStage activity={activeActivity} isAiActive={isLiveAiActive} />
              </div>

              {/* Activity Slider */}
              <div className="h-28 bg-white/5 backdrop-blur-3xl rounded-[40px] p-4 flex items-center gap-4 border border-white/5 overflow-x-auto no-scrollbar shrink-0">
                 {session.flow?.map((act, idx) => (
                   <button 
                    key={act.id} 
                    onClick={() => setActiveActivity(act)}
                    className={`flex-shrink-0 flex items-center gap-4 px-8 py-4 rounded-[24px] border-2 transition-all ${activeActivity?.id === act.id ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' : 'bg-white/5 border-transparent text-slate-500 hover:bg-white/10'}`}
                   >
                      <span className="text-xs font-black italic uppercase tracking-tight">{idx + 1}. {act.title}</span>
                   </button>
                 ))}
              </div>
           </div>

        </div>

        {/* Control Bar */}
        <div className="h-28 bg-[#080B12] border-t border-white/5 px-12 flex items-center justify-between shrink-0">
           <div className="flex items-center gap-4">
              <ControlButton icon={isMicOn ? 'mic' : 'mic_off'} active={isMicOn} onClick={() => setIsMicOn(!isMicOn)} />
              <ControlButton icon={isVideoOn ? 'videocam' : 'videocam_off'} active={isVideoOn} onClick={() => setIsVideoOn(!isVideoOn)} />
              <ControlButton icon="screen_share" active={false} onClick={() => {}} />
           </div>

           <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsLiveAiActive(!isLiveAiActive)}
                className={`flex items-center gap-4 px-12 py-5 rounded-[24px] font-black transition-all ${isLiveAiActive ? 'bg-primary text-white shadow-primary-glow' : 'bg-white/5 text-slate-500 border border-white/5'}`}
              >
                 <span className={`material-symbols-outlined text-3xl ${isLiveAiActive ? 'animate-pulse' : ''}`}>psychology</span>
                 <span className="text-[11px] uppercase tracking-[0.3em]">{isLiveAiActive ? 'AI ANALİZ AKTİF' : 'AI ASİSTANI BAŞLAT'}</span>
              </button>
           </div>

           <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                 <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sinyal Gücü</div>
                 <div className="flex gap-1 mt-1">
                    {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-3 bg-emerald-500 rounded-full"></div>)}
                 </div>
              </div>
              <button onClick={onEndSession} className="px-10 py-5 bg-rose-500 text-white font-black rounded-[24px] shadow-xl shadow-rose-500/20 hover:bg-rose-600 transition-all active:scale-95 text-[11px] uppercase tracking-widest">Seansı Bitir</button>
           </div>
        </div>

      </div>

      {/* Right Sidebar: Intelligence & Logs */}
      <aside className="hidden 2xl:flex w-96 bg-[#080B12] border-l border-white/5 flex-col overflow-hidden">
         <div className="p-8 border-b border-white/5 bg-white/[0.02] shrink-0">
            <h3 className="text-sm font-black text-white italic uppercase tracking-[0.2em] mb-1">Klinik İstihbarat</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Multimodal Seans Günlüğü</p>
         </div>
         
         <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
            {aiObservations.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center opacity-10 text-center">
                  <span className="material-symbols-outlined text-8xl mb-4">analytics</span>
                  <p className="text-xs font-black uppercase tracking-[0.3em]">AI Bekleniyor...</p>
               </div>
            ) : aiObservations.map((obs, idx) => (
              <div key={idx} className="p-5 bg-white/5 rounded-[28px] border border-white/5 text-xs text-slate-300 italic leading-relaxed animate-in slide-in-from-right duration-500">
                 <div className="flex justify-between mb-2">
                    <span className="text-[9px] font-black text-primary uppercase tracking-widest">Analiz</span>
                    <span className="text-[9px] font-bold text-slate-600">{obs.time}</span>
                 </div>
                 "{obs.text}"
              </div>
            ))}
         </div>

         <div className="p-8 bg-white/[0.01] border-t border-white/5 space-y-6 shrink-0">
            <div className="space-y-3">
               <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span>Artikülasyon Doğruluğu</span>
                  <span className="text-white">%72</span>
               </div>
               <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-1000 shadow-primary-glow" style={{ width: '72%' }}></div>
               </div>
            </div>
            <div className="space-y-3">
               <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span>Motivasyon Skoru</span>
                  <span className="text-white">%88</span>
               </div>
               <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: '88%' }}></div>
               </div>
            </div>
         </div>
      </aside>
    </div>
  );
};

const ControlButton: React.FC<{ icon: string, active: boolean, onClick: () => void }> = ({ icon, active, onClick }) => (
  <button onClick={onClick} className={`size-16 rounded-2xl flex items-center justify-center transition-all ${active ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-rose-500 text-white shadow-xl shadow-rose-500/20'}`}>
     <span className="material-symbols-outlined text-2xl">{icon}</span>
  </button>
);

export default SessionRoom;
