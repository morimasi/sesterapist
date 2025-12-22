
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const AIAssessment: React.FC = () => {
  const [notes, setNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleGenerateReport = async () => {
    if (!notes.trim() && !selectedFile) return;
    setIsAnalyzing(true);
    setReport(null);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `Lütfen profesyonel bir Dil ve Konuşma Terapisti gibi klinik bir rapor oluştur. 
      Raporu Markdown formatında ve ICF (İşlevsellik, Engellilik ve Sağlığın Uluslararası Sınıflandırması) standartlarına yakın bir dille hazırla.
      
      Girdi Verileri: 
      - Terapist Gözlemleri: "${notes}"
      - Medya Analizi: ${selectedFile ? selectedFile.name : 'Dosya yüklenmedi'}
      
      Rapor Yapısı:
      1. Vaka Özeti ve Temel Bulgular
      2. Dil ve Konuşma İşlevleri Analizi (Artikülasyon, Akıcılık, Dil Bilgisi)
      3. Çevresel ve Kişisel Faktörlerin Etkisi
      4. Uzun ve Kısa Dönemli Terapi Planı Önerileri
      5. Önerilen Materyaller ve Ev Egzersizleri`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 16000 } // Karmaşık klinik analiz için düşünme bütçesi ekledik
        }
      });

      if (!response.text) throw new Error("API boş yanıt döndürdü.");
      
      setReport(response.text);
    } catch (err: any) {
      console.error("Clinical Analysis failed:", err);
      setError("AI raporu oluşturulurken bir hata oluştu. Lütfen bağlantınızı kontrol edin.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
             <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">AI_Klinik_Analiz</h2>
             <p className="text-slate-500 font-medium">Gemini Pro 3 (Thinking Mode) ile derinlemesine vaka analizi.</p>
          </div>
          
          <div className="relative">
            <input type="file" accept="video/*,audio/*" onChange={handleFileChange} className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black transition-all cursor-pointer shadow-xl ${selectedFile ? 'bg-emerald-500 text-white' : 'bg-white text-slate-700 border border-border hover:bg-slate-50'}`}>
               <span className="material-symbols-outlined">{selectedFile ? 'check_circle' : 'video_library'}</span>
               {selectedFile ? selectedFile.name : 'Medya Yükle'}
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
             <div className="bg-white rounded-[32px] border border-border p-8 shadow-sm h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4 text-primary">
                  <span className="material-symbols-outlined">edit_note</span>
                  <span className="text-xs font-black uppercase tracking-widest">Gözlem Notları</span>
                </div>
                <textarea 
                  className="flex-1 w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-medium focus:ring-4 focus:ring-primary/10 outline-none resize-none mb-6 min-h-[300px]"
                  placeholder="Seans sırasındaki gözlemlerinizi buraya not edin. AI bu notları klinik standartlarda rapora dönüştürecektir..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
                <button 
                  disabled={isAnalyzing}
                  onClick={handleGenerateReport}
                  className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-3 group active:scale-95 disabled:opacity-50"
                >
                   {isAnalyzing ? <span className="animate-spin material-symbols-outlined">sync</span> : <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">psychology</span>}
                   {isAnalyzing ? 'Klinik Veriler İşleniyor...' : 'Profesyonel Rapor Oluştur'}
                </button>
                {error && <div className="mt-4 p-4 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-100">{error}</div>}
             </div>
          </div>

          <div className="lg:col-span-3">
             <div className="bg-white rounded-[32px] border border-border p-10 shadow-sm min-h-[500px] flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
                  <span className="material-symbols-outlined text-[200px]">description</span>
                </div>
                {isAnalyzing ? (
                   <div className="space-y-6 animate-pulse relative z-10">
                      <div className="flex items-center gap-2 mb-8">
                         <div className="size-2 bg-primary rounded-full animate-bounce"></div>
                         <div className="size-2 bg-primary rounded-full animate-bounce delay-100"></div>
                         <div className="size-2 bg-primary rounded-full animate-bounce delay-200"></div>
                         <span className="text-xs font-black text-slate-400 ml-2">MODEL DÜŞÜNÜYOR VE ANALİZ EDİYOR...</span>
                      </div>
                      <div className="h-8 bg-slate-100 rounded-full w-2/3"></div>
                      <div className="h-4 bg-slate-100 rounded-full w-full"></div>
                      <div className="h-4 bg-slate-100 rounded-full w-5/6"></div>
                      <div className="h-32 bg-slate-50 rounded-3xl w-full"></div>
                   </div>
                ) : report ? (
                  <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap font-medium animate-in fade-in duration-700 relative z-10">
                     {report}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 py-20 relative z-10">
                     <span className="material-symbols-outlined text-8xl mb-4">clinical_notes</span>
                     <p className="font-bold text-slate-400">Verileri girdikten sonra AI tarafından hazırlanan <br/>klinik rapor burada görünecek.</p>
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
