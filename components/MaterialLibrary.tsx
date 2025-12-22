
import React, { useState } from 'react';
import { Activity } from '../types';
import { ASSET_LIBRARY } from '../constants';
import { GoogleGenAI, Type } from "@google/genai";

interface MaterialLibraryProps {
  onAdd: (activity: Activity) => void;
}

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

  const handleAiGenerate = async () => {
    if (!aiPrompt) return;
    setIsAiGenerating(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', // Güncellendi: Daha hızlı materyal üretimi
        contents: `Dil konuşma terapisi için profesyonel bir materyal oluştur. Kullanıcı isteği: "${aiPrompt}"`,
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
            <p className="text-base md:text-lg text-slate-500 font-medium">Flash 3.0 destekli akıllı materyal üretim merkezi.</p>
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

        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 md:p-6 rounded-[32px] border border-primary/20 flex flex-col md:flex-row items-center gap-4 relative overflow-hidden group">
           <div className="hidden md:block absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
              <span className="material-symbols-outlined text-[120px]">bolt</span>
           </div>
           <div className="size-14 bg-white rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 relative z-10">
              <span className="material-symbols-outlined text-primary text-3xl italic">magic_button</span>
           </div>
           <div className="flex-1 relative z-10 w-full">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-slate-800 text-sm md:text-base italic">AI MATERYAL OLUŞTURUCU (v3 FLASH)</h4>
                <span className="px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black uppercase rounded animate-pulse">Ultra Hızlı</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                 <input 
                   className="flex-1 bg-white border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none shadow-sm font-medium"
                   placeholder="Örn: 4 yaş için hayali bir uzay yolculuğu temalı /s/ sesi egzersizi..."
                   value={aiPrompt}
                   onChange={(e) => setAiPrompt(e.target.value)}
                 />
                 <button 
                   disabled={isAiGenerating}
                   onClick={handleAiGenerate}
                   className={`bg-slate-900 text-white px-6 py-3 rounded-xl font-black shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2 ${isAiGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                 >
                   {isAiGenerating ? <span className="animate-spin material-symbols-outlined">sync</span> : <span className="material-symbols-outlined">bolt</span>}
                   {isAiGenerating ? 'İşleniyor...' : 'Saniyeler İçinde Oluştur'}
                 </button>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input 
                className="w-full bg-white border border-border rounded-2xl pl-12 pr-6 py-4 text-base md:text-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm font-medium"
                placeholder="Materyal ismine göre ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
              {filtered.map(item => (
                <div key={item.id} className="bg-white rounded-[32px] border border-border overflow-hidden group hover:shadow-2xl hover:border-primary/20 transition-all flex flex-col">
                   <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                      <div className="absolute top-4 left-4">
                         <span className="bg-white/90 backdrop-blur-md text-[10px] font-black uppercase px-2 py-1 rounded-lg text-primary shadow-sm border border-white/20">{item.type}</span>
                      </div>
                   </div>
                   <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-extrabold text-slate-900 group-hover:text-primary transition-colors mb-2 text-lg italic tracking-tight">{item.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-6 font-medium">{item.description}</p>
                      <div className="mt-auto flex items-center justify-between">
                         <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                            <span className="material-symbols-outlined text-[16px]">timer</span>
                            {item.duration} dk
                         </div>
                         <button 
                           onClick={() => onAdd(item)}
                           className="bg-slate-50 hover:bg-primary hover:text-white text-slate-600 size-10 rounded-xl flex items-center justify-center transition-all border border-border active:scale-90"
                         >
                            <span className="material-symbols-outlined">add</span>
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
