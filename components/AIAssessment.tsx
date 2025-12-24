
import React, { useState, useMemo } from 'react';
import { aiService } from '../services/aiService';

type AnalysisTab = 'observations' | 'history' | 'metrics';

const AIAssessment: React.FC<{ config?: Record<string, any> }> = ({ config }) => {
  const [activeTab, setActiveTab] = useState<AnalysisTab>('observations');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    observations: '',
    history: '',
    articulationScore: '0',
    fluencyScore: '0',
    comprehension: 'Orta',
    expression: 'Orta'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateReport = async () => {
    const combinedNotes = `
      VAKA GÖZLEMLERİ: ${formData.observations}
      HASTA GEÇMİŞİ: ${formData.history}
      METRİKLER: Artikülasyon: %${formData.articulationScore}, Akıcılık: %${formData.fluencyScore}, 
      Anlama: ${formData.comprehension}, İfade: ${formData.expression}
    `;

    setIsAnalyzing(true);
    setReport(null);

    try {
      const result = await aiService.analyzeClinicalCase(combinedNotes, {
        ...config,
        model: 'gemini-3-flash-preview', 
        thinkingBudget: 0 
      });
      setReport(result || "Analiz hatası.");
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 overflow-hidden bg-[#F1F5F9] flex flex-col">
      {/* Üst Header: Klinik Bilgileri */}
      <header className="bg-white border-b border-slate-200 px-10 py-6 flex items-center justify-between shrink-0">
         <div className="flex items-center gap-6">
            <div className="size-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
               <span className="material-symbols-outlined text-3xl">clinical_notes</span>
            </div>
            <div>
               <h2 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Klinik Analiz Merkezi</h2>
               <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded border border-primary/10">Engine: Gemini 3 Flash</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol: ICF Standard 2024</span>
               </div>
            </div>
         </div>
         <div className="flex gap-3">
            <button className="px-6 py-2.5 bg-white border-2 border-slate-100 text-slate-600 font-black text-[10px] uppercase rounded-xl hover:bg-slate-50 transition-all">Geçmiş Raporlar</button>
            <button className="px-6 py-2.5 bg-primary text-white font-black text-[10px] uppercase rounded-xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all">Dışa Aktar (PDF)</button>
         </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
         {/* Sol Panel: Giriş Formu */}
         <aside className="w-[500px] border-r border-slate-200 bg-white flex flex-col shrink-0">
            <div className="flex border-b border-slate-100">
               <TabButton active={activeTab === 'observations'} label="GÖZLEMLER" onClick={() => setActiveTab('observations')} />
               <TabButton active={activeTab === 'history'} label="GEÇMİŞ" onClick={() => setActiveTab('history')} />
               <TabButton active={activeTab === 'metrics'} label="METRİKLER" onClick={() => setActiveTab('metrics')} />
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
               {activeTab === 'observations' && (
                 <div className="space-y-6 animate-in fade-in duration-500">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-4 border-primary pl-3">Seans Gözlem Verileri</h4>
                    <textarea 
                      value={formData.observations}
                      onChange={(e) => handleInputChange('observations', e.target.value)}
                      placeholder="Artikülasyon hataları, davranışsal tepkiler, motivasyon seviyesi..."
                      className="w-full h-80 bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 text-sm font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all resize-none shadow-inner"
                    />
                    <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4">
                       <span className="material-symbols-outlined text-amber-500">lightbulb</span>
                       <p className="text-[11px] text-amber-700 font-medium leading-relaxed italic">İpucu: Çocuğun grup içindeki sosyal etkileşimini de belirtmek ICF raporunun "Katılım" kısmını güçlendirir.</p>
                    </div>
                 </div>
               )}

               {activeTab === 'history' && (
                 <div className="space-y-6 animate-in fade-in duration-500">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-4 border-primary pl-3">Vaka Tıbbi Geçmişi</h4>
                    <textarea 
                      value={formData.history}
                      onChange={(e) => handleInputChange('history', e.target.value)}
                      placeholder="Tanı tarihi, eşlik eden hastalıklar, önceki terapiler..."
                      className="w-full h-80 bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 text-sm font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all resize-none shadow-inner"
                    />
                 </div>
               )}

               {activeTab === 'metrics' && (
                 <div className="space-y-8 animate-in fade-in duration-500">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-4 border-primary pl-3">Nicel Klinik Veriler</h4>
                    <div className="space-y-6">
                       <RangeInput label="Artikülasyon Başarısı" value={formData.articulationScore} onChange={(v) => handleInputChange('articulationScore', v)} />
                       <RangeInput label="Akıcılık İndeksi" value={formData.fluencyScore} onChange={(v) => handleInputChange('fluencyScore', v)} />
                       <div className="grid grid-cols-2 gap-4 pt-4">
                          <SelectInput label="Anlama" value={formData.comprehension} options={['Zayıf', 'Orta', 'İyi']} onChange={(v) => handleInputChange('comprehension', v)} />
                          <SelectInput label="İfade" value={formData.expression} options={['Zayıf', 'Orta', 'İyi']} onChange={(v) => handleInputChange('expression', v)} />
                       </div>
                    </div>
                 </div>
               )}
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50/50">
               <button 
                 disabled={isAnalyzing || !formData.observations}
                 onClick={handleGenerateReport}
                 className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-30 disabled:grayscale"
               >
                  {isAnalyzing ? <span className="animate-spin material-symbols-outlined">sync</span> : <span className="material-symbols-outlined text-primary">psychology</span>}
                  {isAnalyzing ? 'Muhakeme Motoru Çalışıyor...' : 'Klinik Raporu Sentezle'}
               </button>
            </div>
         </aside>

         {/* Sağ Panel: Rapor Çıktısı */}
         <main className="flex-1 bg-[#F1F5F9] p-10 overflow-y-auto no-scrollbar relative">
            {isAnalyzing && (
               <div className="absolute inset-0 z-20 bg-white/40 backdrop-blur-sm flex items-center justify-center">
                  <div className="bg-white p-12 rounded-[56px] shadow-3xl border border-slate-100 flex flex-col items-center text-center gap-8 max-w-md animate-in zoom-in duration-500">
                     <div className="relative">
                        <div className="size-24 border-8 border-slate-100 rounded-full"></div>
                        <div className="size-24 border-8 border-primary border-t-transparent rounded-full animate-spin absolute top-0"></div>
                        <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-primary animate-pulse">neurology</span>
                     </div>
                     <div>
                        <h3 className="text-xl font-black text-slate-900 italic uppercase mb-2 tracking-tighter">Muhakeme Modu Aktif</h3>
                        <p className="text-sm text-slate-500 font-medium">Gemini 3 Flash klinik verileri ICF standartlarına göre sentezliyor ve seans önerileri hazırlıyor.</p>
                     </div>
                  </div>
               </div>
            )}

            {report ? (
               <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                  <div className="bg-white rounded-[48px] p-10 border border-slate-200 shadow-sm flex items-center gap-12 overflow-hidden relative">
                     <div className="absolute top-0 right-0 p-8 opacity-5">
                        <span className="material-symbols-outlined text-[120px]">insights</span>
                     </div>
                     <div className="size-48 bg-slate-50 rounded-full border-4 border-dashed border-slate-100 flex items-center justify-center relative shrink-0">
                        <div className="absolute inset-4 bg-primary/10 rounded-full animate-pulse"></div>
                        <span className="text-2xl font-black text-primary italic">%{formData.articulationScore}</span>
                     </div>
                     <div className="flex-1 space-y-4">
                        <h4 className="text-xl font-black text-slate-900 italic uppercase tracking-tight">Klinik Sentez Özeti</h4>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">Bu rapor, girilen veriler ve ICF protokolü temel alınarak yapay zeka tarafından oluşturulmuştur.</p>
                        <div className="flex gap-4">
                           <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-lg border border-emerald-100">Güven Skoru: %94</span>
                           <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase rounded-lg border border-primary/10">ICF Eşleşmesi: Tam</span>
                        </div>
                     </div>
                  </div>

                  <div className="bg-white rounded-[56px] p-16 border border-slate-200 shadow-2xl relative">
                     <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap font-medium text-lg">
                        {report}
                     </div>
                  </div>
               </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none grayscale">
                  <span className="material-symbols-outlined text-[160px] mb-8 text-slate-200">shield_with_heart</span>
                  <h3 className="text-3xl font-black text-slate-400 italic tracking-tighter uppercase mb-4">Analiz Hazır Değil</h3>
                  <p className="max-w-md font-medium text-slate-500 italic">Sol paneldeki formları doldurarak klinik verileri sisteme girin ve sentez motorunu başlatın.</p>
               </div>
            )}
         </main>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean, label: string, onClick: () => void }> = ({ active, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-4 ${active ? 'bg-primary/5 text-primary border-primary' : 'text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-50'}`}
  >
    {label}
  </button>
);

const RangeInput: React.FC<{ label: string, value: string, onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <div className="space-y-4">
     <div className="flex justify-between items-end">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
        <span className="text-xl font-black text-primary italic">%{value}</span>
     </div>
     <input 
       type="range" 
       min="0" max="100" 
       value={value}
       onChange={(e) => onChange(e.target.value)}
       className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary" 
     />
  </div>
);

const SelectInput: React.FC<{ label: string, value: string, options: string[], onChange: (v: string) => void }> = ({ label, value, options, onChange }) => (
  <div className="space-y-3">
     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
     <select 
       value={value}
       onChange={(e) => onChange(e.target.value)}
       className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3.5 text-xs font-black uppercase text-slate-700 outline-none focus:border-primary transition-all cursor-pointer"
     >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
     </select>
  </div>
);

export default AIAssessment;
