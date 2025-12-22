
import React from 'react';
import { Badge } from '../types';

const MOCK_BADGES: Badge[] = [
  { id: 'b1', title: 'İlk Adım', icon: 'auto_awesome', unlocked: true, date: '12 Mart' },
  { id: 'b2', title: '7 Günlük Seri', icon: 'local_fire_department', unlocked: true, date: '19 Mart' },
  { id: 'b3', title: 'R Ustası', icon: 'psychology', unlocked: false },
  { id: 'b4', title: 'Konuşkan Çocuk', icon: 'forum', unlocked: true, date: '25 Mart' },
  { id: 'b5', title: 'Süper Dinleyici', icon: 'hearing', unlocked: false },
  { id: 'b6', title: 'Gece Kuşu', icon: 'bedtime', unlocked: true, date: '28 Mart' },
];

const Gamification: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header with Level Progress */}
        <div className="bg-gradient-to-br from-indigo-600 to-primary rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-10">
              <span className="material-symbols-outlined text-[200px]">military_tech</span>
           </div>
           
           <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
              <div className="space-y-4">
                 <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20">
                    Mevcut Seviye
                 </div>
                 <h2 className="text-6xl font-black">Seviye 12</h2>
                 <p className="text-indigo-100 font-medium">Bir sonraki seviyeye sadece 450 XP kaldı!</p>
              </div>
              
              <div className="flex-1 max-w-md w-full space-y-4">
                 <div className="flex justify-between items-end">
                    <span className="text-sm font-bold uppercase">XP İlerlemesi</span>
                    <span className="text-2xl font-black">2,550 <span className="text-sm opacity-60">/ 3,000</span></span>
                 </div>
                 <div className="h-4 bg-white/20 rounded-full overflow-hidden border border-white/10">
                    <div className="h-full bg-secondary rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all duration-1000" style={{ width: '85%' }}></div>
                 </div>
                 <div className="flex justify-between text-[10px] font-bold text-indigo-100 uppercase tracking-widest">
                    <span>Çırak</span>
                    <span>Usta</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           <StatBox label="Toplam Puan" value="12,450" icon="stars" color="text-amber-500 bg-amber-50" />
           <StatBox label="Oturum Serisi" value="8 Gün" icon="local_fire_department" color="text-rose-500 bg-rose-50" />
           <StatBox label="Rozetler" value="14/30" icon="military_tech" color="text-primary bg-sky-50" />
           <StatBox label="Tamamlanan Görev" value="48" icon="task_alt" color="text-emerald-500 bg-emerald-50" />
        </div>

        {/* Badges Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-2xl font-black text-slate-800 tracking-tight">Kazanılan Rozetler</h3>
             <button className="text-primary font-bold text-sm hover:underline">Tümünü Gör</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
             {MOCK_BADGES.map(badge => (
               <div key={badge.id} className={`flex flex-col items-center p-6 rounded-[32px] border transition-all ${badge.unlocked ? 'bg-white border-border shadow-sm hover:shadow-xl hover:-translate-y-1' : 'bg-slate-50 border-transparent opacity-50 grayscale'}`}>
                  <div className={`size-16 rounded-2xl flex items-center justify-center mb-4 ${badge.unlocked ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-400'}`}>
                     <span className="material-symbols-outlined text-3xl">{badge.icon}</span>
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900 text-center mb-1">{badge.title}</h4>
                  {badge.date ? (
                    <span className="text-[10px] font-bold text-slate-400">{badge.date}</span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 italic">Kilitli</span>
                  )}
               </div>
             ))}
          </div>
        </section>

        {/* Quest List */}
        <section className="bg-white rounded-[40px] border border-border p-10">
           <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-secondary text-3xl">explore</span>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Haftalık Görevler</h3>
           </div>
           <div className="space-y-4">
              <QuestItem title="3 Seans Tamamla" progress={2} total={3} reward="200 XP" />
              <QuestItem title="Günde 15 Dakika Pratik Yap" progress={5} total={7} reward="500 XP" />
              <QuestItem title="Kütüphaneden 2 Yeni Oyun Dene" progress={1} total={2} reward="150 XP" />
           </div>
        </section>
      </div>
    </div>
  );
};

const StatBox: React.FC<{ label: string, value: string, icon: string, color: string }> = ({ label, value, icon, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-border shadow-sm flex flex-col items-center text-center group hover:border-primary/20 transition-all">
    <div className={`size-12 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${color}`}>
       <span className="material-symbols-outlined text-2xl">{icon}</span>
    </div>
    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</div>
    <div className="text-2xl font-black text-slate-900 tracking-tight">{value}</div>
  </div>
);

const QuestItem: React.FC<{ title: string, progress: number, total: number, reward: string }> = ({ title, progress, total, reward }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-border">
     <div className="flex-1">
        <div className="font-bold text-slate-800 mb-2">{title}</div>
        <div className="flex items-center gap-3">
           <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(progress/total)*100}%` }}></div>
           </div>
           <span className="text-xs font-black text-slate-400 min-w-10 text-right">{progress}/{total}</span>
        </div>
     </div>
     <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-xl border border-amber-100">
        <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
        <span className="text-xs font-black uppercase tracking-wider">{reward}</span>
     </div>
  </div>
);

export default Gamification;
