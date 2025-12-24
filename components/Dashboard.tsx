
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

  if (isClient) {
    return (
      <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6 md:p-10 no-scrollbar">
        <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2">
              <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight italic uppercase leading-none">
                Günün Kutlu Olsun, <span className="text-emerald-500">{user?.name}</span>! 🌟
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium italic">Gelişimin her geçen gün bir üst seviyeye taşınıyor.</p>
            </div>
            <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-[32px] border border-slate-200 dark:border-white/5 shadow-2xl">
               <div className="size-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/20">
                  <span className="material-symbols-outlined font-black">local_fire_department</span>
               </div>
               <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">GÜNLÜK_SERİ</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white italic">{user?.streak || 12} GÜN</div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-10">
              <section className="bg-white dark:bg-slate-900 rounded-[56px] border border-slate-200 dark:border-white/5 p-12 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 dark:opacity-[0.02] group-hover:rotate-12 transition-transform duration-1000">
                  <span className="material-symbols-outlined text-[240px]">event_upcoming</span>
                </div>
                <div className="flex items-center justify-between mb-12 relative z-10">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase leading-none">Sıradaki Klinik Seansın</h3>
                  <div className="px-5 py-2 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse shadow-xl shadow-emerald-500/20">LIVE_ROOM_READY</div>
                </div>
                
                <div className="bg-slate-50 dark:bg-white/5 rounded-[40px] p-10 flex flex-col md:flex-row items-center gap-10 relative z-10 border border-slate-100 dark:border-white/5">
                   <div className="size-28 rounded-[36px] bg-white dark:bg-slate-800 border-8 border-white dark:border-slate-800 shadow-2xl overflow-hidden shrink-0">
                      <img src="https://i.pravatar.cc/150?u=therapist" className="w-full h-full object-cover grayscale" alt="Therapist" />
                   </div>
                   <div className="flex-1 text-center md:text-left">
                      <h4 className="text-3xl font-black text-slate-900 dark:text-white italic tracking-tight uppercase leading-none mb-3">Dr. Selin Kaya</h4>
                      <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-xs tracking-widest leading-none">BUGÜN • 14:30 - 15:15</p>
                      <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-6">
                         <span className="px-4 py-2 bg-white dark:bg-white/5 rounded-xl text-[9px] font-black text-slate-400 uppercase border border-slate-100 dark:border-white/10">Artikülasyon</span>
                         <span className="px-4 py-2 bg-white dark:bg-white/5 rounded-xl text-[9px] font-black text-slate-400 uppercase border border-slate-100 dark:border-white/10">R Sesi</span>
                      </div>
                   </div>
                   <button 
                     onClick={() => onJoinSession({ id: 's-123', clientName: user?.name || '', startTime: '14:30', type: 'Artikülasyon' })}
                     className="px-12 py-6 bg-emerald-500 text-white font-black rounded-3xl shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4 uppercase text-xs tracking-widest"
                   >
                      <span className="material-symbols-outlined font-black">videocam</span>
                      SEANSA KATIL
                   </button>
                </div>
              </section>

              <section className="bg-white dark:bg-slate-900 rounded-[56px] border border-slate-200 dark:border-white/5 p-12 shadow-sm">
                 <div className="flex items-center justify-between mb-12">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase leading-none">Günlük Klinik Görevler</h3>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">3 TASK WAITING</span>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <HomeworkCard title="Balon Patlatma (R)" desc="5 dakika boyunca /r/ sesi hece çalışması." xp={150} icon="videogame_asset" />
                    <HomeworkCard title="Bulut Nefesi" desc="Seans öncesi rahatlama ve nefes kontrolü." xp={50} icon="spa" />
                 </div>
              </section>
            </div>

            <div className="lg:col-span-4 space-y-10">
               <section className="bg-slate-900 dark:bg-[#0F172A] rounded-[56px] p-12 text-white shadow-3xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
                    <span className="material-symbols-outlined text-[200px]">workspace_premium</span>
                  </div>
                  <div className="relative z-10 text-center space-y-8">
                     <div className="relative inline-block">
                        <svg className="size-40 -rotate-90">
                           <circle cx="80" cy="80" r="72" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                           <circle cx="80" cy="80" r="72" fill="transparent" stroke="#10B981" strokeWidth="12" strokeDasharray={452} strokeDashoffset={452 * (1 - 0.72)} strokeLinecap="round" className="transition-all duration-2000" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                           <span className="text-5xl font-black italic">14</span>
                           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">LEVEL</span>
                        </div>
                     </div>
                     <div>
                        <h4 className="text-2xl font-black italic uppercase tracking-tighter">BÜYÜK ELÇİ</h4>
                        <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-2 tracking-[0.3em]">450 XP TO NEXT LEVEL</div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-5 rounded-3xl border border-white/5 backdrop-blur-xl">
                           <div className="text-[9px] font-black text-slate-500 uppercase mb-2">TOTAL XP</div>
                           <div className="text-2xl font-black italic leading-none">{user?.stats?.xp.toLocaleString()}</div>
                        </div>
                        <div className="bg-white/5 p-5 rounded-3xl border border-white/5 backdrop-blur-xl">
                           <div className="text-[9px] font-black text-slate-500 uppercase mb-2">BADGES</div>
                           <div className="text-2xl font-black italic leading-none">24</div>
                        </div>
                     </div>
                  </div>
               </section>

               <section className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-200 dark:border-white/5 p-10 shadow-sm">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-10 flex items-center gap-4 tracking-tighter uppercase italic leading-none">
                     <span className="material-symbols-outlined text-primary text-3xl">analytics</span>
                     Gelişim Özeti
                  </h3>
                  <div className="space-y-8">
                     <ProgressMini label="Artikülasyon Başarısı" value={84} color="bg-primary" />
                     <ProgressMini label="Akıcılık İndeksi" value={65} color="bg-emerald-500" />
                     <ProgressMini label="Klinik Motivasyon" value={92} color="bg-amber-500" />
                  </div>
                  <button className="w-full mt-12 py-5 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white font-black text-[10px] uppercase rounded-2xl border border-slate-100 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all tracking-[0.2em]">TÜM RAPORLARIMI GÖR</button>
               </section>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6 md:p-10 no-scrollbar">
      <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight italic uppercase leading-none">
              Hoş geldin, <span className="text-primary italic">{user?.name || 'Terapist'}</span> 👋
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium italic">Global klinik verileri ve bugünkü seansların için sistem hazır.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={onStartBuilder}
              className="flex items-center gap-4 bg-white dark:bg-slate-900 text-slate-800 dark:text-white px-8 py-4 rounded-3xl font-black border-2 border-slate-100 dark:border-white/5 hover:border-primary/20 shadow-2xl shadow-black/5 transition-all text-xs uppercase tracking-widest"
            >
              <span className="material-symbols-outlined text-primary text-xl">auto_fix</span>
              AI MATERYAL TASARLA
            </button>
            <button className="flex items-center gap-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-8 py-4 rounded-3xl font-black shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest">
              <span className="material-symbols-outlined text-xl">add</span>
              SEANS PLANLA
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            <section className="bg-white dark:bg-slate-900 rounded-[56px] border border-slate-200 dark:border-white/5 p-12 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-5 dark:opacity-[0.02] group-hover:rotate-12 transition-transform duration-1000">
                <span className="material-symbols-outlined text-[240px]">calendar_today</span>
              </div>
              <div className="flex items-center justify-between mb-12 relative z-10">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase leading-none">Günün Randevuları</h3>
                <span className="px-5 py-2 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">7 SESSIONS LEFT</span>
              </div>
              
              <div className="space-y-5 relative z-10">
                <AppointmentCard 
                  name="Ahmet Yılmaz" 
                  time="14:30" 
                  type="Artikülasyon" 
                  status="LIVE_NOW" 
                  active
                  onJoin={() => onJoinSession({ id: '1', clientName: 'Ahmet Yılmaz', startTime: '14:30', type: 'Artikülasyon' })}
                />
                <AppointmentCard 
                  name="Elif Demir" 
                  time="16:00" 
                  type="Dil Gelişimi" 
                  status="READY" 
                  onJoin={() => {}}
                />
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div onClick={onStartAssessment} className="bg-indigo-600 rounded-[48px] p-10 text-white shadow-[0_30px_60px_rgba(79,70,229,0.3)] group cursor-pointer relative overflow-hidden">
                  <div className="relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-200 mb-4 block">CLINICAL_ANALYSIS_ENGINE</span>
                    <h4 className="text-5xl font-black italic mb-6 uppercase tracking-tighter">12 Yeni Rapor</h4>
                    <p className="text-indigo-100 text-sm font-medium leading-relaxed italic">AI tarafından hazırlanan derinlemesine vaka analizlerini ve ICF raporlarını inceleyin.</p>
                  </div>
                  <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-[200px] text-white/10 group-hover:rotate-12 transition-transform duration-[2s]">psychology</span>
               </div>
               <div className="bg-emerald-500 rounded-[48px] p-10 text-white shadow-[0_30px_60px_rgba(16,185,129,0.3)] group cursor-pointer relative overflow-hidden">
                  <div className="relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-100 mb-4 block">MATERIAL_STUDIO_V3</span>
                    <h4 className="text-5xl font-black italic mb-6 uppercase tracking-tighter">48 Aktif Öğe</h4>
                    <p className="text-emerald-50 text-sm font-medium leading-relaxed italic">Yeni nesil Gemini 3.0 Pro ile üretilen fotogerçekçi interaktif klinik araçlar.</p>
                  </div>
                  <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-[200px] text-white/10 group-hover:rotate-12 transition-transform duration-[2s]">book_4</span>
               </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-10">
             <section className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-200 dark:border-white/5 p-10 shadow-sm">
                <h3 className="font-black text-slate-900 dark:text-white mb-10 flex items-center gap-4 tracking-tighter uppercase italic leading-none">
                   <span className="material-symbols-outlined text-primary text-3xl">bolt</span>
                   Hızlı İşlemler
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <QuickAction icon="mic" label="Ses Kaydet" color="text-rose-600 bg-rose-50 dark:bg-rose-500/10" onClick={() => {}} />
                  <QuickAction icon="videocam" label="Hızlı Seans" color="text-primary bg-sky-50 dark:bg-primary/10" onClick={onQuickSession || (() => {})} />
                  <QuickAction icon="auto_fix" label="AI MATERYAL" color="text-amber-600 bg-amber-50 dark:bg-amber-500/10" onClick={onStartBuilder} />
                  <QuickAction icon="person_add" label="YENI VAKA" color="text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10" onClick={() => {}} />
                </div>
             </section>

             <section className="bg-slate-900 dark:bg-[#0F172A] rounded-[48px] p-10 text-white shadow-3xl relative overflow-hidden">
                <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-[200px] text-white/5 -rotate-12">school</span>
                <div className="relative z-10 space-y-8">
                   <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black italic tracking-tighter uppercase">Akademik Takip</h3>
                      <button className="size-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all border border-white/10"><span className="material-symbols-outlined text-sm">open_in_new</span></button>
                   </div>
                   <div className="space-y-5">
                      <AcademicLink source="PubMed" title="Neural mechanisms in articulation recovery..." />
                      <AcademicLink source="Scholar" title="Comparative study on AI models for speech pathology..." />
                      <AcademicLink source="Lancet" title="Longitudinal study of early intervention effects..." />
                   </div>
                </div>
             </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const AppointmentCard: React.FC<{ name: string, time: string, type: string, status: string, active?: boolean, onJoin: () => void }> = ({ name, time, type, status, active, onJoin }) => (
  <div 
    onClick={onJoin}
    className={`flex items-center gap-6 p-6 rounded-[36px] border-2 transition-all cursor-pointer group shadow-2xl shadow-black/5 ${active ? 'bg-primary dark:bg-primary border-primary' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-white/5 hover:border-primary/20'}`}
  >
    <div className="size-16 rounded-3xl bg-slate-100 dark:bg-slate-700 flex-shrink-0 border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden group-hover:scale-110 transition-transform">
      <img src={`https://i.pravatar.cc/150?u=${name}`} alt={name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
    </div>
    <div className="flex-1 min-w-0">
      <div className={`font-black text-xl italic tracking-tighter leading-none mb-1 ${active ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{name}</div>
      <div className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-white/70' : 'text-slate-400'}`}>{type} • {time}</div>
    </div>
    <div className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-white text-primary shadow-2xl scale-110' : 'bg-slate-50 dark:bg-white/5 text-slate-400 border border-slate-100 dark:border-white/10'}`}>
      {status}
    </div>
  </div>
);

const QuickAction: React.FC<{ icon: string, label: string, color: string, onClick: () => void }> = ({ icon, label, color, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center justify-center gap-4 p-8 rounded-[40px] bg-slate-50 dark:bg-white/5 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl transition-all border-2 border-transparent hover:border-primary/20 group">
    <div className={`size-16 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform ${color} shadow-2xl shadow-black/5`}>
      <span className="material-symbols-outlined text-3xl font-black">{icon}</span>
    </div>
    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 text-center uppercase tracking-[0.2em]">{label}</span>
  </button>
);

const HomeworkCard: React.FC<{ title: string, desc: string, xp: number, icon: string }> = ({ title, desc, xp, icon }) => (
  <div className="p-8 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[40px] hover:border-emerald-500/30 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl transition-all group cursor-pointer">
     <div className="flex items-center justify-between mb-6">
        <div className="size-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-black/5">
           <span className="material-symbols-outlined text-3xl font-black">{icon}</span>
        </div>
        <span className="text-[10px] font-black text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-4 py-1.5 rounded-xl border border-amber-100 dark:border-amber-500/20 uppercase tracking-widest">+{xp} XP</span>
     </div>
     <h4 className="text-2xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter mb-3 group-hover:text-emerald-500 transition-colors leading-none">{title}</h4>
     <p className="text-sm text-slate-500 dark:text-slate-400 font-medium italic line-clamp-2 leading-relaxed mb-8">"{desc}"</p>
     <button className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:bg-emerald-500 dark:hover:bg-emerald-500 dark:hover:text-white transition-all shadow-xl">BAŞLAT</button>
  </div>
);

const ProgressMini: React.FC<{ label: string, value: number, color: string }> = ({ label, value, color }) => (
  <div className="space-y-4">
     <div className="flex justify-between items-end">
        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{label}</span>
        <span className="text-3xl font-black text-slate-900 dark:text-white italic leading-none">%{value}</span>
     </div>
     <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden shadow-inner">
        <div className={`h-full ${color} transition-all duration-2000 shadow-xl`} style={{ width: `${value}%` }}></div>
     </div>
  </div>
);

const AcademicLink: React.FC<{ source: string, title: string }> = ({ source, title }) => (
  <div className="p-5 bg-white/5 rounded-[28px] border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
     <div className={`text-[10px] font-black mb-2 uppercase tracking-[0.3em] ${source === 'PubMed' ? 'text-primary' : 'text-emerald-400'}`}>{source}</div>
     <div className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors line-clamp-2 leading-relaxed italic">"{title}"</div>
  </div>
);

export default Dashboard;
