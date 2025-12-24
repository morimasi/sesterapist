
import React, { useState } from 'react';

type AssetStatus = 'Downloaded' | 'Downloading' | 'Available';

interface OfflineAsset {
  id: number;
  title: string;
  size: string;
  status: AssetStatus;
  date: string;
  progress?: number;
}

const MOCK_ASSETS: OfflineAsset[] = [
  { id: 1, title: "Balon Patlatma (R)", size: "4.2 MB", status: "Downloaded", date: "12 Mart" },
  { id: 2, title: "Orman Hafızası", size: "12.8 MB", status: "Downloading", date: "-", progress: 65 },
  { id: 3, title: "Bulut Nefesi Isınma", size: "2.1 MB", status: "Downloaded", date: "10 Mart" },
  { id: 4, title: "Çiftlik Hayvanları Kartları", size: "8.5 MB", status: "Available", date: "-" },
];

const OfflineModule: React.FC = () => {
  const [offlineMode, setOfflineMode] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 md:p-10 no-scrollbar">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header & Hero Banner */}
        <div className="bg-white rounded-[56px] border border-slate-200 p-12 flex flex-col md:flex-row items-center gap-12 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
              <span className="material-symbols-outlined text-[240px]">cloud_off</span>
           </div>
           <div className="size-40 bg-sky-50 text-primary rounded-[48px] flex items-center justify-center flex-shrink-0 shadow-inner relative z-10 border border-sky-100">
              <span className="material-symbols-outlined text-7xl animate-float">signal_wifi_off</span>
           </div>
           <div className="flex-1 space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10">
                 Klinik Süreklilik Protokolü v6.0
              </div>
              <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Uzaktan Operasyon Merkezi</h2>
              <p className="text-lg text-slate-500 font-medium italic leading-relaxed max-w-xl">İnternet bağlantısı kesildiğinde seanslarınızı kesintisiz sürdürün. Bağlantı sağlandığında tüm klinik verileriniz global sunucularla otomatik senkronize edilir.</p>
           </div>
           <div className="relative z-10">
              <button 
                onClick={() => setOfflineMode(!offlineMode)}
                className={`px-10 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-widest transition-all shadow-2xl active:scale-95 ${offlineMode ? 'bg-emerald-500 text-white shadow-emerald-500/30 ring-8 ring-emerald-500/5' : 'bg-slate-900 text-white shadow-black/20 hover:bg-black'}`}
              >
                 {offlineMode ? 'OPERASYON AKTİF' : 'MODU ETKİNLEŞTİR'}
              </button>
           </div>
        </div>

        {/* Sync Status Ring */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-[40px] p-8 flex items-center justify-between shadow-sm">
           <div className="flex items-center gap-6">
              <div className="size-14 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-xl border border-emerald-50">
                 <span className="material-symbols-outlined text-3xl font-black animate-spin-slow">sync</span>
              </div>
              <div>
                 <div className="text-lg font-black text-emerald-900 uppercase italic tracking-tight">Veri Senkronizasyonu Hazır</div>
                 <div className="text-xs text-emerald-600 font-bold uppercase tracking-widest opacity-80">Son Senkronizasyon: 5 Dakika Önce • Tüm Notlar Güncel</div>
              </div>
           </div>
           <button className="px-8 py-3.5 bg-white border-2 border-emerald-200 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-emerald-100 transition-colors shadow-sm active:scale-95">Şimdi Eşitle</button>
        </div>

        {/* Asset Management Table-like View */}
        <section className="bg-white rounded-[56px] border border-slate-200 p-12 shadow-sm">
           <div className="flex items-center justify-between mb-12">
              <div>
                 <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Yerel Materyal Kütüphanesi</h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Cihazınızda saklanan offline varlıklar</p>
              </div>
              <div className="flex gap-4">
                <button className="px-6 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 hover:bg-primary/5 transition-all">
                   <span className="material-symbols-outlined text-lg">download_for_offline</span> Tümünü İndir
                </button>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_ASSETS.map(asset => (
                <div key={asset.id} className="group p-6 bg-slate-50 rounded-[32px] border-2 border-transparent hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all flex flex-col gap-5">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                         <div className={`size-14 rounded-2xl flex items-center justify-center transition-all ${
                            asset.status === 'Downloaded' ? 'bg-emerald-100 text-emerald-600' : 
                            asset.status === 'Downloading' ? 'bg-primary/10 text-primary' : 'bg-white text-slate-300 border border-slate-100'
                         }`}>
                            <span className={`material-symbols-outlined text-3xl ${asset.status === 'Downloading' ? 'animate-spin' : ''}`}>
                               {asset.status === 'Downloaded' ? 'check_circle' : 
                                asset.status === 'Downloading' ? 'sync' : 'cloud_download'}
                            </span>
                         </div>
                         <div>
                            <div className="text-lg font-black text-slate-900 italic tracking-tight flex items-center gap-3 leading-none uppercase">
                               {asset.title}
                               <StatusBadge status={asset.status} />
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                               {asset.size} • {asset.status === 'Downloaded' ? `İndirildi: ${asset.date}` : asset.status === 'Downloading' ? `%${asset.progress} tamamlandı` : 'İndirmeye Hazır'}
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         {asset.status === 'Available' && (
                           <button className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                              <span className="material-symbols-outlined text-xl font-black">download</span>
                           </button>
                         )}
                         <button className="size-10 bg-rose-50 text-rose-400 hover:text-rose-600 hover:bg-rose-100 rounded-xl transition-all flex items-center justify-center">
                            <span className="material-symbols-outlined text-xl font-black">{asset.status === 'Downloaded' ? 'delete' : 'close'}</span>
                         </button>
                      </div>
                   </div>
                   {asset.status === 'Downloading' && (
                      <div className="space-y-2">
                         <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]" style={{ width: `${asset.progress}%` }}></div>
                         </div>
                      </div>
                   )}
                </div>
              ))}
           </div>
        </section>

        {/* Local Persistence Simulation */}
        <section className="bg-[#0F172A] rounded-[56px] p-12 text-white relative overflow-hidden group shadow-3xl">
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
           <span className="material-symbols-outlined absolute -bottom-10 -left-10 text-[240px] text-white/5 -rotate-12 group-hover:rotate-12 transition-transform duration-[2s]">edit_note</span>
           <div className="relative z-10 max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/10">Yerel_Veritabanı_Aktif</div>
              <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Çevrimdışı Klinik Günlükler</h3>
              <p className="text-slate-400 text-lg font-medium italic leading-relaxed">İnternet yokken alınan tüm vaka notları, ses kayıtları ve gelişim metrikleri AES-256 ile şifrelenerek yerel belleğe yazılır. Senkronizasyon protokolü sayesinde hiçbir veri kaybı yaşanmaz.</p>
              <div className="flex gap-4 pt-4">
                 <button className="px-10 py-4 bg-white text-slate-900 font-black text-[11px] uppercase rounded-2xl hover:bg-primary hover:text-white transition-all shadow-xl">Notları Görüntüle</button>
                 <button className="px-10 py-4 bg-white/5 border border-white/10 text-white font-black text-[11px] uppercase rounded-2xl hover:bg-white/10 transition-all">Güvenlik Logları</button>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: AssetStatus }> = ({ status }) => {
  const styles = {
    Downloaded: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    Downloading: 'bg-primary/5 text-primary border-primary/10',
    Available: 'bg-slate-100 text-slate-400 border-slate-200'
  };

  const labels = {
    Downloaded: 'LOKAL',
    Downloading: 'AKTARIYOR',
    Available: 'BULUTTA'
  };

  return (
    <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

export default OfflineModule;
