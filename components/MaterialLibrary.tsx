
import React, { useState } from 'react';
import { Activity, GenerationParams } from '../types';
import { ASSET_LIBRARY } from '../constants';
import { aiService } from '../services/aiService';

const AGE_GROUPS = ["2-4 Yaş (Erken Dönem)", "5-7 Yaş (Okul Öncesi)", "8-12 Yaş (Okul Çağı)", "Ergen", "Yetişkin"];
const TARGET_SOUNDS = ["R", "S", "K", "L", "Z", "Ş", "Ç", "T", "G"];
const POSITIONS = ["Başlangıç", "Orta", "Son", "Karışık"];
const THEMES = ["Uzay Macerası", "Korsanlar", "Süper Kahramanlar", "Doğa & Hayvanlar", "Okul Hayatı", "Günlük Yaşam", "Bilim Kurgu", "Fantastik"];
const VISUAL_STYLES = ["3D Yumuşak Kil (Clay)", "Profesyonel İllüstrasyon", "Foto-gerçekçi", "Suluboya", "Minimalist Vektör", "Pixel Art"];

const MaterialLibrary: React.FC<{ onAdd: (activity: Activity) => void }> = ({ onAdd }) => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'browse' | 'factory'>('browse');
  
  const [factoryParams, setFactoryParams] = useState<GenerationParams>({
    type: 'Flashcards',
    targetSound: 'R',
    position: 'Initial',
    ageGroup: '5-7 Yaş (Okul Öncesi)',
    theme: 'Uzay Macerası',
    difficulty: 'Medium',
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
    setPreviewMaterial(null);
    try {
      // Mapping frontend state to API params
      const apiParams: GenerationParams = {
        ...factoryParams,
        targetSound: factoryParams.targetSound, // Already string
      };

      const metadata = await aiService.generateMaterial(apiParams);
      
      const newMaterial: Activity = {
        id: `ai-${Date.now()}`,
        title: metadata.title,
        description: metadata.description,
        type: factoryParams.type,
        category: 'AI Generated',
        duration: 15,
        image: metadata.image,
        content: metadata.content,
        settings: {
          targetSoundPosition: factoryParams.position,
          difficulty: factoryParams.difficulty === 'Easy' ? 'Kolay' : factoryParams.difficulty === 'Medium' ? 'Orta' : 'Zor',
          notes: `AI tarafından ${factoryParams.targetSound} hedefiyle üretilmiştir.`
        },
        isAiGenerated: true,
        generatedDate: new Date().toLocaleDateString()
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
      setActiveTab('browse');
      alert("Materyal kütüphanenize ve aktif seans planına eklendi.");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] dark:bg-[#0B1120] p-6 md:p-10 no-scrollbar font-sans transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10">
                <span className="material-symbols-outlined text-[14px]">precision_manufacturing</span>
                Clinical Production Engine v9.0
             </div>
             <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase leading-none">İçerik Stüdyosu</h2>
             <p className="text-lg text-slate-500 dark:text-slate-400 font-medium tracking-tight max-w-xl italic">
                {activeTab === 'browse' ? 'Global kütüphaneden onaylı materyalleri seçin.' : 'Gemini 3.0 ile kişiselleştirilmiş klinik materyaller üretin.'}
             </p>
          </div>
          
          <div className="flex bg-white dark:bg-white/5 p-1.5 rounded-[24px] border border-slate-200 dark:border-white/5 shadow-sm">
             <button 
               onClick={() => setActiveTab('browse')}
               className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition-all tracking-widest ${activeTab === 'browse' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'}`}
             >
               Kütüphane
             </button>
             <button 
               onClick={() => setActiveTab('factory')}
               className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition-all tracking-widest ${activeTab === 'factory' ? 'bg-primary text-white shadow-xl' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'}`}
             >
               AI Fabrikası
             </button>
          </div>
        </div>

        {activeTab === 'factory' ? (
          /* AI FACTORY INTERFACE */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
             
             {/* Configuration Panel */}
             <div className="lg:col-span-8 space-y-8">
                <div className="bg-white dark:bg-[#111827] rounded-[48px] border border-slate-200 dark:border-white/5 p-12 shadow-2xl relative overflow-hidden">
                   {/* Background Tech Elements */}
                   <div className="absolute top-0 right-0 p-12 opacity-5 dark:opacity-[0.02] pointer-events-none">
                      <span className="material-symbols-outlined text-[200px]">psychology_alt</span>
                   </div>

                   <h3 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase mb-8 relative z-10">Üretim Parametreleri</h3>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                      <div className="space-y-6">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Aktivite Türü</label>
                            <div className="grid grid-cols-2 gap-3">
                               {['Flashcards', 'Story', 'MinimalPairs', 'General'].map(type => (
                                 <button 
                                   key={type}
                                   onClick={() => setFactoryParams({...factoryParams, type: type as any})}
                                   className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 transition-all ${factoryParams.type === type ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white' : 'border-slate-100 text-slate-400 hover:border-slate-300 dark:border-white/10 dark:text-slate-500'}`}
                                 >
                                    {type === 'MinimalPairs' ? 'Minimal Çift' : type === 'Flashcards' ? 'Kart Seti' : type === 'Story' ? 'Hikaye' : 'Genel'}
                                 </button>
                               ))}
                            </div>
                         </div>
                         
                         <FactorySelect 
                            label="Hedef Ses (Fonem)" 
                            value={factoryParams.targetSound} 
                            options={TARGET_SOUNDS} 
                            onChange={(v) => setFactoryParams({...factoryParams, targetSound: v})} 
                         />
                         
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Ses Pozisyonu</label>
                            <div className="flex bg-slate-50 dark:bg-white/5 p-1 rounded-xl">
                               {['Initial', 'Medial', 'Final'].map(pos => (
                                 <button 
                                   key={pos}
                                   onClick={() => setFactoryParams({...factoryParams, position: pos as any})}
                                   className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${factoryParams.position === pos ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400'}`}
                                 >
                                    {pos === 'Initial' ? 'Baş' : pos === 'Medial' ? 'Orta' : 'Son'}
                                 </button>
                               ))}
                            </div>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <FactorySelect 
                            label="Yaş Grubu" 
                            value={factoryParams.ageGroup} 
                            options={AGE_GROUPS} 
                            onChange={(v) => setFactoryParams({...factoryParams, ageGroup: v})} 
                         />
                         
                         <FactorySelect 
                            label="İçerik Teması" 
                            value={factoryParams.theme} 
                            options={THEMES} 
                            onChange={(v) => setFactoryParams({...factoryParams, theme: v})} 
                         />

                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Zorluk Seviyesi</label>
                            <input 
                              type="range" 
                              min="0" max="2" 
                              step="1"
                              value={factoryParams.difficulty === 'Easy' ? 0 : factoryParams.difficulty === 'Medium' ? 1 : 2}
                              onChange={(e) => {
                                 const val = parseInt(e.target.value);
                                 setFactoryParams({...factoryParams, difficulty: val === 0 ? 'Easy' : val === 1 ? 'Medium' : 'Hard'});
                              }}
                              className="w-full h-2 bg-slate-100 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase px-1">
                               <span>Kolay</span><span>Orta</span><span>Zor</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Style & Action Panel */}
             <div className="lg:col-span-4 flex flex-col gap-8">
                <div className="bg-slate-50 dark:bg-[#111827] rounded-[48px] border border-slate-200 dark:border-white/5 p-8 flex-1 flex flex-col">
                   <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6 ml-2">Görsel Stil Motoru</h3>
                   <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar max-h-[300px]">
                      {VISUAL_STYLES.map(style => (
                        <button 
                          key={style} 
                          onClick={() => setFactoryParams({...factoryParams, visualStyle: style})} 
                          className={`w-full text-left px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-wider border-2 transition-all flex items-center justify-between group ${factoryParams.visualStyle === style ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-white dark:bg-white/5 border-transparent text-slate-500 hover:bg-white hover:border-slate-200'}`}
                        >
                           {style}
                           {factoryParams.visualStyle === style && <span className="material-symbols-outlined text-sm">check</span>}
                        </button>
                      ))}
                   </div>
                </div>

                <button 
                  disabled={isAiGenerating} 
                  onClick={handleAiGenerate} 
                  className="w-full py-8 bg-gradient-to-r from-slate-900 to-black dark:from-white dark:to-slate-200 text-white dark:text-black rounded-[32px] font-black text-xl shadow-2xl hover:scale-[1.02] transition-all flex flex-col items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                   {isAiGenerating ? (
                      <div className="flex flex-col items-center gap-3">
                         <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                         <span className="text-[10px] uppercase tracking-widest animate-pulse">Sentezleniyor...</span>
                      </div>
                   ) : (
                      <>
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                        <span className="material-symbols-outlined text-4xl text-primary relative z-10 group-hover:rotate-12 transition-transform">auto_fix_high</span>
                        <span className="relative z-10">Materyal Üret</span>
                      </>
                   )}
                </button>
             </div>

             {/* PREVIEW MODAL */}
             {previewMaterial && (
               <div className="col-span-12 mt-12 animate-in slide-in-from-bottom-12 duration-1000">
                  <div className="bg-white dark:bg-[#111827] rounded-[56px] border-4 border-primary/20 p-12 shadow-3xl relative">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl">
                        AI Önizleme Modu
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                        <div className="md:col-span-4 space-y-8">
                           <div className="aspect-square rounded-[40px] overflow-hidden shadow-2xl border-8 border-slate-50 dark:border-white/5 relative group">
                              <img src={previewMaterial.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Generated" />
                              <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md rounded-2xl p-4 text-center">
                                 <div className="text-[9px] font-black text-white/60 uppercase tracking-widest">Tema</div>
                                 <div className="text-white font-bold italic">{factoryParams.theme}</div>
                              </div>
                           </div>
                           <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[32px] space-y-4">
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Klinik Hedefler</h4>
                              <div className="flex flex-wrap gap-2">
                                 <span className="px-3 py-1 bg-white dark:bg-black/20 rounded-lg text-[10px] font-bold text-primary border border-primary/10">/{factoryParams.targetSound}/ Sesi</span>
                                 <span className="px-3 py-1 bg-white dark:bg-black/20 rounded-lg text-[10px] font-bold text-slate-500">{factoryParams.position} Pozisyon</span>
                                 <span className="px-3 py-1 bg-white dark:bg-black/20 rounded-lg text-[10px] font-bold text-slate-500">{factoryParams.ageGroup}</span>
                              </div>
                           </div>
                        </div>
                        
                        <div className="md:col-span-8 flex flex-col">
                           <h3 className="text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase mb-4">{previewMaterial.title}</h3>
                           <p className="text-lg text-slate-500 dark:text-slate-400 font-medium italic mb-10">"{previewMaterial.description}"</p>
                           
                           <div className="flex-1 bg-slate-50 dark:bg-black/20 rounded-[40px] p-8 overflow-y-auto max-h-[400px] mb-8 space-y-6">
                              {/* Dynamic Content Display based on Type */}
                              {previewMaterial.type === 'Flashcards' && (
                                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {previewMaterial.content?.wordList?.map((word, i) => (
                                       <div key={i} className="bg-white dark:bg-[#1F2937] p-4 rounded-2xl text-center shadow-sm border border-slate-100 dark:border-white/5">
                                          <div className="text-lg font-black text-slate-800 dark:text-white">{word}</div>
                                       </div>
                                    ))}
                                 </div>
                              )}
                              
                              {previewMaterial.type === 'Story' && (
                                 <div className="prose prose-slate dark:prose-invert max-w-none">
                                    <p className="whitespace-pre-wrap text-lg leading-relaxed font-medium">{previewMaterial.content?.storyText}</p>
                                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10">
                                        <h5 className="font-black uppercase text-xs mb-4 text-slate-400">Anlama Soruları</h5>
                                        <ul className="space-y-3">
                                            {previewMaterial.content?.clozeQuestions?.map((q, i) => (
                                                <li key={i} className="bg-white dark:bg-white/5 p-4 rounded-xl text-sm font-medium">
                                                    {q.sentence.replace('___', `[${q.answer}]`)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                 </div>
                              )}

                              {previewMaterial.type === 'MinimalPairs' && (
                                 <div className="space-y-3">
                                    {previewMaterial.content?.minimalPairs?.map((pair, i) => (
                                       <div key={i} className="flex items-center justify-between bg-white dark:bg-white/5 p-4 rounded-2xl">
                                          <span className="text-xl font-black text-emerald-500">{pair.target}</span>
                                          <span className="material-symbols-outlined text-slate-300">compare_arrows</span>
                                          <span className="text-xl font-black text-rose-500">{pair.foil}</span>
                                       </div>
                                    ))}
                                 </div>
                              )}

                              {/* Common Instructions */}
                              {previewMaterial.content?.instructions && (
                                 <div className="space-y-2 mt-6">
                                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yönerge</h5>
                                    {previewMaterial.content.instructions.map((ins, i) => (
                                       <p key={i} className="text-sm text-slate-600 dark:text-slate-300 italic">• {ins}</p>
                                    ))}
                                 </div>
                              )}
                           </div>

                           <div className="flex justify-end gap-4">
                              <button onClick={() => setPreviewMaterial(null)} className="px-8 py-4 bg-transparent text-slate-400 font-bold uppercase text-[11px] tracking-widest hover:text-rose-500 transition-colors">İptal Et</button>
                              <button onClick={confirmAddMaterial} className="px-10 py-4 bg-emerald-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/30 hover:bg-emerald-600 transition-all uppercase text-[11px] tracking-widest flex items-center gap-3">
                                 <span className="material-symbols-outlined">add_circle</span>
                                 Kütüphaneye Ekle
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
             )}
          </div>
        ) : (
          /* BROWSE INTERFACE (Existing) */
          <div className="space-y-10 animate-in fade-in duration-500">
             <div className="relative max-w-2xl">
                <span className="material-symbols-outlined absolute left-8 top-1/2 -translate-y-1/2 text-primary text-2xl">search_sparkle</span>
                <input className="w-full bg-white dark:bg-[#111827] border-2 border-slate-100 dark:border-white/5 rounded-[40px] pl-20 pr-8 py-7 text-xl focus:ring-8 focus:ring-primary/5 focus:border-primary outline-none transition-all shadow-xl dark:shadow-none font-bold italic" placeholder="Kütüphanede ara..." value={search} onChange={(e) => setSearch(e.target.value)} />
             </div>

             <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                 {['all', 'Game', 'Exercise', 'Cards'].map(t => (
                   <button 
                     key={t}
                     onClick={() => setFilter(t)}
                     className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition-all tracking-widest whitespace-nowrap ${filter === t ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-white dark:bg-white/5 text-slate-400'}`}
                   >
                     {t === 'all' ? 'TÜMÜ' : t === 'Game' ? 'OYUNLAR' : t === 'Exercise' ? 'EGZERSİZ' : 'KARTLAR'}
                   </button>
                 ))}
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {filtered.map(item => (
                  <div key={item.id} className="bg-white dark:bg-[#111827] rounded-[56px] border border-slate-100 dark:border-white/5 overflow-hidden group hover:shadow-3xl hover:border-primary/20 transition-all flex flex-col relative cursor-pointer" onClick={() => onAdd(item)}>
                     <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-white/5">
                        <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={item.title} />
                        <div className="absolute top-8 left-8">
                           <span className="bg-white/95 backdrop-blur-md text-[9px] font-black uppercase px-4 py-2 rounded-2xl text-primary shadow-xl border border-primary/10">{item.type}</span>
                        </div>
                     </div>
                     <div className="p-10 flex-1 flex flex-col">
                        <h3 className="font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors mb-4 text-2xl italic tracking-tighter leading-none uppercase">{item.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-10 font-medium italic">"{item.description}"</p>
                        <div className="mt-auto flex items-center justify-between">
                           <span className="text-[10px] font-black text-slate-400 bg-slate-50 dark:bg-white/5 px-4 py-2 rounded-xl border border-slate-100 dark:border-white/5 uppercase">{item.duration} DK</span>
                           <span className="material-symbols-outlined text-primary font-black opacity-0 group-hover:opacity-100 transition-opacity">add_circle</span>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FactorySelect: React.FC<{ label: string, value: string, options: string[], onChange: (v: string) => void }> = ({ label, value, options, onChange }) => (
  <div className="space-y-2">
     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{label}</label>
     <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-slate-50 dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 rounded-2xl px-6 py-4 text-slate-900 dark:text-white font-black text-xs uppercase outline-none focus:border-primary transition-all cursor-pointer appearance-none">
           {options.map(opt => <option key={opt} value={opt} className="bg-white dark:bg-[#111827]">{opt}</option>)}
        </select>
        <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
     </div>
  </div>
);

export default MaterialLibrary;
