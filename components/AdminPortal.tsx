
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { User, PlatformModule, UserRole } from '../types';

interface AdminPortalProps {
  modules: PlatformModule[];
  onUpdateModules: (newModules: PlatformModule[]) => void;
  users: User[];
  onUpdateUsers: (newUsers: User[]) => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ modules, onUpdateModules, users, onUpdateUsers }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'modules' | 'security' | 'system'>('modules');
  const [moduleFilter, setModuleFilter] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [configuringModule, setConfiguringModule] = useState<PlatformModule | null>(null);
  
  // Simulated Real-time Metrics
  const [cpuLoad, setCpuLoad] = useState<number[]>(new Array(40).fill(0).map(() => Math.random() * 40 + 10));
  const [logs, setLogs] = useState<{id: string, time: string, level: string, msg: string}[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuLoad(prev => [...prev.slice(1), Math.random() * 50 + 10]);
      
      const levels = ['BİLGİ', 'HATA', 'UYARI', 'GÜVENLİK'];
      const msgs = [
        'IAM Token doğrulandı: node_u82',
        'Gemini API gecikme süresi: 142ms',
        'Veritabanı senkronizasyonu tamamlandı',
        'Yetkisiz erişim girişimi engellendi: IP 192.168.1.1',
        'Kütüphane önbelleği yenilendi',
        'Yeni oturum başlatıldı: seans_921'
      ];
      
      if (Math.random() > 0.6) {
        setLogs(prev => [{
          id: Math.random().toString(36).substr(2, 9),
          time: new Date().toLocaleTimeString(),
          level: levels[Math.floor(Math.random() * levels.length)],
          msg: msgs[Math.floor(Math.random() * msgs.length)]
        }, ...prev.slice(0, 19)]);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'therapist',
    status: 'active'
  });

  const handleUpdateUser = (updatedUser: User) => {
    onUpdateUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setEditingUser(null);
  };

  const handleUpdateModuleRole = (modId: string, role: UserRole) => {
    onUpdateModules(modules.map(m => m.id === modId ? { ...m, minRole: role } : m));
  };

  const handleUpdateModuleConfig = (modId: string, key: string, value: any) => {
    onUpdateModules(modules.map(m => {
      if (m.id === modId) {
        return { ...m, config: { ...m.config, [key]: value } };
      }
      return m;
    }));
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm("Bu kullanıcının sistem erişimini kalıcı olarak silmek istediğinize emin misiniz?")) {
      onUpdateUsers(users.filter(u => u.id !== id));
    }
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    const userToAdd: User = {
      id: `u-${Date.now()}`,
      name: newUser.name as string,
      email: newUser.email as string,
      role: newUser.role as UserRole,
      status: 'active',
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
      joinedAt: new Date().toLocaleDateString()
    };
    onUpdateUsers([...users, userToAdd]);
    setIsAddingUser(false);
    setNewUser({ name: '', email: '', role: 'therapist', status: 'active' });
  };

  const filteredModules = useMemo(() => {
    return modules.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = 
        moduleFilter === 'all' ? true :
        moduleFilter === 'enabled' ? m.enabled : !m.enabled;
      return matchesSearch && matchesStatus;
    });
  }, [modules, search, moduleFilter]);

  return (
    <div className="flex-1 flex overflow-hidden bg-[#020408] font-mono selection:bg-primary/30">
      {/* Dynamic Command Sidebar */}
      <aside className="w-80 bg-[#080B12] border-r border-white/5 flex flex-col p-8 gap-10 shrink-0">
        <div className="px-6 py-8 bg-primary/5 border border-primary/20 rounded-[40px] relative overflow-hidden group">
           <div className="absolute -top-4 -right-4 size-24 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
           <div className="text-[9px] font-black text-primary uppercase tracking-[0.5em] mb-2">ROOT ERİŞİMİ AKTİF</div>
           <div className="text-white font-black text-2xl italic tracking-tighter uppercase leading-none">Omni Kontrol <span className="text-primary">v9.4</span></div>
           <div className="mt-4 flex items-center gap-2">
              <span className="size-2 bg-emerald-500 rounded-full animate-pulse shadow-primary-glow"></span>
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Sistem: Kararlı / Online</span>
           </div>
        </div>

        <nav className="space-y-3">
           <AdminNavBtn active={activeTab === 'users'} icon="identity_platform" label="Kimlik Yönetimi" onClick={() => setActiveTab('users')} />
           <AdminNavBtn active={activeTab === 'modules'} icon="grid_view" label="Sistem Matrisi" onClick={() => setActiveTab('modules')} />
           <AdminNavBtn active={activeTab === 'security'} icon="policy" label="Güvenlik Politikaları" onClick={() => setActiveTab('security')} />
           <AdminNavBtn active={activeTab === 'system'} icon="terminal" label="Ana Terminal" onClick={() => setActiveTab('system')} />
        </nav>

        <div className="mt-auto space-y-6 pt-8 border-t border-white/5">
           <SidebarStat label="YETKİ MOTORU" value="DİNAMİK RBAC" color="text-primary" />
           <SidebarStat label="API BÖLGESİ" value="BATI AVRUPA" color="text-slate-500" />
           <div className="h-12 w-full bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">T - {new Date().toLocaleTimeString()}</span>
           </div>
        </div>
      </aside>

      {/* Main Command Workspace */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.02),transparent_40%)]">
         <header className="h-28 border-b border-white/5 flex items-center justify-between px-14 bg-[#080B12]/60 backdrop-blur-3xl sticky top-0 z-20">
            <div className="flex flex-col">
               <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
                  {activeTab === 'modules' && 'Mimari Matris'}
                  {activeTab === 'users' && 'Kimlik Yönetim Merkezi'}
                  {activeTab === 'security' && 'Güvenlik Duvarı ve Yönetim'}
                  {activeTab === 'system' && 'Altyapı Çekirdeği'}
               </h2>
               <div className="flex items-center gap-4 mt-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] italic">Küme: Ana Sunucu Düğümü</span>
                  <div className="h-3 w-px bg-white/10"></div>
                  <span className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">Yönetici Yetkileri: AKTİF</span>
               </div>
            </div>

            <div className="flex items-center gap-8">
               <div className="relative group">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 text-lg">manage_search</span>
                  <input 
                    className="bg-white/5 border border-white/10 rounded-[20px] pl-14 pr-8 py-4 text-[11px] text-white uppercase font-black focus:border-primary outline-none transition-all w-80 placeholder:text-slate-700 shadow-inner" 
                    placeholder="SİSTEM İZLEME..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
               </div>
               <div className="flex gap-2">
                  <button className="size-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all"><span className="material-symbols-outlined">notifications</span></button>
                  <button className="size-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all"><span className="material-symbols-outlined font-black">logout</span></button>
               </div>
            </div>
         </header>

         <div className="flex-1 overflow-y-auto p-14 no-scrollbar">
            {activeTab === 'users' && (
               <div className="space-y-12 animate-in fade-in duration-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <QuickStat label="TOPLAM KİMLİK" value={users.length} icon="group" color="text-primary" />
                     <QuickStat label="AKTİF SEANSLAR" value="14" icon="videocam" color="text-emerald-500" />
                     <QuickStat label="GÜVENLİK İHLALİ" value="0" icon="security" color="text-rose-500" />
                  </div>

                  <div className="bg-[#0C0F16] rounded-[56px] border border-white/5 overflow-hidden shadow-3xl">
                     <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">İşletim Yetkisi Matrisi</h3>
                        <button onClick={() => setIsAddingUser(true)} className="px-10 py-4 bg-primary text-white text-[11px] font-black uppercase rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-4">
                           <span className="material-symbols-outlined text-lg font-black">person_add</span>
                           YENİ KİMLİK EKLE
                        </button>
                     </div>
                     <div className="overflow-x-auto">
                       <table className="w-full text-left min-w-[1100px]">
                          <thead>
                             <tr className="bg-white/[0.01] text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">
                                <th className="px-12 py-8">Kimlik Anahtarı</th>
                                <th className="px-12 py-8">Erişim Rolü</th>
                                <th className="px-12 py-8">Sağlık Durumu</th>
                                <th className="px-12 py-8">Son İşlem</th>
                                <th className="px-12 py-8 text-right">Yönetici Aksiyonları</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                             {users.filter(u => u.name.toLowerCase().includes(search.toLowerCase())).map(u => (
                               <tr key={u.id} className="group hover:bg-white/[0.03] transition-all">
                                  <td className="px-12 py-8">
                                     <div className="flex items-center gap-6">
                                        <div className="size-12 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all border-2 border-white/5">
                                           <img src={u.avatar || `https://i.pravatar.cc/150?u=${u.id}`} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div>
                                           <div className="text-sm font-black text-white italic uppercase leading-none mb-1">{u.name}</div>
                                           <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{u.email}</div>
                                        </div>
                                     </div>
                                  </td>
                                  <td className="px-12 py-8">
                                     <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border-2 ${
                                       u.role === 'admin' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                       u.role === 'therapist' ? 'bg-primary/10 text-primary border-primary/20' :
                                       'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                     }`}>{u.role}</span>
                                  </td>
                                  <td className="px-12 py-8">
                                     <div className={`flex items-center gap-3 font-black text-[11px] uppercase ${u.status === 'active' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        <div className={`size-2 rounded-full ${u.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-50'}`}></div>
                                        {u.status === 'active' ? 'GÜVENLİ' : 'ASKIYA ALINDI'}
                                     </div>
                                  </td>
                                  <td className="px-12 py-8 font-mono text-[11px] text-slate-500 italic uppercase">
                                     {new Date().toLocaleDateString()} OK
                                  </td>
                                  <td className="px-12 py-8 text-right">
                                     <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setEditingUser(u)} className="size-11 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/5"><span className="material-symbols-outlined text-lg">settings</span></button>
                                        <button onClick={() => handleDeleteUser(u.id)} className="size-11 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20"><span className="material-symbols-outlined text-lg">delete_forever</span></button>
                                     </div>
                                  </td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'modules' && (
               <div className="space-y-12 animate-in fade-in duration-700">
                  <div className="flex items-center justify-between bg-white/[0.02] p-10 rounded-[48px] border border-white/5 shadow-inner">
                     <div className="flex items-center gap-10">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Matris Filtresi:</span>
                        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
                           {(['all', 'enabled', 'disabled'] as const).map(f => (
                             <button key={f} onClick={() => setModuleFilter(f)} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${moduleFilter === f ? 'bg-primary text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>
                               {f === 'all' ? 'TÜMÜ' : f === 'enabled' ? 'AKTİF' : 'PASİF'}
                             </button>
                           ))}
                        </div>
                     </div>
                     <div className="flex items-center gap-4 px-6 py-3 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Toplam Modül: {filteredModules.length}</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-10">
                     {filteredModules.map(mod => (
                       <div key={mod.id} className={`bg-[#0C0F16] p-12 rounded-[64px] border-2 transition-all relative overflow-hidden group ${mod.enabled ? 'border-white/5 shadow-3xl' : 'border-rose-500/10 opacity-60 grayscale'}`}>
                          <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:rotate-12 transition-transform duration-1000">
                             <span className="material-symbols-outlined text-[180px]">{mod.icon}</span>
                          </div>
                          
                          <div className="relative z-10 flex flex-col h-full">
                             <div className="flex items-start justify-between mb-10">
                                <div className="flex items-center gap-8">
                                   <div className={`size-16 rounded-[28px] flex items-center justify-center transition-all ${mod.enabled ? 'bg-primary text-white shadow-primary-glow shadow-xl' : 'bg-slate-800 text-slate-500'}`}>
                                      <span className="material-symbols-outlined text-4xl">{mod.icon}</span>
                                   </div>
                                   <div>
                                      <h3 className="text-2xl font-black text-white italic tracking-tight mb-2 uppercase leading-none">{mod.name}</h3>
                                      <div className="flex items-center gap-3">
                                         <span className={`size-2 rounded-full ${mod.enabled ? 'bg-emerald-500 animate-pulse shadow-emerald-500/50' : 'bg-rose-500'}`}></span>
                                         <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/5">{mod.category}</span>
                                      </div>
                                   </div>
                                </div>
                                <button onClick={() => onUpdateModules(modules.map(m => m.id === mod.id ? { ...m, enabled: !m.enabled } : m))} className={`w-14 h-8 rounded-full transition-all relative shrink-0 ${mod.enabled ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-slate-800'}`}>
                                   <div className={`absolute top-1 size-6 bg-white rounded-full transition-all ${mod.enabled ? 'left-7' : 'left-1'}`}></div>
                                </button>
                             </div>
                             
                             <p className="text-slate-500 text-[12px] font-medium leading-relaxed italic mb-12 line-clamp-3">"{mod.description}"</p>
                             
                             <div className="mt-auto pt-8 border-t border-white/5 space-y-6">
                                <div className="flex items-center justify-between">
                                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">RBAC SEVİYESİ</label>
                                   <select value={mod.minRole} onChange={(e) => handleUpdateModuleRole(mod.id, e.target.value as UserRole)} className="bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase rounded-xl px-4 py-2 outline-none focus:border-primary transition-all cursor-pointer appearance-none shadow-inner">
                                      <option value="client" className="bg-[#0C0F16]">VAKA (DANIŞAN)</option>
                                      <option value="therapist" className="bg-[#0C0F16]">UZMAN (TERAPİST)</option>
                                      <option value="admin" className="bg-[#0C0F16]">ROOT (YÖNETİCİ)</option>
                                   </select>
                                </div>
                                <button onClick={() => setConfiguringModule(mod)} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                                   <span className="material-symbols-outlined text-lg">tune</span>
                                   KONFİGÜRASYONU YÖNET
                                </button>
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            )}
            
            {/* Security and System tabs would follow similar natural naming */}
            {activeTab === 'security' && (
               <div className="space-y-12 animate-in fade-in duration-700">
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                     <div className="xl:col-span-8 space-y-10">
                        <div className="bg-[#0C0F16] rounded-[56px] border border-white/5 p-12 shadow-3xl">
                           <div className="flex items-center justify-between mb-12">
                              <div>
                                 <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Siber Tehdit Tanılaması</h3>
                                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Canlı Güvenlik Duvarı Metrikleri</p>
                              </div>
                              <div className="px-6 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest">GÜVENLİ DÜZEY</div>
                           </div>
                           
                           <div className="space-y-6">
                              <SecurityRule label="Şifreleme (AES-256-GCM)" status="SAĞLIKLI" value="100%" />
                              <SecurityRule label="Anomali Tespit Motoru" status="TARIYOR" value="98.2%" />
                              <SecurityRule label="Oturum Ele Geçirme Koruması" status="SAĞLIKLI" value="100%" />
                              <SecurityRule label="Erişim Doğrulaması" status="SAĞLIKLI" value="100%" />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </main>
    </div>
  );
};

const AdminNavBtn: React.FC<{ active: boolean, icon: string, label: string, onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-6 px-8 py-5 rounded-[24px] transition-all relative group ${active ? 'bg-primary text-white shadow-3xl shadow-primary/30 scale-105' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}>
     <span className={`material-symbols-outlined text-[28px] ${active ? 'animate-pulse' : ''}`}>{icon}</span>
     <span className="text-[11px] font-black uppercase tracking-[0.3em]">{label}</span>
     {active && <div className="absolute left-0 w-2 h-8 bg-white rounded-r-full"></div>}
  </button>
);

const SidebarStat: React.FC<{ label: string, value: string, color: string }> = ({ label, value, color }) => (
  <div className="flex flex-col gap-2 px-3">
     <div className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em]">{label}</div>
     <div className={`text-[12px] font-black italic tracking-tighter uppercase ${color}`}>{value}</div>
  </div>
);

const QuickStat: React.FC<{ label: string, value: string | number, icon: string, color: string }> = ({ label, value, icon, color }) => (
  <div className="bg-[#0C0F16] p-10 rounded-[48px] border border-white/5 shadow-xl relative group hover:-translate-y-2 transition-all">
     <div className={`size-14 rounded-2xl bg-white/5 flex items-center justify-center ${color} mb-6 border border-white/10 group-hover:scale-110 transition-transform`}>
        <span className="material-symbols-outlined text-3xl font-black">{icon}</span>
     </div>
     <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</div>
     <div className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">{value}</div>
  </div>
);

const SecurityRule: React.FC<{ label: string, status: string, value: string }> = ({ label, status, value }) => (
  <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/[0.08] transition-all group">
     <div className="flex items-center gap-6">
        <div className={`size-10 rounded-xl flex items-center justify-center font-black text-[10px] ${status === 'SAĞLIKLI' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'}`}>
           <span className="material-symbols-outlined text-lg">{status === 'SAĞLIKLI' ? 'verified' : 'sync'}</span>
        </div>
        <div>
           <div className="text-sm font-black text-white italic uppercase tracking-tight">{label}</div>
           <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{status} PROTOKOLÜ</div>
        </div>
     </div>
     <div className="text-xl font-black text-white italic">{value}</div>
  </div>
);

export default AdminPortal;
