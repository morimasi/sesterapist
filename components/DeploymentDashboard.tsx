
import React, { useState, useEffect } from 'react';
import { DeploymentStatus } from '../types';

const CLOUD_REGIONS: DeploymentStatus[] = [
  { region: 'Avrupa-Batı (Frankfurt)', instances: 12, load: 42, status: 'healthy' },
  { region: 'ABD-Doğu (K. Virginia)', instances: 8, load: 68, status: 'healthy' },
  { region: 'Asya-Doğu (Singapur)', instances: 4, load: 85, status: 'warning' },
  { region: 'ME-Güney (İstanbul Edge)', instances: 6, load: 31, status: 'healthy' },
];

const DeploymentDashboard: React.FC = () => {
  const [traffic, setTraffic] = useState<number[]>(new Array(20).fill(0).map(() => Math.floor(Math.random() * 100)));
  const [scaling, setScaling] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTraffic(prev => [...prev.slice(1), Math.floor(Math.random() * 100)]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleScaleUp = () => {
    setScaling(true);
    setTimeout(() => setScaling(false), 3000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0A0D14] text-slate-300 p-8 font-mono">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Bulut_Altyapi_Konsolu</h2>
            <p className="text-xs text-slate-500 mt-1">Çok bölgeli dağıtım ve otomatik ölçeklendirme yöneticisi</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full text-[10px] font-black border border-emerald-500/20 flex items-center gap-2">
              <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
              ÜRETİM ORTAMI
            </div>
            <button 
              onClick={handleScaleUp}
              disabled={scaling}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-xl text-xs font-black transition-all shadow-xl shadow-primary/20 flex items-center gap-2"
            >
              {scaling ? <span className="material-symbols-outlined animate-spin text-sm">sync</span> : <span className="material-symbols-outlined text-sm">rocket_launch</span>}
              v3.1.2 Hotfix Dağıt
            </button>
          </div>
        </div>

        {/* Real-time Traffic Graph */}
        <div className="bg-white/5 rounded-[32px] border border-white/10 p-8">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black uppercase text-white tracking-widest flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary">analytics</span>
                 Global Trafik Akışı
              </h3>
              <div className="text-[10px] text-slate-500">Canlı Güncelleme: Her 2 sn</div>
           </div>
           <div className="h-48 flex items-end gap-1 px-4">
              {traffic.map((val, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-primary/40 hover:bg-primary transition-all rounded-t-md relative group"
                  style={{ height: `${val}%` }}
                >
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                      {val}k
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Regions */}
          <div className="lg:col-span-2 space-y-6">
             <div className="bg-white/5 rounded-[32px] border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10 bg-white/[0.02]">
                   <h3 className="text-sm font-black uppercase text-white">Küme Sağlığı</h3>
                </div>
                <div className="divide-y divide-white/5">
                   {CLOUD_REGIONS.map((reg, idx) => (
                     <div key={idx} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-4">
                           <div className={`size-3 rounded-full ${reg.status === 'healthy' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500 animate-pulse'}`}></div>
                           <div>
                              <div className="text-sm font-bold text-white">{reg.region}</div>
                              <div className="text-[10px] text-slate-500 uppercase font-black">{reg.instances} Düğüm • %{reg.load} Yük</div>
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all">
                              <span className="material-symbols-outlined text-sm">settings_input_component</span>
                           </button>
                           <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-primary">
                              <span className="material-symbols-outlined text-sm">add_circle</span>
                           </button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Infrastructure Stats */}
          <div className="space-y-6">
             <section className="bg-white/5 rounded-[32px] border border-white/10 p-6">
                <h3 className="text-xs font-black text-slate-500 uppercase mb-6 tracking-widest">Sistem Gizli Anahtarları</h3>
                <div className="space-y-4">
                   <SecretItem label="GEMINI_API_KEY" value="••••••••••••••••" />
                   <SecretItem label="AWS_S3_ERISIMI" value="••••••••••••••••" />
                   <SecretItem label="DB_BAGLANTISI" value="••••••••••••••••" />
                </div>
                <button className="w-full mt-6 py-2 text-[10px] font-black text-primary hover:underline uppercase">Anahtarları Yönet</button>
             </section>

             <section className="bg-primary/10 border border-primary/20 rounded-[32px] p-6">
                <div className="flex items-center justify-between mb-4">
                   <span className="material-symbols-outlined text-primary">auto_mode</span>
                   <div className="text-[10px] font-black text-primary uppercase">Otomatik Ölçeklendirme AÇIK</div>
                </div>
                <h4 className="text-white font-bold text-sm mb-2">Edge Bilişim v2</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Gecikme süresi şu anda İstanbul Edge düğümleri aracılığıyla ME-Güney kullanıcıları için optimize ediliyor.</p>
             </section>
          </div>
        </div>

        {/* Global Map Preview Mockup */}
        <div className="bg-slate-900 rounded-[40px] p-12 relative overflow-hidden h-[300px] flex items-center justify-center border border-white/5">
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/world-map.png')] bg-center bg-no-repeat"></div>
           <div className="relative z-10 text-center space-y-4">
              <h3 className="text-3xl font-black text-white italic tracking-tighter">KÜRESEL ERİŞİM</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto italic">TheraSpeech şu anda 4 kıtada, gecikmesiz gerçek zamanlı AI seansları sunan <span className="text-primary font-bold">14 Edge lokasyonuyla</span> yayında.</p>
              <div className="flex justify-center gap-8">
                 <div className="flex items-center gap-2">
                    <span className="size-2 bg-emerald-500 rounded-full"></span>
                    <span className="text-[10px] font-black uppercase text-slate-400">Stabil</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="size-2 bg-primary rounded-full animate-ping"></span>
                    <span className="text-[10px] font-black uppercase text-slate-400">Ölçekleniyor</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const SecretItem: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-none">
     <span className="text-[10px] font-bold text-slate-400">{label}</span>
     <span className="text-xs text-primary font-bold">{value}</span>
  </div>
);

export default DeploymentDashboard;
