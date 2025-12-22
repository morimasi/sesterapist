
import React from 'react';
import { User, SessionMetadata } from '../types';

interface DashboardProps {
  user: User | null;
  onStartBuilder: () => void;
  onJoinSession: (session: SessionMetadata) => void;
  onStartAssessment?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onStartBuilder, onJoinSession, onStartAssessment }) => {
  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Hoş geldin, {user?.name || 'Terapist'} 👋</h2>
          <p className="text-slate-500 mt-1">İşte bugünkü seanslarına ve materyallerine hızlı bir bakış.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onStartBuilder}
            className="flex items-center gap-2 bg-white text-slate-700 px-6 py-3 rounded-2xl font-bold border border-border hover:bg-slate-50 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined">auto_fix</span>
            Materyal Tasarla
          </button>
          <button 
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
          >
            <span className="material-symbols-outlined">add</span>
            Yeni Seans Planla
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-3xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-extrabold text-lg">Yaklaşan Seanslar</h3>
              <button className="text-primary text-sm font-bold hover:underline">Tümünü Gör</button>
            </div>
            <div className="space-y-4">
              <AppointmentCard 
                name="Ahmet Yılmaz" 
                time="14:30" 
                type="Artikülasyon" 
                status="Şimdi Başla" 
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

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div 
              onClick={onStartAssessment}
              className="bg-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-600/20 relative overflow-hidden group cursor-pointer"
            >
              <div className="relative z-10">
                <div className="text-indigo-100 text-sm font-bold uppercase tracking-wider mb-2">AI Klinik Analiz</div>
                <div className="text-3xl font-black mb-4 group-hover:scale-105 transition-transform origin-left">12 Rapor</div>
                <p className="text-sm text-indigo-100">Bu hafta danışanların için üretilen gelişim analizleri.</p>
              </div>
              <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl text-white/10 group-hover:rotate-12 transition-transform">analytics</span>
            </div>
            <div className="bg-emerald-500 rounded-3xl p-6 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden group cursor-pointer">
              <div className="relative z-10">
                <div className="text-emerald-50 text-sm font-bold uppercase tracking-wider mb-2">Materyaller</div>
                <div className="text-3xl font-black mb-4 group-hover:scale-105 transition-transform origin-left">48 Materyal</div>
                <p className="text-sm text-emerald-50">Kütüphanendeki toplam interaktif materyal sayısı.</p>
              </div>
              <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl text-white/10 group-hover:rotate-12 transition-transform">book</span>
            </div>
          </section>
        </div>

        {/* Right Column - Sidebar info */}
        <div className="space-y-8">
          <section className="bg-white rounded-3xl border border-border p-6 shadow-sm">
            <h3 className="font-extrabold text-lg mb-6 text-slate-800">Hızlı Aksiyonlar</h3>
            <div className="grid grid-cols-2 gap-3">
              <QuickAction icon="mic" label="Ses Kaydet" color="text-rose-500 bg-rose-50" />
              <QuickAction icon="video_call" label="Oda Aç" color="text-primary bg-sky-50" />
              <QuickAction icon="auto_fix" label="AI Materyal" color="text-amber-500 bg-amber-50" />
              <QuickAction icon="person_add" label="Danışan Ekle" color="text-emerald-500 bg-emerald-50" />
            </div>
          </section>

          <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl">
             <h3 className="font-bold mb-3">Akademik Makaleler</h3>
             <p className="text-xs text-slate-400 mb-6">Uzmanlık alanınla ilgili en yeni araştırmaları takip et.</p>
             <div className="space-y-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                   <div className="text-xs font-bold text-primary mb-1">PubMed</div>
                   <div className="text-sm font-medium line-clamp-2">Neural mechanisms in articulation recovery...</div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                   <div className="text-xs font-bold text-success mb-1">Scholar</div>
                   <div className="text-sm font-medium line-clamp-2">Comparative study on AI models for speech pathology...</div>
                </div>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const AppointmentCard: React.FC<{ name: string, time: string, type: string, status: string, onJoin: () => void }> = ({ name, time, type, status, onJoin }) => (
  <div 
    onClick={onJoin}
    className="flex items-center gap-4 p-4 bg-white hover:bg-slate-50 rounded-2xl border border-transparent hover:border-border transition-all cursor-pointer group"
  >
    <div className="size-12 rounded-full bg-slate-100 flex-shrink-0 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
      <img src={`https://i.pravatar.cc/150?u=${name}`} alt={name} className="w-full h-full object-cover" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-bold text-slate-800 group-hover:text-primary transition-colors">{name}</div>
      <div className="text-xs text-slate-500">{type} • {time}</div>
    </div>
    <div className={`px-4 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wide transition-all ${status === 'Şimdi Başla' ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105' : 'bg-slate-100 text-slate-500'}`}>
      {status}
    </div>
    <span className="material-symbols-outlined text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 group-hover:translate-x-0">chevron_right</span>
  </div>
);

const QuickAction: React.FC<{ icon: string, label: string, color: string }> = ({ icon, label, color }) => (
  <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-border group">
    <div className={`size-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${color}`}>
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <span className="text-[11px] font-bold text-slate-600 text-center">{label}</span>
  </button>
);

export default Dashboard;
