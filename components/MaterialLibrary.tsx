
import React, { useState } from 'react';
import { Activity } from '../types';
import { ASSET_LIBRARY } from '../constants';
import { GoogleGenAI, Type } from "@google/genai";

interface MaterialLibraryProps {
  onAdd: (activity: Activity) => void;
}

const QUICK_PROMPTS = [
  { label: "Çiftlik Hayvanları", prompt: "4 yaş grubu için çiftlik hayvanları temalı, hayvan sesleri içeren kelime dağarcığı geliştirme kartları seti oluştur." },
  { label: "Uzay Yolculuğu", prompt: "6 yaş grubu için /s/ ve /ş/ seslerini ayırt etmeye yönelik uzay temalı bir interaktif macera oyunu tasarla." },
  { label: "Günlük Rutinler", prompt: "Sabah hazırlığı ve okul rutini üzerine sıralama becerisini geliştiren bir egzersiz kurgula." }
];

const MaterialLibrary: React.FC<MaterialLibraryProps> = ({ onAdd }) => {
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
    if (!finalPrompt) return;
    setIsAiGenerating(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Dil konuşma terapisi için profesyonel bir materyal oluştur. Kullanıcı isteği: "${finalPrompt}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Materyal başlığı" },
              description: { type: Type.STRING, description: "Klinik açıklama ve kullanım amacı" },
              duration: { type: Type.NUMBER, description: "Tahmini süre (dakika)" },
              type: { type: Type.STRING, description: "Materyal türü (Oyun, Egzersiz, Kart)" },
              category: { type: Type.STRING, description: "Klinik kategori (Artikülasyon, Akıcılık vb.)" },
              image: { type: Type.STRING, description: "Konuyla ilgili Unsplash URL'si" }
            },
            required: ["title", "description", "duration", "type", "category"]
          }
        }
      });
      
      const newActivity = JSON.parse(response.text || '{}');
      newActivity.id = `ai-${Date.now()}`;
      newActivity.image = newActivity.image || "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=400";
      
      onAdd(newActivity as Activity);
    } catch (error) {
      console.error("AI Generation failed:", error);
      alert("AI materyal üretiminde bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsAiGenerating(false);
      setAiPrompt('');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight italic">Materyal Kütüphanesi</h2>
            <p className="text-base md:text-lg text-slate-500 font-medium tracking-tight">Flash 3.0 destekli akıllı materyal üretim merkezi.</p>
          </div>
          <div className="flex bg-white p-1 rounded-2xl border border-border shadow-sm overflow-x-auto whitespace-nowrap scrollbar-hide">
             {['all', 'Game', 'Exercise', 'Cards'].map(t => (
               <button 
                 key={t}
                 onClick={() => setFilter(t)}
                 className={`px-4 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all ${filter === t ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-slate-800'}`}
               >
                 {t === 'all' ? 'Tümü' : t === 'Game' ? 'Oyunlar' : t === 'Exercise' ? 'Egzersizler' : 'Kartlar'}
               </button>
             ))}
          </div>
        </div>

        {/* AI Generator Section */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 md:p-10 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
              <span className="material-symbols-outlined text-[240px]">bolt</span>
           </div>
           
           <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="size-12 bg-primary/20 text-primary rounded-2xl flex items-center justify-center border border-primary/20 shadow-lg">
                  <span className="material-symbols-outlined text-3xl italic animate-pulse">magic_button</span>
                </div>
                <div>
                   <h4 className="font-black text-white text-xl md:text-2xl italic tracking-tight uppercase">AI MATERYAL OLUŞTURUCU <span className="text-primary">v3 FLASH</span></h4>
                   <p className="text-slate-400 text-sm font-medium">Saniyeler içinde klinik standartlarda materyal tasarlayın.</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                 <input 
                   className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-500 focus:ring-4 focus:ring-primary/20 outline-none transition-all font-medium text-lg"
                   placeholder="Örn: 4 yaş için çiftlik hayvanları temalı kartlar..."
                   value={aiPrompt}
                   onChange={(e) => setAiPrompt(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
                 />
                 <button 
                   disabled={isAiGenerating}
                   onClick={() => handleAiGenerate()}
                   className={`bg-primary text-white px-10 py-4 rounded-2xl font-black shadow-2xl shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-3 active:scale-95 ${isAiGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                 >
                   {isAiGenerating ? <span className="animate-spin material-symbols-outlined">sync</span> : <span className="material-symbols-outlined">auto_fix</span>}
                   {isAiGenerating ? 'İşleniyor...' : 'Hemen Oluştur'}
                 </button>
              </div>

              {/* Quick Prompts Area */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">Hızlı Örnekler:</span>
                 {QUICK_PROMPTS.map((qp, i) => (
                   <button 
                     key={i}
                     onClick={() => { setAiPrompt(qp.prompt); handleAiGenerate(qp.prompt); }}
                     disabled={isAiGenerating}
                     className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-bold text-slate-300 transition-all active:scale-95"
                   >
                     {qp.label}
                   </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Existing Library Section */}
        <div className="space-y-6">
           <div className="relative group">
              <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
              <input 
                className="w-full bg-white border-2 border-slate-100 rounded-[32px] pl-16 pr-8 py-6 text-lg focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-xl shadow-slate-200/50 font-medium"
                placeholder="Kütüphanede ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20">
              {filtered.map(item => (
                <div key={item.id} className="bg-white rounded-[40px] border border-border overflow-hidden group hover:shadow-2xl hover:border-primary/30 transition-all flex flex-col relative">
                   <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" alt={item.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute top-5 left-5">
                         <span className="bg-white/90 backdrop-blur-md text-[10px] font-black uppercase px-3 py-1.5 rounded-xl text-primary shadow-xl border border-white/20">{item.type}</span>
                      </div>
                   </div>
                   <div className="p-8 flex-1 flex flex-col">
                      <h3 className="font-extrabold text-slate-900 group-hover:text-primary transition-colors mb-3 text-xl italic tracking-tight leading-tight">{item.title}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-8 font-medium">{item.description}</p>
                      <div className="mt-auto flex items-center justify-between">
                         <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            <span className="material-symbols-outlined text-[18px]">schedule</span>
                            {item.duration || 10} dk
                         </div>
                         <button 
                           onClick={() => onAdd(item)}
                           className="bg-slate-900 hover:bg-primary text-white size-12 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-90 group-hover:rotate-12"
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
