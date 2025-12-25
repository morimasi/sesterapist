
import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-dark scroll-smooth no-scrollbar font-sans">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(14,165,233,0.1),transparent_60%)]"></div>
        
        <div className="max-w-6xl mx-auto text-center space-y-16 relative z-10">
          <div className="inline-flex items-center gap-3 px-8 py-3 bg-white dark:bg-white/5 backdrop-blur-3xl rounded-full text-[11px] font-black uppercase tracking-[0.5em] text-primary border border-slate-200 dark:border-white/10 animate-in fade-in slide-in-from-top-10 duration-1000">
            <span className="size-2 bg-primary rounded-full animate-ping shadow-primary-glow"></span>
            PROFESYONEL PROTOKOL: GEMINI 3.0 MULDIMODAL AKTİF
          </div>
          
          <h1 className="text-7xl md:text-[130px] font-black text-slate-900 dark:text-white tracking-tighter leading-[0.8] italic uppercase">
            Terapiyi <br />
            <span className="gradient-text">Yeniden İnşa Et.</span>
          </h1>

          <p className="text-xl md:text-3xl text-slate-500 dark:text-slate-400 max-w-4xl mx-auto font-medium leading-relaxed italic animate-in fade-in duration-1000 delay-300">
            Yapay zeka artık bir asistan değil, <span className="text-slate-900 dark:text-white font-bold underline decoration-primary decoration-4 underline-offset-8">klinik partneriniz.</span> TheraSpeech ile tanışın.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-10 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto px-16 py-8 bg-primary text-white font-black rounded-[32px] shadow-[0_25px_50px_-12px_rgba(14,165,233,0.5)] hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-[0.4em] hover:bg-primary-dark"
            >
              DENEYİMİ BAŞLAT
            </button>
          </div>
        </div>

        <div className="mt-40 flex flex-wrap justify-center gap-10 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-1000">
           <TechBadge icon="neurology" label="MULTIMODAL ÇEKİRDEK" />
           <TechBadge icon="auto_videocam" label="VİZYON ANALİTİĞİ" />
           <TechBadge icon="security" label="GÜVENLİ VERİ" />
           <TechBadge icon="language" label="KÜRESEL ERİŞİM" />
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="py-60 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 h-auto md:h-[900px]">
          
          <div className="md:col-span-8 bg-white dark:bg-surface-dark rounded-[64px] border border-slate-200 dark:border-white/5 p-20 relative overflow-hidden group hover:shadow-elite transition-all duration-700 shadow-2xl">
             <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                   <span className="text-[12px] font-black text-primary uppercase tracking-[0.6em] mb-8 block">MOTOR V7.0</span>
                   <h3 className="text-6xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase mb-10 leading-tight">Gemini 3.0 <br/>MULTIMODAL ANALİTİK</h3>
                   <p className="text-slate-500 dark:text-slate-400 font-medium italic text-2xl max-w-2xl leading-relaxed">
                      Seans sırasındaki ses tonunu, ağız hareketlerini ve klinik notları eş zamanlı işleyen dünyanın ilk multimodal klinik asistanı.
                   </p>
                </div>
             </div>
          </div>
          {/* Remaining content... */}
        </div>
      </section>
    </div>
  );
};

const TechBadge: React.FC<{ icon: string, label: string }> = ({ icon, label }) => (
  <div className="flex items-center gap-4 px-8 py-4 bg-white dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all">
     <span className="material-symbols-outlined text-primary text-2xl">{icon}</span>
     <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">{label}</span>
  </div>
);

export default LandingPage;
