
import React, { useState } from 'react';
import { Activity } from '../types';
import { ASSET_LIBRARY } from '../constants';
import { aiService } from '../services/aiService';

const AGE_GROUPS = ["2-4 Yaş", "5-7 Yaş", "8-12 Yaş", "Ergen", "Yetişkin"];
const GOALS = ["Artikülasyon", "Fonolojik Farkındalık", "Kelime Dağarcığı", "Akıcılık", "Sosyal İletişim"];
const VISUAL_STYLES = ["3D Yumuşak Kil (Clay)", "Profesyonel İllüstrasyon", "Foto-gerçekçi", "Suluboya", "Minimalist Vektör"];

const MaterialLibrary: React.FC<{ onAdd: (activity: Activity) => void }> = ({ onAdd }) => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0); 
  
  const [factoryParams, setFactoryParams] = useState({
    prompt: '',
    ageGroup: '5-7 Yaş',
    targetSound: 'R',
    goal: 'Artikülasyon',
    theme: 'Uzay Macerası',
    visualStyle: '3D Yumuşak Kil (Clay)'
  });

  const [previewMaterial, setPreviewMaterial] = useState<Activity | null>(null);

  const allActivities = ASSET_LIBRARY.flatMap(c => c.activities);
  const filtered = allActivities.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || a.type.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleAiGenerate = async () => {
    setIsAiGenerating(true);
    setGenerationStep(1);
    
    try {
      const metadata = await aiService.generateMaterial(factoryParams);
      setGenerationStep(2);
      
      const newMaterial: Activity = {
        ...metadata,
        id: `ai-${Date.now()}`,
        settings: {
          targetSoundPosition: "Başlangıç",
          difficulty: factoryParams.ageGroup === '2-4 Yaş' ? 'Kolay' : 'Orta',
          notes: `AI tarafından ${factoryParams.goal} hedefiyle üretilmiştir.`
        }
      };
      
      setPreviewMaterial(newMaterial);
      setGenerationStep(3);
    } catch (error) {
      console.error("Material generation failed:", error);
      alert("Hata oluştu. Lütfen tekrar deneyin.");
      setGenerationStep(0);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const confirmAddMaterial = () => {
    if (previewMaterial) {
      onAdd(previewMaterial);
      setPreviewMaterial(null);
      setGenerationStep(0);
      setFactoryParams({ ...factoryParams, prompt: '' });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 md:p-10 no-scrollbar">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10">
                <span className="material-symbols-outlined text-[14px]">precision_manufacturing</span>
                Clinical Production Engine v6.0
             </div>
             <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Materyal Fabrikası</h2>
             <p className="text-lg text-slate-500 font-medium tracking-tight max-w-xl italic">Klinik parametrelerle milimetrik içerik üretimi.</p>
          </div>
          
          <div className="flex bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
             {['all', 'Game', 'Exercise', 'Cards'].map(t => (
               <button 
                 key={t}
                 onClick={() => setFilter(t)}
                 className={`px-6 py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${filter === t ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 {t === 'all' ? 'TÜMÜ' : t === 'Game' ? 'OYUNLAR' : t === 'Exercise' ? 'EGZERSİZ' : 'KARTLAR'}
               </button>
             ))}
          </div>
        </div>

        {/* --- PROFESSIONAL AI FACTORY PANEL --- */}
        <div className="bg-white rounded-[64px] border border-slate-200 p-10 md:p-14 shadow-3xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
              <span className="material-symbols-outlined text-[320px] text-primary">dynamic_form</span>
           </div>
           
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-8">
                 <div className="space-y-2">
                    <h4 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Yapılandırma Paneli</h4>
                    <p className="text-slate-500 font-medium italic">Materyal üretim algoritması için klinik girişleri belirleyin.</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FactorySelect 
                      label="Hedef Yaş Grubu" 
                      value={factoryParams.ageGroup} 
                      options={AGE_GROUPS} 
                      onChange={(v) => setFactoryParams({...factoryParams, ageGroup: v})} 
                    />
                    <FactorySelect 
                      label="Terapi Amacı" 
                      value={factoryParams.goal} 
                      options={GOALS} 
                      onChange={(v) => setFactoryParams({...factoryParams, goal: v})} 
                    />
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hedef Fonem</label>
                       <input 
                         className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold text-sm outline-none focus:border-primary transition-all" 
                         value={factoryParams.targetSound}
                         onChange={(e) => setFactoryParams({...factoryParams, targetSound: e.target.value})}
                         placeholder="Örn: R, S, K, Tr..."
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">İçerik Teması</label>
                       <input 
                         className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold text-sm outline-none focus:border-primary transition-all" 
                         value={factoryParams.theme}
                         onChange={(e) => setFactoryParams({...factoryParams, theme: e.target.value})}
                         placeholder="Örn: Korsanlar, Doğa, Robotlar..."
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Özel Klinik Talimatlar</label>
                    <textarea 
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-8 py-6 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-lg shadow-inner min-h-[120px] resize-none"
                      placeholder="Spesifik bir kelime listesi veya senaryo ekleyebilirsiniz..."
                      value={factoryParams.prompt}
                      onChange={(e) => setFactoryParams({...factoryParams, prompt: e.target.value})}
                    />
                 </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-6">
                 <div className="bg-slate-50 p-8 rounded-[48px] border border-slate-100 space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Görsel Stil Tercihi</h4>
                    <div className="space-y-2">
                       {VISUAL_STYLES.map(style => (
                         <button 
                           key={style}
                           onClick={() => setFactoryParams({...factoryParams, visualStyle: style})}
                           className={`w-full text-left px-5 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-tight border-2 transition-all ${factoryParams.visualStyle === style ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-primary/30'}`}
                         >
                            {style}
                         </button>
                       ))}
                    </div>
                 </div>

                 <button 
                   disabled={isAiGenerating}
                   onClick={handleAiGenerate}
                   className={`w-full py-8 bg-slate-900 text-white rounded-[32px] font-black text-xl shadow-3xl hover:bg-black transition-all flex flex-col items-center justify-center gap-2 active:scale-95 group ${isAiGenerating ? 'opacity-50 cursor-wait' : ''}`}
                 >
                   {isAiGenerating ? (
                      <div className="flex flex-col items-center gap-3">
                         <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                         <span className="text-xs tracking-[0.3em] font-black uppercase">Üretim Devam Ediyor</span>
                      </div>
                   ) : (
                      <>
                         <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-4xl text-primary animate-pulse">rocket_launch</span>
                            <span>Üretimi Başlat</span>
                         </div>
                         <span className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.4em]">Engine: Gemini 3.0 Pro</span>
                      </>
                   )}
                 </button>
              </div>
           </div>
        </div>

        {/* Existing Browser Grid */}
        <div className="space-y-10">
           <div className="relative max-w-2xl group">
              <span className="material-symbols-outlined absolute left-8 top-1/2 -translate-y-1/2 text-primary text-2xl">search_sparkle</span>
              <input 
                className="w-full bg-white border-2 border-slate-100 rounded-[40px] pl-20 pr-8 py-7 text-xl focus:ring-8 focus:ring-primary/5 focus:border-primary outline-none transition-all shadow-xl shadow-slate-200/50 font-bold italic"
                placeholder="Mevcut kütüphanede ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {filtered.map(item => (
                <div key={item.id} className="bg-white rounded-[56px] border border-slate-100 overflow-hidden group hover:shadow-3xl hover:border-primary/20 transition-all flex flex-col relative">
                   <div className="relative aspect-square overflow-hidden bg-slate-50">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" alt={item.title} />
                      <div className="absolute top-8 left-8">
                         <span className="bg-white/95 backdrop-blur-md text-[9px] font-black uppercase px-4 py-2 rounded-2xl text-primary shadow-xl border border-primary/10">{item.type}</span>
                      </div>
                   </div>
                   <div className="p-10 flex-1 flex flex-col">
                      <h3 className="font-black text-slate-900 group-hover:text-primary transition-colors mb-4 text-2xl italic tracking-tighter leading-none">{item.title}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-10 font-medium italic">"{item.description}"</p>
                      <div className="mt-auto flex items-center justify-between">
                         <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 uppercase tracking-widest">
                            <span className="material-symbols-outlined text-[18px]">timer</span>
                            {item.duration || 10} DK
                         </div>
                         <button 
                           onClick={() => onAdd(item)}
                           className="bg-slate-900 hover:bg-primary text-white size-14 rounded-2xl flex items-center justify-center transition-all shadow-xl active:scale-90 group-hover:rotate-12"
                         >
                            <span className="material-symbols-outlined font-black">add_circle</span>
                         </button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* --- PREVIEW & EDIT MODAL --- */}
      {previewMaterial && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-10 bg-black/95 backdrop-blur-2xl animate-in fade-in zoom-in duration-300">
           <div className="bg-white w-full max-w-5xl rounded-[64px] border-4 border-primary/20 p-16 flex flex-col gap-12 shadow-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                 <span className="material-symbols-outlined text-[240px] -rotate-12">verified</span>
              </div>
              
              <div className="flex items-center justify-between relative z-10">
                 <div className="flex items-center gap-8">
                    <div className="size-20 bg-primary text-white rounded-[32px] flex items-center justify-center shadow-2xl shadow-primary/30">
                       <span className="material-symbols-outlined text-4xl font-black">auto_awesome</span>
                    </div>
                    <div>
                       <h3 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Üretim Tamamlandı</h3>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-1">Materyal Özelliklerini Gözden Geçirin</p>
                    </div>
                 </div>
                 <button onClick={() => setPreviewMaterial(null)} className="size-16 rounded-[28px] bg-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all flex items-center justify-center"><span className="material-symbols-outlined text-2xl font-black">close</span></button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
                 <div className="space-y-10">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Materyal Başlığı</label>
                       <input 
                         className="w-full text-4xl font-black text-slate-900 border-b-4 border-slate-100 focus:border-primary outline-none pb-4 transition-all italic tracking-tighter"
                         value={previewMaterial.title}
                         onChange={(e) => setPreviewMaterial({...previewMaterial, title: e.target.value})}
                       />
                    </div>
                    
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Klinik Açıklama</label>
                       <textarea 
                         className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-8 text-slate-700 font-medium text-lg leading-relaxed focus:border-primary outline-none transition-all resize-none h-48 italic"
                         value={previewMaterial.description}
                         onChange={(e) => setPreviewMaterial({...previewMaterial, description: e.target.value})}
                       />
                    </div>

                    <div className="flex gap-4">
                       <div className="flex-1 p-6 bg-primary/5 rounded-[32px] border border-primary/10">
                          <div className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Hedef Analizi</div>
                          <div className="text-sm font-black text-slate-900">{factoryParams.goal}</div>
                       </div>
                       <div className="flex-1 p-6 bg-emerald-50 rounded-[32px] border border-emerald-100">
                          <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">Gelişim Seviyesi</div>
                          <div className="text-sm font-black text-slate-900">{factoryParams.ageGroup}</div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-10">
                    <div className="relative aspect-square rounded-[56px] overflow-hidden border-8 border-slate-50 shadow-2xl group">
                       <img src={previewMaterial.image} className="w-full h-full object-cover" alt="Generated" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-10">
                          <p className="text-white text-xs font-bold italic leading-relaxed">AI tarafından {factoryParams.visualStyle} stilinde render edildi.</p>
                       </div>
                    </div>
                    <div className="p-8 bg-slate-900 rounded-[40px] flex items-center justify-between text-white shadow-3xl">
                       <div className="flex items-center gap-4">
                          <span className="material-symbols-outlined text-primary text-3xl">verified</span>
                          <div>
                             <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Durum</div>
                             <div className="text-sm font-black italic">Yayına Hazır</div>
                          </div>
                       </div>
                       <button 
                         onClick={confirmAddMaterial}
                         className="px-12 py-5 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark transition-all uppercase text-[11px] tracking-widest shadow-xl shadow-primary/30"
                       >
                          Kütüphaneye Ekle
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const FactorySelect: React.FC<{ label: string, value: string, options: string[], onChange: (v: string) => void }> = ({ label, value, options, onChange }) => (
  <div className="space-y-2">
     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
     <select 
       value={value}
       onChange={(e) => onChange(e.target.value)}
       className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-black text-xs uppercase outline-none focus:border-primary transition-all cursor-pointer appearance-none"
     >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
     </select>
  </div>
);

export default MaterialLibrary;
