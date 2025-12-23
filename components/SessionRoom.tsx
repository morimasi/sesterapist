
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
  const [activeActivity, setActiveActivity] = useState<Activity | null>(session?.flow?.[0] || null);
  const [isLiveAiActive, setIsLiveAiActive] = useState(false);
  const [aiObservations, setAiObservations] = useState<{ text: string; type: 'info' | 'success' | 'warning' }[]>([]);
  
  const sessionPromiseRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (session?.flow && session.flow.length > 0) {
      setActiveActivity(session.flow[0]);
    }
  }, [session]);

  useEffect(() => {
    if (isLiveAiActive) {
      startLiveAnalysis();
    } else {
      stopLiveAnalysis();
    }
    return () => stopLiveAnalysis();
  }, [isLiveAiActive]);

  const startLiveAnalysis = async () => {
    if (typeof window.aistudio !== 'undefined' && !await window.aistudio.hasSelectedApiKey()) {
      await window.aistudio.openSelectKey();
    }

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
            
            const bytes = new Uint8Array(int16.buffer);
            let binary = '';
            for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
            const base64 = btoa(binary);

            sessionPromiseRef.current.then((session: any) => {
              session.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
            });
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(audioContextRef.current!.destination);
        },
        onmessage: (msg: any) => {
          if (msg.serverContent?.modelTurn?.parts) {
            msg.serverContent.modelTurn.parts.forEach((part: any) => {
              if (part.text) {
                setAiObservations(prev => [{ text: part.text, type: 'info' }, ...prev.slice(0, 5)]);
              }
            });
          }
        },
        onerror: (e: any) => console.error("Live AI Error:", e),
        onclose: () => setIsLiveAiActive(false)
      });
    } catch (err) {
      console.error("Mic access denied or error:", err);
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

  if (!session) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 text-white p-10">
         <div className="size-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 animate-pulse">
            <span className="material-symbols-outlined text-5xl text-primary">videocam_off</span>
         </div>
         <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Aktif Oturum Bulunamadı</h2>
         <p className="text-slate-500 max-w-md text-center font-medium">Lütfen Dashboard üzerinden bir randevu seçin veya "Hızlı Seans" başlatın.</p>
         <button onClick={onEndSession} className="mt-8 px-10 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Geri Dön</button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-950 font-sans selection:bg-primary/30">
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Ana Sahne */}
        <div className="flex-1 p-4 md:p-6 flex flex-col gap-4 overflow-hidden">
           <div className="flex-1 bg-slate-900/40 rounded-[64px] border border-white/5 overflow-hidden shadow-3xl relative group">
              <InteractiveStage activity={activeActivity} isAiActive={isLiveAiActive} />
              
              <div className="absolute top-10 left-10 flex flex-col gap-6">
                 <VideoCircle label="UZMAN" src="https://i.pravatar.cc/150?u=therapist" active />
                 <VideoCircle label="DANIŞAN" src="https://i.pravatar.cc/150?u=client" active={session.clientName !== 'Bekleniyor...'} />
              </div>

              <div className="absolute top-10 right-10 flex items-center gap-4">
                 {isLiveAiActive && (
                    <div className="flex items-center gap-3 px-5 py-3 bg-primary/20 backdrop-blur-2xl border border-primary/30 rounded-2xl text-primary text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                       <span className="size-2.5 bg-primary rounded-full shadow-[0_0_10px_rgba(14,165,233,0.8)]"></span>
                       Canlı AI Analizi
                    </div>
                 )}
                 <div className="px-5 py-3 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest">
                    Oturum ID: {session.id.slice(0, 8)}
                 </div>
              </div>
           </div>

           {/* Materyal Akışı */}
           <div className="h-32 dark-glass rounded-[40px] p-4 flex items-center gap-4 overflow-x-auto no-scrollbar shadow-2xl border-white/5">
              <div className="px-8 border-r border-white/10 flex-shrink-0">
                 <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Seans Akışı</div>
                 <div className="text-lg text-white font-bold italic tracking-tight">{session.flow?.length || 0} Materyal</div>
              </div>
              {session.flow?.map((act) => (
                <button 
                  key={act.id}
                  onClick={() => setActiveActivity(act)}
                  className={`flex-shrink-0 flex items-center gap-4 px-8 py-5 rounded-[24px] transition-all border-2 ${activeActivity?.id === act.id ? 'bg-primary text-white border-primary shadow-2xl scale-105' : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'}`}
                >
                   <div className="size-12 rounded-xl bg-cover bg-center shadow-inner border border-white/10" style={{ backgroundImage: `url(${act.image})` }}></div>
                   <span className="text-sm font-black italic whitespace-nowrap tracking-tight uppercase">{act.title}</span>
                </button>
              ))}
           </div>
        </div>

        {/* Alt Kontrol Çubuğu */}
        <div className="h-28 flex items-center justify-between px-12 bg-slate-950/95 backdrop-blur-3xl border-t border-white/5">
           <div className="flex items-center gap-6">
              <ToolbarButton icon={isMicOn ? 'mic' : 'mic_off'} active={isMicOn} onClick={() => setIsMicOn(!isMicOn)} />
              <ToolbarButton icon="videocam" active onClick={() => {}} />
           </div>

           <div className="flex-1 flex justify-center">
              <button 
                onClick={() => setIsLiveAiActive(!isLiveAiActive)}
                className={`flex items-center gap-5 px-14 py-5 rounded-[24px] font-black transition-all group ${isLiveAiActive ? 'bg-primary text-white shadow-3xl shadow-primary/40 scale-105' : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'}`}
              >
                 <span className={`material-symbols-outlined text-3xl ${isLiveAiActive ? 'animate-spin-slow' : 'opacity-50'}`}>psychology</span>
                 <span className="tracking-widest uppercase">{isLiveAiActive ? 'Asistan Aktif' : 'AI Asistanını Başlat'}</span>
              </button>
           </div>

           <div className="flex items-center gap-6">
              <button onClick={onEndSession} className="bg-rose-500 hover:bg-rose-600 text-white px-12 py-5 rounded-[24px] font-black transition-all flex items-center gap-4 shadow-3xl shadow-rose-500/30 active:scale-95">
                 <span className="material-symbols-outlined font-black">call_end</span>
                 Seansı Bitir
              </button>
           </div>
        </div>
      </div>

      {/* Sağ Yan Panel: Canlı AI Analizi */}
      <aside className="hidden xl:flex w-[480px] bg-white flex-col border-l border-slate-200 shadow-[-40px_0_100px_rgba(0,0,0,0.1)]">
         <div className="p-12 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter mb-12 flex items-center gap-4">
               <span className="material-symbols-outlined text-primary text-3xl">analytics</span>
               Canlı Analitik Verileri
            </h3>
            
            <div className="space-y-12">
               <LiveMetric label="Artikülasyon Skoru" value={72} unit="%" color="bg-primary" />
               <LiveMetric label="Akıcılık İndeksi" value={45} unit="%" color="bg-secondary" />
               <LiveMetric label="Engagement" value={94} unit="%" color="bg-emerald-500" />
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-12 space-y-10 no-scrollbar">
            <section className="space-y-6">
               <div className="flex items-center justify-between px-2">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">AI Gözlem Akışı</h4>
                  {isLiveAiActive && <span className="flex size-2 bg-emerald-500 rounded-full animate-ping"></span>}
               </div>
               <div className="space-y-6">
                  {aiObservations.length > 0 ? (
                    aiObservations.map((obs, idx) => (
                      <div key={idx} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 text-sm font-semibold text-slate-700 animate-in slide-in-from-right duration-500 shadow-sm leading-relaxed italic">
                        "{obs.text}"
                      </div>
                    ))
                  ) : (
                    <div className="py-24 text-center opacity-10 border-4 border-dashed border-slate-200 rounded-[56px] flex flex-col items-center gap-4">
                       <span className="material-symbols-outlined text-7xl">neurology</span>
                       <p className="text-[10px] font-black uppercase tracking-widest">Veri Analizi Bekleniyor</p>
                    </div>
                  )}
               </div>
            </section>
         </div>

         <div className="p-10 bg-slate-900 rounded-t-[56px] shadow-3xl">
            <button className="w-full py-6 bg-primary text-white font-black rounded-3xl hover:bg-primary-dark transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95">
               <span className="material-symbols-outlined text-2xl">description</span>
               Klinik Rapor Hazırla
            </button>
         </div>
      </aside>
    </div>
  );
};

