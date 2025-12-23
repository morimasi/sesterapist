
import React, { useState } from 'react';
import { aiService } from '../services/aiService';

const AIAssessment: React.FC = () => {
  const [notes, setNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    if (!notes.trim()) return;
    setIsAnalyzing(true);
    setReport(null);
    setError(null);

    try {
      const result = await aiService.analyzeClinicalCase(notes);
      setReport(result || "Analiz sonuçlandırılamadı.");
    } catch (err: any) {
      setError("AI analizi sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 border border-indigo-200">
                <span className="material-symbols-outlined text-[14px] animate-pulse">bolt</span>
                Thinking Engine: Gemini 3 Flash
             </div>
             <h2 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">Klinik_Analiz_Merkezi</h2>
             <p className="text-slate-500 font-medium">Gemini 3 Flash ile yüksek hızlı vaka muhakemesi.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
             <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm h-full flex flex-col group">
                <div className="flex items-center gap-3 mb-6 text-primary">
                  <span className="material-symbols-outlined text-3xl">edit_note</span>
                  <span className="text-sm font-black uppercase tracking-widest">Seans Gözlemleri</span>
                </div>
                <textarea 
                  className="flex-1 w-full bg-slate-50 border-2 border-slate-100 rounded-[32px] p-8 text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none resize-none mb-8 min-h-[400px] transition-all"
                  placeholder="Danışanın artikülasyon hatalarını, motivasyon durumunu ve uygulama sonuçlarını buraya yazın..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
                <button 
                  disabled={isAnalyzing || !notes.trim()}
                  onClick={handleGenerateReport}
                  className="w-full py-6 bg-slate-900 text-white font-black rounded-2xl shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-4 group active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                   {isAnalyzing ? (
                     <span className="animate-spin material-symbols-outlined">sync</span>
                   ) : (
                     <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">psychology</span>
                   )}
                   {isAnalyzing ? 'DERİN ANALİZ YAPILIYOR...' : 'ICF RAPORU OLUŞTUR'}
                </button>
                {error && <div className="mt-6 p-4 bg-rose-50 text-rose-600 rounded-2xl text-xs font-bold border border-rose-100 animate-bounce">{error}</div>}
             </div>
          </div>

          <div className="lg:col-span-7">
             <div className="bg-white rounded-[48px] border border-slate-200 p-12 shadow-xl min-h-[600px] flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                  <span className="material-symbols-outlined text-[300px]">description</span>
                </div>
                {isAnalyzing ? (
                   <div className="space-y-8 animate-pulse relative z-10">
                      <div className="flex items-center gap-3 mb-12">
                         <div className="size-3 bg-primary rounded-full animate-bounce"></div>
                         <div className="size-3 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                         <div className="size-3 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                         <span className="text-[10px] font-black text-slate-400 ml-4 tracking-widest">FLASH MODEL DÜŞÜNÜYOR VE ANALİZ EDİYOR...</span>
                      </div>
                      <div className="h-10 bg-slate-100 rounded-2xl w-3/4"></div>
                      <div className="space-y-4">
                         <div className="h-4 bg-slate-50 rounded-full w-full"></div>
                         <div className="h-4 bg-slate-50 rounded-full w-11/12"></div>
                         <div className="h-4 bg-slate-50 rounded-full w-5/6"></div>
                      </div>
                      <div className="h-64 bg-slate-50 rounded-[40px] w-full border border-slate-100"></div>
                   </div>
                ) : report ? (
                  <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap font-medium animate-in fade-in slide-in-from-top-4 duration-1000 relative z-10">
                     <div className="flex items-center gap-2 mb-10 text-emerald-500">
                        <span className="material-symbols-outlined filled">verified</span>
                        <span className="text-xs font-black uppercase tracking-widest">Analiz Tamamlandı (Flash Engine)</span>
                     </div>
                     {report}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20 py-20 relative z-10 scale-90">
                     <span className="material-symbols-outlined text-[120px] mb-8 text-slate-300">clinical_notes</span>
                     <p className="font-bold text-slate-500 text-xl italic max-w-sm">Verileri girdikten sonra AI tarafından hazırlanan profesyonel rapor burada görünecek.</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssessment;
