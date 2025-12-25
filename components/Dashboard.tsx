
import React from 'react';
import { User, SessionMetadata } from '../types';

interface DashboardProps {
  user: User | null;
  onStartBuilder: () => void;
  onJoinSession: (session: SessionMetadata) => void;
  onStartAssessment?: () => void;
  onQuickSession?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onStartBuilder, onJoinSession, onStartAssessment, onQuickSession }) => {
  const isClient = user?.role === 'client';

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-dark p-8 md:p-16 no-scrollbar">
      <div className="max-w-7xl mx-auto space-y-16 animate-in fade-in duration-1000">
        
        {/* Modern Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-5">
               <span className="px-5 py-2 bg-primary/10 text-primary text-[11px] font-black uppercase tracking-[0.4em] rounded-2xl border border-primary/20">SİSTEM AKTİF</span>
               <div className="size-2.5 bg-emerald-500 rounded-full animate-pulse shadow-primary-glow"></div>
               <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Protokol: Gemini 3.0 Multimodal</span>
            </div>
            <h2 className="text-6xl md:text-[90px] font-black text-slate-900 dark:text-white tracking-tighter italic uppercase leading-none">
              {isClient ? 'Hoş Geldin' : 'Klinik Üs'}, <span className="text-primary italic">{user?.name?.split(' ')[0]}</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-2xl font-medium italic leading-none">Global klinik standartları seansınız için optimize edildi.</p>
          </div>
          
          <div className="flex gap-6">
             {isClient ? (
                <div className="flex items-center gap-8 bg-white dark:bg-surface-dark px-10 py-6 rounded-[40px] border border-slate-200 dark:border-white/5 shadow-2xl">
                   <div className="size-16 bg-amber-500 text-white rounded-3xl flex items-center justify-center shadow-[0_15px_30px_-10px_rgba(245,158,11,0.5)]">
                      <span className="material-symbols-outlined text-3xl font-black">local_fire_department</span>
                   </div>
                   <div>
                      <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none mb-2">Klinik Seri</div>
                      <div className="text-4xl font-black text-slate-900 dark:text-white italic leading-none">{user?.streak || 12} GÜN</div>
                   </div>
                </div>
             ) : (
                <button onClick={onStartBuilder} className="px-12 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black rounded-[28px] shadow-3xl hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-[0.3em] flex items-center gap-5">
                   <span className="material-symbols-outlined text-2xl">auto_fix</span> MATERYAL MOTORU
                </button>
             )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Activity Section */}
          <div className="lg:col-span-8 space-y-12">
            <section className="bg-white dark:bg-surface-dark rounded-[64px] border border-slate-200 dark:border-white/5 p-16 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000">
                <span className="material-symbols-outlined text-[300px]">event_available</span>
              </div>
              
              <div className="flex items-center justify-between mb-16 relative z-10">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase leading-none">Sıradaki Klinik Aktivite</h3>
                <div className="flex items-center gap-4 px-6 py-3 bg-emerald-500/10 text-emerald-500 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] border border-emerald-500/20">
                   BAĞLANTI HAZIR
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-white/[0.02] rounded-[56px] p-12 flex flex-col md:flex-row items-center gap-12 relative z-10 border border-slate-200 dark:border-white/5 group-hover:shadow-3xl transition-all duration-700">
                 <div className="size-40 rounded-[48px] bg-white dark:bg-slate-800 border-8 border-white dark:border-slate-800 shadow-2xl overflow-hidden shrink-0 group/img">
                    <img src={isClient ? "https://i.pravatar.cc/150?u=therapist" : "https://i.pravatar.cc/150?u=client"} className="w-full h-full object-cover grayscale group-hover/img:grayscale-0 transition-all duration-1000 scale-110 group-hover/img:scale-100" alt="" />
                 </div>
                 <div className="flex-1 text-center md:text-left">
                    <h4 className="text-4xl font-black text-slate-900 dark:text-white italic tracking-tight uppercase leading-none mb-4">{isClient ? 'Dr. Selin Kaya' : 'Ahmet Yılmaz'}</h4>
                    <p className="text-slate-400 font-bold uppercase text-sm tracking-[0.3em] leading-none">Artikülasyon • 14:30 - 15:15</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-8">
                       <span className="px-5 py-2.5 bg-white dark:bg-white/5 rounded-2xl text-[11px] font-black text-slate-500 uppercase border border-slate-200 dark:border-white/10 tracking-widest italic shadow-sm">#MULTIMODAL PROTOKOL</span>
                       <span className="px-5 py-2.5 bg-white dark:bg-white/5 rounded-2xl text-[11px] font-black text-slate-500 uppercase border border-slate-200 dark:border-white/10 tracking-widest italic shadow-sm">#R SESİ</span>
                    </div>
                 </div>
                 <button 
                   onClick={() => onJoinSession({ id: 's-1', clientName: 'Vaka', startTime: '14:30', type: 'Terapi', status: 'active' })}
                   className="px-16 py-8 bg-emerald-500 text-white font-black rounded-[32px] shadow-[0_25px_50px_-12px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-5 uppercase text-sm tracking-[0.3em] hover:bg-emerald-600"
                 >
                    <span className="material-symbols-outlined text-3xl">videocam</span>
                    {isClient ? 'KATIL' : 'BAŞLAT'}
                 </button>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <BentoSmall 
                  icon="neurology" 
                  title="MULTIMODAL Analiz" 
                  desc="Gemini 3.0 klinik raporları saniyeler içinde fütüristik standartlarda sentezlenir." 
                  color="bg-indigo-600 shadow-indigo-600/30" 
                  onClick={onStartAssessment}
               />
               <BentoSmall 
                  icon="auto_stories" 
                  title="İçerik Stüdyosu" 
                  desc="Vakanıza özel üretilen binlerce interaktif materyal ve 3D oyun kütüphanesi." 
                  color="bg-slate-900 shadow-slate-900/30 dark:bg-surface-dark dark:border dark:border-white/10" 
               />
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-12">
             <section className="bg-white dark:bg-surface-dark rounded-[64px] p-16 border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden group">
                <div className="relative z-10 flex flex-col items-center text-center space-y-10">
                   <div className="relative">
                      <svg className="size-48 -rotate-90">
                         <circle cx="96" cy="96" r="88" fill="transparent" stroke="rgba(0,0,0,0.03)" className="dark:stroke-white/5" strokeWidth="14" />
                         <circle cx="96" cy="96" r="88" fill="transparent" stroke="#0EA5E9" strokeWidth="14" strokeDasharray={552} strokeDashoffset={552 * (1 - 0.72)} strokeLinecap="round" className="transition-all duration-[3s] ease-out shadow-primary-glow" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-5xl font-black italic dark:text-white tracking-tighter">14</span>
                         <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">RANK</span>
                      </div>
                   </div>
                   <div className="space-y-3">
                      <h4 className="text-3xl font-black italic uppercase tracking-tighter dark:text-white leading-none">Büyük Elçi</h4>
                      <p className="text-[11px] text-primary font-black uppercase tracking-[0.6em] mt-1">MOTOR: GEMINI 3.0 PRO</p>
                   </div>
                   <div className="w-full pt-10 border-t border-slate-100 dark:border-white/5">
                      <div className="flex justify-between items-center mb-4">
                         <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Master Yolu</span>
                         <span className="text-[11px] font-black text-primary uppercase">%72</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden shadow-inner">
                         <div className="h-full bg-primary rounded-full transition-all duration-[2s] shadow-primary-glow" style={{ width: '72%' }}></div>
                      </div>
                   </div>
                </div>
             </section>

             <div className="bg-primary rounded-[56px] p-12 text-white shadow-[0_35px_60px_-15px_rgba(14,165,233,0.3)] relative overflow-hidden group hover:-translate-y-2 transition-all duration-700 cursor-pointer">
                <span className="material-symbols-outlined absolute -bottom-16 -right-16 text-[220px] text-white/10 group-hover:rotate-12 transition-transform duration-[2s]">rocket_launch</span>
                <div className="relative z-10 space-y-8">
                   <h4 className="text-3xl font-black italic uppercase leading-none tracking-tight">Klinik Görev</h4>
                   <p className="text-lg font-medium text-white/90 leading-relaxed italic">Bugünkü ödevlerini tamamlayarak <span className="font-black text-white underline decoration-2 underline-offset-4">+240 XP</span> kazan.</p>
                   <button className="px-10 py-4 bg-white text-primary font-black text-[11px] uppercase rounded-2xl tracking-[0.2em] shadow-2xl active:scale-95 transition-all">GÖREVE GİT</button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BentoSmall: React.FC<{ icon: string, title: string, desc: string, color: string, onClick?: () => void }> = ({ icon, title, desc, color, onClick }) => (
  <div onClick={onClick} className={`${color} p-12 rounded-[56px] text-white shadow-2xl relative overflow-hidden group cursor-pointer hover:scale-[1.03] transition-all duration-700`}>
     <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
        <span className="material-symbols-outlined text-[180px]">{icon}</span>
     </div>
     <div className="relative z-10 flex flex-col h-full">
        <div className="size-16 rounded-3xl bg-white/20 backdrop-blur-3xl flex items-center justify-center mb-10 border border-white/20 shadow-inner group-hover:scale-110 transition-transform">
           <span className="material-symbols-outlined text-4xl font-black">{icon}</span>
        </div>
        <h4 className="text-3xl font-black italic uppercase tracking-tighter mb-4 leading-none">{title}</h4>
        <p className="text-sm text-white/70 font-medium italic leading-relaxed">{desc}</p>
     </div>
  </div>
);

export default Dashboard;
