
import React, { useState } from 'react';
import { Activity, User } from '../types';

interface TimelineProps {
  sessionFlow: Activity[];
  selectedId: string;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
  users: User[];
  onLaunchSession: (client: User) => void;
}

const Timeline: React.FC<TimelineProps> = ({ sessionFlow, selectedId, onSelect, onRemove, onClearAll, users, onLaunchSession }) => {
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);
  const totalDuration = sessionFlow.reduce((acc, curr) => acc + curr.duration, 0);
  const clients = users.filter(u => u.role === 'client');

  return (
    <main className="flex-1 bg-slate-50 relative flex flex-col min-w-0">
      {/* Canvas Header */}
      <div className="h-20 flex items-center justify-between px-10 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-5">
          <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center">
             <span className="material-symbols-outlined text-primary font-black">pending_actions</span>
          </div>
          <div>
            <h2 className="font-black text-slate-900 italic tracking-tighter uppercase leading-none">Aktif Seans Tasarımı</h2>
            <div className="flex items-center gap-3 mt-1">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{sessionFlow.length} MATERYAL</span>
               <span className="size-1 bg-slate-200 rounded-full"></span>
               <span className="text-[10px] font-black text-primary uppercase tracking-widest">YAKLAŞIK {totalDuration} DAKİKA</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={onClearAll} className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors">Tümünü Temizle</button>
          <button 
            disabled={sessionFlow.length === 0}
            onClick={() => setIsLaunchModalOpen(true)}
            className="px-10 py-3 bg-slate-900 text-white font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-30 flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-lg">rocket_launch</span>
            SEANSI BAŞLAT
          </button>
        </div>
      </div>

      {/* Scrollable Timeline Area */}
      <div className="flex-1 overflow-y-auto p-12 relative no-scrollbar">
        {sessionFlow.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-40">
             <span className="material-symbols-outlined text-[140px] mb-6">view_timeline</span>
             <h3 className="text-3xl font-black italic uppercase tracking-tighter">Akış Şeması Boş</h3>
             <p className="text-sm font-bold uppercase tracking-widest mt-2 max-w-xs">Sol panelden veya kütüphaneden materyal ekleyerek seansı kurgulayın.</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8 relative">
            <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-slate-200 pointer-events-none"></div>
            
            {sessionFlow.map((activity, index) => {
              const isSelected = activity.id === selectedId;
              return (
                <div key={activity.id} className="relative flex gap-10 group animate-in slide-in-from-left duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex-shrink-0 z-10 pt-6">
                    <div className={`size-16 rounded-[24px] flex items-center justify-center font-black text-xl shadow-2xl ring-8 ring-slate-50 transition-all ${isSelected ? 'bg-primary text-white scale-110 shadow-primary/30' : 'bg-white text-slate-300'}`}>
                      {index + 1}
                    </div>
                  </div>

                  <div 
                    className={`flex-1 bg-white rounded-[40px] p-8 shadow-sm transition-all cursor-pointer border-2 relative overflow-hidden ${isSelected ? 'border-primary shadow-2xl' : 'border-transparent hover:border-slate-200'}`}
                    onClick={() => onSelect(activity.id)}
                  >
                    <div className="flex items-start gap-8">
                      <div className="size-28 rounded-[32px] overflow-hidden shadow-inner shrink-0">
                         <img src={activity.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                           <div>
                              <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 block">{activity.category}</span>
                              <h3 className="text-2xl font-black text-slate-900 italic tracking-tight leading-none">{activity.title}</h3>
                           </div>
                           <button 
                             onClick={(e) => { e.stopPropagation(); onRemove(activity.id); }}
                             className="size-10 rounded-xl bg-rose-50 text-rose-500 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:bg-rose-500 hover:text-white"
                           >
                              <span className="material-symbols-outlined text-lg">delete</span>
                           </button>
                        </div>
                        <p className="text-slate-500 text-sm font-medium italic line-clamp-2 leading-relaxed mb-6">"{activity.description}"</p>
                        <div className="flex items-center gap-4">
                           <div className="px-4 py-1.5 bg-slate-50 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">{activity.duration} DK</div>
                           <div className="px-4 py-1.5 bg-slate-50 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">{activity.type}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Launch Modal */}
      {isLaunchModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-[56px] p-12 shadow-3xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-10">
                 <div className="space-y-1">
                    <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Vaka Ataması</h3>
                    <p className="text-slate-500 font-medium italic uppercase text-[10px] tracking-widest">Bu seansı hangi danışan ile başlatmak istersiniz?</p>
                 </div>
                 <button onClick={() => setIsLaunchModalOpen(false)} className="size-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"><span className="material-symbols-outlined">close</span></button>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar pr-2 mb-10">
                 {clients.map(client => (
                   <button 
                     key={client.id}
                     onClick={() => { onLaunchSession(client); setIsLaunchModalOpen(false); }}
                     className="w-full flex items-center justify-between p-6 bg-slate-50 rounded-[32px] border-2 border-transparent hover:border-primary hover:bg-white hover:shadow-xl transition-all group"
                   >
                      <div className="flex items-center gap-6 text-left">
                         <div className="size-14 rounded-2xl overflow-hidden shadow-lg border-2 border-white group-hover:scale-105 transition-transform">
                            <img src={client.avatar || `https://i.pravatar.cc/150?u=${client.id}`} className="w-full h-full object-cover" alt="" />
                         </div>
                         <div>
                            <div className="text-lg font-black text-slate-900 italic tracking-tight leading-none uppercase">{client.name}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Son Seans: 3 Gün Önce</div>
                         </div>
                      </div>
                      <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">play_circle</span>
                   </button>
                 ))}
              </div>

              <div className="flex items-center justify-center p-8 bg-primary/5 rounded-[40px] border border-primary/10">
                 <p className="text-xs text-primary font-bold italic text-center leading-relaxed">
                    Seans başlatıldığında vakanın klinik profil verileri Gemini 3.0 analiz motoruna aktarılacak ve kişiselleştirilmiş protokol devreye girecektir.
                 </p>
              </div>
           </div>
        </div>
      )}
    </main>
  );
};

export default Timeline;
