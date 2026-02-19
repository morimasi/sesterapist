
import React, { useState, useEffect } from 'react';
import { aiService } from '../services/aiService';

type AnalysisTab = 'primary' | 'metrics' | 'observations' | 'history';

interface AssessmentData {
  primaryComplaint: string;
  articulationScore: number;
  phonologyScore: number;
  pragmaticScore: number;
  motorSpeechScore: number;
  observations: string;
  history: string;
  age: string;
  gender: string;
}

const AIAssessment: React.FC<{ config?: Record<string, any> }> = ({ config }) => {
  const [activeTab, setActiveTab] = useState<AnalysisTab>('primary');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [thinkingStep, setThinkingStep] = useState(0);
  
  const [formData, setFormData] = useState<AssessmentData>({
    primaryComplaint: '',
    articulationScore: 50,
    phonologyScore: 50,
    pragmaticScore: 50,
    motorSpeechScore: 50,
    observations: '',
    history: '',
    age: '',
    gender: 'Belirtilmedi'
  });

  const thinkingMessages = [
    "Vaka verileri klinik veritabanıyla karşılaştırılıyor...",
    "Fonetik hatalar ve prosodi analizi yapılıyor...",
    "Akademik literatür taranıyor (Gemini 3.0 Pro)...",
    "İşlevsellik (ICF) kodları sentezleniyor...",
    "Nihai klinik rapor oluşturuluyor..."
  ];

  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setThinkingStep(prev => (prev < 4 ? prev + 1 : prev));
      }, 3000);
      return () => clearInterval(interval);
    } else {
      setThinkingStep(0);
    }
  }, [isAnalyzing]);

  const handleInputChange = (field: keyof AssessmentData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateReport = async () => {
    setIsAnalyzing(true);
    setReport(null);

    const context = `
      VAKA PROFİLİ: Yaş: ${formData.age}, Cinsiyet: ${formData.gender}
      ANA ŞİKAYET: ${formData.primaryComplaint}
      KLİNİK METRİKLER (0-100): Artikülasyon: ${formData.articulationScore}, Fonoloji: ${formData.phonologyScore}, Pragmatik: ${formData.pragmaticScore}, Motor: ${formData.motorSpeechScore}
      GÖZLEMLER: ${formData.observations}
      GEÇMİŞ: ${formData.history}
    `;

    try {
      const result = await aiService.analyzeClinicalCase(context, {
        thinkingBudget: 2000 
      });
      setReport(result || "Analiz hatası.");
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAssessment = () => {
    if (window.confirm("Tüm verileri temizlemek istediğinize emin misiniz?")) {
      setFormData({
        primaryComplaint: '', articulationScore: 50, phonologyScore: 50, pragmaticScore: 50, motorSpeechScore: 50,
        observations: '', history: '', age: '', gender: 'Belirtilmedi'
      });
      setReport(null);
    }
  };

  return (
    <div className="flex-1 overflow-hidden bg-[#F1F5F9] flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 px-12 py-8 flex items-center justify-between shrink-0 shadow-sm z-10">
         <div className="flex items-center gap-8">
            <div className="size-16 bg-slate-900 text-white rounded-[24px] flex items-center justify-center shadow-2xl rotate-3">
               <span className="material-symbols-outlined text-4xl font-black">neurology</span>
            </div>
            <div>
               <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Klinik Muhakeme Merkezi</h2>
               <div className="flex items-center gap-3 mt-2">
                  <span className="px-3 py-0.5 bg-primary/10 text-primary text-[9px] font-black uppercase rounded-full border border-primary/10">Motor: Gemini 3.0 Pro</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic">Analiz Protokolü v9.5</span>
               </div>
            </div>
         </div>
         <div className="flex gap-4">
            <button onClick={resetAssessment} className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors">Temizle</button>
            <button className="px-10 py-4 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-3">
               <span className="material-symbols-outlined text-lg">save</span> TASLAK KAYDET
            </button>
         </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
         <aside className="w-[500px] border-r border-slate-200 bg-white flex flex-col shrink-0 shadow-2xl relative z-10">
            <nav className="flex border-b border-slate-100 bg-slate-50/50 p-2 gap-1">
               <TabBtn active={activeTab === 'primary'} icon="assignment_late" label="Genel" onClick={() => setActiveTab('primary')} />
               <TabBtn active={activeTab === 'metrics'} icon="analytics" label="Metrik" onClick={() => setActiveTab('metrics')} />
               <TabBtn active={activeTab === 'observations'} icon="visibility" label="Gözlem" onClick={() => setActiveTab('observations')} />
               <TabBtn active={activeTab === 'history'} icon="history_edu" label="Öykü" onClick={() => setActiveTab('history')} />
            </nav>

            <div className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar">
               {activeTab === 'primary' && (
                 <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="grid grid-cols-2 gap-6">
                       <InputGroup label="Vaka Yaşı" placeholder="Örn: 5;4" value={formData.age} onChange={(v) => handleInputChange('age', v)} />
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Cinsiyet</label>
                          <select value={formData.gender} onChange={(e) => handleInputChange('gender', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none focus:border-primary transition-all">
                             <option>Erkek</option><option>Kız</option><option>Diğer</option>
                          </select>
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Ana Şikayet</label>
                       <textarea value={formData.primaryComplaint} onChange={(e) => handleInputChange('primaryComplaint', e.target.value)} placeholder="Başvuru sebebini detaylandırın..." className="w-full h-40 bg-slate-50 border-2 border-slate-100 rounded-[32px] p-6 text-sm font-medium focus:ring-8 focus:ring-primary/5 focus:border-primary outline-none transition-all resize-none shadow-inner" />
                    </div>
                 </div>
               )}
               {activeTab === 'metrics' && (
                 <div className="space-y-10 animate-in fade-in duration-500">
                    <MetricSlider label="Artikülasyon / Üretim" value={formData.articulationScore} onChange={(v) => handleInputChange('articulationScore', v)} />
                    <MetricSlider label="Fonolojik Farkındalık" value={formData.phonologyScore} onChange={(v) => handleInputChange('phonologyScore', v)} />
                    <MetricSlider label="Pragmatik Dil" value={formData.pragmaticScore} onChange={(v) => handleInputChange('pragmaticScore', v)} />
                    <MetricSlider label="Motor Konuşma" value={formData.motorSpeechScore} onChange={(v) => handleInputChange('motorSpeechScore', v)} />
                 </div>
               )}
               {activeTab === 'observations' && (
                 <div className="space-y-8 animate-in fade-in duration-500">
                    <textarea value={formData.observations} onChange={(e) => handleInputChange('observations', e.target.value)} placeholder="Seans gözlemleri ve teknik detaylar..." className="w-full h-80 bg-slate-50 border-2 border-slate-100 rounded-[32px] p-6 text-sm font-medium focus:ring-8 focus:ring-primary/5 focus:border-primary outline-none transition-all resize-none shadow-inner" />
                 </div>
               )}
               {activeTab === 'history' && (
                 <div className="space-y-8 animate-in fade-in duration-500">
                    <textarea value={formData.history} onChange={(e) => handleInputChange('history', e.target.value)} placeholder="Tıbbi geçmiş, aile öyküsü ve gelişim basamakları..." className="w-full h-80 bg-slate-50 border-2 border-slate-100 rounded-[32px] p-6 text-sm font-medium focus:ring-8 focus:ring-primary/5 focus:border-primary outline-none transition-all resize-none shadow-inner" />
                 </div>
               )}
            </div>

            <div className="p-10 border-t border-slate-100 bg-white">
               <button 
                 disabled={isAnalyzing || !formData.primaryComplaint}
                 onClick={handleGenerateReport}
                 className="w-full py-6 bg-slate-900 text-white font-black rounded-3xl shadow-3xl hover:bg-black transition-all flex items-center justify-center gap-5 active:scale-95 disabled:opacity-30 group"
               >
                  {isAnalyzing ? <div className="size-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div> : <span className="material-symbols-outlined text-primary text-3xl group-hover:rotate-12 transition-transform">psychology_alt</span>}
                  <span className="uppercase tracking-[0.3em] text-xs">{isAnalyzing ? 'Analiz Sentezleniyor' : 'Raporu Sentezle'}</span>
               </button>
            </div>
         </aside>

         <main className="flex-1 bg-[#F1F5F9] p-12 overflow-y-auto no-scrollbar relative flex flex-col items-center">
            {isAnalyzing && (
               <div className="absolute inset-0 z-20 bg-slate-100/60 backdrop-blur-xl flex items-center justify-center">
                  <div className="bg-white p-20 rounded-[80px] shadow-3xl border border-slate-200 flex flex-col items-center text-center gap-12 max-w-xl animate-in zoom-in duration-500">
                     <div className="relative">
                        <div className="size-40 border-[12px] border-slate-100 rounded-full"></div>
                        <div className="size-40 border-[12px] border-primary border-t-transparent rounded-full animate-spin absolute top-0"></div>
                        <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl text-primary animate-pulse">clinical_notes</span>
                     </div>
                     <div className="space-y-6">
                        <h3 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">AI Derin Düşünme Protokolü</h3>
                        <p className="text-slate-500 font-medium leading-relaxed italic text-lg h-12">
                          {thinkingMessages[thinkingStep]}
                        </p>
                        <div className="flex gap-2 justify-center">
                           {[0,1,2,3,4].map(i => <div key={i} className={`h-2 w-12 rounded-full transition-all duration-700 ${i <= thinkingStep ? 'bg-primary shadow-primary-glow' : 'bg-slate-100'}`}></div>)}
                        </div>
                     </div>
                  </div>
               </div>
            )}
            {report ? (
               <div className="w-full max-w-4xl bg-white rounded-[64px] border border-slate-200 p-20 shadow-2xl animate-in slide-in-from-bottom-8 duration-1000">
                  <div className="flex items-center justify-between mb-16 border-b border-slate-100 pb-10">
                     <div className="flex items-center gap-6">
                        <div className="size-16 bg-emerald-500 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/20">
                           <span className="material-symbols-outlined text-3xl font-black">verified</span>
                        </div>
                        <div>
                           <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Klinik Tanı Raporu</h3>
                           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Nihai Uzman Sentezi</p>
                        </div>
                     </div>
                     <button className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl">PDF İNDİR</button>
                  </div>
                  <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-medium text-xl whitespace-pre-wrap italic selection:bg-primary/20">
                     {report}
                  </div>
               </div>
            ) : !isAnalyzing && (
               <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20 py-40">
                  <span className="material-symbols-outlined text-[160px] mb-8">psychology_alt</span>
                  <h3 className="text-4xl font-black italic uppercase tracking-tighter">Vaka Analizine Hazır</h3>
                  <p className="text-lg font-bold uppercase tracking-widest mt-4 max-w-sm">Soldaki panelden klinik verileri girin ve profesyonel analizi başlatın.</p>
               </div>
            )}
         </main>
      </div>
    </div>
  );
};

const TabBtn: React.FC<{ active: boolean, icon: string, label: string, onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button onClick={onClick} className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-4 rounded-2xl transition-all ${active ? 'bg-white text-primary shadow-xl border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}>
    <span className="material-symbols-outlined text-xl">{icon}</span>
    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const InputGroup: React.FC<{ label: string, placeholder: string, value: string, onChange: (v: string) => void }> = ({ label, placeholder, value, onChange }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{label}</label>
    <input className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none focus:border-primary transition-all shadow-inner" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const MetricSlider: React.FC<{ label: string, value: number, onChange: (v: number) => void }> = ({ label, value, onChange }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
       <label className="text-sm font-black text-slate-700 uppercase tracking-tight">{label}</label>
       <span className="text-lg font-black text-primary italic">%{value}</span>
    </div>
    <input type="range" min="0" max="100" value={value} onChange={(e) => onChange(parseInt(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary" />
  </div>
);

export default AIAssessment;
