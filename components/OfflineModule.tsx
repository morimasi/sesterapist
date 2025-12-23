
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
  { id: 1, title: "Pop the Bubble (R)", size: "4.2 MB", status: "Downloaded", date: "12 Mart" },
  { id: 2, title: "Jungle Memory", size: "12.8 MB", status: "Downloading", date: "-", progress: 65 },
  { id: 3, title: "Cloud Breathing", size: "2.1 MB", status: "Downloaded", date: "10 Mart" },
  { id: 4, title: "Farm Animals Cards", size: "8.5 MB", status: "Available", date: "-" },
];

const OfflineModule: React.FC = () => {
  const [offlineMode, setOfflineMode] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Hero Banner */}
        <div className="bg-white rounded-[40px] border border-border p-10 flex flex-col md:flex-row items-center gap-8 shadow-sm">
           <div className="size-32 bg-sky-50 text-primary rounded-[32px] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-6xl">cloud_off</span>
           </div>
           <div className="flex-1 space-y-2">
              <h2 className="text-3xl font-black text-slate-900">Offline Terapi Modu</h2>
              <p className="text-slate-500 leading-relaxed">İnternet bağlantınız olmasa bile seanslarınıza devam edebilir, materyalleri kullanabilirsiniz. Bağlantı geldiğinde verileriniz otomatik senkronize edilir.</p>
           </div>
           <button 
             onClick={() => setOfflineMode(!offlineMode)}
             className={`px-8 py-4 rounded-2xl font-black transition-all ${offlineMode ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'bg-slate-900 text-white'}`}
           >
              {offlineMode ? 'Mod Aktif' : 'Modu Etkinleştir'}
           </button>
        </div>

        {/* Sync Status */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="size-10 bg-white rounded-xl flex items-center justify-center text-emerald-500">
                 <span className="material-symbols-outlined animate-spin-slow">sync</span>
              </div>
              <div>
                 <div className="text-sm font-bold text-emerald-900">Senkronizasyon Hazır</div>
                 <div className="text-xs text-emerald-600">Son senkronizasyon: 5 dakika önce</div>
              </div>
           </div>
           <button className="px-6 py-2 bg-white border border-emerald-200 text-emerald-600 text-xs font-black rounded-xl hover:bg-emerald-100 transition-colors">Şimdi Eşitle</button>
        </div>

        {/* Asset Management */}
        <section className="bg-white rounded-[32px] border border-border p-8 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-800">İndirilen Materyaller</h3>
              <div className="flex gap-2">
                <button className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                   <span className="material-symbols-outlined text-sm">download</span> Tümünü İndir
                </button>
              </div>
           </div>
           <div className="space-y-4">
              {MOCK_ASSETS.map(asset => (
                <div key={asset.id} className="group flex flex-col p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className={`size-12 rounded-xl flex items-center justify-center transition-colors ${
                            asset.status === 'Downloaded' ? 'bg-emerald-100 text-emerald-600' : 
                            asset.status === 'Downloading' ? 'bg-primary/10 text-primary' : 'bg-white text-slate-400 border border-slate-100'
                         }`}>
                            <span className={`material-symbols-outlined ${asset.status === 'Downloading' ? 'animate-spin' : ''}`}>
                               {asset.status === 'Downloaded' ? 'check_circle' : 
                                asset.status === 'Downloading' ? 'sync' : 'cloud_download'}
                            </span>
                         </div>
                         <div>
                            <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                               {asset.title}
                               <StatusBadge status={asset.status} />
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                               {asset.size} • {asset.status === 'Downloaded' ? `İndirildi: ${asset.date}` : asset.status === 'Downloading' ? `%${asset.progress} tamamlandı` : 'İndirmeye Hazır'}
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                         {asset.status === 'Available' && (
                           <button className="px-4 py-2 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-lg hover:bg-primary hover:text-white transition-all">
                              İndir
                           </button>
                         )}
                         <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-rose-500 transition-all">
                            <span className="material-symbols-outlined text-[20px]">{asset.status === 'Downloaded' ? 'delete' : 'close'}</span>
                         </button>
                      </div>
                   </div>
                   {asset.status === 'Downloading' && (
                      <div className="mt-4 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                         <div className="h-full bg-primary transition-all duration-500" style={{ width: `${asset.progress}%` }}></div>
                      </div>
                   )}
                </div>
              ))}
           </div>
        </section>

        {/* Offline Session Notes Simulation */}
        <section className="bg-slate-900 rounded-[32px] p-10 text-white relative overflow-hidden">
           <span className="material-symbols-outlined absolute -bottom-10 -left-10 text-[180px] text-white/5 -rotate-12">edit_note</span>
           <div className="relative z-10 max-w-lg">
              <h3 className="text-2xl font-black mb-4">Offline Seans Notu</h3>
              <p className="text-slate-400 text-sm mb-6">İnternet yokken aldığınız tüm klinik notlar cihazınızda güvenli şekilde saklanır ve ilk bağlantıda buluta yedeklenir.</p>
              <button className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-xs font-bold hover:bg-white/20 transition-all">Notları Görüntüle</button>
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
    Available: 'bg-slate-100 text-slate-500 border-slate-200'
  };

  const labels = {
    Downloaded: 'İndirildi',
    Downloading: 'İndiriliyor',
    Available: 'Bulutta'
  };

  return (
    <span className={`text-[9px] font-black uppercase tracking-tight px-2 py-0.5 rounded-md border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

export default OfflineModule;
