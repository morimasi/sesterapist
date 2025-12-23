
import React, { useState, useEffect } from 'react';
import { User, PlatformModule, SessionMetadata, GlobalStats, UserRole } from '../types';

const MOCK_USERS: User[] = [
  { id: '1', name: 'Dr. Selin Kaya', role: 'therapist', status: 'active', email: 'selin@theraspeech.com', lastSeen: '2 dk önce' },
  { id: '2', name: 'Ahmet Yılmaz', role: 'client', status: 'active', email: 'ahmet@gmail.com', lastSeen: '1 saat önce' },
  { id: '3', name: 'Can Demir', role: 'therapist', status: 'suspended', email: 'can@klinik.com', lastSeen: '3 gün önce' },
  { id: '4', name: 'Admin Root', role: 'admin', status: 'active', email: 'admin@theraspeech.com', lastSeen: 'Şimdi' },
];

const MOCK_MODULES: PlatformModule[] = [
  { id: 'ai_gen', name: 'AI Materyal Üretimi', enabled: true, minRole: 'therapist', description: 'Gemini 3 Flash ile içerik üretimi.' },
  { id: 'live_analyser', name: 'Canlı Ses Analizi', enabled: true, minRole: 'therapist', description: 'Live API üzerinden anlık klinik geri bildirim.' },
  { id: 'academic', name: 'Akademik Kütüphane', enabled: true, minRole: 'therapist', description: 'Google Search destekli makale tarama.' },
  { id: 'gamification', name: 'Oyunlaştırma (XP/Badge)', enabled: false, minRole: 'client', description: 'Danışan motivasyon sistemi.' },
];

const AdminPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'modules' | 'sessions' | 'system'>('users');
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [modules, setModules] = useState<PlatformModule[]>(MOCK_MODULES);
  const [search, setSearch] = useState('');

  const toggleModule = (id: string) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
  };

  const changeUserRole = (id: string, newRole: UserRole) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#0A0D14] font-sans selection:bg-primary/30">
      {/* Admin Sidebar */}
      <aside className="w-72 bg-[#111827] border-r border-white/5 flex flex-col p-6 gap-8">
        <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl">
           <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Komuta_Merkezi</div>
           <div className="text-white font-bold text-sm italic">OmniPanel v4.0</div>
        </div>

        <nav className="space-y-2">
           <AdminNavBtn active={activeTab === 'users'} icon="group" label="Kullanıcı Yönetimi" onClick={() => setActiveTab('users')} />
           <AdminNavBtn active={activeTab === 'modules'} icon="extension" label="Modül Konfigürasyonu" onClick={() => setActiveTab('modules')} />
           <AdminNavBtn active={activeTab === 'sessions'} icon="videocam" label="Canlı Seanslar" onClick={() => setActiveTab('sessions')} />
           <AdminNavBtn active={activeTab === 'system'} icon="terminal" label="Sistem Sağlığı" onClick={() => setActiveTab('system')} />
        </nav>

        <div className="mt-auto p-6 bg-slate-900/50 rounded-3xl border border-white/5 text-center">
           <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">API_COST_MONTHLY</div>
           <div className="text-2xl font-black text-white italic">$428.50</div>
           <div className="h-1.5 w-full bg-white/5 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: '65%' }}></div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
         <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#0F172A]/40 backdrop-blur-xl">
            <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">
               {activeTab === 'users' ? 'Kullanıcı_Veritabanı' : activeTab === 'modules' ? 'Modül_Kontrol_Matrisi' : activeTab === 'sessions' ? 'Canlı_Aktivite_İzleyici' : 'Sistem_Tanılama'}
            </h2>
            <div className="flex items-center gap-4">
               <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">search</span>
                  <input 
                    className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-2.5 text-sm text-white focus:ring-4 focus:ring-primary/10 outline-none w-80 transition-all font-medium" 
                    placeholder="Global ara..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
               </div>
               <button className="bg-primary text-white size-11 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 hover:scale-105 transition-all active:scale-95">
                  <span className="material-symbols-outlined font-bold">add</span>
               </button>
            </div>
         </header>

         <div className="flex-1 overflow-y-auto p-10 no-scrollbar">
            {activeTab === 'users' && (
              <div className="bg-[#111827] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
                 <table className="w-full text-left">
                    <thead className="bg-white/[0.02] text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                       <tr>
                          <th className="px-10 py-5">Kullanıcı</th>
                          <th className="px-10 py-5">Rol</th>
                          <th className="px-10 py-5">Durum</th>
                          <th className="px-10 py-5">Son_Görülme</th>
                          <th className="px-10 py-5 text-right">İşlemler</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {users.filter(u => u.name.toLowerCase().includes(search.toLowerCase())).map(user => (
                         <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-10 py-6">
                               <div className="flex items-center gap-4">
                                  <div className="size-11 rounded-2xl bg-slate-800 border-2 border-white/5 overflow-hidden">
                                     <img src={`https://i.pravatar.cc/150?u=${user.id}`} className="w-full h-full object-cover" alt="" />
                                  </div>
                                  <div>
                                     <div className="text-sm font-black text-white italic">{user.name}</div>
                                     <div className="text-[10px] text-slate-500 font-medium">{user.email}</div>
                                  </div>
                               </div>
                            </td>
                            <td className="px-10 py-6">
                               <select 
                                 value={user.role} 
                                 onChange={(e) => changeUserRole(user.id, e.target.value as UserRole)}
                                 className="bg-black/40 border border-white/10 rounded-xl text-[10px] font-black text-primary uppercase px-3 py-1.5 outline-none cursor-pointer hover:border-primary/40 transition-all"
                               >
                                  <option value="therapist">TERAPİST</option>
                                  <option value="client">DANIŞAN</option>
                                  <option value="admin">ADMİN</option>
                               </select>
                            </td>
                            <td className="px-10 py-6">
                               <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${user.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                                  {user.status}
                               </span>
                            </td>
                            <td className="px-10 py-6 text-xs font-bold text-slate-400 italic">{user.lastSeen}</td>
                            <td className="px-10 py-6 text-right">
                               <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => toggleUserStatus(user.id)} className="p-2.5 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
                                     <span className="material-symbols-outlined text-[20px]">{user.status === 'active' ? 'block' : 'undo'}</span>
                                  </button>
                                  <button className="p-2.5 hover:bg-white/5 rounded-xl text-slate-500 hover:text-rose-500 transition-all">
                                     <span className="material-symbols-outlined text-[20px]">delete</span>
                                  </button>
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
            )}

            {activeTab === 'modules' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {modules.map(mod => (
                   <div key={mod.id} className="bg-[#111827] p-8 rounded-[40px] border border-white/5 shadow-xl hover:border-primary/20 transition-all flex flex-col gap-6 relative overflow-hidden group">
                      <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-1000 ${mod.enabled ? 'text-primary' : 'text-slate-500'}`}>
                         <span className="material-symbols-outlined text-[140px]">extension</span>
                      </div>
                      <div className="flex items-center justify-between relative z-10">
                         <div className="flex items-center gap-4">
                            <div className={`size-14 rounded-[20px] flex items-center justify-center ${mod.enabled ? 'bg-primary/20 text-primary' : 'bg-slate-800 text-slate-500'}`}>
                               <span className="material-symbols-outlined text-3xl">{mod.id === 'ai_gen' ? 'bolt' : mod.id === 'live_analyser' ? 'graphic_eq' : mod.id === 'academic' ? 'school' : 'military_tech'}</span>
                            </div>
                            <div>
                               <h3 className="text-lg font-black text-white italic">{mod.name}</h3>
                               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Min Rol: {mod.minRole}</p>
                            </div>
                         </div>
                         <button 
                           onClick={() => toggleModule(mod.id)}
                           className={`w-14 h-8 rounded-full transition-all relative ${mod.enabled ? 'bg-primary' : 'bg-slate-800'}`}
                         >
                            <div className={`absolute top-1 size-6 bg-white rounded-full shadow-2xl transition-all ${mod.enabled ? 'left-7' : 'left-1'}`}></div>
                         </button>
                      </div>
                      <p className="text-sm text-slate-400 font-medium leading-relaxed relative z-10">{mod.description}</p>
                      <div className="mt-auto pt-6 border-t border-white/5 flex gap-4">
                         <button className="flex-1 py-3 bg-white/5 text-[10px] font-black text-white uppercase rounded-xl hover:bg-white/10 transition-all">Gelişmiş Ayarlar</button>
                         <button className="px-5 py-3 bg-white/5 text-slate-500 rounded-xl hover:text-rose-500 transition-all"><span className="material-symbols-outlined text-sm">delete</span></button>
                      </div>
                   </div>
                 ))}
              </div>
            )}

            {activeTab === 'sessions' && (
              <div className="space-y-10">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatsWidget label="AKTİF_OTURUMLAR" value="12" color="text-primary" />
                    <StatsWidget label="BUGÜN_TAMAMLANAN" value="48" color="text-emerald-500" />
                    <StatsWidget label="SİSTEM_GECİKMESİ" value="42ms" color="text-amber-500" />
                 </div>
                 
                 <div className="bg-[#111827] rounded-[40px] border border-white/5 p-10">
                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-10 flex items-center gap-3">
                       <span className="material-symbols-outlined text-primary">sensors</span>
                       CANLI_ETKİNLİK_MONİTÖRÜ
                    </h3>
                    <div className="space-y-6">
                       <SessionTrackItem name="Ahmet Yılmaz" therapist="Dr. Selin Kaya" type="Artikülasyon" duration="24:12" status="live" />
                       <SessionTrackItem name="Elif Demir" therapist="Uzm. Can Demir" type="Dil Gelişimi" duration="08:45" status="live" />
                       <SessionTrackItem name="Eren Öztürk" therapist="Dkt. Ayşe Gül" type="Kekemelik" duration="42:10" status="closing" />
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'system' && (
               <div className="space-y-10">
                  <div className="bg-gradient-to-br from-primary/20 to-indigo-600/20 p-12 rounded-[56px] border border-white/5 text-center relative overflow-hidden">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 size-96 bg-primary/20 blur-[120px] -z-10 animate-pulse"></div>
                     <div className="text-7xl font-black text-white italic tracking-tighter mb-4 animate-pulse">99.98%</div>
                     <div className="text-[12px] font-black text-primary uppercase tracking-[0.5em] mb-12">Global_Uptime_Healthy</div>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <HealthPoint label="Database" status="ok" />
                        <HealthPoint label="Gemini API" status="ok" />
                        <HealthPoint label="Live Audio Node" status="warning" />
                        <HealthPoint label="Image Gen" status="ok" />
                     </div>
                  </div>
                  
                  <div className="bg-[#111827] rounded-[40px] p-10 border border-white/5">
                     <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-8">Kritik_Log_Dökümü</h3>
                     <div className="space-y-3 font-mono text-[11px]">
                        <div className="flex gap-4 text-emerald-500/70 py-2 border-b border-white/5">
                           <span>[14:22:01]</span><span>[INFO]</span><span>User ID: 19283 authenticated via OAuth.</span>
                        </div>
                        <div className="flex gap-4 text-amber-500/70 py-2 border-b border-white/5">
                           <span>[14:18:45]</span><span>[WARN]</span><span>Live API latency peaked at 240ms in Frankfurt region.</span>
                        </div>
                        <div className="flex gap-4 text-rose-500/70 py-2 border-b border-white/5">
                           <span>[14:15:22]</span><span>[ERROR]</span><span>Storage quota reached for User ID: 221. Auto-scaling triggered.</span>
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
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${active ? 'bg-primary text-white shadow-2xl shadow-primary/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
  >
     <span className="material-symbols-outlined text-2xl font-bold">{icon}</span>
     <span className="text-xs font-black uppercase tracking-widest">{label}</span>
  </button>
);

const StatsWidget: React.FC<{ label: string, value: string, color: string }> = ({ label, value, color }) => (
  <div className="bg-[#111827] p-8 rounded-[32px] border border-white/5 shadow-xl">
     <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">{label}</div>
     <div className={`text-4xl font-black italic ${color}`}>{value}</div>
  </div>
);

const SessionTrackItem: React.FC<{ name: string, therapist: string, type: string, duration: string, status: 'live' | 'closing' }> = ({ name, therapist, type, duration, status }) => (
  <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-primary/20 transition-all">
     <div className="flex items-center gap-6">
        <div className="relative">
           <div className="size-12 rounded-2xl bg-slate-800 border border-white/10 overflow-hidden">
              <img src={`https://i.pravatar.cc/150?u=${name}`} className="w-full h-full object-cover" alt="" />
           </div>
           {status === 'live' && <div className="absolute -top-1 -right-1 size-3 bg-emerald-500 rounded-full border-2 border-[#111827] animate-pulse"></div>}
        </div>
        <div>
           <div className="text-sm font-black text-white italic">{name} <span className="text-slate-500 not-italic text-[10px] mx-2">Tarafından</span> {therapist}</div>
           <div className="text-[10px] text-primary font-black uppercase tracking-widest">{type} • {duration} Sürer</div>
        </div>
     </div>
     <button className="px-6 py-3 bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase rounded-xl border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all">Durdur</button>
  </div>
);

const HealthPoint: React.FC<{ label: string, status: 'ok' | 'warning' | 'error' }> = ({ label, status }) => (
  <div className="flex flex-col items-center gap-4">
     <div className={`size-4 rounded-full ${status === 'ok' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : status === 'warning' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'}`}></div>
     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</div>
  </div>
);

export default AdminPortal;
