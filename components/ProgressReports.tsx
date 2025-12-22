
import React from 'react';
import { ProgressMetric } from '../types';

const MOCK_PROGRESS: ProgressMetric[] = [
  { date: '1 Mar', accuracy: 45, fluency: 30, engagement: 80 },
  { date: '8 Mar', accuracy: 52, fluency: 35, engagement: 85 },
  { date: '15 Mar', accuracy: 60, fluency: 42, engagement: 75 },
  { date: '22 Mar', accuracy: 75, fluency: 55, engagement: 90 },
  { date: '29 Mar', accuracy: 82, fluency: 68, engagement: 95 },
];

const ProgressReports: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Gelişim Raporları</h2>
            <p className="text-slate-500 mt-1">Danışanların klinik ilerlemesini veriye dayalı izleyin.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-border rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50">PDF İndir</button>
            <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20">Paylaş</button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-border">
          <div className="flex-1">
             <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Danışan Seçin</label>
             <select className="w-full bg-transparent border-none text-sm font-bold outline-none">
                <option>Ahmet Yılmaz</option>
                <option>Elif Demir</option>
                <option>Caner Öz</option>
             </select>
          </div>
          <div className="w-px h-8 bg-border"></div>
          <div className="flex-1">
             <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Kategori</label>
             <select className="w-full bg-transparent border-none text-sm font-bold outline-none">
                <option>Artikülasyon (R Sesi)</option>
                <option>Kelime Dağarcığı</option>
                <option>Cümle Yapısı</option>
             </select>
          </div>
          <div className="w-px h-8 bg-border"></div>
          <div className="flex-1">
             <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Zaman Aralığı</label>
             <select className="w-full bg-transparent border-none text-sm font-bold outline-none">
                <option>Son 1 Ay</option>
                <option>Son 3 Ay</option>
                <option>Tüm Zamanlar</option>
             </select>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Chart 1: Accuracy Over Time */}
           <div className="lg:col-span-2 bg-white rounded-[32px] border border-border p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-lg font-bold text-slate-800">Doğruluk Oranı (%)</h3>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                       <div className="size-2 rounded-full bg-primary"></div>
                       <span className="text-xs font-bold text-slate-500">Hedef</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="size-2 rounded-full bg-secondary"></div>
                       <span className="text-xs font-bold text-slate-500">Mevcut</span>
                    </div>
                 </div>
              </div>
              <div className="relative h-64 flex items-end justify-between px-4">
                 {/* Mock Chart Lines (SVG) */}
                 <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                    <polyline 
                      fill="none" 
                      stroke="#0EA5E9" 
                      strokeWidth="3" 
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={MOCK_PROGRESS.map((m, i) => `${(i / 4) * 100}%, ${100 - m.accuracy}%`).join(' ')} 
                      style={{ transition: 'all 1s ease' }}
                    />
                 </svg>
                 {MOCK_PROGRESS.map((m, i) => (
                    <div key={i} className="flex flex-col items-center gap-4 z-10">
                       <div className="text-[10px] font-bold text-slate-400">{m.accuracy}%</div>
                       <div className="size-3 rounded-full bg-primary border-4 border-white shadow-sm"></div>
                       <div className="text-xs font-bold text-slate-600 uppercase">{m.date}</div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Stats Summary */}
           <div className="space-y-6">
              <StatCard label="Ortalama Başarı" value="%62" subValue="+12.4% geçen aya göre" icon="trending_up" color="text-primary bg-sky-50" />
              <StatCard label="Akıcılık Puanı" value="7.2/10" subValue="+0.8 iyileşme" icon="speed" color="text-secondary bg-amber-50" />
              <StatCard label="Seans Devamlılığı" value="%94" subValue="24/25 seans" icon="calendar_today" color="text-success bg-emerald-50" />
           </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white rounded-[32px] border border-border p-8">
              <h3 className="text-lg font-bold mb-6">Kelime Bazlı Analiz</h3>
              <div className="space-y-4">
                 <WordAnalytic label="Araba" score={88} />
                 <WordAnalytic label="Radyo" score={42} />
                 <WordAnalytic label="Nar" score={75} />
                 <WordAnalytic label="Ders" score={91} />
              </div>
           </div>
           <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden">
              <h3 className="text-lg font-bold mb-4 relative z-10">AI Klinik Görüşü</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 relative z-10">
                 Ahmet'in artikülasyon becerilerinde belirgin bir "Initial position" (başlangıç konumu) iyileşmesi gözlemleniyor. Medial konumda sarsıntılar devam etmekte. Gelecek 4 seansta "R" sesinin kelime ortası kullanımına odaklanılması önerilir.
              </p>
              <button className="text-primary font-bold text-sm flex items-center gap-2 relative z-10">
                 Detaylı AI Analizi <span className="material-symbols-outlined text-[18px]">arrow_right_alt</span>
              </button>
              <span className="material-symbols-outlined absolute -bottom-8 -right-8 text-[160px] text-white/5">psychology</span>
           </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string, value: string, subValue: string, icon: string, color: string }> = ({ label, value, subValue, icon, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-border flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`size-14 rounded-2xl flex items-center justify-center ${color}`}>
       <span className="material-symbols-outlined text-2xl">{icon}</span>
    </div>
    <div>
       <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</div>
       <div className="text-2xl font-black text-slate-800">{value}</div>
       <div className="text-[10px] font-bold text-emerald-600">{subValue}</div>
    </div>
  </div>
);

const WordAnalytic: React.FC<{ label: string, score: number }> = ({ label, score }) => (
  <div className="space-y-2">
     <div className="flex justify-between items-center text-sm">
        <span className="font-bold text-slate-700">{label}</span>
        <span className="font-black text-primary">{score}%</span>
     </div>
     <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${score}%` }}></div>
     </div>
  </div>
);

export default ProgressReports;
