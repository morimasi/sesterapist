
import React, { useState } from 'react';
import { aiService } from '../services/aiService';

interface Paper {
  title: string;
  uri: string;
}

const AcademicLibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'papers' | 'videos'>('papers');
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Paper[]>([]);
  const [summary, setSummary] = useState<string | null>(null);

  const handleAiSearch = async () => {
    if (!search.trim()) return;
    setIsSearching(true);
    setResults([]);
    setSummary(null);

    try {
      const { text, sources } = await aiService.academicSearch(search);
      setSummary(text || "");
      setResults(sources);
    } catch (error) {
      console.error("Academic search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-10 no-scrollbar">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3">
             <h2 className="text-5xl font-black text-slate-900 tracking-tight italic uppercase">Akademik_Bilgi_Üssü</h2>
             <p className="text-lg text-slate-500 font-medium italic tracking-tight">Klinik kararlarınızı bilimsel verilerle destekleyin.</p>
          </div>
          <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
             <button onClick={() => setActiveTab('papers')} className={`px-8 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'papers' ? 'bg-primary text-white shadow-xl' : 'text-slate-400'}`}>MAKALELER</button>
             <button onClick={() => setActiveTab('videos')} className={`px-8 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'videos' ? 'bg-primary text-white shadow-xl' : 'text-slate-400'}`}>VİDEOLAR</button>
          </div>
        </div>

        <div className="relative group max-w-5xl mx-auto">
           <span className="material-symbols-outlined absolute left-8 top-1/2 -translate-y-1/2 text-primary text-3xl animate-pulse">search_sparkle</span>
           <input 
             className="w-full bg-white border-none rounded-[40px] pl-20 pr-48 py-8 text-xl focus:ring-8 focus:ring-primary/10 outline-none transition-all shadow-2xl shadow-primary/5 font-bold italic"
             placeholder="Örn: 'Otizm spektrum bozukluğunda PECS kullanımı'..."
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
           />
           <button 
             onClick={handleAiSearch}
             disabled={isSearching}
             className="absolute right-4 top-4 bottom-4 px-12 bg-slate-950 text-white font-black rounded-[32px] hover:bg-black transition-all disabled:opacity-50 shadow-xl"
           >
             {isSearching ? 'TARANIYOR...' : 'LİTERATÜR TARA'}
           </button>
        </div>

        {summary && (
          <div className="bg-white rounded-[48px] border border-slate-100 p-12 shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
             <div className="flex items-center gap-3 mb-8">
                <div className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                   <span className="material-symbols-outlined">summarize</span>
                </div>
                <h3 className="text-xl font-black italic">AI_Özet_Analizi</h3>
             </div>
             <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-medium">
                {summary}
             </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-6">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">Doğrulanmış Kaynaklar ({results.length})</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                {results.map((paper, idx) => (
                  <a 
                    key={idx} 
                    href={paper.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white p-8 rounded-[40px] border border-slate-100 hover:border-primary hover:shadow-2xl transition-all group flex items-start gap-6 relative overflow-hidden"
                  >
                     <div className="size-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-3xl">article</span>
                     </div>
                     <div className="space-y-3 relative z-10 flex-1 min-w-0">
                        <h3 className="font-black text-slate-800 group-hover:text-primary transition-colors leading-tight text-xl italic tracking-tight line-clamp-2">{paper.title}</h3>
                        <p className="text-[10px] text-slate-400 font-mono truncate">{paper.uri}</p>
                     </div>
                     <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-all translate-x-1 group-hover:translate-x-0">open_in_new</span>
                  </a>
                ))}
             </div>
          </div>
        )}

        {!isSearching && results.length === 0 && !summary && (
          <div className="bg-slate-950 rounded-[56px] p-20 text-white relative overflow-hidden shadow-3xl">
             <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
                <span className="material-symbols-outlined text-[380px] -rotate-12">school</span>
             </div>
             <div className="relative z-10 max-w-3xl space-y-8">
                <h3 className="text-6xl font-black tracking-tighter italic leading-none">Bilimin <span className="text-primary">Işığında</span> Terapi.</h3>
                <p className="text-slate-400 text-2xl font-medium leading-relaxed italic">Dünya çapındaki binlerce klinik çalışmaya saniyeler içinde erişin, en güncel protokolleri seanslarınıza taşıyın.</p>
                <div className="flex gap-4 pt-6">
                   {['Bilişsel_Nöro', 'Dil_Gelişimi', 'Kanıta_Dayalı'].map(tag => (
                     <div key={tag} className="px-6 py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 italic">#{tag}</div>
                   ))}
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademicLibrary;
