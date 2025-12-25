
import React, { useState } from 'react';
import { User, Invoice } from '../types';

interface SettingsProps {
  user: User | null;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
  config: {
    highContrast: boolean;
    largeText: boolean;
    animationsEnabled: boolean;
  };
  onUpdateConfig: (newConfig: any) => void;
}

const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-001', date: '01 Mart 2024', amount: '1,600 ₺', status: 'Paid', service: 'Pro Klinik Paketi' },
  { id: 'INV-002', date: '01 Şubat 2024', amount: '1,600 ₺', status: 'Paid', service: 'Pro Klinik Paketi' },
  { id: 'INV-003', date: '01 Ocak 2024', amount: '1,600 ₺', status: 'Paid', service: 'Pro Klinik Paketi' },
];

type SettingsTab = 'profile' | 'clinical' | 'notifications' | 'security' | 'billing' | 'accessibility';

const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser, onLogout, config, onUpdateConfig }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [editName, setEditName] = useState(user?.name || "");
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [isSaving, setIsSaving] = useState(false);

  const isClient = user?.role === 'client';

  const handleSaveProfile = () => {
    if (!user) return;
    setIsSaving(true);
    setTimeout(() => {
      onUpdateUser({ ...user, name: editName });
      setIsSaving(false);
      alert("Profil bilgileri başarıyla güncellendi.");
    }, 800);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.next !== passwords.confirm) {
      alert("Yeni şifreler eşleşmiyor!");
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setPasswords({ current: '', next: '', confirm: '' });
      alert("Şifreniz başarıyla değiştirildi. Bir sonraki girişte yeni şifrenizi kullanın.");
    }, 1000);
  };

  const triggerAvatarUpload = () => {
    // Simüle edilmiş dosya yükleme
    const mockUrl = `https://i.pravatar.cc/150?u=${Math.random()}`;
    if (user) {
      onUpdateUser({ ...user, avatar: mockUrl });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 md:p-10 no-scrollbar">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header: Dynamic Navigation */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900/5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-900/5">
               <span className="material-symbols-outlined text-[14px]">settings_accessibility</span>
               Kullanıcı Kontrol Merkezi v7.0
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
              {isClient ? 'Vaka Profili' : 'Hesap Yönetimi'}
            </h2>
            <p className="text-lg text-slate-500 font-medium tracking-tight italic">Platform deneyiminizi kişiselleştirin.</p>
          </div>
          
          <div className="flex bg-white p-1.5 rounded-[24px] border border-slate-200 shadow-sm overflow-x-auto no-scrollbar max-w-full">
            <TabBtn active={activeTab === 'profile'} label="Kimlik" onClick={() => setActiveTab('profile')} />
            {isClient && <TabBtn active={activeTab === 'clinical'} label="Klinik Bilgi" onClick={() => setActiveTab('clinical')} />}
            <TabBtn active={activeTab === 'notifications'} label="Bildirimler" onClick={() => setActiveTab('notifications')} />
            <TabBtn active={activeTab === 'security'} label="Güvenlik" onClick={() => setActiveTab('security')} />
            <TabBtn active={activeTab === 'billing'} label="Ödemeler" onClick={() => setActiveTab('billing')} />
            <TabBtn active={activeTab === 'accessibility'} label="Erişim" onClick={() => setActiveTab('accessibility')} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-8 space-y-8">
            
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section className="bg-white rounded-[56px] border border-slate-200 p-10 md:p-12 shadow-sm">
                   <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
                      <div className="relative group">
                         <div className="size-32 rounded-[48px] bg-slate-100 overflow-hidden border-4 border-white shadow-2xl transition-transform group-hover:scale-105 duration-500 cursor-pointer" onClick={triggerAvatarUpload}>
                            <img src={user?.avatar || `https://i.pravatar.cc/150?u=${user?.id}`} className="w-full h-full object-cover" alt="Profile" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <span className="material-symbols-outlined text-white text-3xl">upload</span>
                            </div>
                         </div>
                         <button onClick={triggerAvatarUpload} className="absolute -bottom-3 -right-3 size-12 bg-primary text-white rounded-2xl shadow-xl flex items-center justify-center hover:bg-slate-900 transition-all border-4 border-white">
                            <span className="material-symbols-outlined text-[24px]">add_a_photo</span>
                         </button>
                      </div>
                      <div className="text-center md:text-left flex-1">
                         <h3 className="text-3xl font-black text-slate-900 italic tracking-tight uppercase leading-none">{user?.name}</h3>
                         <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">
                           ID: #{user?.id} • ÜYELİK: 2024
                         </p>
                         <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                            <span className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-xl border ${isClient ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-primary/10 text-primary border-primary/10'}`}>
                               {isClient ? 'VAKA SAHİBİ' : 'UZMAN TERAPİST'}
                            </span>
                            <span className="px-4 py-1.5 bg-amber-50 text-amber-600 text-[10px] font-black uppercase rounded-xl border border-amber-100">DOĞRULANMIŞ HESAP</span>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-slate-100">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Görünen Tam İsim</label>
                        <input 
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold text-sm outline-none focus:border-primary transition-all shadow-sm" 
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                      </div>
                      <Field label="E-Posta Adresi (Değiştirilemez)" value={user?.email} disabled />
                      {isClient && (
                        <>
                           <Field label="Veli / Vasi Adı" value="Mehmet Yılmaz" />
                           <Field label="Telefon Numarası" value="+90 532 000 00 00" />
                        </>
                      )}
                   </div>

                   <div className="mt-12 flex justify-end">
                      <button 
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="px-12 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95 text-xs uppercase tracking-widest flex items-center gap-3"
                      >
                         {isSaving ? <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <span className="material-symbols-outlined text-sm">save</span>}
                         DEĞİŞİKLİKLERİ KAYDET
                      </button>
                   </div>
                </section>

                <section className="bg-rose-50 border border-rose-100 p-10 rounded-[48px] flex items-center justify-between group overflow-hidden relative">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:rotate-12 transition-transform duration-1000">
                      <span className="material-symbols-outlined text-[100px]">logout</span>
                   </div>
                   <div className="relative z-10">
                      <h4 className="text-xl font-black text-rose-900 uppercase italic tracking-tight mb-1">Oturumu Güvenle Kapat</h4>
                      <p className="text-sm text-rose-600 font-medium italic">Klinik verilerinizin güvenliği için tarayıcıyı kapatmadan önce çıkış yapın.</p>
                   </div>
                   <button 
                    onClick={onLogout}
                    className="relative z-10 px-8 py-4 bg-rose-500 text-white font-black rounded-2xl shadow-xl shadow-rose-500/20 hover:bg-rose-600 transition-all active:scale-95 text-[10px] uppercase tracking-widest flex items-center gap-3"
                   >
                      <span className="material-symbols-outlined text-lg">logout</span>
                      ÇIKIŞ YAP
                   </button>
                </section>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <section className="bg-white rounded-[56px] border border-slate-200 p-10 md:p-12 shadow-sm">
                    <div className="flex items-center gap-4 mb-10">
                       <div className="size-12 bg-indigo-500/10 text-indigo-600 rounded-2xl flex items-center justify-center">
                          <span className="material-symbols-outlined font-black">lock</span>
                       </div>
                       <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Şifre ve Güvenlik Protokolü</h3>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-8">
                       <div className="space-y-6">
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Mevcut Şifre</label>
                             <input 
                                type="password"
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none focus:border-primary transition-all" 
                                value={passwords.current}
                                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                                placeholder="••••••••"
                             />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Yeni Şifre</label>
                                <input 
                                   type="password"
                                   className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none focus:border-primary transition-all" 
                                   value={passwords.next}
                                   onChange={(e) => setPasswords({...passwords, next: e.target.value})}
                                   placeholder="Min. 8 Karakter"
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Yeni Şifre Onay</label>
                                <input 
                                   type="password"
                                   className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none focus:border-primary transition-all" 
                                   value={passwords.confirm}
                                   onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                   placeholder="Tekrar Yazın"
                                />
                             </div>
                          </div>
                       </div>
                       <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                          <p className="text-[10px] text-slate-400 font-bold max-w-sm italic">Şifreniz en az bir büyük harf, bir rakam ve bir özel karakter içermelidir.</p>
                          <button 
                            type="submit"
                            disabled={isSaving || !passwords.next}
                            className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all active:scale-95 uppercase text-[10px] tracking-widest flex items-center gap-3"
                          >
                             ŞİFREYİ GÜNCELLE
                          </button>
                       </div>
                    </form>
                 </section>

                 <section className="bg-white rounded-[56px] border border-slate-200 p-10 shadow-sm space-y-6">
                    <h4 className="text-sm font-black text-slate-900 uppercase italic">İki Faktörlü Doğrulama (2FA)</h4>
                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                       <div className="flex items-center gap-6">
                          <div className="size-10 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center">
                             <span className="material-symbols-outlined">smartphone</span>
                          </div>
                          <p className="text-sm font-bold text-slate-700 italic">SMS veya Authenticator Uygulaması</p>
                       </div>
                       <button className="px-6 py-2 bg-white border-2 border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-primary hover:border-primary transition-all">AKTİF ET</button>
                    </div>
                 </section>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="bg-slate-900 rounded-[56px] p-12 text-white relative overflow-hidden shadow-3xl group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
                       <span className="material-symbols-outlined text-[320px]">credit_card</span>
                    </div>
                    <div className="relative z-10 space-y-10">
                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div>
                             <span className="px-4 py-1.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20 mb-6 inline-block">AKTİF ABONELİK</span>
                             <h3 className="text-4xl font-black italic tracking-tighter uppercase mb-2">{user?.subscription?.plan || 'Pro'} Paket</h3>
                             <p className="text-slate-400 font-medium italic">Bir sonraki yenileme: <span className="text-white">{user?.subscription?.nextBillingDate || '01.04.2024'}</span></p>
                          </div>
                          <div className="flex gap-4">
                             <button className="px-8 py-4 bg-emerald-500 text-white font-black text-[10px] uppercase rounded-2xl shadow-xl shadow-emerald-500/30 hover:bg-emerald-600 transition-all active:scale-95">Seans Yükle</button>
                             <button className="px-8 py-4 bg-white/5 text-white font-black text-[10px] uppercase rounded-2xl border border-white/10 hover:bg-white/10 transition-all active:scale-95">Planı Yönet</button>
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <BillingStat label="Kalan Seans Hakkı" value={`${user?.subscription?.remainingSessions || 4} SEANS`} />
                          <BillingStat label="Ödev Tamamlama" value="12 / 15" />
                          <BillingStat label="AI Materyal Kullanımı" value="42 / ∞" />
                       </div>
                    </div>
                 </div>

                 <section className="bg-white rounded-[56px] border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-10 border-b border-slate-100 flex items-center justify-between">
                       <h3 className="text-xl font-black text-slate-900 italic tracking-tight uppercase">İşlem ve Ödeme Kayıtları</h3>
                    </div>
                    <div className="overflow-x-auto">
                       <table className="w-full text-left">
                          <thead>
                             <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <th className="px-10 py-6">ID</th>
                                <th className="px-10 py-6">TARİH</th>
                                <th className="px-10 py-6">HİZMET</th>
                                <th className="px-10 py-6 text-right">TUTAR</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                             {MOCK_INVOICES.map(inv => (
                               <tr key={inv.id} className="group hover:bg-slate-50/50 transition-colors">
                                  <td className="px-10 py-6 text-sm font-black text-slate-900 italic">{inv.id}</td>
                                  <td className="px-10 py-6 text-sm text-slate-500 font-medium">{inv.date}</td>
                                  <td className="px-10 py-6 text-sm text-slate-700 font-bold uppercase">{inv.service}</td>
                                  <td className="px-10 py-6 text-right text-sm font-black text-slate-900">{inv.amount}</td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </section>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white p-12 rounded-[56px] border border-slate-200">
                <h3 className="text-2xl font-black text-slate-900 italic uppercase mb-8">Bilgilendirme Tercihleri</h3>
                <div className="space-y-4">
                  <SettingToggle title="Seans Öncesi Bildirim" desc="Seans başlamadan 30dk önce hatırlatıcı gönder." active={true} />
                  <SettingToggle title="Yeni Ödev Bildirimi" desc="Terapistiniz yeni bir materyal atadığında uyar." active={true} />
                  <SettingToggle title="Pazarlama Bülteni" desc="Yeni özelliklerden haberdar ol." active={false} />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Snapshot & Actions */}
          <div className="lg:col-span-4 space-y-10">
             
             {/* Profile Summary Card */}
             <div className="bg-white rounded-[48px] border border-slate-200 p-10 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000">
                   <span className="material-symbols-outlined text-[120px]">shield_with_heart</span>
                </div>
                <div className="relative z-10 space-y-8">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Hızlı Görünüm</h4>
                   <div className="space-y-6">
                      <ProfileStat icon="event_note" label="Kalan Seanslar" value={user?.subscription?.remainingSessions?.toString() || "4"} color="text-emerald-500" />
                      <ProfileStat icon="verified" label="Başarı Skoru" value={`${user?.stats?.completionRate || 0}%`} color="text-primary" />
                      <ProfileStat icon="history" label="Son Seans" value="Dün 16:00" color="text-slate-400" />
                   </div>
                   <button 
                    onClick={onLogout}
                    className="w-full py-5 bg-rose-500 text-white font-black rounded-[24px] shadow-xl shadow-rose-500/20 hover:bg-rose-600 transition-all active:scale-95 uppercase text-[11px] tracking-widest flex items-center justify-center gap-3"
                   >
                      <span className="material-symbols-outlined">logout</span>
                      Oturumu Kapat
                   </button>
                </div>
             </div>

             {/* Clinical Privacy */}
             <div className="bg-primary rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute -bottom-10 -right-10 text-[180px] text-white/10 group-hover:rotate-12 transition-transform duration-1000">
                   <span className="material-symbols-outlined">health_and_safety</span>
                </div>
                <div className="relative z-10 space-y-6">
                   <h4 className="text-xl font-black italic tracking-tight uppercase leading-none">Veri Güvenliğiniz</h4>
                   <p className="text-sm font-medium text-sky-100 leading-relaxed italic">Tüm klinik verileriniz HIPAA ve KVKK standartlarında korunur. Dilediğiniz zaman "Veri İndirme" talebi oluşturabilirsiniz.</p>
                   <button className="px-8 py-3 bg-white text-primary font-black text-[10px] uppercase rounded-xl tracking-widest shadow-xl active:scale-95 transition-all">
                      Verilerimi İndir
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const TabBtn: React.FC<{ active: boolean, label: string, onClick: () => void }> = ({ active, label, onClick }) => (
  <button 
    onClick={onClick} 
    className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition-all tracking-widest shrink-0 ${active ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
  >
    {label}
  </button>
);

const Field: React.FC<{ label: string, value?: string, disabled?: boolean }> = ({ label, value, disabled }) => (
  <div className="space-y-2">
     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">{label}</label>
     <input 
       className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold text-sm outline-none focus:border-primary transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" 
       value={value}
       disabled={disabled}
       readOnly={disabled}
     />
  </div>
);

const SettingToggle: React.FC<{ title: string, desc: string, active: boolean }> = ({ title, desc, active }) => (
  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] border border-transparent hover:border-slate-200 transition-all group">
     <div className="flex-1 pr-10">
        <div className="text-sm font-black text-slate-800 uppercase tracking-tight italic mb-1">{title}</div>
        <div className="text-xs text-slate-500 font-medium italic">{desc}</div>
     </div>
     <button className={`w-14 h-8 rounded-full transition-all relative ${active ? 'bg-emerald-500' : 'bg-slate-300'}`}>
        <div className={`absolute top-1 size-6 bg-white rounded-full transition-all ${active ? 'left-7' : 'left-1'}`}></div>
     </button>
  </div>
);

const ProfileStat: React.FC<{ icon: string, label: string, value: string, color: string }> = ({ icon, label, value, color }) => (
  <div className="flex items-center gap-5 group/stat">
     <div className={`size-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover/stat:scale-110 transition-transform ${color}`}>
        <span className="material-symbols-outlined text-2xl font-black">{icon}</span>
     </div>
     <div>
        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</div>
        <div className="text-xl font-black text-slate-900 tracking-tighter italic uppercase">{value}</div>
     </div>
  </div>
);

const BillingStat: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="p-6 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm">
     <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
     <div className="text-lg font-black tracking-tighter text-white uppercase italic">{value}</div>
  </div>
);

export default Settings;
