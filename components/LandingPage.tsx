
import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-white scroll-smooth selection:bg-primary/20">
      {/* Navigation Spacer */}
      <div className="h-16"></div>

      {/* Hero Section - Compact & Impactful */}
      <section className="relative pt-12 md:pt-20 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-200">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                AI Powered Speech Pathology
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] italic">
                Kelimeler <span className="text-primary">Özgür,</span><br />
                Gelişim <span className="text-slate-400">Veriye</span> Dayalı.
              </h1>

              <p className="text-lg text-slate-500 max-w-xl font-medium leading-relaxed">
                Dil ve konuşma terapisini klinik hassasiyet ve multimodal yapay zeka ile birleştiren, uzman onaylı yeni nesil platform.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button 
                  onClick={onGetStarted}
                  className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Hemen Başla
                </button>
                <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 font-black rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 group">
                  <span className="material-symbols-outlined text-primary text-xl">play_circle</span>
                  Demoyu İzle
                </button>
              </div>

              {/* Minimal Stats Row */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-4 border-t border-slate-100">
                 <MiniStat value="12k+" label="Seans" />
                 <MiniStat value="98%" label="Memnuniyet" />
                 <MiniStat value="500+" label="Uzman" />
              </div>
            </div>

            <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
               <div className="relative z-10 bg-slate-50 rounded-[48px] p-2 border border-slate-200 shadow-2xl overflow-hidden group">
                  <img 
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200" 
                    className="w-full h-auto rounded-[40px] grayscale group-hover:grayscale-0 transition-all duration-700"
                    alt="Platform Preview"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
               </div>
               {/* Abstract Background Decoration */}
               <div className="absolute -top-12 -right-12 size-64 bg-primary/5 rounded-full blur-3xl -z-0"></div>
               <div className="absolute -bottom-12 -left-12 size-48 bg-secondary/5 rounded-full blur-3xl -z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento - Compact Grid */}
      <section className="py-16 px-6 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <FeatureCard 
              icon="magic_button"
              title="AI Üretimi"
              desc="Vaka profiline özel interaktif materyal ve oyunlar saniyeler içinde hazır."
              color="bg-primary"
            />
            
            <FeatureCard 
              icon="graphic_eq"
              title="Canlı Analiz"
              desc="Seans sırasında artikülasyon ve akıcılığı takip eden gerçek zamanlı asistan."
              color="bg-slate-900"
            />

            <FeatureCard 
              icon="insights"
              title="Klinik Rapor"
              desc="Bilimsel verilere dayalı, paylaşılabilir detaylı gelişim grafikleri."
              color="bg-indigo-600"
            />

            <div className="md:col-span-2 bg-white rounded-[40px] border border-slate-200 p-8 flex flex-col md:flex-row items-center gap-8 group hover:shadow-xl transition-all">
               <div className="flex-1 space-y-4 text-center md:text-left">
                  <div className="inline-flex px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">Çocuklar İçin</div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight italic">Eğlenceli Terapi Deneyimi</h3>
                  <p className="text-sm text-slate-500 font-medium">Oyunlaştırılmış egzersizler ve ödül sistemiyle çocukların motivasyonunu en üst düzeyde tutun.</p>
               </div>
               <div className="size-32 bg-slate-100 rounded-3xl flex-shrink-0 overflow-hidden shadow-inner">
                  <img src="https://images.unsplash.com/photo-1587654711722-542055051e50?auto=format&fit=crop&q=80&w=300" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="Kids" />
               </div>
            </div>

            <div className="bg-emerald-500 rounded-[40px] p-8 text-white flex flex-col justify-center relative overflow-hidden group hover:shadow-xl transition-all">
               <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl text-white/10 group-hover:rotate-12 transition-transform">military_tech</span>
               <h3 className="text-xl font-black mb-2 relative z-10">Oyunlaştırma</h3>
               <p className="text-emerald-50 text-xs font-medium relative z-10 leading-relaxed">Rozetler, seviyeler ve haftalık hedeflerle başarıyı kutlayın.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 border-y border-slate-100 overflow-hidden">
         <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-wrap items-center justify-center md:justify-between gap-8 opacity-40 grayscale group hover:grayscale-0 transition-all">
               <div className="text-sm font-black text-slate-400 tracking-tighter italic">UNIVERSITY_PARTNER</div>
               <div className="text-sm font-black text-slate-400 tracking-tighter italic">CLINIC_NETWORK</div>
               <div className="text-sm font-black text-slate-400 tracking-tighter italic">AI_CERTIFIED</div>
               <div className="text-sm font-black text-slate-400 tracking-tighter italic">HEALTH_SAFE</div>
            </div>
         </div>
      </section>

      {/* CTA Section - Minimal */}
      <section className="py-20 px-6">
         <div className="max-w-4xl mx-auto bg-slate-950 rounded-[48px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-8">
               <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none italic">
                  Konuşma Terapisinde<br />
                  <span className="text-primary">Geleceği</span> Tasarlayın.
               </h2>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button onClick={onGetStarted} className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-primary hover:text-white transition-all">
                     Ücretsiz Başlayın
                  </button>
                  <button className="w-full sm:w-auto px-10 py-5 bg-white/5 text-white font-black rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                     Bize Ulaşın
                  </button>
               </div>
            </div>
            {/* Background Sound Wave */}
            <div className="absolute inset-0 opacity-10 flex items-center justify-center gap-2">
               {[0.5, 0.8, 1, 0.6, 0.4, 0.9, 0.7].map((h, i) => (
                 <div key={i} className="w-2 bg-primary rounded-full animate-pulse" style={{ height: `${h * 80}%`, animationDelay: `${i * 0.1}s` }}></div>
               ))}
            </div>
         </div>
      </section>

      <footer className="py-12 px-6 bg-white border-t border-slate-50">
         <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="size-8 bg-primary text-white rounded-lg flex items-center justify-center text-lg font-bold">
                  <span className="material-symbols-outlined">graphic_eq</span>
               </div>
               <span className="font-black tracking-tight">Thera<span className="text-primary">Speech</span></span>
            </div>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
               <a href="#" className="hover:text-primary transition-colors">KVKK</a>
               <a href="#" className="hover:text-primary transition-colors">Gizlilik</a>
               <a href="#" className="hover:text-primary transition-colors">Lansman v3.0</a>
            </div>
            <p className="text-[10px] font-bold text-slate-400">© 2024 TheraSpeech AI.</p>
         </div>
      </footer>
    </div>
  );
};

const MiniStat: React.FC<{ value: string, label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center lg:items-start">
     <div className="text-2xl font-black text-slate-900 tracking-tighter">{value}</div>
     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</div>
  </div>
);

const FeatureCard: React.FC<{ icon: string, title: string, desc: string, color: string }> = ({ icon, title, desc, color }) => (
  <div className="bg-white p-8 rounded-[40px] border border-slate-200 group hover:border-primary/20 hover:shadow-xl transition-all">
     <div className={`size-12 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg ${color} group-hover:scale-110 transition-transform`}>
        <span className="material-symbols-outlined">{icon}</span>
     </div>
     <h3 className="text-lg font-black text-slate-900 mb-2 italic tracking-tight">{title}</h3>
     <p className="text-xs text-slate-500 font-medium leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;
