
import React, { useState, useEffect, useRef } from 'react';
import { SessionMetadata, Activity, LiveStats } from '../types';
import InteractiveStage from './InteractiveStage';
import { aiService } from '../services/aiService';

interface SessionRoomProps {
  session: SessionMetadata | null;
  onEndSession: () => void;
}

const SessionRoom: React.FC<SessionRoomProps> = ({ session, onEndSession }) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [activeActivity, setActiveActivity] = useState<Activity | null>(session?.flow?.[0] || null);
  const [isLiveAiActive, setIsLiveAiActive] = useState(false);
  const [aiObservations, setAiObservations] = useState<{ text: string; type: 'info' | 'success' | 'warning' }[]>([]);
  
  const [stats, setStats] = useState<LiveStats>({
    articulationScore: 68,
    fluencyScore: 42,
    engagementLevel: 91,
    detectedErrors: []
  });

  const sessionPromiseRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (isLiveAiActive) {
      startLiveAnalysis();
    } else {
      stopLiveAnalysis();
    }
    return () => stopLiveAnalysis();
  }, [isLiveAiActive]);

  const startLiveAnalysis = async () => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      sessionPromiseRef.current = aiService.connectLive({
        onopen: () => {
          const source = audioContextRef.current!.createMediaStreamSource(stream);
          const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
            
            const base64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));
            sessionPromiseRef.current.then((session: any) => {
              session.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
            });
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(audioContextRef.current!.destination);
        },
        onmessage: (msg: any) => {
          if (msg.serverContent?.modelTurn?.parts?.[0]?.text) {
            const text = msg.serverContent.modelTurn.parts[0].text;
            setAiObservations(prev => [{ text, type: 'info' }, ...prev.slice(0, 4)]);
          }
        }
      });
    } catch (err) {
      console.error("Live analysis start failed:", err);
      setIsLiveAiActive(false);
    }
  };

  const stopLiveAnalysis = () => {
    if (sessionPromiseRef.current) {
      sessionPromiseRef.current.then((s: any) => s.close());
      sessionPromiseRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  if (!session) return null;

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-950 font-sans selection:bg-primary/30">
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Main Stage */}
        <div className="flex-1 p-4 md:p-6 flex flex-col gap-4 overflow-hidden">
           <div className="flex-1 bg-slate-900/40 rounded-[48px] border border-white/5 overflow-hidden shadow-2xl relative group">
              <InteractiveStage activity={activeActivity} isAiActive={isLiveAiActive} />
              
              <div className="absolute top-8 left-8 flex flex-col gap-4">
                 <VideoCircle label="UZMAN" src="https://i.pravatar.cc/150?u=therapist" active={isCamOn} />
                 <VideoCircle label="DANIŞAN" src="https://i.pravatar.cc/150?u=client" active />
              </div>

              <div className="absolute top-8 right-8 flex items-center gap-3">
                 {isLiveAiActive && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary/20 backdrop-blur-xl border border-primary/30 rounded-2xl text-primary text-[10px] font-black uppercase tracking-widest animate-pulse">
                       <span className="size-2 bg-primary rounded-full"></span>
                       ANALİZ_CANLI
                    </div>
                 )}
                 <div className="px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest">
                    OTURUM_001
                 </div>
              </div>
           </div>

           {/* Material Selector */}
           <div className="h-28 dark-glass rounded-[32px] p-3 flex items-center gap-3 overflow-x-auto no-scrollbar shadow-xl">
              <div className="px-5 border-r border-white/10 flex-shrink-0">
                 <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Akış</div>
                 <div className="text-sm text-white font-bold italic">{session.flow?.length || 0} Materyal</div>
              </div>
              {session.flow?.map((act) => (
                <button 
                  key={act.id}
                  onClick={() => setActiveActivity(act)}
                  className={`flex-shrink-0 flex items-center gap-4 px-6 py-4 rounded-2xl transition-all border ${activeActivity?.id === act.id ? 'bg-primary text-white border-primary shadow-xl scale-105' : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'}`}
                >
                   <div className="size-10 rounded-xl bg-cover bg-center shadow-inner" style={{ backgroundImage: `url(${act.image})` }}></div>
                   <span className="text-sm font-black italic whitespace-nowrap">{act.title}</span>
                </button>
              ))}
           </div>
        </div>

        {/* Toolbar */}
        <div className="h-24 flex items-center justify-between px-10 bg-slate-950/90 backdrop-blur-2xl border-t border-white/5">
           <div className="flex items-center gap-4">
              <ToolbarButton icon={isMicOn ? 'mic' : 'mic_off'} active={isMicOn} onClick={() => setIsMicOn(!isMicOn)} />
              <ToolbarButton icon={isCamOn ? 'videocam' : 'videocam_off'} active={isCamOn} onClick={() => setIsCamOn(!isCamOn)} />
              <ToolbarButton icon="screen_share" onClick={() => {}} />
           </div>

           <div className="flex-1 flex justify-center">
              <button 
                onClick={() => setIsLiveAiActive(!isLiveAiActive)}
                className={`flex items-center gap-4 px-10 py-4 rounded-2xl font-black transition-all group ${isLiveAiActive ? 'bg-primary text-white shadow-2xl shadow-primary/40' : 'bg-white/5 text-slate-500 hover:text-slate-300'}`}
              >
                 <span className={`material-symbols-outlined text-2xl ${isLiveAiActive ? 'animate-spin-slow' : ''}`}>psychology</span>
                 {isLiveAiActive ? 'ASİSTAN_AKTİF' : 'AI ASİSTANI BAŞLAT'}
              </button>
           </div>

           <div className="flex items-center gap-4">
              <button onClick={onEndSession} className="bg-rose-500 hover:bg-rose-600 text-white px-10 py-4 rounded-2xl font-black transition-all flex items-center gap-3 shadow-2xl shadow-rose-500/30 active:scale-95">
                 <span className="material-symbols-outlined font-bold">call_end</span>
                 BİTİR
              </button>
           </div>
        </div>
      </div>

      {/* Side Intelligence Panel */}
      <aside className="hidden xl:flex w-[460px] bg-white flex-col border-l border-slate-200 shadow-[-20px_0_60px_rgba(0,0,0,0.08)]">
         <div className="p-10 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter mb-10 flex items-center gap-3">
               <span className="material-symbols-outlined text-primary">analytics</span>
               KLİNİK_VERİ_MERKEZİ
            </h3>
            
            <div className="space-y-10">
               <LiveMetric label="Artikülasyon Doğruluğu" value={stats.articulationScore} unit="%" color="bg-primary" />
               <LiveMetric label="Akıcılık Katsayısı" value={stats.fluencyScore} unit="%" color="bg-secondary" />
               <LiveMetric label="Katılım Seviyesi" value={stats.engagementLevel} unit="%" color="bg-success" />
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar">
            <section className="space-y-4">
               <div className="flex items-center justify-between px-2">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Canlı_AI_Gözlemleri</h4>
                  {isLiveAiActive && <span className="flex size-2 bg-emerald-500 rounded-full animate-pulse"></span>}
               </div>
               <div className="space-y-4">
                  {aiObservations.length > 0 ? (
                    aiObservations.map((obs, idx) => (
                      <div key={idx} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 text-sm font-medium text-slate-700 animate-in slide-in-from-left">
                        {obs.text}
                      </div>
                    ))
                  ) : (
                    <div className="py-16 text-center opacity-20 border-2 border-dashed border-slate-200 rounded-[40px]">
                       <span className="material-symbols-outlined text-5xl mb-3">neurology</span>
                       <p className="text-[10px] font-bold uppercase tracking-widest">Analiz Bekleniyor</p>
                    </div>
                  )}
               </div>
            </section>
         </div>

         <div className="p-10 bg-slate-900 rounded-t-[48px] shadow-2xl">
            <button className="w-full py-5 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark transition-all flex items-center justify-center gap-3 shadow-xl">
               <span className="material-symbols-outlined">description</span>
               KLİNİK RAPOR OLUŞTUR
            </button>
         </div>
      </aside>
    </div>
  );
};

