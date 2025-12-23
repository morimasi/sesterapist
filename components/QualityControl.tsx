
import React, { useState, useEffect } from 'react';
import { SystemHealth } from '../types';

const QualityControl: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth>({
    apiStatus: 'online',
    latency: 124,
    lastSync: new Date().toLocaleTimeString(),
    activeUsers: 1248
  });

  const [testResults, setTestResults] = useState([
    { name: 'Gemini API Bağlantısı', status: 'geçti', time: '12ms' },
    { name: 'WebRTC Sinyal El Sıkışması', status: 'geçti', time: '45ms' },
    { name: 'S3 Varlık Depolama Erişimi', status: 'geçti', time: '89ms' },
    { name: 'Yerel Veritabanı Senkronizasyonu', status: 'uyarı', time: '240ms' },
    { name: 'Şifreleme Katmanı (AES-256)', status: 'geçti', time: '2ms' },
  ]);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-8 text-slate-300 font-mono">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
           <div>
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic leading-none">Sistem Tanılama v6.0</h2>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">Gerçek Zamanlı Altyapı İzleme</p>
           </div>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-1 rounded-full text-[10px] font-black border border-emerald-500/20">
                 <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
                 SİSTEM STABİL
              </div>
              <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all border border-white/5 uppercase tracking-widest">Stres Testi</button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <StatusCard label="API Gecikmesi" value={`${health.latency}ms`} sub="Optimal" color="text-primary" />
           <StatusCard label="Sunucu Yükü" value="14.2%" sub="Düşük" color="text-emerald-500" />
           <StatusCard label="Hata Oranı" value="0.04%" sub="Sağlıklı" color="text-emerald-500" />
           <StatusCard label="Aktif Oturumlar" value={health.activeUsers.toString()} sub="Son saatte +12" color="text-amber-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <section className="bg-white/5 rounded-3xl border border-white/10 p-8">
              <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
                 <span className="material-symbols-outlined text-sm text-primary">checklist</span>
                 Birim Test Kapsamı
              </h3>
              <div className="space-y-4">
                 {testResults.map((test, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                       <span className="text-xs font-bold">{test.name}</span>
                       <div className="flex items-center gap-4">
                          <span className="text-[10px] text-slate-500">{test.time}</span>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${test.status === 'geçti' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'}`}>
                             {test.status}
                          </span>
                       </div>
                    </div>
                 ))}
              </div>
           </section>

           <section className="bg-white/5 rounded-3xl border border-white/10 p-8">
              <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
                 <span className="material-symbols-outlined text-sm text-rose-500">bug_report</span>
                 Kritik Günlükler
              </h3>
              <div className="space-y-3">
                 <LogItem type="UYARI" msg="Gemini API kota sınırına yaklaşıyor (%85)" time="14:24:01" />
                 <LogItem type="BİLGİ" msg="Zamanlanmış yedekleme başlatıldı" time="14:15:22" />
                 <LogItem type="HATA" msg="WebSocket bağlantısı kesildi" time="14:02:11" />
                 <LogItem type="BİLGİ" msg="Kullanıcı kimlik doğrulaması başarılı" time="13:58:45" />
                 <LogItem type="UYARI" msg="Erişilebilirlik modu etkinleştirildi" time="13:45:00" />
              </div>
           </section>
        </div>

        <div className="bg-indigo-600/10 border border-indigo-600/20 rounded-3xl p-8 flex items-center justify-between">
           <div className="space-y-1">
              <div className="text-indigo-400 font-black text-sm uppercase tracking-widest">Otomatik Optimizasyon</div>
              <p className="text-xs text-slate-400">Sistem şu anda trafik tahminlerine göre örnekleri ölçeklendiriyor.</p>
           </div>
           <button className="px-6 py-3 bg-indigo-600 text-white font-black rounded-xl text-xs shadow-xl shadow-indigo-600/20 uppercase tracking-widest">Önbelleği Optimize Et</button>
        </div>
      </div>
    </div>
  );
};

const StatusCard: React.FC<{ label: string, value: string, sub: string, color: string }> = ({ label, value, sub, color }) => (
  <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
     <div className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">{label}</div>
     <div className={`text-2xl font-black ${color} tracking-tighter mb-1 leading-none uppercase`}>{value}</div>
     <div className="text-[10px] font-bold text-slate-600">{sub}</div>
  </div>
);

const LogItem: React.FC<{ type: string, msg: string, time: string }> = ({ type, msg, time }) => (
  <div className="flex gap-4 text-[11px] font-medium py-2 border-b border-white/5 last:border-none">
     <span className="text-slate-600">{time}</span>
     <span className={type === 'HATA' ? 'text-rose-500' : type === 'UYARI' ? 'text-amber-500' : 'text-primary'}>[{type}]</span>
     <span className="text-slate-400 truncate">{msg}</span>
  </div>
);

export default QualityControl;
