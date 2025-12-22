
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

interface Paper {
  title: string;
  uri: string;
  snippet?: string;
}

const AcademicLibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'papers' | 'videos'>('papers');
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [aiResults, setAiResults] = useState<Paper[]>([]);

  const handleAiSearch = async () => {
    if (!search.trim()) return;
    setIsSearching(true);
    setAiResults([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview", // Güncellendi: Daha hızlı özetleme ve arama sentezi
        contents: `"${search}" konusuyla ilgili en güncel dil ve konuşma terapisi makalelerini, klinik çalışmaları ve akademik kaynakları bul ve profesyonelce listele.`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const papers: Paper[] = chunks.map((chunk: any) => ({
        title: chunk.web?.title || "Akademik Kaynak",
        uri: chunk.web?.uri || "#",
      })).filter((p: Paper) => p.uri !== "#");

      setAiResults(papers);
    } catch (error) {
      console.error("Academic search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
             <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Akademik_Egitim_Merkezi</h2>
             <p className="text-slate-500 font-medium">Gemini 3 Flash ve Google Search ile anlık akademik tarama.</p>
          </div>
          <div className="flex bg-white p-1 rounded-2xl border border-border shadow-sm">
             <button 
               onClick={() => setActiveTab('papers')}
               className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'papers' ? 'bg-primary text-white shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}
             >
               Makaleler
             </button>
             <button 
               onClick={() => setActiveTab('videos')}
               className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'videos' ? 'bg-primary text-white shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}
             >
               Eğitim Videoları
             </button>
          </div>
        </div>

        <div className="relative group">
           <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-primary animate-pulse">search_sparkle</span>
           <input 
             className="w-full bg-white border-2 border-primary/10 rounded-[32px] pl-16 pr-40 py-6 text-lg focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-xl shadow-primary/5 font-medium"
             placeholder="Örn: 'Otizmde alternatif iletişim yöntemleri'..."
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
           />
           <button 
             onClick={handleAiSearch}
             disabled={isSearching}
             className="absolute right-3 top-3 bottom-3 px-10 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all disabled:opacity-50 shadow-lg"
           >
             {isSearching ? 'Tarama Yapılıyor...' : 'AI Literatür Taraması'}
           </button>
        </div>

        {aiResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
             {aiResults.map((paper, idx) => (
               <a 
                 key={idx} 
                 href={paper.uri} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="bg-white p-8 rounded-[40px] border border-border hover:border-primary hover:shadow-2xl transition-all group relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                     <span className="material-symbols-outlined text-8xl">article</span>
                  </div>
                  <div className="flex items-start justify-between gap-4 relative z-10">
                     <div className="space-y-3">
                        <div className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-1 rounded inline-block">Akademik Yayın</div>
                        <h3 className="font-extrabold text-slate-800 group-hover:text-primary transition-colors leading-tight text-lg italic tracking-tight">{paper.title}</h3>
                        <p className="text-[10px] text-slate-400 font-mono truncate max-w-xs">{paper.uri}</p>
                     </div>
                     <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors translate-x-1 group-hover:translate-x-0">open_in_new</span>
                  </div>
               </a>
             ))}
          </div>
        )}

        {!isSearching && aiResults.length === 0 && (
          <div className="bg-slate-900 rounded-[48px] p-16 text-white relative overflow-hidden shadow-2xl">
             <span className="material-symbols-outlined absolute -bottom-20 -right-20 text-[340px] text-white/5 -rotate-12">school</span>
             <div className="relative z-10 max-w-2xl space-y-6">
                <h3 className="text-4xl font-black tracking-tight italic">Günü Yakalayın, Bilimi Takip Edin.</h3>
                <p className="text-slate-400 text-xl font-medium leading-relaxed">Gemini 3 Flash teknolojisi, saniyeler içinde binlerce akademik yayını tarar ve vakanız için en uygun klinik yaklaşımları karşınıza getirir.</p>
                <div className="flex gap-4 pt-4">
                   <div className="px-5 py-2.5 bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10">#Nörofizyoloji</div>
                   <div className="px-5 py-2.5 bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10">#Klinik_Kanit</div>
                   <div className="px-5 py-2.5 bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10">#v3_Flash</div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademicLibrary;
