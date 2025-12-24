
import React, { useState, useEffect } from 'react';
import { SystemHealth } from '../types';

const QualityControl: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth>({
    apiStatus: 'online',
    latency: 124,
    lastSync: new Date().toLocaleTimeString(),
    activeUsers: 1248
  });

  const [aiGuardrails, setAiGuardrails] = useState([
    { rule: 'Klinik Kapsam Dışı Yanıt Engelleme', status: 'active', coverage: '%100' },
    { rule: 'KVKK / HIPAA Veri Maskeleme', status: 'active', coverage: '%100' },
    { rule: 'Duygu Durum Yanılgı Filtresi', status: 'active', coverage: '%98.4' },
    { rule: 'Otomatik Rapor Doğrulama', status: 'warning', coverage: '%92.1' },
  ]);

  return (
    <div className="flex-1 overflow-y-auto bg-[#05070A] p-6 md:p-12 font-mono selection:bg-primary/30 no-scrollbar">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header: Infrastructure Health */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-white/5 pb-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-500 border border-emerald-500/20">
               <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
               System Diagnostic Engine v6.0
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase leading-none">Sistem Sağlığı & Tanılama</h2>
            <p className="text-sm font-medium text-slate-500 italic">Altyapı kararlılığı ve Klinik AI güvenlik duvarı izleme paneli.</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-8">
                <MetricSmall label="API_UPTIME" value="%99.99" color="text-emerald-500" />
                <div className="w-px h-8 bg-white/10"></div>
                <MetricSmall label="LOG_RETENTION" value="30 GÜN" color="text-slate-300" />
             </div>
             <button className="px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:bg-primary-dark transition-all active:scale-95">
                SİSTEM RAPORU ÜRET
             </button>
          </div>
        </div>

        {/* Real-time Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           <DiagnosticCard label="Gemini API Latency" value={`${health.latency}ms`} status="Optimal" icon="speed" color="text-primary" />
           <DiagnosticCard label="Global Traffic Load" value="1.4 GB/s" status="Normal" icon="lan" color="text-emerald-500" />
           <DiagnosticCard label="Database Connections" value="142 Active" status="Healthy" icon="database" color="text-indigo-500" />
           <DiagnosticCard label="AI Token Usage" value="842k / Saat" status="Optimal" icon="token" color="text-amber-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           {/* AI Guardrails Section */}
           <div className="lg:col-span-7 space-y-10">
              <div className="bg-[#0C0F16] rounded-[56px] border border-white/5 p-12 shadow-3xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000">
                    <span className="material-symbols-outlined text-[240px]">shield_with_heart</span>
                 </div>
                 
                 <div className="flex items-center justify-between mb-12">
                    <div className="space-y-1">
                       <h3 className="text-xl font-black text-white italic tracking-tight uppercase">Klinik AI Koruma Kalkanı</h3>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Güvenli Terapi Protokolleri</p>
                    </div>
                    <span className="px-4 py-2 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded-xl border border-emerald-500/20">AKTİF</span>
                 </div>

                 <div className="space-y-4">
                    {aiGuardrails.map((rule, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-primary/20 transition-all group/row">
                         <div className="flex items-center gap-6">
                            <div className={`size-12 rounded-2xl flex items-center justify-center transition-all ${rule.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                               <span className="material-symbols-outlined">{rule.status === 'active' ? 'verified_user' : 'report'}</span>
                            </div>
                            <div className="space-y-1">
                               <div className="text-sm font-black text-white italic uppercase tracking-tight">{rule.rule}</div>
                               <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Kapsama: {rule.coverage}</div>
                            </div>
                         </div>
                         <button className="text-slate-600 hover:text-white transition-colors"><span className="material-symbols-outlined">settings</span></button>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Stress Test Simulation Visualization */}
              <div className="bg-[#0C0F16] rounded-[56px] border border-white/5 p-12 overflow-hidden">
                 <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Eş Zamanlı İşlem Yükü</h3>
                    <div className="flex gap-2">
                       {[1,2,3,4,5].map(i => <div key={i} className="size-2 bg-primary/20 rounded-full animate-pulse" style={{ animationDelay: `${i*200}ms` }}></div>)}
                    </div>
                 </div>
                 <div className="h-40 flex items-end gap-1 px-4">
                    {new Array(60).fill(0).map((_, i) => (
                      <div 
                        key={i} 
                        className="flex-1 bg-primary/40 rounded-t-sm hover:bg-primary transition-all cursor-crosshair" 
                        style={{ height: `${20 + Math.random() * 80}%` }}
                      ></div>
                    ))}
                 </div>
                 <div className="flex justify-between mt-6 px-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                    <span>T - 60 DK</span>
                    <span>CANLI VERİ</span>
                 </div>
              </div>
           </div>

           {/* Sidebar: System Logs & Audit */}
           <div className="lg:col-span-5 space-y-10">
              <div className="bg-[#0C0F16] rounded-[48px] border border-white/5 p-10 flex flex-col h-full max-h-[800px] overflow-hidden">
                 <div className="flex items-center justify-between mb-8 shrink-0">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Gerçek Zamanlı Log Akışı</h4>
                    <span className="material-symbols-outlined text-primary">terminal</span>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto space-y-4 pr-2 no-scrollbar">
                    <LogLine type="INFO" msg="Gemini Pro 1.5 Düğümüne Bağlanıldı" time="14:22:01" />
                    <LogLine type="DEBUG" msg="User session u_4821 initialized" time="14:21:45" />
                    <LogLine type="WARN" msg="Gecikme süresi 150ms üzerine çıktı (Region: ASIA)" time="14:20:12" />
                    <LogLine type="CRIT" msg="S3 Bucket access policy updated" time="14:18:55" />
                    <LogLine type="INFO" msg="Yeni klinik rapor başarıyla şifrelendi" time="14:15:22" />
                    <LogLine type="DEBUG" msg="WebRTC handshake success [Client: 192.168.1.1]" time="14:12:00" />
                    <LogLine type="INFO" msg="Offline senkronizasyon tamamlandı (Vaka: #124)" time="14:10:44" />
                    <LogLine type="WARN" msg="Model çıktısı klinik sınırları zorluyor: Engellendi" time="14:05:31" />
                    <LogLine type="DEBUG" msg="Garbage collection completed" time="14:02:11" />
                    <LogLine type="INFO" msg="Sistem yeniden başlatma protokolü onaylandı" time="13:58:00" />
                 </div>

                 <div className="mt-8 pt-8 border-t border-white/5 space-y-4 shrink-0">
                    <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all active:scale-95">
                       Tüm Günlükleri İndir (.log)
                    </button>
                 </div>
              </div>

              {/* Hardware Status Rings */}
              <div className="bg-[#0C0F16] rounded-[48px] border border-white/5 p-10 space-y-10">
                 <HardwareStat label="CPU Kullanımı" value="%24" icon="processor" />
                 <HardwareStat label="Bellek Rezervi" value="4.2 GB" icon="memory" />
                 <HardwareStat label="Ağ Bant Genişliği" value="840 Mbps" icon="wifi_tethering" />
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- Helper Components ---

const MetricSmall: React.FC<{ label: string, value: string, color: string }> = ({ label, value, color }) => (
  <div className="text-center">
     <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</div>
     <div className={`text-xs font-black italic tracking-tight ${color}`}>{value}</div>
  </div>
);

const DiagnosticCard: React.FC<{ label: string, value: string, status: string, icon: string, color: string }> = ({ label, value, status, icon, color }) => (
  <div className="bg-[#0C0F16] p-8 rounded-[40px] border border-white/5 hover:border-primary/20 transition-all group shadow-sm">
     <div className="flex items-center justify-between mb-6">
        <div className={`size-12 rounded-2xl bg-white/5 flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
           <span className="material-symbols-outlined text-2xl font-black">{icon}</span>
        </div>
        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-lg">{status}</div>
     </div>
     <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</div>
     <div className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">{value}</div>
  </div>
);

const LogLine: React.FC<{ type: 'INFO' | 'DEBUG' | 'WARN' | 'CRIT', msg: string, time: string }> = ({ type, msg, time }) => {
  const colors = {
    INFO: 'text-primary',
    DEBUG: 'text-slate-600',
    WARN: 'text-amber-500',
    CRIT: 'text-rose-500'
  };

  return (
    <div className="flex gap-4 text-[10px] font-medium border-b border-white/5 pb-3 last:border-none">
       <span className="text-slate-700 whitespace-nowrap">{time}</span>
       <span className={`${colors[type]} font-black w-10`}>[{type}]</span>
       <span className="text-slate-400 truncate">{msg}</span>
    </div>
  );
};

const HardwareStat: React.FC<{ label: string, value: string, icon: string }> = ({ label, value, icon }) => (
  <div className="flex items-center justify-between group">
     <div className="flex items-center gap-5">
        <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors border border-white/5 shadow-inner">
           <span className="material-symbols-outlined text-2xl font-black">{icon}</span>
        </div>
        <div>
           <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</div>
           <div className="text-xl font-black text-white italic tracking-tighter uppercase">{value}</div>
        </div>
     </div>
     <div className="flex-1 max-w-[100px] h-1.5 bg-white/5 rounded-full overflow-hidden ml-8">
        <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: value.includes('%') ? value : '65%' }}></div>
     </div>
  </div>
);

export default QualityControl;
