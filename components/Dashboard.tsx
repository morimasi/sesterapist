
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
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Welcome */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight italic">
              Hoş geldin, <span className="text-primary">{user?.name || 'Terapist'}</span> 👋
            </h2>
            <p className="text-slate-500 font-medium">Klinik verilerin ve bugünkü seansların için her şey hazır.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={onStartBuilder}
              className="flex items-center gap-3 bg-white text-slate-800 px-8 py-4 rounded-2xl font-bold border-2 border-slate-100 hover:border-primary/20 hover:shadow-2xl transition-all active:scale-95 shadow-sm"
            >
              <span className="material-symbols-outlined text-primary">auto_fix</span>
              Yeni Materyal Tasarla
            </button>
            <button className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-slate-900/10 hover:bg-black transition-all active:scale-95">
              <span className="material-symbols-outlined">add</span>
              Seans Planla
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Column: Session Flow */}
          <div className="lg:col-span-8 space-y-10">
            <section className="bg-white rounded-[48px] border border-slate-200/60 p-10 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:rotate-12 transition-transform duration-1000">
                <span className="material-symbols-outlined text-[200px]">calendar_today</span>
              </div>
              <div className="flex items-center justify-between mb-10 relative z-10">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Günün Randevuları</h3>
                <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black uppercase text-slate-500 tracking-widest">7 SEANS KALAN</span>
              </div>
              
              <div className="space-y-4 relative z-10">
                <AppointmentCard 
                  name="Ahmet Yılmaz" 
                  time="14:30" 
                  type="Artikülasyon" 
                  status="Canlı Mod" 
                  active
                  onJoin={() => onJoinSession({ id: '1', clientName: 'Ahmet Yılmaz', startTime: '14:30', type: 'Artikülasyon' })}
                />
                <AppointmentCard 
                  name="Elif Demir" 
                  time="16:00" 
                  type="Dil Gelişimi" 
                  status="Hazır" 
                  onJoin={() => {}}
                />
                <AppointmentCard 
                  name="Caner Öz" 
                  time="17:15" 
                  type="Kekemelik" 
                  status="Beklemede" 
                  onJoin={() => {}}
                />
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div onClick={onStartAssessment} className="bg-indigo-600 rounded-[40px] p-8 text-white shadow-2xl shadow-indigo-600/20 group cursor-pointer relative overflow-hidden">
                  <div className="relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200 mb-2 block">Klinik Analiz Motoru</span>
                    <h4 className="text-4xl font-black italic mb-4">12 Yeni Rapor</h4>
                    <p className="text-indigo-100 text-sm font-medium leading-relaxed">AI tarafından hazırlanan derinlemesine vaka analizlerini incele.</p>
                  </div>
                  <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl text-white/10 group-hover:rotate-12 transition-transform">psychology</span>
               </div>
               <div className="bg-emerald-500 rounded-[40px] p-8 text-white shadow-2xl shadow-emerald-500/20 group cursor-pointer relative overflow-hidden">
                  <div className="relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-100 mb-2 block">Materyal Kütüphanesi</span>
                    <h4 className="text-4xl font-black italic mb-4">48 Aktif Öğe</h4>
                    <p className="text-emerald-50 text-sm font-medium leading-relaxed">Yeni nesil Gemini 3.0 Flash ile üretilen interaktif araçlar.</p>
                  </div>
                  <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl text-white/10 group-hover:rotate-12 transition-transform">book_4</span>
               </div>
            </div>
          </div>

          {/* Side Column: Quick Access & Academic */}
          <div className="lg:col-span-4 space-y-10">
             <section className="bg-white rounded-[40px] border border-slate-200/60 p-8 shadow-sm">
                <h3 className="font-black text-slate-900 mb-8 flex items-center gap-3 tracking-tight">
                   <span className="material-symbols-outlined text-primary">bolt</span>
                   Hızlı Aksiyonlar
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <QuickAction icon="mic" label="Ses Kaydet" color="text-rose-600 bg-rose-50" onClick={() => {}} />
                  <QuickAction icon="videocam" label="Canlı Oda" color="text-primary bg-sky-50" onClick={onQuickSession || (() => {})} />
                  <QuickAction icon="auto_fix" label="AI Materyal" color="text-amber-600 bg-amber-50" onClick={onStartBuilder} />
                  <QuickAction icon="person_add" label="Yeni Danışan" color="text-emerald-600 bg-emerald-50" onClick={() => {}} />
                </div>
             </section>

             <section className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
                <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-[200px] text-white/5 -rotate-12">school</span>
                <div className="relative z-10 space-y-6">
                   <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black italic tracking-tight">Akademik Takip</h3>
                      <button className="size-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-all"><span className="material-symbols-outlined text-sm">open_in_new</span></button>
                   </div>
                   <div className="space-y-4">
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

const AppointmentCard: React.FC<{ name: string, time: string, type: string, status: string, active?: boolean, onJoin: () => void }> = ({ name, time, type, status, active, onJoin }) => (
  <div 
    onClick={onJoin}
    className="flex items-center gap-5 p-5 bg-white hover:bg-slate-50 rounded-[32px] border-2 border-transparent hover:border-slate-100 transition-all cursor-pointer group shadow-sm"
  >
    <div className="size-14 rounded-2xl bg-slate-100 flex-shrink-0 border-4 border-white shadow-xl overflow-hidden group-hover:scale-110 transition-transform">
      <img src={`https://i.pravatar.cc/150?u=${name}`} alt={name} className="w-full h-full object-cover" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-black text-slate-900 group-hover:text-primary transition-colors text-lg italic tracking-tight">{name}</div>
      <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">{type} • {time}</div>
    </div>
    <div className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-105' : 'bg-slate-100 text-slate-500'}`}>
      {status}
    </div>
  </div>
);

const QuickAction: React.FC<{ icon: string, label: string, color: string, onClick: () => void }> = ({ icon, label, color, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-100 group">
    <div className={`size-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${color} shadow-lg shadow-black/5`}>
      <span className="material-symbols-outlined text-2xl font-bold">{icon}</span>
    </div>
    <span className="text-[10px] font-black text-slate-600 text-center uppercase tracking-widest">{label}</span>
  </button>
);

const AcademicLink: React.FC<{ source: string, title: string }> = ({ source, title }) => (
  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
     <div className={`text-[9px] font-black mb-1 uppercase tracking-widest ${source === 'PubMed' ? 'text-primary' : 'text-emerald-400'}`}>{source}</div>
     <div className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors line-clamp-2 leading-relaxed">{title}</div>
  </div>
);

export default Dashboard;
