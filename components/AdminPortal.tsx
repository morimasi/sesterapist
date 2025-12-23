
import React, { useState, useMemo } from 'react';
import { User, PlatformModule, UserRole } from '../types';

interface AdminPortalProps {
  modules: PlatformModule[];
  onUpdateModules: (newModules: PlatformModule[]) => void;
  users: User[];
  onUpdateUsers: (newUsers: User[]) => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ modules, onUpdateModules, users, onUpdateUsers }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'modules' | 'sessions' | 'system'>('users');
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [editingModule, setEditingModule] = useState<PlatformModule | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);

  // --- Kullanıcı Oluşturma State ---
  const [newUser, setNewUser] = useState<Partial<User>>({
    role: 'client',
    status: 'active',
    subscription: { plan: 'Free', status: 'active', nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
  });

  // --- Modül Mantığı ---
  const toggleModule = (id: string) => {
    onUpdateModules(modules.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
  };

  const updateModuleRole = (id: string, role: UserRole) => {
    onUpdateModules(modules.map(m => m.id === id ? { ...m, minRole: role } : m));
  };

  const handleSaveConfig = (config: Record<string, any>) => {
    if (!editingModule) return;
    onUpdateModules(modules.map(m => m.id === editingModule.id ? { ...m, config } : m));
    setEditingModule(null);
  };

  // --- Kullanıcı İşlemleri ---
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                           u.email?.toLowerCase().includes(search.toLowerCase());
      const matchesRole = filterRole === 'all' || u.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [users, search, filterRole]);

  const handleUpdateUser = (updated: User) => {
    onUpdateUsers(users.map(u => u.id === updated.id ? updated : u));
    setEditingUser(null);
  };

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email) {
      alert("Lütfen ad ve e-posta bilgilerini girin.");
      return;
    }
    const createdUser: User = {
      id: `u-${Date.now()}`,
      name: newUser.name!,
      email: newUser.email!,
      role: (newUser.role as UserRole) || 'client',
      status: (newUser.status as any) || 'active',
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
      joinedAt: new Date().toISOString().split('T')[0],
      subscription: newUser.subscription as any,
      stats: { totalSessions: 0, completionRate: 0, xp: 0 }
    };

    onUpdateUsers([...users, createdUser]);
    setIsAddingUser(false);
    setNewUser({
      role: 'client',
      status: 'active',
      subscription: { plan: 'Free', status: 'active', nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
    });
  };

  const handleToggleUserStatus = (id: string) => {
    onUpdateUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'active' ? 'suspended' : 'active' };
      }
      return u;
    }));
  };

  const renderConfigForm = (mod: PlatformModule) => {
    switch (mod.id) {
      case 'assessment': return <AIConfigForm config={mod.config} onSave={handleSaveConfig} />;
      case 'session': return <SessionConfigForm config={mod.config} onSave={handleSaveConfig} />;
      case 'academic': return <AcademicConfigForm config={mod.config} onSave={handleSaveConfig} />;
      case 'gamification': return <GamificationConfigForm config={mod.config} onSave={handleSaveConfig} />;
      case 'library': return <LibraryConfigForm config={mod.config} onSave={handleSaveConfig} />;
      default: return <GenericJSONConfigForm config={mod.config} onSave={handleSaveConfig} />;
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#080B12] font-sans selection:bg-primary/30">
      {/* Sidebar */}
      <aside className="w-72 bg-[#111827] border-r border-white/5 flex flex-col p-6 gap-8">
        <div className="px-4 py-4 bg-primary/10 border border-primary/20 rounded-2xl">
           <div className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-1">TheraSpeech</div>
           <div className="text-white font-black text-lg italic tracking-tighter">OmniPanel v6.0</div>
        </div>
        <nav className="space-y-2">
           <AdminNavBtn active={activeTab === 'users'} icon="group" label="Kullanıcılar" onClick={() => setActiveTab('users')} />
           <AdminNavBtn active={activeTab === 'modules'} icon="extension" label="Modül Matrisi" onClick={() => setActiveTab('modules')} />
           <AdminNavBtn active={activeTab === 'sessions'} icon="videocam" label="Canlı İzleme" onClick={() => setActiveTab('sessions')} />
           <AdminNavBtn active={activeTab === 'system'} icon="terminal" label="Sistem Sağlığı" onClick={() => setActiveTab('system')} />
        </nav>
        <div className="mt-auto p-6 bg-white/5 rounded-3xl border border-white/5">
           <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">DB_SYNC_STATUS</div>
           <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold">
              <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Live Connected
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
         <header className="h-24 border-b border-white/5 flex items-center justify-between px-10 bg-[#0F172A]/40 backdrop-blur-3xl">
            <div>
               <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">
                  {activeTab === 'users' ? 'Kimlik_ve_Erisim_Yonetimi' : 'Modül_Kontrol_Matrisi'}
               </h2>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Platform erişimlerini global seviyede yönetin.</p>
            </div>
            
            <div className="flex items-center gap-4">
               {activeTab === 'users' && (
                 <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setIsAddingUser(true)}
                      className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all flex items-center gap-3 active:scale-95"
                    >
                       <span className="material-symbols-outlined text-lg">person_add</span>
                       Yeni Kullanıcı Ekle
                    </button>
                    <div className="h-8 w-px bg-white/10 mx-2"></div>
                    <select 
                      value={filterRole} 
                      onChange={(e) => setFilterRole(e.target.value as any)}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none focus:border-primary appearance-none cursor-pointer"
                    >
                        <option value="all">Tüm Roller</option>
                        <option value="therapist">Terapistler</option>
                        <option value="client">Danışanlar</option>
                        <option value="admin">Yöneticiler</option>
                    </select>
                 </div>
               )}
               <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
                  <input className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-sm text-white w-64 outline-none focus:border-primary focus:w-80 transition-all" placeholder="Ara..." value={search} onChange={(e) => setSearch(e.target.value)} />
               </div>
            </div>
         </header>

         <div className="flex-1 overflow-y-auto p-10 no-scrollbar">
            {activeTab === 'modules' && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                 {modules.filter(m => m.name.toLowerCase().includes(search.toLowerCase())).map(mod => (
                   <div key={mod.id} className={`bg-[#111827] p-8 rounded-[48px] border-2 transition-all relative overflow-hidden flex flex-col gap-6 ${mod.enabled ? 'border-white/5 hover:border-primary/30' : 'border-rose-500/20 opacity-60'}`}>
                      <div className="flex items-start gap-6 relative z-10">
                         <div className={`size-16 rounded-3xl flex items-center justify-center ${mod.enabled ? 'bg-primary/20 text-primary' : 'bg-slate-800 text-slate-500'}`}>
                            <span className="material-symbols-outlined text-4xl">{mod.icon}</span>
                         </div>
                         <div className="flex-1">
                            <h3 className="text-xl font-black text-white italic tracking-tight mb-1">{mod.name}</h3>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">{mod.description}</p>
                         </div>
                         <button onClick={() => toggleModule(mod.id)} className={`w-14 h-8 rounded-full transition-all relative ${mod.enabled ? 'bg-emerald-500' : 'bg-slate-800'}`}>
                            <div className={`absolute top-1 size-6 bg-white rounded-full transition-all ${mod.enabled ? 'left-7' : 'left-1'}`}></div>
                         </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                         <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Min_Erisim</label>
                            <select value={mod.minRole} onChange={(e) => updateModuleRole(mod.id, e.target.value as UserRole)} className="w-full bg-black/40 border border-white/10 rounded-xl text-[10px] font-black text-primary uppercase px-4 py-2.5 outline-none">
                               <option value="therapist">Terapist</option>
                               <option value="client">Danışan</option>
                               <option value="admin">Admin</option>
                            </select>
                         </div>
                         <button onClick={() => setEditingModule(mod)} className="mt-auto py-3.5 bg-white/5 hover:bg-white/10 text-white font-black text-[10px] uppercase rounded-xl border border-white/5 flex items-center justify-center gap-3">
                            <span className="material-symbols-outlined text-sm">settings_suggest</span> Gelişmiş Ayarlar
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="bg-[#111827] rounded-[48px] border border-white/5 overflow-hidden shadow-2xl">
                 <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5">
                       <tr>
                          <th className="px-10 py-6">Kullanıcı / Kimlik</th>
                          <th className="px-10 py-6">Rol Mevkisi</th>
                          <th className="px-10 py-6">Canlı Durum</th>
                          <th className="px-10 py-6">Abonelik Verisi</th>
                          <th className="px-10 py-6 text-right">Matris İşlemleri</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {filteredUsers.length > 0 ? filteredUsers.map(u => (
                         <tr key={u.id} className="group hover:bg-white/[0.02] transition-colors">
                            <td className="px-10 py-6">
                               <div className="flex items-center gap-4">
                                  <div className="size-12 rounded-2xl bg-slate-800 border-2 border-white/5 overflow-hidden shadow-lg group-hover:scale-110 transition-transform">
                                     <img src={u.avatar || `https://i.pravatar.cc/150?u=${u.id}`} className="w-full h-full object-cover" alt="" />
                                  </div>
                                  <div>
                                     <div className="text-sm font-black text-white italic tracking-tight">{u.name}</div>
                                     <div className="text-[10px] text-slate-500 font-bold">{u.email || 'email_yok@theraspeech.com'}</div>
                                  </div>
                               </div>
                            </td>
                            <td className="px-10 py-6">
                               <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                 u.role === 'admin' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                                 u.role === 'therapist' ? 'bg-primary/10 text-primary border-primary/20' : 
                                 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                               }`}>
                                  {u.role}
                               </span>
                            </td>
                            <td className="px-10 py-6">
                               <div className="flex items-center gap-2">
                                  <span className={`size-2 rounded-full ${u.status === 'active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]'}`}></span>
                                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{u.status === 'active' ? 'AKTİF' : 'ASKIDA'}</span>
                               </div>
                            </td>
                            <td className="px-10 py-6">
                               <div className="text-[10px] font-black text-primary uppercase mb-1">{u.subscription?.plan || 'Free'} Plan</div>
                               <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Dönem Sonu: {u.subscription?.nextBillingDate || 'N/A'}</div>
                            </td>
                            <td className="px-10 py-6 text-right">
                               <div className="flex items-center justify-end gap-2">
                                  <button onClick={() => setEditingUser(u)} className="size-10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all shadow-inner"><span className="material-symbols-outlined text-lg font-bold">edit</span></button>
                                  <button onClick={() => handleToggleUserStatus(u.id)} className={`size-10 text-white rounded-xl transition-all shadow-inner ${u.status === 'active' ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}>
                                     <span className="material-symbols-outlined text-lg font-bold">{u.status === 'active' ? 'block' : 'check_circle'}</span>
                                  </button>
                               </div>
                            </td>
                         </tr>
                       )) : (
                         <tr>
                            <td colSpan={5} className="py-40 text-center">
                               <span className="material-symbols-outlined text-6xl text-slate-800 mb-6">person_search</span>
                               <p className="text-slate-500 font-black italic uppercase tracking-widest">Kayıt Bulunamadı.</p>
                            </td>
                         </tr>
                       )}
                    </tbody>
                 </table>
              </div>
            )}
         </div>
      </main>

      {/* --- ADD USER MODAL --- */}
      {isAddingUser && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-10 bg-black/95 backdrop-blur-2xl animate-in fade-in zoom-in duration-300">
           <div className="bg-[#111827] w-full max-w-2xl rounded-[56px] border-2 border-primary/20 p-12 flex flex-col gap-10 shadow-3xl relative overflow-hidden">
              <div className="absolute -top-20 -right-20 size-64 bg-primary/5 rounded-full blur-3xl"></div>
              
              <div className="flex items-center justify-between relative z-10">
                 <div className="flex items-center gap-6">
                    <div className="size-16 bg-primary text-white rounded-3xl flex items-center justify-center shadow-xl shadow-primary/20">
                       <span className="material-symbols-outlined text-3xl font-black">person_add</span>
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">YENI KAYIT EKLE</h3>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Sisteme yeni uzman veya danışan tanımlayın</p>
                    </div>
                 </div>
                 <button onClick={() => setIsAddingUser(false)} className="size-12 rounded-2xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"><span className="material-symbols-outlined">close</span></button>
              </div>

              <div className="space-y-6 relative z-10">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block ml-2">Tam İsim</label>
                       <input 
                         value={newUser.name || ''} 
                         onChange={e => setNewUser({...newUser, name: e.target.value})} 
                         placeholder="Örn: Dr. Berk Atan"
                         className="w-full bg-black/40 border-2 border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-sm outline-none focus:border-primary transition-all" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block ml-2">E-Posta Adresi</label>
                       <input 
                         value={newUser.email || ''} 
                         onChange={e => setNewUser({...newUser, email: e.target.value})} 
                         placeholder="uzman@theraspeech.ai"
                         className="w-full bg-black/40 border-2 border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-sm outline-none focus:border-primary transition-all" 
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block ml-2">Platform Rolü</label>
                       <select 
                         value={newUser.role} 
                         onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})} 
                         className="w-full bg-black/40 border-2 border-white/10 rounded-2xl px-6 py-4 text-white font-black text-xs uppercase outline-none focus:border-primary cursor-pointer"
                       >
                          <option value="client">Client (Danışan)</option>
                          <option value="therapist">Therapist (Uzman)</option>
                          <option value="admin">Admin (Yönetici)</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block ml-2">Abonelik Planı</label>
                       <select 
                         value={newUser.subscription?.plan} 
                         onChange={e => setNewUser({...newUser, subscription: { ...newUser.subscription!, plan: e.target.value as any }})} 
                         className="w-full bg-black/40 border-2 border-white/10 rounded-2xl px-6 py-4 text-white font-black text-xs uppercase outline-none focus:border-primary cursor-pointer"
                       >
                          <option value="Free">Free Plan</option>
                          <option value="Basic">Basic Plan</option>
                          <option value="Pro">Pro Plan</option>
                          <option value="Clinic">Clinic Paketi</option>
                       </select>
                    </div>
                 </div>

                 <div className="p-6 bg-primary/5 border border-primary/10 rounded-[32px] flex items-center gap-6">
                    <span className="material-symbols-outlined text-primary text-4xl">info_sparkle</span>
                    <p className="text-xs text-slate-400 font-medium italic leading-relaxed">
                       Yeni kullanıcı oluşturulduğunda varsayılan klinik metrikler (%0 başarı, 0 seans) otomatik olarak atanır ve sistem aktivasyon e-postası gönderilir.
                    </p>
                 </div>
              </div>

              <div className="pt-8 border-t border-white/5 flex gap-4 relative z-10">
                 <button onClick={() => setIsAddingUser(false)} className="px-10 py-5 bg-white/5 text-white font-black rounded-[24px] hover:bg-white/10 transition-all uppercase text-[11px] tracking-widest">VAZGEÇ</button>
                 <button 
                   onClick={handleCreateUser} 
                   className="flex-1 py-5 bg-primary text-white font-black rounded-[24px] shadow-3xl shadow-primary/30 hover:bg-primary-dark transition-all uppercase text-[11px] tracking-[0.2em] active:scale-95"
                 >
                    KAYDI VERİTABANINA EKLE
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* --- USER EDIT MODAL --- */}
      {editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-10 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-[#111827] w-full max-w-4xl rounded-[56px] border-2 border-primary/20 p-12 flex flex-col gap-10 overflow-hidden shadow-3xl">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-6">
                    <div className="size-20 bg-slate-800 rounded-3xl border-4 border-white/5 overflow-hidden">
                       <img src={editingUser.avatar || `https://i.pravatar.cc/150?u=${editingUser.id}`} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">{editingUser.name} PROFILI</h3>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Kullanıcı Kimlik ve Yetki Düzenleyici</p>
                    </div>
                 </div>
                 <button onClick={() => setEditingUser(null)} className="size-14 rounded-[24px] bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"><span className="material-symbols-outlined text-2xl font-bold">close</span></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 overflow-y-auto pr-4 no-scrollbar">
                 {/* Basic Info */}
                 <div className="space-y-6">
                    <div className="bg-white/5 p-8 rounded-[40px] border border-white/5 space-y-6">
                       <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Temel_Bilgiler</h4>
                       <div className="space-y-4">
                          <div>
                             <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">E-Posta Adresi</label>
                             <input value={editingUser.email || ''} onChange={e => setEditingUser({...editingUser, email: e.target.value})} className="w-full bg-black/40 border-2 border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-sm outline-none focus:border-primary transition-all" />
                          </div>
                          <div>
                             <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Kullanıcı Rolü</label>
                             <select value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value as UserRole})} className="w-full bg-black/40 border-2 border-white/10 rounded-2xl px-6 py-4 text-white font-black text-xs uppercase outline-none focus:border-primary cursor-pointer transition-all">
                                <option value="client">Client (Danışan)</option>
                                <option value="therapist">Therapist (Uzman)</option>
                                <option value="admin">Admin (Yönetici)</option>
                             </select>
                          </div>
                       </div>
                    </div>

                    <div className="bg-white/5 p-8 rounded-[40px] border border-white/5 space-y-6">
                       <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Klinik_Istatistikler</h4>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                             <div className="text-[9px] font-black text-slate-500 uppercase mb-1">Toplam Seans</div>
                             <div className="text-xl font-black text-white italic">{editingUser.stats?.totalSessions || 0}</div>
                          </div>
                          <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                             <div className="text-[9px] font-black text-slate-500 uppercase mb-1">Başarı Skoru</div>
                             <div className="text-xl font-black text-emerald-500 italic">%{editingUser.stats?.completionRate || 0}</div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Subscription & Advanced */}
                 <div className="space-y-6">
                    <div className="bg-primary/5 p-8 rounded-[40px] border border-primary/20 space-y-6">
                       <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Abonelik_Yonetimi</h4>
                       <div className="space-y-4">
                          <div>
                             <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Mevcut Plan</label>
                             <select 
                               value={editingUser.subscription?.plan || 'Free'} 
                               onChange={e => setEditingUser({
                                 ...editingUser, 
                                 subscription: { 
                                   ...(editingUser.subscription || { status: 'active', nextBillingDate: '2024-12-31' }), 
                                   plan: e.target.value as any 
                                 }
                               })} 
                               className="w-full bg-black/40 border-2 border-white/10 rounded-2xl px-6 py-4 text-white font-black text-xs uppercase outline-none focus:border-primary cursor-pointer transition-all"
                             >
                                <option value="Free">Free Plan</option>
                                <option value="Basic">Basic Plan</option>
                                <option value="Pro">Pro Plan</option>
                                <option value="Clinic">Clinic Enterprise</option>
                             </select>
                          </div>
                          <div>
                             <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Sıradaki Ödeme Tarihi</label>
                             <input 
                               type="date"
                               value={editingUser.subscription?.nextBillingDate || ''} 
                               onChange={e => setEditingUser({
                                 ...editingUser, 
                                 subscription: { 
                                   ...(editingUser.subscription || { status: 'active', plan: 'Free' }), 
                                   nextBillingDate: e.target.value 
                                 }
                               })} 
                               className="w-full bg-black/40 border-2 border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-sm outline-none focus:border-primary transition-all" 
                             />
                          </div>
                       </div>
                    </div>

                    <div className="p-8 bg-rose-500/10 rounded-[40px] border border-rose-500/20">
                       <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-4">Tehlikeli_Bolge</h4>
                       <div className="space-y-4">
                          <button onClick={() => handleToggleUserStatus(editingUser.id)} className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase transition-all ${editingUser.status === 'active' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
                             {editingUser.status === 'active' ? 'HESABI DONDUR' : 'HESABI AKTIF ET'}
                          </button>
                          <button className="w-full py-4 bg-white/5 text-slate-500 hover:text-white rounded-2xl font-black text-[10px] uppercase transition-all">
                             ŞİFRE SIFIRLAMA LİNKİ GÖNDER
                          </button>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex gap-4 mt-auto">
                 <button onClick={() => setEditingUser(null)} className="px-10 py-5 bg-white/5 text-white font-black rounded-[24px] hover:bg-white/10 transition-all uppercase text-[11px] tracking-widest">IPTAL</button>
                 <button onClick={() => handleUpdateUser(editingUser)} className="flex-1 py-5 bg-primary text-white font-black rounded-[24px] shadow-3xl shadow-primary/30 hover:bg-primary-dark transition-all uppercase text-[11px] tracking-[0.2em] active:scale-95">DEGISIKLIKLERI VERITABANINA YAZ</button>
              </div>
           </div>
        </div>
      )}

      {/* --- MODULE EDIT MODAL --- */}
      {editingModule && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-10 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-[#111827] w-full max-w-2xl rounded-[56px] border-2 border-primary/20 p-12 flex flex-col gap-10 shadow-3xl">
              <div className="flex items-center justify-between">
                 <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">{editingModule.name} AYARLARI</h3>
                 <button onClick={() => setEditingModule(null)} className="size-12 rounded-2xl bg-white/5 text-slate-400 hover:text-white flex items-center justify-center"><span className="material-symbols-outlined font-black">close</span></button>
              </div>
              <div className="space-y-8 overflow-y-auto max-h-[500px] pr-4 no-scrollbar">
                 {renderConfigForm(editingModule)}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// --- Formlar & Yardımcı Bileşenler ---

const AdminNavBtn: React.FC<{ active: boolean, icon: string, label: string, onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
     <span className="material-symbols-outlined text-2xl font-bold">{icon}</span>
     <span className="text-xs font-black uppercase tracking-widest">{label}</span>
  </button>
);

const AIConfigForm: React.FC<{ config: any, onSave: (c: any) => void }> = ({ config, onSave }) => {
  const [local, setLocal] = useState(config || { model: 'gemini-3-flash-preview', thinkingBudget: 16000 });
  return (
    <div className="space-y-6">
       <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase mb-3">AI Model</label>
          <select value={local.model} onChange={e => setLocal({...local, model: e.target.value})} className="w-full bg-black/40 border-2 border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-primary cursor-pointer transition-all">
             <option value="gemini-3-flash-preview">Gemini 3 Flash</option>
             <option value="gemini-3-pro-preview">Gemini 3 Pro</option>
          </select>
       </div>
       <button onClick={() => onSave(local)} className="w-full py-5 bg-primary text-white font-black rounded-2xl uppercase tracking-widest text-[11px] active:scale-95 transition-all">KAYDET</button>
    </div>
  );
};

const GenericJSONConfigForm: React.FC<{ config: any, onSave: (c: any) => void }> = ({ config, onSave }) => {
  const [raw, setRaw] = useState(JSON.stringify(config || {}, null, 2));
  const [err, setErr] = useState<string | null>(null);
  const handleSave = () => {
    try { const parsed = JSON.parse(raw); onSave(parsed); setErr(null); } catch (e) { setErr("Geçersiz JSON formatı."); }
  };
  return (
    <div className="space-y-6">
       <textarea value={raw} onChange={e => setRaw(e.target.value)} className="w-full h-64 bg-black/60 border border-white/10 rounded-2xl p-6 font-mono text-sm text-emerald-400 focus:border-primary outline-none transition-all shadow-inner" />
       {err && <p className="text-rose-500 text-xs font-bold">{err}</p>}
       <button onClick={handleSave} className="w-full py-5 bg-primary text-white font-black rounded-2xl uppercase tracking-widest text-[11px] active:scale-95 transition-all">SİSTEM VERİSİNİ GÜNCELLE</button>
    </div>
  );
};

const GamificationConfigForm: React.FC<{ config: any, onSave: (c: any) => void }> = ({ config, onSave }) => {
  const [local, setLocal] = useState(config || { xpMultiplier: 1.0, dailyQuestCount: 3 });
  return (
    <div className="space-y-6">
       <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase mb-3">XP Çarpanı: {local.xpMultiplier}x</label>
          <input type="range" min="1" max="5" step="0.1" value={local.xpMultiplier} onChange={e => setLocal({...local, xpMultiplier: parseFloat(e.target.value)})} className="w-full h-2 bg-white/5 rounded-full accent-primary appearance-none cursor-pointer" />
       </div>
       <button onClick={() => onSave(local)} className="w-full py-5 bg-primary text-white font-black rounded-2xl uppercase tracking-widest text-[11px] active:scale-95 transition-all">KAYDET</button>
    </div>
  );
};

const LibraryConfigForm: React.FC<{ config: any, onSave: (c: any) => void }> = ({ config, onSave }) => {
  const [local, setLocal] = useState(config || { aiImageGen: true, maxResults: 20 });
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
          <span className="text-white font-bold text-sm">AI Görsel Üretimi</span>
          <button onClick={() => setLocal({...local, aiImageGen: !local.aiImageGen})} className={`w-14 h-8 rounded-full transition-all relative ${local.aiImageGen ? 'bg-primary' : 'bg-slate-800'}`}>
             <div className={`absolute top-1 size-6 bg-white rounded-full shadow-lg transition-all ${local.aiImageGen ? 'left-7' : 'left-1'}`}></div>
          </button>
       </div>
       <button onClick={() => onSave(local)} className="w-full py-5 bg-primary text-white font-black rounded-2xl uppercase tracking-widest text-[11px] active:scale-95 transition-all">KAYDET</button>
    </div>
  );
};

const SessionConfigForm: React.FC<{ config: any, onSave: (c: any) => void }> = ({ config, onSave }) => {
  const [local, setLocal] = useState(config || { voice: 'Kore' });
  return (
    <div className="space-y-6">
       <div className="grid grid-cols-2 gap-3">
          {['Kore', 'Zephyr', 'Puck', 'Charon'].map(v => (
            <button key={v} onClick={() => setLocal({...local, voice: v})} className={`py-4 rounded-xl text-[10px] font-black uppercase border-2 transition-all active:scale-95 ${local.voice === v ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-500'}`}>{v}</button>
          ))}
       </div>
       <button onClick={() => onSave(local)} className="w-full py-5 bg-primary text-white font-black rounded-2xl uppercase tracking-widest text-[11px] active:scale-95 transition-all">KAYDET</button>
    </div>
  );
};

const AcademicConfigForm: React.FC<{ config: any, onSave: (c: any) => void }> = ({ config, onSave }) => {
  const [local, setLocal] = useState(config || { googleSearch: true });
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
          <span className="text-white font-bold text-sm">Google Search Grounding</span>
          <button onClick={() => setLocal({...local, googleSearch: !local.googleSearch})} className={`w-14 h-8 rounded-full transition-all relative ${local.googleSearch ? 'bg-primary' : 'bg-slate-800'}`}>
             <div className={`absolute top-1 size-6 bg-white rounded-full shadow-lg transition-all ${local.googleSearch ? 'left-7' : 'left-1'}`}></div>
          </button>
       </div>
       <button onClick={() => onSave(local)} className="w-full py-5 bg-primary text-white font-black rounded-2xl uppercase tracking-widest text-[11px] active:scale-95 transition-all">KAYDET</button>
    </div>
  );
};

export default AdminPortal;
