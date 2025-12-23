
import React, { useState } from 'react';
import { Activity } from '../types';
import { ASSET_LIBRARY } from '../constants';
import { aiService } from '../services/aiService';

const QUICK_PROMPTS = [
  { label: "Okyanus Macerası", prompt: "6 yaş grubu için deniz altı temalı, /l/ sesine odaklanan interaktif bir hikaye kartı seti." },
  { label: "Süpermarket Gezisi", prompt: "4-5 yaş arası çocuklar için günlük yaşam kelimelerini geliştiren market temalı eşleştirme oyunu." },
  { label: "Robot Atölyesi", prompt: "Artikülasyon hedefleri içeren, robot parçaları toplama temalı bir egzersiz kurgusu." }
];

const MaterialLibrary: React.FC<{ onAdd: (activity: Activity) => void }> = ({ onAdd }) => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const allActivities = ASSET_LIBRARY.flatMap(c => c.activities);
  const filtered = allActivities.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || a.type.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleAiGenerate = async (customPrompt?: string) => {
    const finalPrompt = customPrompt || aiPrompt;
    if (!finalPrompt || isAiGenerating) return;
    
    setIsAiGenerating(true);
    try {
      const newMaterial = await aiService.generateMaterial(finalPrompt);
      newMaterial.id = `ai-${Date.now()}`;
      onAdd(newMaterial as Activity);
      setAiPrompt('');
    } catch (error) {
      console.error("Material generation failed:", error);
      alert("Hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-10 no-scrollbar">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-3">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                AI Content Engine v3
             </div>
             <h2 className="text-5xl font-black text-slate-900 tracking-tight italic">Materyal_Fabrikası</h2>
             <p className="text-lg text-slate-500 font-medium tracking-tight max-w-xl">Gemini 3 Flash ve Image 2.5 ile saniyeler içinde profesyonel klinik materyaller üretin.</p>
          </div>
          
          <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
             {['all', 'Game', 'Exercise', 'Cards'].map(t => (
               <button 
                 key={t}
                 onClick={() => setFilter(t)}
                 className={`px-6 py-3 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${filter === t ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 {t === 'all' ? 'TÜMÜ' : t === 'Game' ? 'OYUNLAR' : t === 'Exercise' ? 'EGZERSİZ' : 'KARTLAR'}
               </button>
             ))}
          </div>
        </div>

        {/* AI Composer Box */}
        <div className="bg-slate-950 rounded-[48px] p-10 md:p-14 text-white relative overflow-hidden shadow-3xl group">
           <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
              <span className="material-symbols-outlined text-[260px]">auto_awesome</span>
           </div>
           
           <div className="relative z-10 max-w-4xl space-y-8">
              <div className="space-y-2">
                 <h4 className="text-3xl font-black italic tracking-tighter">Hayal Edin, <span className="text-primary">Klinik</span> Materyale Dönüşsün.</h4>
                 <p className="text-slate-400 font-medium">Hedef ses, yaş grubu ve temayı belirtin; AI hem içeriği hem de görselleri hazırlasın.</p>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                 <div className="flex-1 relative">
                    <input 
                      className="w-full bg-white/5 border-2 border-white/10 rounded-3xl px-8 py-6 text-white placeholder:text-slate-600 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-xl shadow-inner"
                      placeholder="Örn: 5 yaş grubu için uzay temalı /s/ sesi kartları..."
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
                    />
                 </div>
                 <button 
                   disabled={isAiGenerating}
                   onClick={() => handleAiGenerate()}
                   className={`bg-primary text-white px-12 py-6 rounded-3xl font-black text-lg shadow-2xl shadow-primary/30 hover:bg-primary-dark transition-all flex items-center justify-center gap-4 active:scale-95 ${isAiGenerating ? 'opacity-50 cursor-wait' : ''}`}
                 >
                   {isAiGenerating ? (
                     <div className="flex items-center gap-2">
                        <span className="animate-spin material-symbols-outlined">sync</span>
                        <span>ÜRETİLİYOR...</span>
                     </div>
                   ) : (
                     <>
                        <span className="material-symbols-outlined">magic_button</span>
                        <span>TASARLA</span>
                     </>
                   )}
                 </button>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hızlı Şablonlar:</span>
                 {QUICK_PROMPTS.map((qp, i) => (
                   <button 
                     key={i}
                     onClick={() => { setAiPrompt(qp.prompt); handleAiGenerate(qp.prompt); }}
                     disabled={isAiGenerating}
                     className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-slate-300 transition-all active:scale-95"
                   >
                     {qp.label}
                   </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Browser Grid */}
        <div className="space-y-10">
           <div className="relative max-w-2xl">
              <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input 
                className="w-full bg-white border-none rounded-[32px] pl-16 pr-8 py-6 text-lg focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-xl shadow-slate-200/50 font-medium italic"
                placeholder="Kütüphanede ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {filtered.map(item => (
                <div key={item.id} className="bg-white rounded-[48px] border border-slate-100 overflow-hidden group hover:shadow-3xl hover:border-primary/20 transition-all flex flex-col relative">
                   <div className="relative aspect-square overflow-hidden bg-slate-50">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" alt={item.title} />
                      <div className="absolute top-6 left-6">
                         <span className="bg-white/90 backdrop-blur-md text-[10px] font-black uppercase px-4 py-2 rounded-2xl text-primary shadow-xl">{item.type}</span>
                      </div>
                   </div>
                   <div className="p-10 flex-1 flex flex-col">
                      <h3 className="font-black text-slate-900 group-hover:text-primary transition-colors mb-4 text-2xl italic tracking-tight leading-tight">{item.title}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-10 font-medium">{item.description}</p>
                      <div className="mt-auto flex items-center justify-between">
                         <div className="flex items-center gap-3 text-xs font-black text-slate-400 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                            <span className="material-symbols-outlined text-[18px]">schedule</span>
                            {item.duration || 10} DK
                         </div>
                         <button 
                           onClick={() => onAdd(item)}
                           className="bg-slate-900 hover:bg-primary text-white size-14 rounded-2xl flex items-center justify-center transition-all shadow-xl active:scale-90 group-hover:rotate-12"
                         >
                            <span className="material-symbols-outlined font-bold">add</span>
                         </button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialLibrary;
