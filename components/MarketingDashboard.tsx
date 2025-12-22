
import React, { useState, useEffect } from 'react';
import { Campaign } from '../types';

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: 'c1', name: 'Global Lansman - Farkındalık', platform: 'Meta', spend: '$12,400', conversions: 4200, status: 'active' },
  { id: 'c2', name: 'Terapist Edinimi', platform: 'LinkedIn', spend: '$8,200', conversions: 310, status: 'active' },
  { id: 'c3', name: 'Konuşma Patolojisi Arama', platform: 'Google', spend: '$5,100', conversions: 1250, status: 'active' },
  { id: 'c4', name: 'Elde Tutma Yeniden Etkileşim', platform: 'Email', spend: '$400', conversions: 85, status: 'paused' },
];

const MarketingDashboard: React.FC = () => {
  const [countdown, setCountdown] = useState({ d: 12, h: 4, m: 22, s: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        return { ...prev, s: 59, m: prev.m - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Launch Countdown & Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500 rounded-[48px] p-12 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[240px]">rocket_launch</span>
           </div>
           
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="space-y-4">
                 <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-white/20">
                    Büyük Lansman v3.0
                 </div>
                 <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none italic">Yarınlara<br />Hazır Mıyız?</h2>
                 <p className="text-lg text-white/80 font-medium max-w-md">Lansmana kalan süre. Tüm sistemler kontrol edildi, trafik dalgası bekleniyor.</p>
              </div>

              <div className="flex gap-4 md:gap-8">
                 <TimeBlock label="GÜN" value={countdown.d} />
                 <TimeBlock label="SAAT" value={countdown.h} />
                 <TimeBlock label="DAK" value={countdown.m} />
                 <TimeBlock label="SAN" value={countdown.s} />
              </div>
           </div>
        </div>

        {/* Growth Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <GrowthCard label="Bekleme Listesi (Ön Lansman)" value="12,482" change="+14% bugün" color="text-indigo-600" />
           <GrowthCard label="Ön Kayıtlar (Uzman)" value="842" change="+22%" color="text-purple-600" />
           <GrowthCard label="Beklenen ARR (1. Yıl)" value="$1.2M" change="Optimist" color="text-emerald-600" />
           <GrowthCard label="Marka Duyarlılığı" value="94/100" change="Pozitif" color="text-amber-600" />
        </div>

        {/* Campaign Management */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white rounded-[40px] border border-border overflow-hidden shadow-sm">
              <div className="p-8 border-b border-border flex items-center justify-between bg-slate-50/50">
                 <h3 className="text-xl font-black text-slate-900 tracking-tight">Aktif Reklam Kampanyaları</h3>
                 <button className="text-sm font-bold text-primary hover:underline">Yeni Kampanya+</button>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-border">
                       <tr>
                          <th className="px-8 py-4">Kampanya Adı</th>
                          <th className="px-8 py-4">Platform</th>
                          <th className="px-8 py-4">Harcama</th>
                          <th className="px-8 py-4">Dönüşüm</th>
                          <th className="px-8 py-4">Durum</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {MOCK_CAMPAIGNS.map(camp => (
                         <tr key={camp.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-5 text-sm font-bold text-slate-900">{camp.name}</td>
                            <td className="px-8 py-5">
                               <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${camp.platform === 'Meta' ? 'bg-blue-50 text-blue-600' : camp.platform === 'Google' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                  {camp.platform}
                               </span>
                            </td>
                            <td className="px-8 py-5 text-sm font-black text-slate-900">{camp.spend}</td>
                            <td className="px-8 py-5 text-sm font-bold text-slate-600">{camp.conversions.toLocaleString()}</td>
                            <td className="px-8 py-5">
                               <div className="flex items-center gap-2">
                                  <div className={`size-2 rounded-full ${camp.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{camp.status === 'active' ? 'AKTİF' : 'DURAKLATILDI'}</span>
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Social Buzz */}
           <div className="bg-white rounded-[40px] border border-border p-8 shadow-sm flex flex-col">
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Sosyal Etkileşim (Buzz)</h3>
              <div className="space-y-6 flex-1">
                 <BuzzItem user="DilTerapisti44" content="Theraspeech'in yeni AI analiz motoru gerçekten klinik süreçlerimi hızlandırdı. Harika bir iş!" platform="Twitter" sentiment="positive" />
                 <BuzzItem user="ModernTerapist" content="Lansmanı heyecanla bekliyoruz, Türkiye'den böyle bir girişimin çıkması gurur verici." platform="LinkedIn" sentiment="positive" />
                 <BuzzItem user="CocukGelisimci" content="Fiyatlandırma politikası biraz daha esnek olabilir miydi? Bakalım seanslar nasıl geçecek." platform="Instagram" sentiment="neutral" />
              </div>
              <button className="w-full mt-8 py-4 bg-slate-900 text-white font-black rounded-2xl text-sm">Tüm Bahsetmeleri Gör</button>
           </div>
        </div>

        {/* PR & Roadmap */}
        <div className="bg-white rounded-[48px] border border-border p-12 flex flex-col md:flex-row items-center gap-12">
           <div className="flex-1 space-y-6">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight italic">Lansman Yol Haritası</h3>
              <div className="space-y-6">
                 <RoadmapStep date="12 Nisan" title="Beta Programı Sonu" desc="Klinik testlerden başarıyla geçildi." status="done" />
                 <RoadmapStep date="15 Nisan" title="Global Lansman Günü" desc="Basın bültenleri ve TV röportajları." status="active" />
                 <RoadmapStep date="20 Nisan" title="Terapist Konferansı" desc="Platformun uzmanlara özel tanıtım webinari." status="pending" />
              </div>
           </div>
           <div className="flex-1 bg-primary/5 rounded-[40px] p-10 border border-primary/10">
              <div className="size-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-xl mb-6">
                 <span className="material-symbols-outlined text-3xl">newspaper</span>
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-4">Basın Kiti (Press Kit)</h4>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">Yüksek çözünürlüklü logolar, ürün görselleri ve kurucu ekip biyografilerini içeren medya kiti hazır.</p>
              <button className="flex items-center gap-2 text-primary font-black text-sm group">
                 Medyayı İndir (.zip)
                 <span className="material-symbols-outlined text-sm group-hover:translate-x-2 transition-transform">download</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const TimeBlock: React.FC<{ label: string, value: number }> = ({ label, value }) => (
  <div className="flex flex-col items-center">
     <div className="text-4xl md:text-6xl font-black tracking-tighter bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-2xl min-w-[80px] md:min-w-[120px] text-center">{value.toString().padStart(2, '0')}</div>
     <div className="text-[10px] font-black mt-2 tracking-widest">{label}</div>
  </div>
);

const GrowthCard: React.FC<{ label: string, value: string, change: string, color: string }> = ({ label, value, change, color }) => (
  <div className="bg-white p-8 rounded-[32px] border border-border shadow-sm hover:shadow-xl transition-all">
     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</div>
     <div className={`text-3xl font-black tracking-tighter mb-1 ${color}`}>{value}</div>
     <div className="text-[10px] font-bold text-emerald-500">{change}</div>
  </div>
);

const BuzzItem: React.FC<{ user: string, content: string, platform: string, sentiment: string }> = ({ user, content, platform, sentiment }) => (
  <div className="space-y-2 border-b border-slate-50 pb-4 last:border-none last:pb-0">
     <div className="flex items-center justify-between">
        <span className="text-xs font-black text-slate-900">@{user}</span>
        <span className={`size-2 rounded-full ${sentiment === 'positive' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
     </div>
     <p className="text-xs text-slate-500 leading-relaxed italic">"{content}"</p>
     <div className="text-[9px] font-black text-primary uppercase">{platform}</div>
  </div>
);

const RoadmapStep: React.FC<{ date: string, title: string, desc: string, status: 'done' | 'active' | 'pending' }> = ({ date, title, desc, status }) => (
  <div className="flex gap-6 items-start group">
     <div className="flex flex-col items-center">
        <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all ${status === 'done' ? 'bg-emerald-500 border-emerald-500' : status === 'active' ? 'bg-white border-primary shadow-[0_0_15px_rgba(14,165,233,0.5)]' : 'bg-slate-100 border-slate-200'}`}>
           {status === 'done' && <span className="material-symbols-outlined text-white text-[14px]">check</span>}
           {status === 'active' && <div className="size-2 bg-primary rounded-full animate-ping"></div>}
        </div>
        <div className="w-0.5 h-16 bg-slate-100 mt-2"></div>
     </div>
     <div className="flex-1 -mt-1">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{date}</div>
        <h4 className={`text-lg font-black ${status === 'active' ? 'text-primary' : 'text-slate-800'}`}>{title}</h4>
        <p className="text-xs text-slate-500">{desc}</p>
     </div>
  </div>
);

export default MarketingDashboard;
