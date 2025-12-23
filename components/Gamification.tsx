
import React, { useState } from 'react';
import { Badge } from '../types';

interface Quest {
  id: string;
  title: string;
  progress: number;
  total: number;
  reward: string;
  category: 'daily' | 'weekly' | 'clinical';
  icon: string;
}

const MOCK_BADGES: Badge[] = [
  { id: 'b1', title: 'İlk Kelime', icon: 'chat_bubble', unlocked: true, date: '12 Mart' },
  { id: 'b2', title: '7 Günlük Seri', icon: 'local_fire_department', unlocked: true, date: '19 Mart' },
  { id: 'b3', title: 'R Ustası', icon: 'psychology', unlocked: false },
  { id: 'b4', title: 'Konuşkan Çocuk', icon: 'forum', unlocked: true, date: '25 Mart' },
  { id: 'b5', title: 'Süper Dinleyici', icon: 'hearing', unlocked: false },
  { id: 'b6', title: 'Klinik Kaşif', icon: 'explore', unlocked: true, date: '28 Mart' },
  { id: 'b7', title: 'Zaman Yolcusu', icon: 'history', unlocked: false },
  { id: 'b8', title: 'Mükemmeliyetçi', icon: 'verified', unlocked: false },
];

const MOCK_QUESTS: Quest[] = [
  { id: 'q1', title: 'Günün Görevi: 20 kez "Araba" de', progress: 14, total: 20, reward: '100 XP', category: 'daily', icon: 'mic' },
  { id: 'q2', title: 'Haftalık: 3 Seans Tamamla', progress: 2, total: 3, reward: '500 XP', category: 'weekly', icon: 'videocam' },
  { id: 'q3', title: 'Ödev: "S" Sesi Egzersizi', progress: 1, total: 1, reward: '250 XP', category: 'clinical', icon: 'task' },
];

