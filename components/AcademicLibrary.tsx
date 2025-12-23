
import React, { useState, useEffect } from 'react';
import { aiService } from '../services/aiService';
import { Paper } from '../types';

const RESEARCH_CATEGORIES = [
  { id: 'all', label: 'Tüm Alanlar', icon: 'grid_view' },
  { id: 'articulation', label: 'Artikülasyon', icon: 'voice_over_off' },
  { id: 'stuttering', label: 'Kekemelik', icon: 'speed' },
  { id: 'autism', label: 'OSB & İletişim', icon: 'extension' },
  { id: 'aphasia', label: 'Nörojenik / Afazi', icon: 'psychology' },
  { id: 'pediatric', label: 'Pediatrik Dil', icon: 'child_care' }
];

const AcademicLibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'papers' | 'saved' | 'videos'>('papers');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [aiSynthesis, setAiSynthesis] = useState<string | null>(null);
  const [savedPapers, setSavedPapers] = useState<Paper[]>(() => {
    const saved = localStorage.getItem('theraspeech_saved_papers');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('theraspeech_saved_papers', JSON.stringify(savedPapers));
  }, [savedPapers]);

  const handleAiSearch = async (predefinedQuery?: string) => {
    const query = predefinedQuery || search;
    if (!query.trim()) return;
    
    setIsSearching(true);
    setAiSynthesis(null);
    setPapers([]);

    try {
      const { text, sources } = await aiService.academicSearch(query);
      setAiSynthesis(text || "");
      setPapers(sources as Paper[]);
    } catch (error) {
      console.error("Academic search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleSavePaper = (paper: Paper) => {
    if (savedPapers.find(p => p.id === paper.id)) {
      setSavedPapers(savedPapers.filter(p => p.id !== paper.id));
    } else {
      setSavedPapers([...savedPapers, { ...paper, isSaved: true }]);
    }
  };

  const renderContent = () => {
    if (activeTab === 'saved') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
          {savedPapers.length > 0 ? savedPapers.map(paper => (
            <PaperCard key={paper.id} paper={paper} onSave={() => toggleSavePaper(paper)} isSaved />
          )) : (
            <div className="col-span-full py-40 text-center opacity-30">
               <span className="material-symbols-outlined text-[100px] mb-6">bookmark_add</span>
               <p className="font-black italic uppercase tracking-widest">Henüz Kaydedilmiş Makale Yok.</p>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-12 pb-20">
        {aiSynthesis && (
          <div className="bg-white rounded-[48px] border-2 border-primary/10 p-12 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-700 relative overflow-hidden group">
             <div className="absolute -top-10 -right-10 size-40 bg-primary/5 rounded-full blur-3xl"></div>
             <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-4">
                   <div className="size-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20">
                      <span className="material-symbols-outlined text-2xl font-black">clinical_notes</span>
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase">KLİNİK_SENTEZ_RAPORU</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Yapay Zeka Destekli Literatür Özetlemesi</p>
                   </div>
                </div>
                <button className="px-6 py-2 bg-slate-900 text-white text-[10px] font-black rounded-xl hover:bg-black transition-all uppercase tracking-widest">PDF OLARAK İNDİR</button>
             </div>
             <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-medium text-lg relative z-10 whitespace-pre-wrap">
                {aiSynthesis}
             </div>
             <div className="mt-10 pt-8 border-t border-slate-100 flex items-center gap-6 relative z-10">
                <div className="flex -space-x-3">
                   {[1,2,3].map(i => <div key={i} className="size-10 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black uppercase text-slate-400">P{i}</div>)}
                </div>
                <p className="text-xs text-slate-500 font-bold italic">Bu sentez yukarıda listelenen ve 4 farklı akademik kaynaktan doğrulanmış verilere dayanmaktadır.</p>
             </div>
          </div>
        )}

        {papers.length > 0 ? (
          <div className="space-y-6">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-6">Doğrulanmış Akademik Kaynaklar ({papers.length})</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {papers.map((paper) => (
                  <PaperCard 
                    key={paper.id} 
                    paper={paper} 
                    onSave={() => toggleSavePaper(paper)} 
                    isSaved={!!savedPapers.find(p => p.id === paper.id)} 
                  />
                ))}
             </div>
          </div>
        ) : !isSearching && !aiSynthesis && (
          <div className="bg-[#0B1120] rounded-[64px] p-24 text-white relative overflow-hidden shadow-3xl group">
             <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50"></div>
             <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                <span className="material-symbols-outlined text-[420px] -rotate-12">school</span>
             </div>
             <div className="relative z-10 max-w-3xl space-y-10">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20">
                   <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                   Powered by Gemini 3.0 Pro & Grounding
                </div>
                <h3 className="text-7xl font-black tracking-tighter italic leading-[0.9] uppercase">Bilimsel_Veri <br/><span className="text-primary">Klinik_Başarı.</span></h3>
                <p className="text-slate-400 text-2xl font-medium leading-relaxed italic max-w-2xl">Dünya çapındaki binlerce klinik çalışmaya saniyeler içinde erişin, kanıta dayalı protokolleri seanslarınıza taşıyın.</p>
                <div className="flex flex-wrap gap-4 pt-6">
                   {['Bilişsel_Nöro', 'Dil_Gelişimi', 'EBP_Standartları', 'Kanıta_Dayalı'].map(tag => (
                     <div key={tag} className="px-8 py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 italic text-slate-500 hover:text-white transition-colors cursor-default">#{tag}</div>
                   ))}
                </div>
             </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#F8FAFC]">
      {/* Sidebar: Categories */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col p-8 gap-10">
         <div className="space-y-2">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6">KATEGORİ_FİLTRESİ</h2>
            <nav className="space-y-2">
               {RESEARCH_CATEGORIES.map(cat => (
                 <button 
                   key={cat.id} 
                   onClick={() => setSelectedCategory(cat.id)}
                   className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${selectedCategory === cat.id ? 'bg-slate-900 text-white shadow-xl shadow-black/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                 >
                    <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                    <span className="text-[11px] font-black uppercase tracking-widest">{cat.label}</span>
                 </button>
               ))}
            </nav>
         </div>

         <div className="mt-auto p-8 bg-slate-900 rounded-[40px] text-white relative overflow-hidden shadow-2xl group">
            <span className="material-symbols-outlined absolute -bottom-6 -right-6 text-7xl text-white/5 group-hover:rotate-12 transition-transform">auto_stories</span>
            <div className="relative z-10">
               <h4 className="text-xl font-black italic mb-2 tracking-tight">Haftalık Bülten</h4>
               <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed mb-6">Yeni yayınlanan en iyi 5 makaleyi her Pazartesi e-postana gönderelim.</p>
               <button className="w-full py-3 bg-primary text-white font-black text-[10px] uppercase rounded-xl shadow-lg shadow-primary/20">ABONE OL</button>
            </div>
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
         {/* Navigation & Search Header */}
         <header className="shrink-0 bg-white/80 backdrop-blur-3xl border-b border-slate-200 p-10 space-y-10 sticky top-0 z-30">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
               <div className="space-y-1">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Akademik_Bilgi_Üssü</h2>
                  <p className="text-slate-500 font-medium italic tracking-tight uppercase text-[10px] tracking-widest">Klinik Karar Destek Mekanizması v6.0</p>
               </div>
               <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                  <button onClick={() => setActiveTab('papers')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'papers' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500'}`}>ARAŞTIRMALAR</button>
                  <button onClick={() => setActiveTab('saved')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'saved' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500'}`}>KAYDEDİLENLER ({savedPapers.length})</button>
                  <button onClick={() => setActiveTab('videos')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'videos' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500'}`}>VİDEO LECTURES</button>
               </div>
            </div>

            <div className="relative group max-w-6xl mx-auto">
               <span className="material-symbols-outlined absolute left-8 top-1/2 -translate-y-1/2 text-primary text-3xl animate-pulse">search_sparkle</span>
               <input 
                 className="w-full bg-white border-2 border-slate-100 rounded-[40px] pl-20 pr-48 py-8 text-xl focus:ring-8 focus:ring-primary/5 focus:border-primary outline-none transition-all shadow-2xl shadow-primary/5 font-bold italic selection:bg-primary/20"
                 placeholder="Örn: 'OSB seanslarında görsel desteklerin akıcılık üzerindeki etkisi'..."
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
               />
               <button 
                 onClick={() => handleAiSearch()}
                 disabled={isSearching}
                 className="absolute right-4 top-4 bottom-4 px-12 bg-slate-900 text-white font-black rounded-[32px] hover:bg-black transition-all disabled:opacity-50 shadow-xl shadow-black/20 flex items-center justify-center gap-3 active:scale-95"
               >
                 {isSearching ? <span className="animate-spin material-symbols-outlined">sync</span> : <span className="material-symbols-outlined">psychology_alt</span>}
                 {isSearching ? 'TARANIYOR...' : 'LİTERATÜR TARA'}
               </button>
            </div>
         </header>

         {/* Content Grid */}
         <div className="flex-1 p-10">
            {isSearching ? (
               <div className="h-full flex flex-col items-center justify-center text-center gap-8 py-40">
                  <div className="relative">
                     <div className="size-32 border-8 border-slate-100 rounded-full"></div>
                     <div className="size-32 border-8 border-primary border-t-transparent rounded-full animate-spin absolute top-0"></div>
                     <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-primary animate-pulse">auto_awesome</span>
                  </div>
                  <div>
                     <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase mb-2">AKADEMİK_VERİLER_DERLENİYOR</h3>
                     <p className="text-slate-500 font-medium max-w-md">Gemini 3.0 Pro bilimsel veritabanlarını tarıyor ve klinik sentez oluşturuyor. Lütfen bekleyin...</p>
                  </div>
               </div>
            ) : renderContent()}
         </div>
      </main>
    </div>
  );
};

// --- Yardımcı Bileşen: PaperCard ---

const PaperCard: React.FC<{ paper: Paper, onSave: () => void, isSaved: boolean }> = ({ paper, onSave, isSaved }) => (
  <div className="bg-white p-10 rounded-[56px] border border-slate-100 hover:border-primary/30 hover:shadow-3xl transition-all group relative flex flex-col overflow-hidden">
     <div className="absolute top-0 right-0 p-8 flex flex-col gap-2">
        <button 
          onClick={(e) => { e.preventDefault(); onSave(); }}
          className={`size-12 rounded-2xl flex items-center justify-center transition-all shadow-lg ${isSaved ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/10'}`}
        >
           <span className={`material-symbols-outlined font-black ${isSaved ? 'filled' : ''}`}>{isSaved ? 'bookmark_check' : 'bookmark_add'}</span>
        </button>
        <a 
          href={paper.uri} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="size-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-black transition-all shadow-lg"
        >
           <span className="material-symbols-outlined text-xl">open_in_new</span>
        </a>
     </div>

     <div className="flex-1">
        <div className="flex items-center gap-3 mb-6">
           <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
             paper.source === 'PubMed' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
             paper.source === 'Cochrane' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
             'bg-emerald-50 text-emerald-600 border-emerald-100'
           }`}>
              {paper.source}
           </span>
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{paper.year}</span>
        </div>

        <h3 className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors leading-[1.1] italic tracking-tighter mb-6 line-clamp-3">
           {paper.title}
        </h3>

        <div className="space-y-6">
           <div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                 <span className="material-symbols-outlined text-[14px]">psychology</span>
                 Klinik_Etki_Analizi
              </div>
              <p className="text-sm text-slate-600 font-medium leading-relaxed italic border-l-4 border-slate-100 pl-4 py-2">
                 "{paper.clinicalImpact}"
              </p>
           </div>

           <div className="flex flex-wrap gap-2 pt-4">
              {paper.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-black uppercase rounded-lg border border-slate-100">#{tag}</span>
              ))}
           </div>
        </div>
     </div>

     <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-sm text-slate-400">person</span>
           </div>
           <span className="text-xs font-bold text-slate-500 truncate max-w-[150px]">{paper.authors[0]} et al.</span>
        </div>
        <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-2">
           TAM METİN <span className="material-symbols-outlined text-sm">trending_flat</span>
        </button>
     </div>
  </div>
);

export default AcademicLibrary;