const VideoCircle: React.FC<{ label: string, src: string, active: boolean }> = ({ label, src, active }) => (
  <div className={`size-40 md:size-48 rounded-[40px] overflow-hidden border-4 bg-slate-800 transition-all shadow-2xl relative ${active ? 'border-white/20' : 'border-rose-500/50'}`}>
     {active ? (
       <img src={src} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt={label} />
     ) : (
       <div className="w-full h-full flex items-center justify-center bg-slate-900">
          <span className="material-symbols-outlined text-4xl text-white/20">videocam_off</span>
       </div>
     )}
     <div className="absolute bottom-4 left-4 dark-glass px-3 py-1 rounded-xl text-[9px] text-white font-black tracking-widest uppercase">{label}</div>
  </div>
);

const ToolbarButton: React.FC<{ icon: string, active?: boolean, onClick: () => void }> = ({ icon, active = true, onClick }) => (
  <button onClick={onClick} className={`size-16 rounded-2xl flex items-center justify-center transition-all shadow-lg ${active ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-rose-500 text-white shadow-rose-500/40'}`}>
    <span className="material-symbols-outlined text-2xl font-bold">{icon}</span>
  </button>
);

const LiveMetric: React.FC<{ label: string, value: number, unit: string, color: string }> = ({ label, value, unit, color }) => (
  <div className="space-y-4">
     <div className="flex justify-between items-end">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
        <span className="text-2xl font-black text-slate-900 tracking-tighter italic">{value}{unit}</span>
     </div>
     <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <div className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${value}%` }}></div>
     </div>
  </div>
);

export default SessionRoom;