const VideoCircle: React.FC<{ label: string, src: string, active: boolean }> = ({ label, src, active }) => (
  <div className={`size-48 md:size-52 rounded-[56px] overflow-hidden border-4 bg-slate-800 transition-all shadow-3xl relative group ${active ? 'border-white/10 ring-8 ring-white/5' : 'border-rose-500/50 grayscale opacity-50'}`}>
     {active ? (
       <img src={src} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-out scale-110 group-hover:scale-100" alt={label} />
     ) : (
       <div className="w-full h-full flex items-center justify-center bg-slate-900">
          <span className="material-symbols-outlined text-5xl text-white/10">videocam_off</span>
       </div>
     )}
     <div className="absolute bottom-6 left-6 dark-glass px-4 py-1.5 rounded-2xl text-[9px] text-white font-black tracking-widest uppercase border border-white/20">{label}</div>
  </div>
);

const ToolbarButton: React.FC<{ icon: string, active?: boolean, onClick: () => void }> = ({ icon, active = true, onClick }) => (
  <button onClick={onClick} className={`size-20 rounded-[28px] flex items-center justify-center transition-all shadow-2xl ${active ? 'bg-white/10 text-white hover:bg-white/20 border border-white/5' : 'bg-rose-500 text-white shadow-rose-500/40 scale-95'}`}>
    <span className="material-symbols-outlined text-3xl font-black">{icon}</span>
  </button>
);

const LiveMetric: React.FC<{ label: string, value: number, unit: string, color: string }> = ({ label, value, unit, color }) => (
  <div className="space-y-6">
     <div className="flex justify-between items-end">
        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest leading-none">{label}</span>
        <span className="text-3xl font-black text-slate-900 tracking-tighter italic leading-none">{value}{unit}</span>
     </div>
     <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-50">
        <div className={`h-full ${color} rounded-full transition-all duration-2000 ease-out shadow-lg`} style={{ width: `${value}%` }}></div>
     </div>
  </div>
);

export default SessionRoom;
