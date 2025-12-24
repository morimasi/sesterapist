
import React, { useState, useEffect } from 'react';
import { DeploymentStatus } from '../types';

const CLOUD_REGIONS: DeploymentStatus[] = [
  { region: 'Batı Avrupa (Frankfurt)', instances: 12, load: 42, status: 'healthy' },
  { region: 'Kuzey Amerika (Virginia)', instances: 8, load: 68, status: 'healthy' },
  { region: 'Asya Pasifik (Singapur)', instances: 4, load: 85, status: 'warning' },
  { region: 'Ortadoğu (İstanbul Edge)', instances: 6, load: 31, status: 'healthy' },
];

const DeploymentDashboard: React.FC = () => {
  const [traffic, setTraffic] = useState<number[]>(new Array(24).fill(0).map(() => Math.floor(Math.random() * 60) + 20));
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployProgress, setDeployProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTraffic(prev => [...prev.slice(1), Math.floor(Math.random() * 60) + 20]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDeploy = () => {
    setIsDeploying(true);
    setDeployProgress(0);
    const interval = setInterval(() => {
      setDeployProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsDeploying(false), 1000);
          return 100;
        }
        return p + 5;
      });
    }, 150);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#05070A] text-slate-400 p-6 md:p-12 font-sans selection:bg-primary/30 no-scrollbar">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header: Professional Infrastructure View */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-white/5 pb-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20">
               <span className="material-symbols-outlined text-[14px]">cloud_done</span>
               Global Infrastructure Engine v6.0
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase leading-none">Bulut Altyapı Yönetimi</h2>
            <p className="text-sm font-medium text-slate-500 italic">Global düğümlerin yönetimi ve gerçek zamanlı trafik optimizasyonu.</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-6 px-6 py-3 bg-white/5 rounded-2xl border border-white/5 mr-4">
                <StatusSmall label="API DURUMU" value="AKTİF" color="text-emerald-500" />
                <div className="w-px h-8 bg-white/10"></div>
                <StatusSmall label="HATA PAYI" value="%0.02" color="text-slate-300" />
             </div>
             <button 
               onClick={handleDeploy}
               disabled={isDeploying}
               className={`px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:bg-primary-dark transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50 ${isDeploying ? 'cursor-wait' : ''}`}
             >
                {isDeploying ? (
                  <span className="animate-spin material-symbols-outlined text-lg">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-lg">rocket_launch</span>
                )}
                {isDeploying ? `DAĞITILIYOR %${deployProgress}` : 'YENİ SÜRÜMÜ YAYINLA'}
             </button>
          </div>
        </div>

        {/* Traffic Topology Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           
           <div className="lg:col-span-8 space-y-10">
              {/* Traffic Graph Card */}
              <div className="bg-[#0C0F16] rounded-[56px] border border-white/5 p-12 shadow-3xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000 pointer-events-none">
                    <span className="material-symbols-outlined text-[240px]">query_stats</span>
                 </div>
                 
                 <div className="flex items-center justify-between mb-12">
                    <div>
                       <h3 className="text-xl font-black text-white italic tracking-tight uppercase mb-1">Global Trafik Akışı</h3>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Son 1 Saatlik Veri Talebi</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                       <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
                       <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Normal Yük</span>
                    </div>
                 </div>

                 <div className="h-64 flex items-end gap-1.5 px-4 relative z-10">
                    {traffic.map((val, i) => (
                      <div 
                        key={i} 
                        className="flex-1 bg-primary/20 hover:bg-primary transition-all rounded-t-lg relative group/bar"
                        style={{ height: `${val}%` }}
                      >
                         <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] font-black px-2 py-1 rounded shadow-xl opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                            {val}k Req
                         </div>
                      </div>
                    ))}
                 </div>
                 <div className="flex justify-between mt-6 px-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                    <span>60dk Önce</span>
                    <span>Şimdi</span>
                 </div>
              </div>

              {/* Cluster Health Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {CLOUD_REGIONS.map((reg, idx) => (
                   <div key={idx} className="bg-[#0C0F16] p-8 rounded-[40px] border border-white/5 hover:border-primary/20 transition-all group shadow-sm">
                      <div className="flex items-start justify-between mb-6">
                         <div className="space-y-1">
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{reg.region}</div>
                            <h4 className="text-lg font-black text-white italic tracking-tight uppercase">Bölgesel Küme #{idx + 1}</h4>
                         </div>
                         <div className={`size-3 rounded-full ${reg.status === 'healthy' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-amber-500 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.4)]'}`}></div>
                      </div>
                      <div className="flex items-center gap-8">
                         <div className="flex-1 space-y-4">
                            <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                               <span>Yük Dengesi</span>
                               <span>%{reg.load}</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                               <div className={`h-full transition-all duration-1000 ${reg.load > 80 ? 'bg-amber-500' : 'bg-primary'}`} style={{ width: `${reg.load}%` }}></div>
                            </div>
                         </div>
                         <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors border border-white/5">
                            <span className="material-symbols-outlined">settings_input_component</span>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Sidebar: System Secrets & Maintenance */}
           <div className="lg:col-span-4 space-y-10">
              
              {/* Deployment Pipeline */}
              {isDeploying && (
                 <div className="bg-primary/10 border border-primary/20 rounded-[48px] p-8 animate-in slide-in-from-top-4 duration-500">
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6">Aktif Dağıtım Hattı</h4>
                    <div className="space-y-6">
                       <PipelineStep label="Paketleme (Build)" status={deployProgress > 30 ? 'done' : 'active'} />
                       <PipelineStep label="Statik Analiz" status={deployProgress > 60 ? 'done' : deployProgress > 30 ? 'active' : 'pending'} />
                       <PipelineStep label="Global Dağıtım" status={deployProgress > 95 ? 'done' : deployProgress > 60 ? 'active' : 'pending'} />
                    </div>
                 </div>
              )}

              {/* Secure Vault Section */}
              <div className="bg-[#0C0F16] rounded-[48px] border border-white/5 p-10 shadow-2xl relative overflow-hidden group">
                 <div className="absolute -bottom-10 -right-10 text-[180px] text-white/5 group-hover:rotate-12 transition-transform duration-1000">
                    <span className="material-symbols-outlined">key</span>
                 </div>
                 <div className="relative z-10 space-y-8">
                    <div className="flex items-center justify-between">
                       <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Sistem Sırları (Vault)</h4>
                       <span className="material-symbols-outlined text-primary text-xl">shield_locked</span>
                    </div>
                    
                    <div className="space-y-4">
                       <VaultItem label="GEMINI_API_KEY" value="••••••••••••A42B" />
                       <VaultItem label="S3_STORAGE_SECRET" value="••••••••••••89Z1" />
                       <VaultItem label="DATABASE_CONNECTION" value="••••••••••••SSL1" />
                    </div>

                    <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-300 transition-all active:scale-95">
                       Tümünü Görüntüle (Yetki Gerekir)
                    </button>
                 </div>
              </div>

              {/* Infrastructure Stats Rings */}
              <div className="bg-[#0C0F16] rounded-[48px] border border-white/5 p-10 shadow-sm space-y-10">
                 <div className="flex items-center justify-between group">
                    <div className="space-y-1">
                       <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Haftalık Çalışma Süresi</div>
                       <div className="text-3xl font-black text-white italic tracking-tighter uppercase">%99.98</div>
                    </div>
                    <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                       <span className="material-symbols-outlined text-2xl font-black">check_circle</span>
                    </div>
                 </div>

                 <div className="flex items-center justify-between group">
                    <div className="space-y-1">
                       <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Toplam Bant Genişliği</div>
                       <div className="text-3xl font-black text-primary italic tracking-tighter uppercase">1.2 TB</div>
                    </div>
                    <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                       <span className="material-symbols-outlined text-2xl font-black">cloud_upload</span>
                    </div>
                 </div>
              </div>

              {/* Maintenance Control */}
              <div className="p-8 bg-rose-500/5 border border-rose-500/20 rounded-[40px] flex flex-col gap-4">
                 <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest text-center">Acil Durum İşlemleri</h4>
                 <button className="w-full py-4 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 rounded-2xl font-black text-[10px] uppercase transition-all tracking-widest">
                    BAKIM MODUNU ETKİNLEŞTİR
                 </button>
              </div>

           </div>
        </div>

        {/* Global Network Map Simulation */}
        <div className="bg-[#0C0F16] rounded-[64px] border border-white/5 p-16 text-center relative overflow-hidden group shadow-inner">
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/world-map.png')] bg-center bg-no-repeat group-hover:scale-110 transition-transform duration-[4s]"></div>
           <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
              <h3 className="text-5xl font-black text-white italic tracking-tighter uppercase">Küresel Edge Erişimi</h3>
              <p className="text-lg text-slate-500 font-medium italic leading-relaxed">
                 TheraSpeech altyapısı şu anda <span className="text-primary font-bold">14 farklı lokasyonda</span> eş zamanlı çalışmaktadır. Her seans, danışana en yakın düğümden (Edge Node) sunularak gecikme süresi <span className="text-white font-bold">20ms</span> altına indirilmiştir.
              </p>
              <div className="flex flex-wrap justify-center gap-8 pt-8 opacity-40">
                 <div className="text-[10px] font-black text-white uppercase tracking-[0.4em]">LONDON_HQ</div>
                 <div className="text-[10px] font-black text-white uppercase tracking-[0.4em]">ISTANBUL_EDGE</div>
                 <div className="text-[10px] font-black text-white uppercase tracking-[0.4em]">NY_PRIMARY</div>
                 <div className="text-[10px] font-black text-white uppercase tracking-[0.4em]">SINGAPORE_HUB</div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- Helper Components ---

const StatusSmall: React.FC<{ label: string, value: string, color: string }> = ({ label, value, color }) => (
  <div className="text-center">
     <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</div>
     <div className={`text-xs font-black italic tracking-tight ${color}`}>{value}</div>
  </div>
);

const VaultItem: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-none group/item">
     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
     <div className="flex items-center gap-3">
        <span className="text-xs text-primary font-mono tracking-tighter">{value}</span>
        <button className="text-slate-700 hover:text-white transition-colors"><span className="material-symbols-outlined text-[16px]">content_copy</span></button>
     </div>
  </div>
);

const PipelineStep: React.FC<{ label: string, status: 'done' | 'active' | 'pending' }> = ({ label, status }) => (
  <div className="flex items-center gap-4 group">
     <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-all ${
       status === 'done' ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 
       status === 'active' ? 'bg-primary border-primary animate-pulse' : 
       'bg-transparent border-white/10'
     }`}>
        {status === 'done' && <span className="material-symbols-outlined text-white text-[12px] font-black">check</span>}
     </div>
     <span className={`text-[10px] font-black uppercase tracking-widest ${status === 'pending' ? 'text-slate-600' : 'text-slate-300'}`}>{label}</span>
  </div>
);

export default DeploymentDashboard;