const Gamification: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'mastery'>('overview');

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 md:p-10 no-scrollbar">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header: Level & Global Status */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full text-[10px] font-black uppercase tracking-widest text-amber-600 border border-amber-500/10">
                 <span className="material-symbols-outlined text-[14px]">military_tech</span>
                 Engagement Engine v6.0
              </div>
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Başarı Merkezi</h2>
              <p className="text-lg text-slate-500 font-medium tracking-tight italic">Gelişim sürecini ödüllendirerek klinik bağlılığı artırın.</p>
           </div>
           
           <div className="flex bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
              <button onClick={() => setActiveTab('overview')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all tracking-widest ${activeTab === 'overview' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400'}`}>GENEL BAKIŞ</button>
              <button onClick={() => setActiveTab('mastery')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all tracking-widest ${activeTab === 'mastery' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400'}`}>USTALIK AĞACI</button>
              <button onClick={() => setActiveTab('achievements')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all tracking-widest ${activeTab === 'achievements' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400'}`}>ROZETLER</button>
           </div>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Main Level Hero */}
            <div className="bg-slate-900 rounded-[56px] p-12 text-white relative overflow-hidden shadow-3xl group">
               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                  <span className="material-symbols-outlined text-[320px]">workspace_premium</span>
               </div>
               
               <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-4 flex flex-col items-center text-center space-y-6 lg:border-r lg:border-white/10 pr-12">
                     <div className="relative">
                        <svg className="size-48 -rotate-90">
                           <circle cx="96" cy="96" r="88" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                           <circle cx="96" cy="96" r="88" fill="transparent" stroke="#0EA5E9" strokeWidth="12" strokeDasharray={552} strokeDashoffset={552 * (1 - 0.72)} strokeLinecap="round" className="transition-all duration-2000 ease-out" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Seviye</span>
                           <span className="text-6xl font-black italic tracking-tighter">14</span>
                        </div>
                     </div>
                     <div className="space-y-1">
                        <h4 className="text-2xl font-black italic uppercase">Büyük Elçi</h4>
                        <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">Sonraki Seviye: %72</p>
                     </div>
                  </div>

                  <div className="lg:col-span-8 space-y-10">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <HeroStat label="Toplam XP" value="12,450" icon="stars" />
                        <HeroStat label="Günlük Seri" value="8 Gün" icon="local_fire_department" />
                        <HeroStat label="Klinik Puanı" value="840" icon="medical_services" />
                     </div>
                     
                     <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 flex flex-col md:flex-row items-center gap-8">
                        <div className="size-16 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/20">
                           <span className="material-symbols-outlined text-3xl font-black">bolt</span>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                           <h5 className="text-lg font-black italic uppercase mb-1">Günün Meydan Okuması</h5>
                           <p className="text-xs text-slate-400 font-medium">Bugün 15 dakika boyunca kesintisiz artikülasyon pratiği yaparak <span className="text-white font-bold">+200 XP</span> kazanabilirsin.</p>
                        </div>
                        <button className="px-8 py-3 bg-white text-slate-900 font-black text-[10px] uppercase rounded-xl hover:bg-primary hover:text-white transition-all">Hemen Başla</button>
                     </div>
                  </div>
               </div>
            </div>

            {/* Quests & Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
               <div className="lg:col-span-8 space-y-8">
                  <div className="bg-white rounded-[48px] border border-slate-200 p-10 shadow-sm">
                     <h3 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter mb-8 flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">explore</span>
                        Aktif Görevler
                     </h3>
                     <div className="space-y-4">
                        {MOCK_QUESTS.map(quest => (
                          <div key={quest.id} className="group p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex flex-col md:flex-row md:items-center gap-6 hover:bg-white hover:shadow-xl transition-all cursor-pointer">
                             <div className={`size-14 rounded-2xl flex items-center justify-center shrink-0 ${quest.category === 'clinical' ? 'bg-rose-100 text-rose-600' : 'bg-primary/10 text-primary'}`}>
                                <span className="material-symbols-outlined text-2xl font-black">{quest.icon}</span>
                             </div>
                             <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-2">
                                   <h4 className="font-black text-slate-900 italic truncate group-hover:text-primary transition-colors uppercase tracking-tight">{quest.title}</h4>
                                   <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border border-amber-100 uppercase tracking-widest">{quest.reward}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                   <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                      <div className={`h-full transition-all duration-1000 ${quest.category === 'clinical' ? 'bg-rose-500' : 'bg-primary'}`} style={{ width: `${(quest.progress / quest.total) * 100}%` }}></div>
                                   </div>
                                   <span className="text-[10px] font-black text-slate-400 w-10 text-right">{quest.progress}/{quest.total}</span>
                                </div>
                             </div>
                             <button className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100">DETAY</button>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="lg:col-span-4 space-y-10">
                  {/* Milestones / Future Rewards */}
                  <div className="bg-white rounded-[48px] border border-slate-200 p-10 shadow-sm relative overflow-hidden group">
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Gelecek Ödüller</h3>
                     <div className="space-y-8">
                        <RewardItem level={15} title="Yeni Avatar Seti" icon="face_6" progress={72} />
                        <RewardItem level={18} title="Canlı Odada Özel Arkaplan" icon="wallpaper" progress={45} />
                        <RewardItem level={20} title="Klinik Prestij Rozeti" icon="stars" progress={20} />
                     </div>
                  </div>

                  {/* Quick Activity Button */}
                  <div className="bg-primary rounded-[40px] p-8 text-white shadow-3xl relative overflow-hidden group cursor-pointer active:scale-95 transition-all">
                     <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-[180px] text-white/10 group-hover:rotate-12 transition-transform duration-1000">videogame_asset</span>
                     <div className="relative z-10 space-y-4">
                        <h4 className="text-2xl font-black italic uppercase leading-tight tracking-tight">Hızlı Egzersiz</h4>
                        <p className="text-sm font-medium text-white/80 leading-relaxed">Bağlantıyı koparma, bugün henüz günlük hedefine ulaşmadın!</p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary font-black text-[10px] uppercase rounded-xl tracking-widest shadow-xl">
                           Hemen Başlat
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </>
        )}

        {activeTab === 'achievements' && (
          <div className="bg-white rounded-[64px] border border-slate-200 p-12 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-10">
                {MOCK_BADGES.map(badge => (
                  <div key={badge.id} className={`flex flex-col items-center p-8 rounded-[48px] border-2 transition-all relative group ${badge.unlocked ? 'bg-white border-slate-50 shadow-sm hover:shadow-2xl hover:-translate-y-2' : 'bg-slate-50/50 border-transparent opacity-40 grayscale'}`}>
                     {badge.unlocked && (
                        <div className="absolute -top-3 -right-3 size-8 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                           <span className="material-symbols-outlined text-sm font-black">check</span>
                        </div>
                     )}
                     <div className={`size-20 rounded-3xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 ${badge.unlocked ? 'bg-primary/5 text-primary shadow-inner' : 'bg-slate-200 text-slate-400'}`}>
                        <span className="material-symbols-outlined text-4xl">{badge.icon}</span>
                     </div>
                     <h4 className="text-xs font-black text-slate-900 text-center uppercase tracking-tight mb-2 leading-tight h-8 flex items-center">{badge.title}</h4>
                     <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        {badge.date || 'Kilitli'}
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'mastery' && (
          <div className="bg-slate-900 rounded-[64px] p-20 text-white min-h-[600px] relative overflow-hidden flex flex-col items-center justify-center text-center animate-in zoom-in duration-700">
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
             <span className="material-symbols-outlined text-[160px] text-primary/20 mb-10 animate-pulse">account_tree</span>
             <h3 className="text-5xl font-black italic tracking-tighter uppercase mb-6 leading-none">Gelişim ve Ustalık Ağacı</h3>
             <p className="text-slate-400 max-w-xl text-lg font-medium italic mb-12">Bu modül üzerinde çalışıyoruz. Yakında klinik başarılarınızla dallanan, interaktif bir gelişim ağacıyla karşılaşacaksınız.</p>
             <div className="flex gap-4">
                <div className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500">Çok Yakında</div>
                <button onClick={() => setActiveTab('overview')} className="px-8 py-3 bg-primary text-white font-black text-[10px] uppercase rounded-2xl shadow-xl shadow-primary/30">Geri Dön</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const HeroStat: React.FC<{ label: string, value: string, icon: string }> = ({ label, value, icon }) => (
  <div className="flex flex-col items-center p-6 bg-white/5 rounded-3xl border border-white/5 group hover:bg-white/10 transition-all">
     <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
        <span className="material-symbols-outlined text-2xl font-black">{icon}</span>
     </div>
     <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</div>
     <div className="text-3xl font-black italic tracking-tighter">{value}</div>
  </div>
);

const RewardItem: React.FC<{ level: number, title: string, icon: string, progress: number }> = ({ level, title, icon, progress }) => (
  <div className="flex items-center gap-6 group">
     <div className="size-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:text-primary group-hover:bg-primary/5 transition-all relative">
        <span className="text-[10px] absolute -top-2 -left-2 bg-slate-900 text-white px-2 py-0.5 rounded-lg border border-white/10">Lvl {level}</span>
        <span className="material-symbols-outlined text-2xl">{icon}</span>
     </div>
     <div className="flex-1">
        <div className="text-[11px] font-black text-slate-800 uppercase italic mb-2 tracking-tight">{title}</div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
           <div className="h-full bg-primary/40 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
     </div>
  </div>
);

export default Gamification;
