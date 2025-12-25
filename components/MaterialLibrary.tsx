
import React, { useState } from 'react';
import { Activity } from '../types';
import { ASSET_LIBRARY } from '../constants';
import { aiService } from '../services/aiService';

const AGE_GROUPS = ["2-4 Yaş", "5-7 Yaş", "8-12 Yaş", "Ergen", "Yetişkin"];
const GOALS = ["Artikülasyon", "Fonolojik Farkındalık", "Kelime Dağarcığı", "Akıcılık", "Sosyal İletişim", "Oral Motor"];
const VISUAL_STYLES = ["3D Yumuşak Kil (Clay)", "Profesyonel İllüstrasyon", "Foto-gerçekçi", "Suluboya", "Minimalist Vektör", "Gerçek Fotoğraf"];

const MaterialLibrary: React.FC<{ onAdd: (activity: Activity) => void }> = ({ onAdd }) => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  
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
    try {
      const metadata = await aiService.generateMaterial(factoryParams);
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
    } catch (error) {
      console.error("Material generation failed:", error);
      alert("Hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const confirmAddMaterial = () => {
    if (previewMaterial) {
      onAdd(previewMaterial);
      setPreviewMaterial(null);
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
                Clinical Production Engine v7.5
             </div>
             <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Materyal Fabrikası</h2>
             <p className="text-lg text-slate-500 font-medium tracking-tight max-w-xl italic">Kütüphaneden bir çalışma seçin veya AI ile yenisini üretin.</p>
          </div>
          
          <div className="flex bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar max-w-full">
             {['all', 'Game', 'Exercise', 'Cards', 'Protocol'].map(t => (
               <button 
                 key={t}
                 onClick={() => setFilter(t)}
                 className={`px-6 py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest shrink-0 ${filter === t ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 {t === 'all' ? 'TÜMÜ' : t === 'Game' ? 'OYUNLAR' : t === 'Exercise' ? 'EGZERSİZ' : t === 'Cards' ? 'KARTLAR' : 'PROTOKOLLER'}
               </button>
             ))}
          </div>
        </div>

        {/* AI FACTORY PANEL */}
        <div className="bg-white rounded-[64px] border border-slate-200 p-10 md:p-14 shadow-3xl relative overflow-hidden group">
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-8">
                 <div className="space-y-2">
                    <h4 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Yapılandırma Paneli</h4>
                    <p className="text-slate-500 font-medium italic">Materyal üretim algoritması için klinik girişleri belirleyin.</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FactorySelect label="Hedef Yaş Grubu" value={factoryParams.ageGroup} options={AGE_GROUPS} onChange={(v) => setFactoryParams({...factoryParams, ageGroup: v})} />
                    <FactorySelect label="Terapi Amacı" value={factoryParams.goal} options={GOALS} onChange={(v) => setFactoryParams({...factoryParams, goal: v})} />
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hedef Fonem</label>
                       <input className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold text-sm outline-none focus:border-primary transition-all" value={factoryParams.targetSound} onChange={(e) => setFactoryParams({...factoryParams, targetSound: e.target.value})} placeholder="Örn: R, S, K, Tr..." />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">İçerik Teması</label>
                       <input className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold text-sm outline-none focus:border-primary transition-all" value={factoryParams.theme} onChange={(e) => setFactoryParams({...factoryParams, theme: e.target.value})} placeholder="Örn: Korsanlar, Doğa, Robotlar..." />
                    </div>
                 </div>

                 <textarea className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-8 py-6 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-lg shadow-inner min-h-[120px] resize-none" placeholder="Özel bir kelime listesi veya senaryo ekleyebilirsiniz..." value={factoryParams.prompt} onChange={(e) => setFactoryParams({...factoryParams, prompt: e.target.value})} />
              </div>

              <div className="lg:col-span-4 flex flex-col gap-6">
                 <div className="bg-slate-50 p-8 rounded-[48px] border border-slate-100 space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Görsel Stil</h4>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto no-scrollbar">
                       {VISUAL_STYLES.map(style => (
                         <button key={style} onClick={() => setFactoryParams({...factoryParams, visualStyle: style})} className={`w-full text-left px-5 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-tight border-2 transition-all ${factoryParams.visualStyle === style ? 'bg-primary border-primary text-white' : 'bg-white border-slate-100 text-slate-400'}`}>{style}</button>
                       ))}
                    </div>
                 </div>
                 <button disabled={isAiGenerating} onClick={handleAiGenerate} className="w-full py-8 bg-slate-900 text-white rounded-[32px] font-black text-xl shadow-3xl hover:bg-black transition-all flex flex-col items-center justify-center gap-2 active:scale-95">
                   {isAiGenerating ? <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div> : <><span className="material-symbols-outlined text-4xl text-primary animate-pulse">auto_fix_high</span><span>Sihirli Üretim</span></>}
                 </button>
              </div>
           </div>
        </div>

        {/* BROWSE SECTION */}
        <div className="space-y-10">
           <div className="relative max-w-2xl">
              <span className="material-symbols-outlined absolute left-8 top-1/2 -translate-y-1/2 text-primary text-2xl">search_sparkle</span>
              <input className="w-full bg-white border-2 border-slate-100 rounded-[40px] pl-20 pr-8 py-7 text-xl focus:ring-8 focus:ring-primary/5 focus:border-primary outline-none transition-all shadow-xl font-bold italic" placeholder="Kütüphanede ara..." value={search} onChange={(e) => setSearch(e.target.value)} />
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {filtered.map(item => (
                <div key={item.id} className="bg-white rounded-[56px] border border-slate-100 overflow-hidden group hover:shadow-3xl hover:border-primary/20 transition-all flex flex-col relative cursor-pointer" onClick={() => setPreviewMaterial(item)}>
                   <div className="relative aspect-square overflow-hidden bg-slate-50">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={item.title} />
                      <div className="absolute top-8 left-8">
                         <span className="bg-white/95 backdrop-blur-md text-[9px] font-black uppercase px-4 py-2 rounded-2xl text-primary shadow-xl border border-primary/10">{item.type}</span>
                      </div>
                   </div>
                   <div className="p-10 flex-1 flex flex-col">
                      <h3 className="font-black text-slate-900 group-hover:text-primary transition-colors mb-4 text-2xl italic tracking-tighter leading-none uppercase">{item.title}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-10 font-medium italic">"{item.description}"</p>
                      <div className="mt-auto flex items-center justify-between">
                         <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 uppercase">{item.duration} DK</span>
                         <span className="material-symbols-outlined text-primary font-black opacity-0 group-hover:opacity-100 transition-opacity">visibility</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* DETAILED CONTENT MODAL (Aynı Modal Kütüphane İçin de Geçerli) */}
      {previewMaterial && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-10 bg-black/95 backdrop-blur-2xl animate-in fade-in zoom-in duration-300">
           <div className="bg-white w-full max-w-7xl h-[90vh] rounded-[64px] border-4 border-primary/20 flex flex-col shadow-3xl relative overflow-hidden">
              
              <div className="p-10 border-b border-slate-100 flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-8">
                    <div className="size-16 bg-primary text-white rounded-[24px] flex items-center justify-center shadow-xl">
                       <span className="material-symbols-outlined text-3xl font-black">clinical_notes</span>
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Materyal İçeriği</h3>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-1">Klinik Verileri İnceleyin</p>
                    </div>
                 </div>
                 <button onClick={() => setPreviewMaterial(null)} className="size-14 rounded-[24px] bg-slate-100 text-slate-400 hover:text-rose-500 transition-all flex items-center justify-center"><span className="material-symbols-outlined text-2xl font-black">close</span></button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 no-scrollbar">
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-4 space-y-10">
                       <img src={previewMaterial.image} className="w-full aspect-square rounded-[56px] object-cover shadow-2xl border-8 border-slate-50" alt="Preview" />
                       <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 space-y-6">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ödev Notları</h4>
                          <p className="text-sm font-medium text-slate-800 italic leading-relaxed">
                             {previewMaterial.content?.homeworkNotes || "Ödev notu tanımlanmamış."}
                          </p>
                       </div>
                    </div>

                    <div className="lg:col-span-8 space-y-12">
                       <div className="space-y-4">
                          <h3 className="text-5xl font-black text-slate-900 italic tracking-tighter uppercase">{previewMaterial.title}</h3>
                          <p className="text-xl text-slate-500 font-medium italic">{previewMaterial.description}</p>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                          <section className="space-y-6">
                             <div className="flex items-center gap-4 text-primary"><span className="material-symbols-outlined font-black">menu_book</span><h4 className="text-lg font-black uppercase italic">Terapist Yönergesi</h4></div>
                             <div className="space-y-4">
                                {previewMaterial.content?.instructions?.map((ins, i) => (
                                   <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                      <span className="size-6 bg-primary text-white text-[10px] font-black rounded-lg flex items-center justify-center shrink-0">{i+1}</span>
                                      <p className="text-sm text-slate-700 font-medium italic">{ins}</p>
                                   </div>
                                )) || <p className="text-slate-400 italic">Yönerge bulunamadı.</p>}
                             </div>
                          </section>

                          <section className="space-y-6">
                             <div className="flex items-center gap-4 text-emerald-600"><span className="material-symbols-outlined font-black">list_alt</span><h4 className="text-lg font-black uppercase italic">Çalışma Seti</h4></div>
                             <div className="bg-slate-900 rounded-[32px] p-8 shadow-2xl">
                                <div className="flex flex-wrap gap-2">
                                   {previewMaterial.content?.wordList?.map((word, i) => (
                                      <span key={i} className="px-4 py-2 bg-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest border border-white/5">{word}</span>
                                   )) || <span className="text-slate-500 text-xs italic">Kelime listesi yok.</span>}
                                </div>
                                {previewMaterial.content?.sentences && (
                                   <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                                      {previewMaterial.content.sentences.map((sent, i) => (
                                         <p key={i} className="text-xs text-slate-400 italic">"{sent}"</p>
                                      ))}
                                   </div>
                                )}
                             </div>
                          </section>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-10 bg-slate-900 border-t border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-6">
                    <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20"><span className="material-symbols-outlined text-2xl font-black">verified</span></div>
                    <div><div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hazır</div><div className="text-sm font-black text-white italic">Seans İçin Onaylandı</div></div>
                 </div>
                 <div className="flex gap-4">
                    <button onClick={() => setPreviewMaterial(null)} className="px-10 py-5 bg-white/5 text-white font-black rounded-2xl uppercase text-[11px] tracking-widest hover:bg-white/10 transition-all">Kapat</button>
                    <button onClick={confirmAddMaterial} className="px-16 py-5 bg-primary text-white font-black rounded-2xl shadow-3xl hover:bg-primary-dark transition-all hover:scale-105 active:scale-95 uppercase text-[11px] tracking-widest">Seans Akışına Ekle</button>
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
     <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-black text-xs uppercase outline-none focus:border-primary transition-all cursor-pointer">
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
     </select>
  </div>
);

export default MaterialLibrary;
