
import React, { useState, useEffect } from 'react';
import { ProgressMetric } from '../types';
import { aiService } from '../services/aiService';

const MOCK_PROGRESS: ProgressMetric[] = [
  { date: '1 Mar', accuracy: 42, fluency: 30, engagement: 80 },
  { date: '8 Mar', accuracy: 48, fluency: 35, engagement: 88 },
  { date: '15 Mar', accuracy: 60, fluency: 42, engagement: 72 },
  { date: '22 Mar', accuracy: 72, fluency: 58, engagement: 92 },
  { date: '29 Mar', accuracy: 84, fluency: 65, engagement: 95 },
];

const PHONEME_DATA = [
  { sound: '/r/', initial: 92, medial: 64, final: 45, status: 'Improving' },
  { sound: '/s/', initial: 88, medial: 82, final: 78, status: 'Mastered' },
  { sound: '/k/', initial: 42, medial: 30, final: 12, status: 'Developing' },
  { sound: '/tr/', initial: 15, medial: 5, final: 0, status: 'Emerging' },
];

const ProgressReports: React.FC = () => {
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [clinicalInsight, setClinicalInsight] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'accuracy' | 'fluency' | 'engagement'>('accuracy');

  const handleDeepAiAnalysis = async () => {
    setIsAiAnalyzing(true);
    setClinicalInsight(null);
    try {
      const result = await aiService.generateClinicalProgressReport({
        metrics: MOCK_PROGRESS,
        phonemeScores: PHONEME_DATA,
        clientNotes: "Danışan r sesinde hece düzeyinde başarılı ancak cümle içinde distorsiyonlar devam ediyor."
      });
      setClinicalInsight(result || "Analiz sentezlenemedi.");
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 md:p-10 no-scrollbar">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header: Professional Dashboard Look */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10">
               <span className="material-symbols-outlined text-[14px]">analytics</span>
               Clinical Analytics Engine v6.0
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Gelişim Analitiği</h2>
            <p className="text-lg text-slate-500 font-medium tracking-tight italic">Veriye dayalı klinik karar destek ve ilerleme takibi.</p>
          </div>
          
          <div className="flex gap-3">
             <button className="px-8 py-4 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined">download</span> PDF DIŞA AKTAR
             </button>
             <button 
               onClick={handleDeepAiAnalysis}
               disabled={isAiAnalyzing}
               className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/20 hover:bg-black transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
             >
                {isAiAnalyzing ? <span className="animate-spin material-symbols-outlined">sync</span> : <span className="material-symbols-outlined text-primary">psychology</span>}
                {isAiAnalyzing ? 'ANALİZ EDİLİYOR' : 'DERİN KLİNİK ANALİZ'}
             </button>
          </div>
        </div>

        {/* --- MAIN ANALYTICS GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           
           {/* Primary Chart Area */}
           <div className="lg:col-span-8 space-y-10">
              <div className="bg-white rounded-[56px] border border-slate-200 p-12 shadow-sm relative overflow-hidden group">
                 <div className="flex items-center justify-between mb-12">
                    <div className="space-y-1">
                       <h3 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter">İlerleme Trend Matrisi</h3>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Son 5 Seans Karşılaştırmalı Verisi</p>
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                       {(['accuracy', 'fluency', 'engagement'] as const).map(m => (
                         <button 
                           key={m}
                           onClick={() => setSelectedMetric(m)}
                           className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${selectedMetric === m ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                         >
                           {m === 'accuracy' ? 'DOĞRULUK' : m === 'fluency' ? 'AKICILIK' : 'KATILIM'}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="relative h-80 flex items-end justify-between px-10">
                    {/* SVG Line Graphic */}
                    <svg className="absolute inset-0 w-full h-full px-10 pb-16 pt-24 overflow-visible pointer-events-none">
                       <polyline 
                         fill="none" 
                         stroke="#0EA5E9" 
                         strokeWidth="4" 
                         strokeLinecap="round"
                         strokeLinejoin="round"
                         points={MOCK_PROGRESS.map((m, i) => `${(i / (MOCK_PROGRESS.length-1)) * 100}%, ${100 - (m[selectedMetric])}%`).join(' ')} 
                         className="transition-all duration-1000 ease-in-out"
                       />
                       {/* Drop Shadow Line */}
                       <polyline 
                         fill="none" 
                         stroke="rgba(14,165,233,0.1)" 
                         strokeWidth="12" 
                         strokeLinecap="round"
                         points={MOCK_PROGRESS.map((m, i) => `${(i / (MOCK_PROGRESS.length-1)) * 100}%, ${100 - (m[selectedMetric])}%`).join(' ')} 
                       />
                    </svg>

                    {MOCK_PROGRESS.map((m, i) => (
                      <div key={i} className="flex flex-col items-center gap-6 relative z-10 group/point">
                         <div className="opacity-0 group-hover/point:opacity-100 transition-opacity absolute -top-12 bg-slate-900 text-white px-3 py-1 rounded-lg text-[10px] font-black">%{m[selectedMetric]}</div>
                         <div className={`size-4 rounded-full border-4 border-white shadow-xl transition-all cursor-pointer ${m[selectedMetric] > 70 ? 'bg-emerald-500 scale-125' : 'bg-primary'}`}></div>
                         <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest rotate-[-45deg] mt-4 origin-left">{m.date}</div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Phoneme Success Heatmap */}
              <div className="bg-white rounded-[56px] border border-slate-200 p-12 shadow-sm">
                 <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter mb-8 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">graphic_eq</span>
                    Fonetik Başarı Analizi
                 </h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                          <tr>
                             <th className="px-4 py-4">HEDEF FONEM</th>
                             <th className="px-4 py-4">BAŞLANGIÇ (INITIAL)</th>
                             <th className="px-4 py-4">ORTA (MEDIAL)</th>
                             <th className="px-4 py-4">SON (FINAL)</th>
                             <th className="px-4 py-4">DURUM</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {PHONEME_DATA.map((row, idx) => (
                            <tr key={idx} className="group hover:bg-slate-50/50 transition-all">
                               <td className="px-4 py-6 text-xl font-black text-slate-900 italic tracking-tighter">{row.sound}</td>
                               <td className="px-4 py-6"><HeatmapCell value={row.initial} /></td>
                               <td className="px-4 py-6"><HeatmapCell value={row.medial} /></td>
                               <td className="px-4 py-6"><HeatmapCell value={row.final} /></td>
                               <td className="px-4 py-6">
                                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${row.status === 'Mastered' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                     {row.status}
                                  </span>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>

           {/* Sidebar: AI Clinical Insights & Stats */}
           <div className="lg:col-span-4 space-y-10">
              {/* AI Insight Panel */}
              <div className={`rounded-[56px] p-10 shadow-3xl relative overflow-hidden transition-all duration-700 ${clinicalInsight ? 'bg-slate-900 text-white scale-100' : 'bg-white border-2 border-dashed border-slate-200 text-slate-400'}`}>
                 <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                    <span className="material-symbols-outlined text-[180px] -rotate-12">psychology</span>
                 </div>
                 
                 <div className="relative z-10 space-y-8">
                    <div className="flex items-center justify-between">
                       <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 ${clinicalInsight ? 'text-primary' : 'text-slate-400'}`}>
                          <span className="material-symbols-outlined text-lg">verified</span>
                          Klinik Muhakeme Raporu
                       </h4>
                       {clinicalInsight && <button onClick={() => setClinicalInsight(null)} className="text-white/20 hover:text-white transition-colors"><span className="material-symbols-outlined">close</span></button>}
                    </div>

                    {clinicalInsight ? (
                       <div className="prose prose-invert prose-sm max-w-none text-slate-300 font-medium italic leading-relaxed whitespace-pre-wrap">
                          {clinicalInsight}
                       </div>
                    ) : (
                       <div className="py-20 text-center space-y-6">
                          <p className="text-sm font-bold italic">Trendleri analiz etmek için derin klinik analiz motorunu başlatın.</p>
                          <button onClick={handleDeepAiAnalysis} disabled={isAiAnalyzing} className="px-8 py-3 bg-slate-100 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">ANALİZİ BAŞLAT</button>
                       </div>
                    )}
                 </div>
              </div>

              {/* Snapshot Metrics */}
              <div className="bg-white rounded-[48px] border border-slate-200 p-10 space-y-8">
                 <SnapshotMetric label="Genel Başarı Artışı" value="+%24" trend="up" color="text-emerald-500" />
                 <SnapshotMetric label="Haftalık Seans Süresi" value="124dk" trend="up" color="text-primary" />
                 <SnapshotMetric label="Hata Oranı Değişimi" value="-%12" trend="down" color="text-rose-500" />
              </div>

              {/* Goal Projection */}
              <div className="bg-primary rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute -bottom-10 -right-10 text-[180px] text-white/10 group-hover:rotate-12 transition-transform duration-1000">
                    <span className="material-symbols-outlined">rocket_launch</span>
                 </div>
                 <div className="relative z-10 space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Gelecek Projeksiyonu</h4>
                    <h3 className="text-4xl font-black italic tracking-tighter uppercase">8 Seans Kaldı</h3>
                    <p className="text-sm font-medium text-white/80 leading-relaxed">Mevcut öğrenme hızına göre "R" sesinin tüm konumlarda master edilmesine tahmini 8 seans kalmıştır.</p>
                    <div className="h-1.5 w-full bg-white/20 rounded-full mt-6 overflow-hidden">
                       <div className="h-full bg-white rounded-full w-[72%] shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const HeatmapCell: React.FC<{ value: number }> = ({ value }) => {
  const getBg = () => {
    if (value > 85) return 'bg-emerald-500 text-white';
    if (value > 60) return 'bg-emerald-100 text-emerald-800';
    if (value > 40) return 'bg-amber-100 text-amber-800';
    if (value > 20) return 'bg-rose-100 text-rose-800';
    return 'bg-slate-100 text-slate-400';
  };

  return (
    <div className={`w-16 py-2.5 rounded-xl text-center text-[11px] font-black italic transition-all shadow-sm ${getBg()}`}>
       %{value}
    </div>
  );
};

const SnapshotMetric: React.FC<{ label: string, value: string, trend: 'up' | 'down', color: string }> = ({ label, value, trend, color }) => (
  <div className="flex items-center justify-between group">
     <div>
        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
        <div className={`text-3xl font-black italic tracking-tighter ${color}`}>{value}</div>
     </div>
     <div className={`size-12 rounded-2xl flex items-center justify-center ${trend === 'up' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'} group-hover:scale-110 transition-transform`}>
        <span className="material-symbols-outlined text-3xl font-black">
           {trend === 'up' ? 'trending_up' : 'trending_down'}
        </span>
     </div>
  </div>
);

export default ProgressReports;
