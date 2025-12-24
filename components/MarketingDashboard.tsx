
import React, { useState, useEffect } from 'react';
import { Campaign } from '../types';

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: 'c1', name: 'Global Lansman - Farkındalık', platform: 'Meta', spend: '$12,400', conversions: 4200, status: 'active' },
  { id: 'c2', name: 'Terapist Edinimi', platform: 'LinkedIn', spend: '$8,200', conversions: 310, status: 'active' },
  { id: 'c3', name: 'Konuşma Patolojisi Arama', platform: 'Google', spend: '$5,100', conversions: 1250, status: 'active' },
  { id: 'c4', name: 'Yeniden Etkileşim', platform: 'Email', spend: '$400', conversions: 85, status: 'paused' },
];

const MarketingDashboard: React.FC = () => {
  const [countdown, setCountdown] = useState({ d: 12, h: 4, m: 22, s: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, s: 59, m: prev.m - 1 };
        return { ...prev, s: 59, m: 59, h: prev.h - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 md:p-10 no-scrollbar">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Launch Intelligence Header */}
        <div className="bg-[#0F172A] rounded-[56px] p-12 text-white relative overflow-hidden shadow-3xl group">
           <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50"></div>
           <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-1000 pointer-events-none">
              <span className="material-symbols-outlined text-[320px]">rocket_launch</span>
           </div>
           
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-8">
                 <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-white/10">
                    <span className="size-2 bg-primary rounded-full animate-pulse"></span>
                    Stratejik Lansman v3.0
                 </div>
                 <h2 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.9] italic uppercase">Yarınlara<br />Hazır Mıyız?</h2>
                 <p className="text-xl text-slate-400 font-medium max-w-md italic">Lansman penceresi için tüm büyüme kanalları optimize edildi. Veri dalgası bekleniyor.</p>
                 <div className="flex gap-4">
                    <button className="px-8 py-4 bg-primary text-white font-black text-[10px] uppercase rounded-2xl shadow-2xl shadow-primary/30 hover:bg-primary-dark transition-all">Strateji Raporu</button>
                    <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase rounded-2xl hover:bg-white/10 transition-all">Medya Kiti</button>
                 </div>
              </div>

              <div className="lg:col-span-6 flex justify-end gap-6 md:gap-8">
                 <TimeBlock label="GÜN" value={countdown.d} />
                 <TimeBlock label="SAAT" value={countdown.h} />
                 <TimeBlock label="DAK" value={countdown.m} />
                 <TimeBlock label="SAN" value={countdown.s} />
              </div>
           </div>
        </div>

        {/* Growth Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           <GrowthCard label="Ön Kayıt (Danışan)" value="14.2k" change="+12% bugün" icon="person_celebrate" color="text-indigo-600" />
           <GrowthCard label="Doğrulanmış Uzman" value="842" change="+22%" icon="verified_user" color="text-emerald-600" />
           <GrowthCard label="Marka Duyarlılığı" value="94/100" change="Pozitif" icon="favorite" color="text-rose-500" />
           <GrowthCard label="Beklenen CAC" value="$4.20" change="Optimal" icon="payments" color="text-amber-600" />
        </div>

        {/* Campaign Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           <div className="lg:col-span-8 bg-white rounded-[48px] border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-10 border-b border-slate-100 flex items-center justify-between">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Aktif Büyüme Kanalları</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">ROI Bazlı Kampanya Performansı</p>
                 </div>
                 <button className="px-6 py-2.5 bg-slate-900 text-white font-black text-[10px] uppercase rounded-xl hover:bg-black transition-all">Yeni Kampanya</button>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                       <tr>
                          <th className="px-10 py-6">KAMPANYA ADI</th>
                          <th className="px-10 py-6">PLATFORM</th>
                          <th className="px-10 py-6">HARCAMA</th>
                          <th className="px-10 py-6">DÖNÜŞÜM</th>
                          <th className="px-10 py-6 text-right">DURUM</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {MOCK_CAMPAIGNS.map(camp => (
                         <tr key={camp.id} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="px-10 py-6 text-sm font-black text-slate-900 italic tracking-tight uppercase">{camp.name}</td>
                            <td className="px-10 py-6">
                               <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                                 camp.platform === 'Meta' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                 camp.platform === 'Google' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                 'bg-indigo-50 text-indigo-600 border-indigo-100'
                               }`}>
                                  {camp.platform}
                               </span>
                            </td>
                            <td className="px-10 py-6 text-sm font-black text-slate-900 uppercase">{camp.spend}</td>
                            <td className="px-10 py-6 text-sm font-bold text-slate-600">{camp.conversions.toLocaleString()}</td>
                            <td className="px-10 py-6 text-right">
                               <div className="flex items-center justify-end gap-3">
                                  <div className={`size-2.5 rounded-full ${camp.status === 'active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`}></div>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{camp.status === 'active' ? 'AKTİF' : 'PAUSE'}</span>
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Brand Sentiment & Buzz */}
           <div className="lg:col-span-4 space-y-10">
              <div className="bg-white rounded-[48px] border border-slate-200 p-10 shadow-sm relative overflow-hidden group">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Sosyal Etkileşim (Buzz)</h3>
                 <div className="space-y-8">
                    <BuzzItem user="DilTerapisti_Ak" content="TheraSpeech v3.0 ön izlemesi muazzam duruyor. AI asistanı seansları çok kolaylaştıracak." platform="Twitter" sentiment="positive" />
                    <BuzzItem user="Modern_Klinik" content="Lansman için bekleme listesindeyiz. Türkiye'den böyle bir inovasyon çıkması gurur verici." platform="LinkedIn" sentiment="positive" />
                    <BuzzItem user="Cocuk_Gelisimci" content="Fiyatlandırma politikası global rakiplere göre çok rekabetçi. Klinik geçişini planlıyoruz." platform="Instagram" sentiment="positive" />
                 </div>
                 <button className="w-full mt-10 py-4 bg-slate-50 text-slate-900 font-black text-[10px] uppercase rounded-2xl hover:bg-slate-900 hover:text-white transition-all border border-slate-100">Tüm Bahsetmeleri Gör</button>
              </div>

              <div className="bg-emerald-500 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
                 <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-[180px] text-white/10 group-hover:rotate-12 transition-transform duration-1000">campaign</span>
                 <div className="relative z-10 space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Hızlı Aksiyon</h4>
                    <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Basın Duyurusu Gönder</h3>
                    <p className="text-sm font-medium text-emerald-50 leading-relaxed italic">Onaylanmış 24 medya kuruluşu için lansman bülteni hazır.</p>
                    <button className="px-8 py-3 bg-white text-emerald-600 font-black text-[10px] uppercase rounded-xl tracking-widest shadow-xl active:scale-95 transition-all">Hemen Yayınla</button>
                 </div>
              </div>
           </div>
        </div>

        {/* Strategic Roadmap */}
        <div className="bg-white rounded-[56px] border border-slate-200 p-16 flex flex-col lg:flex-row items-center gap-16 shadow-inner">
           <div className="flex-1 space-y-8">
              <div>
                 <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase leading-none mb-2">Lansman Yol Haritası</h3>
                 <p className="text-slate-500 font-medium">Büyüme stratejimizin kritik kilometre taşları.</p>
              </div>
              <div className="space-y-8">
                 <RoadmapStep date="12 NİSAN" title="Beta Programı Finali" desc="500 uzmandan gelen klinik geri bildirimler işlendi." status="done" />
                 <RoadmapStep date="15 NİSAN" title="Global Lansman Günü" desc="Basın bültenleri, TV röportajları ve sosyal medya fırtınası." status="active" />
                 <RoadmapStep date="20 NİSAN" title="Uzmanlar Konferansı" desc="Platformun yeteneklerini tanıtan küresel webinar." status="pending" />
              </div>
           </div>
           <div className="flex-1 w-full bg-slate-900 rounded-[48px] p-12 text-white relative overflow-hidden group">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
              <div className="relative z-10 space-y-8 text-center lg:text-left">
                 <div className="size-20 bg-primary/20 text-primary rounded-3xl flex items-center justify-center shadow-xl mx-auto lg:mx-0">
                    <span className="material-symbols-outlined text-4xl">analytics</span>
                 </div>
                 <div>
                    <h4 className="text-2xl font-black italic tracking-tight uppercase mb-4">Gelecek Projeksiyonu</h4>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed italic">Mevcut bekleme listesi verilerine göre ilk 6 ay sonunda <span className="text-white font-bold">25,000+ aktif kullanıcı</span> ve <span className="text-primary font-bold">$1.2M ARR</span> hedeflenmektedir.</p>
                 </div>
                 <button className="w-full py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-primary hover:text-white transition-all shadow-2xl">Yatırımcı Sunumunu İndir</button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- Helper Components ---

const TimeBlock: React.FC<{ label: string, value: number }> = ({ label, value }) => (
  <div className="flex flex-col items-center">
     <div className="text-5xl md:text-7xl font-black tracking-tighter bg-white/5 backdrop-blur-2xl border border-white/10 px-6 py-4 rounded-3xl min-w-[100px] md:min-w-[140px] text-center shadow-2xl">
        {value.toString().padStart(2, '0')}
     </div>
     <div className="text-[11px] font-black mt-3 tracking-[0.3em] text-slate-400">{label}</div>
  </div>
);

const GrowthCard: React.FC<{ label: string, value: string, change: string, icon: string, color: string }> = ({ label, value, change, icon, color }) => (
  <div className="bg-white p-10 rounded-[48px] border border-slate-100 hover:border-primary/20 hover:shadow-2xl transition-all group cursor-pointer relative overflow-hidden">
     <div className="absolute -top-4 -right-4 size-24 bg-slate-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <span className={`material-symbols-outlined text-4xl ${color}`}>{icon}</span>
     </div>
     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 relative z-10">{label}</div>
     <div className={`text-4xl font-black tracking-tighter mb-2 relative z-10 ${color}`}>{value}</div>
     <div className="flex items-center gap-2 relative z-10">
        <span className="size-1.5 bg-emerald-500 rounded-full"></span>
        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{change}</span>
     </div>
  </div>
);

const BuzzItem: React.FC<{ user: string, content: string, platform: string, sentiment: string }> = ({ user, content, platform, sentiment }) => (
  <div className="space-y-2 border-b border-slate-50 pb-6 last:border-none last:pb-0 group/buzz">
     <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="size-8 rounded-full bg-slate-100 border border-slate-200"></div>
           <span className="text-xs font-black text-slate-900 group-hover/buzz:text-primary transition-colors">@{user}</span>
        </div>
        <span className={`size-2.5 rounded-full ${sentiment === 'positive' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`}></span>
     </div>
     <p className="text-sm text-slate-600 leading-relaxed italic font-medium">"{content}"</p>
     <div className="text-[9px] font-black text-primary uppercase tracking-widest">{platform}</div>
  </div>
);

const RoadmapStep: React.FC<{ date: string, title: string, desc: string, status: 'done' | 'active' | 'pending' }> = ({ date, title, desc, status }) => (
  <div className="flex gap-8 items-start group/step">
     <div className="flex flex-col items-center pt-1">
        <div className={`size-8 rounded-full border-2 flex items-center justify-center transition-all ${
          status === 'done' ? 'bg-emerald-500 border-emerald-500 shadow-xl' : 
          status === 'active' ? 'bg-white border-primary shadow-[0_0_20px_rgba(14,165,233,0.4)] ring-8 ring-primary/5' : 
          'bg-slate-50 border-slate-200'
        }`}>
           {status === 'done' && <span className="material-symbols-outlined text-white text-[18px] font-black">check</span>}
           {status === 'active' && <div className="size-3 bg-primary rounded-full animate-ping"></div>}
        </div>
        <div className="w-0.5 h-16 bg-slate-100 mt-2"></div>
     </div>
     <div className="flex-1 -mt-1">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover/step:text-primary transition-colors">{date}</div>
        <h4 className={`text-xl font-black italic tracking-tight uppercase ${status === 'active' ? 'text-primary' : 'text-slate-900'}`}>{title}</h4>
        <p className="text-sm text-slate-500 font-medium italic mt-1 leading-relaxed">{desc}</p>
     </div>
  </div>
);

export default MarketingDashboard;
