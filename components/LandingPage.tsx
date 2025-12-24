
import React, { useState } from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [activeTab, setActiveTab] = useState<'therapist' | 'client'>('therapist');

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-950 scroll-smooth selection:bg-primary/20 no-scrollbar">
      
      {/* Hero Section - Ultra Modern */}
      <section className="relative pt-24 md:pt-40 pb-32 px-8 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 left-1/4 size-[600px] bg-primary/20 dark:bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 size-[400px] bg-indigo-500/10 rounded-full blur-[100px] -z-10 animate-float"></div>

        <div className="max-w-6xl mx-auto text-center space-y-12">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 animate-in fade-in slide-in-from-top-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Next-Gen Speech Pathology Platform
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.85] italic uppercase animate-in zoom-in duration-700">
            Kelimeler <span className="text-primary">Özgür,</span><br />
            Gelişim <span className="text-slate-300 dark:text-slate-700">Veriye</span> Dayalı.
          </h1>

          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed italic animate-in fade-in duration-1000 delay-300">
            Gemini 3.0 Flash ile güçlendirilmiş, seansları bilimsel analizlerle derinleştiren küresel klinik ekosistemi.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10 animate-in slide-in-from-bottom-8 duration-700 delay-500">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto px-12 py-6 bg-primary text-white font-black rounded-[32px] shadow-[0_20px_50px_rgba(14,165,233,0.3)] hover:scale-110 active:scale-95 transition-all text-sm uppercase tracking-widest"
            >
              Hemen Başla
            </button>
            <button className="w-full sm:w-auto px-12 py-6 bg-white dark:bg-white/5 text-slate-900 dark:text-white font-black rounded-[32px] border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-3 group text-sm uppercase tracking-widest">
              <span className="material-symbols-outlined text-primary group-hover:rotate-12 transition-transform">play_circle</span>
              Klinik Tur
            </button>
          </div>
        </div>
      </section>

      {/* Role Explorer - Interactive Showcase */}
      <section className="py-32 px-8 bg-slate-50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto space-y-24">
           <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase">Ekosistemi Keşfedin</h2>
              <div className="flex justify-center bg-white dark:bg-slate-900 p-2 rounded-[32px] border border-slate-200 dark:border-white/10 w-fit mx-auto shadow-2xl">
                 <button 
                   onClick={() => setActiveTab('therapist')}
                   className={`px-10 py-4 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'therapist' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white'}`}
                 >
                    UZMAN TERAPİST
                 </button>
                 <button 
                   onClick={() => setActiveTab('client')}
                   className={`px-10 py-4 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'client' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white'}`}
                 >
                    VAKA SAHİBİ
                 </button>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              {activeTab === 'therapist' ? (
                <>
                  <div className="space-y-10 animate-in slide-in-from-left duration-700">
                     <FeatureItem 
                        icon="psychology" 
                        title="AI Klinik Muhakeme" 
                        desc="Terapist notlarını saniyeler içinde ICF standartlarında profesyonel raporlara dönüştürür." 
                     />
                     <FeatureItem 
                        icon="precision_manufacturing" 
                        title="Materyal Fabrikası" 
                        desc="Vakanın ilgi alanına ve hedeflerine göre 2K kalitesinde özgün görsel ve oyunlar üretir." 
                     />
                     <FeatureItem 
                        icon="monitoring" 
                        title="Canlı Spektrum Analizi" 
                        desc="Seans sırasında artikülasyon ve akıcılığı milisaniyeler içinde takip eden asistan." 
                     />
                  </div>
                  <div className="relative group animate-in slide-in-from-right duration-700">
                     <div className="absolute -inset-4 bg-primary/20 rounded-[64px] blur-3xl group-hover:bg-primary/30 transition-all"></div>
                     <img 
                       src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200" 
                       className="rounded-[56px] shadow-3xl border border-slate-200 dark:border-white/10 relative z-10 grayscale hover:grayscale-0 transition-all duration-1000"
                       alt="Therapist Dashboard"
                     />
                  </div>
                </>
              ) : (
                <>
                  <div className="relative group animate-in slide-in-from-left duration-700">
                     <div className="absolute -inset-4 bg-emerald-500/20 rounded-[64px] blur-3xl group-hover:bg-emerald-500/30 transition-all"></div>
                     <img 
                       src="https://images.unsplash.com/photo-1587654711722-542055051e50?auto=format&fit=crop&q=80&w=1200" 
                       className="rounded-[56px] shadow-3xl border border-slate-200 dark:border-white/10 relative z-10 grayscale hover:grayscale-0 transition-all duration-1000"
                       alt="Client Dashboard"
                     />
                  </div>
                  <div className="space-y-10 animate-in slide-in-from-right duration-700">
                     <FeatureItem 
                        icon="military_tech" 
                        title="Oyunlaştırılmış Yolculuk" 
                        desc="XP, rozet ve seviye sistemiyle çocukların klinik bağlılığını en üst düzeye çıkarın." 
                        color="text-emerald-500"
                     />
                     <FeatureItem 
                        icon="calendar_clock" 
                        title="Kolay Rezervasyon" 
                        desc="Uzman takvimlerini görün, hızlı ödeme yapın ve seans haklarınızı şeffafça yönetin." 
                        color="text-emerald-500"
                     />
                     <FeatureItem 
                        icon="show_chart" 
                        title="Interaktif Gelişim Arşivi" 
                        desc="Neredeydiniz? Neredesiniz? AI tarafından basitleştirilmiş aile bilgilendirme raporları." 
                        color="text-emerald-500"
                     />
                  </div>
                </>
              )}
           </div>
        </div>
      </section>

      {/* App Modules - Bento Grid */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BentoCard 
               icon="neurology"
               title="Gemini 3.0 Pro Engine"
               desc="Sektördeki en gelişmiş dil işleme modeli ile klinik doğruluğu %98'e çıkaran motor."
               color="bg-slate-900"
               full
            />
            <BentoCard 
               icon="auto_fix_high"
               title="AI Studio"
               desc="Dilediğiniz görsel stilinde, vakanıza özel interaktif oyunlar."
               color="bg-primary"
            />
            <BentoCard 
               icon="analytics"
               title="Data Insights"
               desc="Zaman bazlı gelişim grafikleri ve fonetik başarı ısı haritaları."
               color="bg-indigo-600"
            />
            <BentoCard 
               icon="security"
               title="HIPAA & KVKK"
               desc="En üst seviye veri şifreleme ve klinik gizlilik standartları."
               color="bg-emerald-600"
            />
          </div>
        </div>
      </section>

      {/* CTA Section - Impactful Dark */}
      <section className="py-32 px-8">
         <div className="max-w-5xl mx-auto bg-slate-950 dark:bg-slate-900 rounded-[64px] p-16 md:p-32 text-center relative overflow-hidden shadow-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50"></div>
            <div className="relative z-10 space-y-12">
               <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none italic uppercase">
                  Konuşma Terapisinde<br />
                  <span className="text-primary italic">Yarınlara</span> Adım Atın.
               </h2>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <button onClick={onGetStarted} className="w-full sm:w-auto px-12 py-6 bg-white text-slate-950 font-black rounded-[32px] hover:scale-110 transition-all text-xs uppercase tracking-[0.2em] shadow-2xl">
                     Ücretsiz Kayıt Ol
                  </button>
                  <button className="w-full sm:w-auto px-12 py-6 bg-white/5 border border-white/10 text-white font-black rounded-[32px] hover:bg-white/10 transition-all text-xs uppercase tracking-[0.2em]">
                     Bize Ulaşın
                  </button>
               </div>
            </div>
            {/* Background Sound Wave Animation */}
            <div className="absolute bottom-0 left-0 right-0 h-40 opacity-10 flex items-end justify-center gap-2 px-10">
               {new Array(40).fill(0).map((_, i) => (
                 <div key={i} className="w-2 bg-primary rounded-t-full animate-pulse" style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i * 0.05}s` }}></div>
               ))}
            </div>
         </div>
      </section>

      <footer className="py-20 px-8 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-950">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3">
               <div className="size-10 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="material-symbols-outlined text-2xl font-black">graphic_eq</span>
               </div>
               <span className="font-black text-xl tracking-tighter text-slate-900 dark:text-white uppercase">Thera<span className="text-primary italic">Speech</span></span>
            </div>
            <div className="flex gap-12 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600">
               <a href="#" className="hover:text-primary transition-colors">KVKK_POLITIKASI</a>
               <a href="#" className="hover:text-primary transition-colors">GIZLILIK_SOZLESMESI</a>
               <a href="#" className="hover:text-primary transition-colors">YAYIN_V7.0</a>
            </div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-700 italic">© 2024 TheraSpeech AI Speech Pathology Hub.</p>
         </div>
      </footer>
    </div>
  );
};

const FeatureItem: React.FC<{ icon: string, title: string, desc: string, color?: string }> = ({ icon, title, desc, color = "text-primary" }) => (
  <div className="flex gap-8 group">
     <div className={`size-16 rounded-[24px] bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${color}`}>
        <span className="material-symbols-outlined text-4xl">{icon}</span>
     </div>
     <div className="space-y-2">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tight uppercase leading-none">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic">{desc}</p>
     </div>
  </div>
);

const BentoCard: React.FC<{ icon: string, title: string, desc: string, color: string, full?: boolean }> = ({ icon, title, desc, color, full }) => (
  <div className={`p-12 rounded-[56px] ${color} text-white shadow-3xl group relative overflow-hidden hover:-translate-y-2 transition-all ${full ? 'md:col-span-2' : ''}`}>
     <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
        <span className="material-symbols-outlined text-[160px]">{icon}</span>
     </div>
     <div className="relative z-10 space-y-6">
        <div className="size-16 rounded-[20px] bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/10">
           <span className="material-symbols-outlined text-3xl font-black">{icon}</span>
        </div>
        <div>
           <h4 className="text-3xl font-black italic tracking-tighter uppercase mb-2 leading-none">{title}</h4>
           <p className="text-sm text-white/70 font-medium leading-relaxed italic">{desc}</p>
        </div>
     </div>
  </div>
);

export default LandingPage;
