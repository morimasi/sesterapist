
import React, { useState } from 'react';
import { User, Invoice } from '../types';

interface SettingsProps {
  user: User | null;
  config: {
    highContrast: boolean;
    largeText: boolean;
    animationsEnabled: boolean;
  };
  onUpdateConfig: (newConfig: any) => void;
}

const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-001', date: '01 Mart 2024', amount: '1,600 ₺', status: 'Paid', service: 'Gelişim Paketi' },
  { id: 'INV-002', date: '01 Şubat 2024', amount: '1,600 ₺', status: 'Paid', service: 'Gelişim Paketi' },
  { id: 'INV-003', date: '01 Ocak 2024', amount: '1,600 ₺', status: 'Paid', service: 'Gelişim Paketi' },
];

const Settings: React.FC<SettingsProps> = ({ user, config, onUpdateConfig }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'accessibility'>('profile');

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Ayarlar</h2>
            <p className="text-slate-500">Hesabınızı ve ödeme tercihlerinizi buradan yönetin.</p>
          </div>
          <div className="flex bg-white p-1 rounded-2xl border border-border shadow-sm overflow-x-auto whitespace-nowrap scrollbar-hide">
            <button onClick={() => setActiveTab('profile')} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'profile' ? 'bg-primary text-white shadow-lg' : 'text-slate-500'}`}>Profil</button>
            <button onClick={() => setActiveTab('billing')} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'billing' ? 'bg-primary text-white shadow-lg' : 'text-slate-500'}`}>Fatura & Abonelik</button>
            <button onClick={() => setActiveTab('accessibility')} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'accessibility' ? 'bg-primary text-white shadow-lg' : 'text-slate-500'}`}>Erişilebilirlik</button>
          </div>
        </div>

        {activeTab === 'profile' && (
          <section className="bg-white rounded-[32px] border border-border p-8 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center gap-6">
                <div className="relative group">
                   <div className="size-24 rounded-3xl bg-slate-100 overflow-hidden border-4 border-white shadow-xl">
                      <img src={user?.avatar || `https://i.pravatar.cc/150?u=${user?.id}`} className="w-full h-full object-cover" alt="Profile" />
                   </div>
                   <button className="absolute -bottom-2 -right-2 size-10 bg-primary text-white rounded-xl shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                   </button>
                </div>
                <div className="flex-1">
                   <h3 className="text-xl font-bold text-slate-900">{user?.name}</h3>
                   <p className="text-sm text-slate-400">Son güncelleme: 12 Mart 2024</p>
                   <div className="flex gap-2 mt-3">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-lg">Uzman Terapist</span>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-lg">Doğrulanmış</span>
                   </div>
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tam İsim</label>
                   <input className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium" defaultValue={user?.name} />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-Posta Adresi</label>
                   <input className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium" defaultValue="selin.kaya@theraspeech.com" />
                </div>
             </div>
          </section>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {/* Current Plan */}
             <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                   <div>
                      <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-primary/20">Aktif Plan</div>
                      <h3 className="text-3xl font-black mb-1">Pro Klinik Paketi</h3>
                      <p className="text-slate-400 text-sm">Bir sonraki ödeme: 01 Nisan 2024 (1,600 ₺)</p>
                   </div>
                   <div className="flex gap-3">
                      <button className="px-6 py-3 bg-white text-slate-900 font-bold rounded-2xl text-sm hover:bg-slate-100 transition-colors">Planı Değiştir</button>
                      <button className="px-6 py-3 bg-white/10 text-white font-bold rounded-2xl text-sm border border-white/10 hover:bg-white/20 transition-colors">İptal Et</button>
                   </div>
                </div>
                <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-[200px] text-white/5 -rotate-12">payments</span>
             </div>

             {/* Invoices Table */}
             <section className="bg-white rounded-[32px] border border-border overflow-hidden shadow-sm">
                <div className="p-8 border-b border-border flex items-center justify-between">
                   <h3 className="text-xl font-bold text-slate-800">Fatura Geçmişi</h3>
                   <button className="text-sm font-bold text-primary hover:underline">Tümünü İndir (.zip)</button>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-border">
                         <tr>
                            <th className="px-8 py-4">Fatura No</th>
                            <th className="px-8 py-4">Tarih</th>
                            <th className="px-8 py-4">Hizmet</th>
                            <th className="px-8 py-4">Tutar</th>
                            <th className="px-8 py-4">Durum</th>
                            <th className="px-8 py-4 text-right">İşlem</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {MOCK_INVOICES.map(invoice => (
                           <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-8 py-5 text-sm font-bold text-slate-900">{invoice.id}</td>
                              <td className="px-8 py-5 text-sm text-slate-500">{invoice.date}</td>
                              <td className="px-8 py-5 text-sm font-medium text-slate-700">{invoice.service}</td>
                              <td className="px-8 py-5 text-sm font-black text-slate-900">{invoice.amount}</td>
                              <td className="px-8 py-5">
                                 <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-lg border border-emerald-100">Ödendi</span>
                              </td>
                              <td className="px-8 py-5 text-right">
                                 <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-primary transition-all shadow-sm">
                                    <span className="material-symbols-outlined text-[20px]">download</span>
                                 </button>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </section>
          </div>
        )}

        {activeTab === 'accessibility' && (
          <section className="bg-white rounded-[32px] border border-border p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center gap-3 mb-8">
                <div className="size-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                   <span className="material-symbols-outlined">accessibility_new</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-800">Erişilebilirlik Ayarları</h3>
             </div>
             <div className="space-y-4">
                <ToggleOption icon="contrast" title="Yüksek Kontrast" desc="Görsel öğeleri daha belirgin hale getirir." active={config.highContrast} onToggle={() => onUpdateConfig({...config, highContrast: !config.highContrast})} />
                <ToggleOption icon="text_fields" title="Büyük Metin" desc="Tüm yazı tiplerini daha okunabilir boyuta getirir." active={config.largeText} onToggle={() => onUpdateConfig({...config, largeText: !config.largeText})} />
                <ToggleOption icon="motion_photos_off" title="Animasyonları Azalt" desc="Uygulama içi geçiş efektlerini kapatır." active={!config.animationsEnabled} onToggle={() => onUpdateConfig({...config, animationsEnabled: !config.animationsEnabled})} />
             </div>
          </section>
        )}

        <div className="flex justify-end gap-4 pt-4">
           <button className="px-8 py-4 text-slate-500 font-bold hover:text-slate-800 transition-colors">İptal</button>
           <button className="px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Değişiklikleri Kaydet</button>
        </div>
      </div>
    </div>
  );
};

const ToggleOption: React.FC<{ icon: string, title: string, desc: string, active: boolean, onToggle: () => void }> = ({ icon, title, desc, active, onToggle }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-border transition-all">
     <div className="flex items-center gap-4">
        <div className="size-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-500">
           <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
           <div className="text-sm font-bold text-slate-800">{title}</div>
           <div className="text-xs text-slate-400">{desc}</div>
        </div>
     </div>
     <button onClick={onToggle} className={`w-14 h-8 rounded-full transition-all relative ${active ? 'bg-primary' : 'bg-slate-300'}`}>
        <div className={`absolute top-1 size-6 bg-white rounded-full shadow-md transition-all ${active ? 'left-7' : 'left-1'}`}></div>
     </button>
  </div>
);

export default Settings;
