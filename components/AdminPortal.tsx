
import React, { useState, useMemo, useEffect } from 'react';
import { User, PlatformModule, UserRole } from '../types';

interface AdminPortalProps {
  modules: PlatformModule[];
  onUpdateModules: (newModules: PlatformModule[]) => void;
  users: User[];
  onUpdateUsers: (newUsers: User[]) => void;
}

interface ActiveSession {
  id: string;
  therapist: string;
  client: string;
  duration: string;
  latency: number;
  aiUsage: number;
  status: 'stable' | 'jitter' | 'critical';
}

const AdminPortal: React.FC<AdminPortalProps> = ({ modules, onUpdateModules, users, onUpdateUsers }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'modules' | 'sessions' | 'system'>('modules');
  const [search, setSearch] = useState('');
  const [editingModule, setEditingModule] = useState<PlatformModule | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  
  // Canlı Seans Simülasyon Verisi
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([
    { id: 'S-842', therapist: 'Dr. Selin Kaya', client: 'Ahmet Y.', duration: '12:45', latency: 42, aiUsage: 84, status: 'stable' },
    { id: 'S-843', therapist: 'Uzm. Berk Atan', client: 'Elif D.', duration: '05:22', latency: 156, aiUsage: 92, status: 'jitter' },
    { id: 'S-844', therapist: 'Dkt. Elif Ak', client: 'Caner Ö.', duration: '44:10', latency: 28, aiUsage: 12, status: 'stable' },
  ]);

  // --- Modül Kontrol Mantığı ---
  const handleToggleModule = (id: string) => {
    onUpdateModules(modules.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
  };

  const handleUpdateModule = (updated: PlatformModule) => {
    onUpdateModules(modules.map(m => m.id === updated.id ? updated : m));
    setEditingModule(null);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#05070A] font-sans selection:bg-primary/30">
      {/* --- Sidebar: Command Center Navigation --- */}
      <aside className="w-80 bg-[#0C0F16] border-r border-white/5 flex flex-col p-8 gap-10">
        <div className="px-6 py-5 bg-primary/10 border border-primary/20 rounded-[32px] relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
              <span className="material-symbols-outlined text-4xl">admin_panel_settings</span>
           </div>
           <div className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-1">TheraSpeech</div>
           <div className="text-white font-black text-xl italic tracking-tighter">OmniPanel v7.0</div>
        </div>

        <nav className="space-y-3">
           <AdminNavBtn active={activeTab === 'modules'} icon="grid_view" label="Modül Matrisi" onClick={() => setActiveTab('modules')} />
           <AdminNavBtn active={activeTab === 'users'} icon="manage_accounts" label="IAM & Erişim" onClick={() => setActiveTab('users')} />
           <AdminNavBtn active={activeTab === 'sessions'} icon="emergency_recording" label="Canlı Operasyon" onClick={() => setActiveTab('sessions')} />
           <AdminNavBtn active={activeTab === 'system'} icon="terminal" label="Sistem Adli Tıp" onClick={() => setActiveTab('system')} />
        </nav>

        <div className="mt-auto space-y-6">
           <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
              <div className="flex items-center justify-between text-[9px] font-black text-slate-500 uppercase tracking-widest">
                 <span>API_GATEWAY_STATUS</span>
                 <span className="text-emerald-500">LIVE</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 w-[94%] animate-pulse"></div>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 italic">
                 <span>Region: EU-WEST-1</span>
                 <span>99.9% Uptime</span>
              </div>
           </div>
        </div>
      </aside>

      {/* --- Main Content Surface --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
         <header className="h-28 border-b border-white/5 flex items-center justify-between px-12 bg-[#0C0F16]/50 backdrop-blur-3xl sticky top-0 z-20">
            <div>
               <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">
                  {activeTab === 'modules' ? 'Sistem_Mimari_Matrisi' : activeTab === 'users' ? 'Kimlik_ve_Yetki_IAM' : activeTab === 'sessions' ? 'Canli_Seans_Monitoru' : 'Altyapı_Forensics'}
               </h2>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2">Global platform hiyerarşisi ve milisaniyelik denetim.</p>
            </div>
            
            <div className="flex items-center gap-6">
               <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">manage_search</span>
                  <input 
                    className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm text-white w-72 outline-none focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all shadow-inner" 
                    placeholder="Global arama..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
               </div>
               {activeTab === 'users' && (
                 <button onClick={() => setIsAddingUser(true)} className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                    <span className="material-symbols-outlined">person_add</span> YENİ KAYIT
                 </button>
               )}
            </div>
         </header>

         <div className="flex-1 overflow-y-auto p-12 no-scrollbar">
            {/* --- 1. MODÜL MATRİSİ --- */}
            {activeTab === 'modules' && (
               <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8 animate-in fade-in duration-700">
                  {modules.filter(m => m.name.toLowerCase().includes(search.toLowerCase())).map(mod => (
                    <div key={mod.id} className={`bg-[#0C0F16] p-10 rounded-[56px] border-2 transition-all relative overflow-hidden group ${mod.enabled ? 'border-white/5 hover:border-primary/20 shadow-lg' : 'border-rose-500/10 opacity-40 grayscale'}`}>
                       <div className="relative z-10 flex flex-col h-full">
                          <div className="flex items-start justify-between mb-8">
                             <div className="flex items-center gap-6">
                                <div className={`size-16 rounded-3xl flex items-center justify-center transition-all ${mod.enabled ? 'bg-primary/20 text-primary shadow-inner' : 'bg-slate-800 text-slate-500'}`}>
                                   <span className="material-symbols-outlined text-4xl">{mod.icon}</span>
                                </div>
                                <div>
                                   <h3 className="text-2xl font-black text-white italic tracking-tight mb-1">{mod.name}</h3>
                                   <div className="flex items-center gap-2">
                                      <span className="text-[9px] font-black text-slate-500 uppercase bg-white/5 px-2 py-0.5 rounded">{mod.category}</span>
                                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${mod.enabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                         {mod.enabled ? 'AKTİF' : 'DEVRE DIŞI'}
                                      </span>
                                   </div>
                                </div>
                             </div>
                             <button onClick={() => handleToggleModule(mod.id)} className={`w-16 h-9 rounded-full transition-all relative shrink-0 ${mod.enabled ? 'bg-emerald-500' : 'bg-slate-800'}`}>
                                <div className={`absolute top-1.5 size-6 bg-white rounded-full transition-all shadow-md ${mod.enabled ? 'left-8.5' : 'left-1.5'}`}></div>
                             </button>
                          </div>
                          <p className="text-sm text-slate-500 font-medium leading-relaxed italic mb-10 flex-1">"{mod.description}"</p>
                          <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/5">
                             <div className="space-y-3">
                                <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Erişim Yetkisi</label>
                                <select 
                                  value={mod.minRole}
                                  onChange={(e) => onUpdateModules(modules.map(m => m.id === mod.id ? { ...m, minRole: e.target.value as UserRole } : m))}
                                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black uppercase text-primary outline-none focus:border-primary transition-all cursor-pointer"
                                >
                                   <option value="client">Client (Vaka)</option>
                                   <option value="therapist">Therapist (Uzman)</option>
                                   <option value="admin">Admin (Yalnızca)</option>
                                </select>
                             </div>
                             <button onClick={() => setEditingModule(mod)} className="mt-auto py-3 bg-white/5 hover:bg-white/10 text-white font-black text-[9px] uppercase rounded-xl border border-white/5 transition-all flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-sm">settings_suggest</span> YAPILANDIR
                             </button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            )}

            {/* --- 2. IAM & ERİŞİM --- */}
            {activeTab === 'users' && (
               <div className="bg-[#0C0F16] rounded-[56px] border border-white/5 overflow-hidden shadow-2xl relative">
                  <table className="w-full text-left border-collapse">
                     <thead className="bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] border-b border-white/5">
                        <tr>
                           <th className="px-10 py-8">Kullanıcı / Kimlik</th>
                           <th className="px-10 py-8">Platform Rolü</th>
                           <th className="px-10 py-8">Klinik Verimlilik</th>
                           <th className="px-10 py-8">Abonelik & Billing</th>
                           <th className="px-10 py-8 text-right">Erişim Kontrolü</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {users.map(u => (
                          <tr key={u.id} className="group hover:bg-white/[0.02] transition-colors">
                             <td className="px-10 py-8">
                                <div className="flex items-center gap-5">
                                   <div className="size-14 rounded-[24px] bg-slate-800 border-2 border-white/5 overflow-hidden shadow-xl group-hover:scale-110 transition-transform">
                                      <img src={u.avatar || `https://i.pravatar.cc/150?u=${u.id}`} className="w-full h-full object-cover" alt="" />
                                   </div>
                                   <div>
                                      <div className="text-lg font-black text-white italic tracking-tight">{u.name}</div>
                                      <div className="text-xs text-slate-500 font-bold opacity-60 uppercase">{u.email}</div>
                                   </div>
                                </div>
                             </td>
                             <td className="px-10 py-8">
                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-inner ${
                                  u.role === 'admin' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                                  u.role === 'therapist' ? 'bg-primary/10 text-primary border-primary/20' : 
                                  'bg-slate-500/10 text-slate-500 border-slate-500/20'
                                }`}>
                                   {u.role}
                                </span>
                             </td>
                             <td className="px-10 py-8">
                                <div className="space-y-2">
                                   <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                      <span>Başarı Skoru</span>
                                      <span className="text-emerald-500">%{u.stats?.completionRate || 0}</span>
                                   </div>
                                   <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${u.stats?.completionRate || 0}%` }}></div>
                                   </div>
                                </div>
                             </td>
                             <td className="px-10 py-8">
                                <div className="text-[10px] font-black text-primary uppercase mb-1">{u.subscription?.plan || 'Free'} Plan</div>
                                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest italic">{u.subscription?.status === 'active' ? 'Yenileme: ' + u.subscription?.nextBillingDate : 'PASİF'}</div>
                             </td>
                             <td className="px-10 py-8 text-right">
                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <button onClick={() => setEditingUser(u)} className="size-11 bg-white/5 text-slate-400 hover:text-white rounded-xl transition-all shadow-inner border border-white/5"><span className="material-symbols-outlined text-lg">edit_note</span></button>
                                   <button className="size-11 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all border border-rose-500/20"><span className="material-symbols-outlined text-lg">block</span></button>
                                </div>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )}

            {/* --- 3. CANLI OPERASYON --- */}
            {activeTab === 'sessions' && (
               <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <LiveStatCard label="Aktif Seanslar" value={activeSessions.length.toString()} icon="videocam" trend="+2 bugün" />
                     <LiveStatCard label="Anlık AI Yükü" value="%64" icon="psychology" trend="Optimal" />
                     <LiveStatCard label="Ortalama Gecikme" value="48ms" icon="speed" trend="-%12" />
                  </div>

                  <div className="bg-[#0C0F16] rounded-[56px] border border-white/5 overflow-hidden shadow-2xl">
                     <div className="p-10 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Aktif Seans Komuta Listesi</h3>
                        <button className="px-6 py-2 bg-emerald-500 text-white text-[9px] font-black uppercase rounded-lg shadow-lg">TÜMÜ STABİL</button>
                     </div>
                     <table className="w-full text-left">
                        <thead className="bg-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                           <tr>
                              <th className="px-10 py-6">SEANS_ID</th>
                              <th className="px-10 py-6">UZMAN / DANIŞAN</th>
                              <th className="px-10 py-6">SÜRE</th>
                              <th className="px-10 py-6">LATENCY</th>
                              <th className="px-10 py-6">AI_USAGE</th>
                              <th className="px-10 py-6 text-right">EYLEM</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                           {activeSessions.map(s => (
                             <tr key={s.id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="px-10 py-6 font-mono text-xs text-primary">{s.id}</td>
                                <td className="px-10 py-6">
                                   <div className="text-xs font-black text-white italic">{s.therapist} <span className="text-slate-500 text-[10px] mx-2">→</span> {s.client}</div>
                                </td>
                                <td className="px-10 py-6 font-mono text-xs text-slate-400">{s.duration}</td>
                                <td className="px-10 py-6">
                                   <div className="flex items-center gap-3">
                                      <div className={`size-2 rounded-full ${s.status === 'stable' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                                      <span className="text-xs font-bold text-white">{s.latency}ms</span>
                                   </div>
                                </td>
                                <td className="px-10 py-6">
                                   <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
                                      <div className="h-full bg-primary" style={{ width: `${s.aiUsage}%` }}></div>
                                   </div>
                                </td>
                                <td className="px-10 py-6 text-right">
                                   <button className="px-4 py-2 bg-white/5 hover:bg-primary text-white text-[9px] font-black uppercase rounded-lg border border-white/5 transition-all">MÜDAHALE ET</button>
                                </td>
                             </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

            {/* --- 4. SİSTEM ADLİ TİP --- */}
            {activeTab === 'system' && (
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in zoom-in duration-700">
                  <div className="lg:col-span-8 space-y-10">
                     <div className="bg-[#0C0F16] rounded-[56px] border border-white/5 p-12 overflow-hidden relative">
                        <div className="flex items-center justify-between mb-10">
                           <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Gerçek Zamanlı Kernel Logları</h3>
                           <div className="flex gap-2">
                              <span className="px-4 py-1.5 bg-rose-500/10 text-rose-500 text-[9px] font-black uppercase rounded-lg">3 KRİTİK HATA</span>
                              <span className="px-4 py-1.5 bg-primary/10 text-primary text-[9px] font-black uppercase rounded-lg">142 INFO</span>
                           </div>
                        </div>
                        <div className="bg-black/60 rounded-3xl p-8 font-mono text-[10px] space-y-3 max-h-[500px] overflow-y-auto no-scrollbar shadow-inner border border-white/5">
                           <div className="text-emerald-500/80">[14:44:01] - GCP_EUROPE_NODE_14: Handshake successful with client_u4821</div>
                           <div className="text-slate-500">[14:44:05] - DATABASE_SYNC: Merging clinical_delta for case_#112... Done.</div>
                           <div className="text-amber-500">[14:44:12] - AI_ORCHESTRATOR: Warning: Token limit threshold reached for user_u9201</div>
                           <div className="text-rose-500 animate-pulse">[14:44:18] - SECURITY_AUTH: Critical failure - Multiple failed logins from IP 192.168.12.4</div>
                           <div className="text-slate-500">[14:44:22] - MEDIA_SERVER: WebRTC session #842 upgraded to 1080p stream.</div>
                           <div className="text-primary">[14:44:30] - DEPLOY_ENGINE: Hot-swap deployment of 'Assessment' module v6.2.1 completed.</div>
                           <div className="text-slate-500">[14:44:35] - S3_BUCKET: Archive task started for Feb_2024 records.</div>
                        </div>
                        <div className="mt-8 flex justify-end gap-4">
                           <button className="px-6 py-3 bg-white/5 text-slate-400 text-[9px] font-black uppercase rounded-xl hover:bg-white/10 border border-white/5 transition-all">Logları Temizle</button>
                           <button className="px-6 py-3 bg-primary text-white text-[9px] font-black uppercase rounded-xl shadow-lg transition-all">Raporu Dışa Aktar (.csv)</button>
                        </div>
                     </div>
                  </div>

                  <div className="lg:col-span-4 space-y-10">
                     <div className="bg-[#0C0F16] rounded-[48px] border border-white/5 p-10 space-y-12">
                        <HardwareGauge label="CPU CORE LOAD" value={24} icon="processor" color="text-primary" />
                        <HardwareGauge label="MEMORY ALLOCATION" value={68} icon="memory" color="text-amber-500" />
                        <HardwareGauge label="NETWORK IOPS" value={12} icon="wifi_tethering" color="text-emerald-500" />
                     </div>
                     
                     <div className="bg-primary rounded-[40px] p-10 text-white shadow-3xl relative overflow-hidden group">
                        <div className="absolute -bottom-10 -right-10 text-[180px] text-white/10 group-hover:rotate-12 transition-transform duration-1000">
                           <span className="material-symbols-outlined">restart_alt</span>
                        </div>
                        <h4 className="text-xl font-black italic tracking-tighter uppercase mb-4 relative z-10">Küresel Sistem Reset</h4>
                        <p className="text-sm font-medium text-white/80 leading-relaxed mb-8 relative z-10 italic leading-none">Bu eylem tüm aktif seansları sonlandırır ve CDN düğümlerini yeniden başlatır. Sadece acil durumlarda kullanın.</p>
                        <button className="w-full py-4 bg-white text-primary font-black text-[10px] uppercase rounded-2xl shadow-xl hover:bg-black hover:text-white transition-all relative z-10">PROTOCOL_ZERO'YU BAŞLAT</button>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </main>

      {/* --- MODAL: DERİN MODÜL YAPILANDIRMA --- */}
      {editingModule && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-10 bg-black/95 backdrop-blur-2xl animate-in fade-in zoom-in duration-300">
           <div className="bg-[#111827] w-full max-w-4xl rounded-[64px] border-2 border-primary/20 p-16 flex flex-col gap-12 shadow-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                 <span className="material-symbols-outlined text-[320px] -rotate-12">{editingModule.icon}</span>
              </div>
              
              <div className="flex items-center justify-between relative z-10">
                 <div className="flex items-center gap-8">
                    <div className="size-20 bg-primary text-white rounded-[32px] flex items-center justify-center shadow-2xl shadow-primary/30">
                       <span className="material-symbols-outlined text-4xl font-black">tune</span>
                    </div>
                    <div>
                       <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">{editingModule.name} Yapılandırması</h3>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-2">Gemini 3.0 Flash Optimize Edilmiş Parametreler</p>
                    </div>
                 </div>
                 <button onClick={() => setEditingModule(null)} className="size-16 rounded-[28px] bg-white/5 text-slate-400 hover:text-white transition-all flex items-center justify-center"><span className="material-symbols-outlined text-2xl font-black">close</span></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10 overflow-y-auto pr-4 max-h-[550px] no-scrollbar">
                 <DeepConfigEditor module={editingModule} onUpdate={handleUpdateModule} />
              </div>

              <div className="pt-8 border-t border-white/5 flex gap-4 mt-auto relative z-10">
                 <button onClick={() => setEditingModule(null)} className="px-10 py-5 bg-white/5 text-white font-black rounded-[24px] hover:bg-white/10 transition-all uppercase text-[11px] tracking-widest">DEĞİŞİKLİKLERİ İPTAL ET</button>
                 <button 
                   onClick={() => handleUpdateModule(editingModule)}
                   className="flex-1 py-5 bg-primary text-white font-black rounded-[24px] shadow-3xl shadow-primary/30 hover:bg-primary-dark transition-all uppercase text-[11px] tracking-[0.2em] active:scale-95"
                 >
                    KONFİGÜRASYONU GLOBAL OLARAK YAYINLA
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* --- MODAL: IAM & ERİŞİM EDİTÖRÜ --- */}
      {editingUser && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-10 bg-black/95 backdrop-blur-2xl animate-in fade-in zoom-in duration-300">
           <div className="bg-[#111827] w-full max-w-5xl rounded-[64px] border-2 border-primary/20 p-16 flex flex-col gap-12 shadow-3xl relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                 <div className="flex items-center gap-8">
                    <div className="size-24 rounded-[40px] border-4 border-white/10 overflow-hidden shadow-2xl relative">
                       <img src={editingUser.avatar || `https://i.pravatar.cc/150?u=${editingUser.id}`} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                       <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">{editingUser.name} Profili</h3>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-2">Kimlik, Yetki ve Erişim Matrisi Düzenleyici</p>
                    </div>
                 </div>
                 <button onClick={() => setEditingUser(null)} className="size-16 rounded-[28px] bg-white/5 text-slate-400 hover:text-white transition-all flex items-center justify-center"><span className="material-symbols-outlined text-2xl font-black">close</span></button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10 overflow-y-auto pr-4 max-h-[600px] no-scrollbar">
                 <div className="space-y-8">
                    <h4 className="text-[11px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3">
                       <span className="material-symbols-outlined text-lg">shield_person</span> YETKİLENDİRME
                    </h4>
                    <div className="space-y-4">
                       <Field label="Platform Rolü" value={editingUser.role} type="select" options={['admin', 'therapist', 'client']} />
                       <Field label="Abonelik Planı" value={editingUser.subscription?.plan} type="select" options={['Free', 'Basic', 'Pro', 'Clinic']} />
                    </div>
                    <div className="p-8 bg-rose-500/5 border border-rose-500/20 rounded-[40px] space-y-4 text-center">
                       <h5 className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Kritik İşlemler</h5>
                       <button className="w-full py-4 bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg">ERİŞİMİ KALICI KAPAT</button>
                    </div>
                 </div>

                 <div className="space-y-8">
                    <h4 className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.3em] flex items-center gap-3">
                       <span className="material-symbols-outlined text-lg">clinical_notes</span> KLİNİK VERİ
                    </h4>
                    <div className="space-y-4">
                       <Field label="Tam İsim" value={editingUser.name} />
                       <Field label="E-Posta" value={editingUser.email} />
                    </div>
                    <div className="bg-white/5 p-8 rounded-[40px] border border-white/5">
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <div className="text-[9px] font-black text-slate-500 uppercase mb-1">XP Puanı</div>
                             <div className="text-2xl font-black text-white italic">{editingUser.stats?.xp}</div>
                          </div>
                          <div>
                             <div className="text-[9px] font-black text-slate-500 uppercase mb-1">Seans Sayısı</div>
                             <div className="text-2xl font-black text-emerald-500 italic">{editingUser.stats?.totalSessions}</div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-8">
                    <h4 className="text-[11px] font-black text-amber-500 uppercase tracking-[0.3em] flex items-center gap-3">
                       <span className="material-symbols-outlined text-lg">history</span> ADLİ LOGLAR
                    </h4>
                    <div className="bg-black/60 rounded-[40px] p-8 font-mono text-[10px] space-y-4 h-80 overflow-y-auto no-scrollbar shadow-inner border border-white/5">
                       <div className="text-emerald-500/60">[Bugün 12:44] - Başarılı Giriş (Mobile)</div>
                       <div className="text-slate-500">[Dün 15:20] - Seans #842 Tamamlandı</div>
                       <div className="text-slate-500">[12 Mart] - Materyal 'Balon R' kaydedildi</div>
                       <div className="text-amber-500/60">[10 Mart] - Parola değiştirme denemesi</div>
                    </div>
                 </div>
              </div>

              <div className="pt-8 border-t border-white/5 flex gap-4 mt-auto relative z-10">
                 <button onClick={() => setEditingUser(null)} className="px-10 py-5 bg-white/5 text-white font-black rounded-[24px] hover:bg-white/10 transition-all uppercase text-[11px] tracking-widest">VAZGEÇ</button>
                 <button onClick={() => setEditingUser(null)} className="flex-1 py-5 bg-primary text-white font-black rounded-[24px] shadow-3xl shadow-primary/30 hover:bg-primary-dark transition-all uppercase text-[11px] tracking-[0.2em] active:scale-95">DEĞİŞİKLİKLERİ KAYDET</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// --- Helper Components ---

const AdminNavBtn: React.FC<{ active: boolean, icon: string, label: string, onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-5 px-6 py-4 rounded-2xl transition-all ${active ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
  >
     <span className="material-symbols-outlined text-2xl font-bold">{icon}</span>
     <span className="text-[11px] font-black uppercase tracking-[0.2em]">{label}</span>
  </button>
);

const LiveStatCard: React.FC<{ label: string, value: string, icon: string, trend: string }> = ({ label, value, icon, trend }) => (
  <div className="bg-[#0C0F16] p-10 rounded-[48px] border border-white/5 group hover:border-primary/20 transition-all shadow-sm">
     <div className="flex items-center justify-between mb-8">
        <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
           <span className="material-symbols-outlined text-3xl font-black">{icon}</span>
        </div>
        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-lg">{trend}</span>
     </div>
     <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{label}</div>
     <div className="text-4xl font-black text-white italic tracking-tighter uppercase">{value}</div>
  </div>
);

const HardwareGauge: React.FC<{ label: string, value: number, icon: string, color: string }> = ({ label, value, icon, color }) => (
  <div className="space-y-6 group">
     <div className="flex justify-between items-end">
        <div className="flex items-center gap-3">
           <span className={`material-symbols-outlined text-2xl ${color}`}>{icon}</span>
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
        </div>
        <span className="text-2xl font-black text-white italic">%{value}</span>
     </div>
     <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-1000 ${value > 85 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : value > 60 ? 'bg-amber-500' : 'bg-primary'}`} style={{ width: `${value}%` }}></div>
     </div>
  </div>
);

const Field: React.FC<{ label: string, value: any, type?: 'text' | 'select', options?: string[] }> = ({ label, value, type = 'text', options }) => (
  <div className="space-y-2">
     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">{label}</label>
     {type === 'select' ? (
       <select className="w-full bg-black/40 border-2 border-white/10 rounded-2xl px-6 py-4 text-white font-black text-xs uppercase outline-none focus:border-primary transition-all cursor-pointer">
          {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
       </select>
     ) : (
       <input className="w-full bg-black/40 border-2 border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-sm outline-none focus:border-primary transition-all shadow-inner" defaultValue={value} />
     )}
  </div>
);

// --- MODÜLE ÖZEL DERİN YAPILANDIRMA EDİTÖRÜ ---
const DeepConfigEditor: React.FC<{ module: PlatformModule, onUpdate: (m: PlatformModule) => void }> = ({ module, onUpdate }) => {
  const [config, setConfig] = useState(module.config);

  const updateParam = (key: string, val: any) => {
    const newConfig = { ...config, [key]: val };
    setConfig(newConfig);
  };

  const renderAssessment = () => (
    <>
      <div className="col-span-full mb-4">
         <h4 className="text-[11px] font-black text-primary uppercase tracking-[0.3em] mb-8">Muhakeme Motoru Ayarları</h4>
      </div>
      <ConfigKnob label="Thinking Budget (Tokens)" value={config.thinkingBudget || 0} min={0} max={24576} step={1024} onChange={v => updateParam('thinkingBudget', v)} />
      <ConfigSelect label="AI Model Tier" value={config.model || 'gemini-3-flash-preview'} options={['gemini-3-flash-preview', 'gemini-3-pro-preview']} onChange={v => updateParam('model', v)} />
      <ConfigToggle label="ICF Mapping Auto-Validation" active={config.autoValidate || true} onChange={v => updateParam('autoValidate', v)} />
    </>
  );

  const renderSession = () => (
    <>
      <div className="col-span-full mb-4">
         <h4 className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-8">Canlı Oda Protokolleri</h4>
      </div>
      <ConfigSelect label="Varsayılan AI Sesi" value={config.voice || 'Kore'} options={['Kore', 'Zephyr', 'Puck', 'Charon']} onChange={v => updateParam('voice', v)} />
      <ConfigKnob label="Audio Sampling Rate (Hz)" value={config.samplingRate || 16000} min={8000} max={48000} step={8000} onChange={v => updateParam('samplingRate', v)} />
      <ConfigToggle label="Face-Tracking Visual Mesh" active={config.faceMesh || true} onChange={v => updateParam('faceMesh', v)} />
    </>
  );

  const renderLibrary = () => (
    <>
      <div className="col-span-full mb-4">
         <h4 className="text-[11px] font-black text-amber-500 uppercase tracking-[0.3em] mb-8">İçerik Üretim Parametreleri</h4>
      </div>
      <ConfigToggle label="AI Image Generation Enabled" active={config.aiImageGen || true} onChange={v => updateParam('aiImageGen', v)} />
      <ConfigKnob label="Max Search Results" value={config.maxResults || 20} min={5} max={100} step={5} onChange={v => updateParam('maxResults', v)} />
      <ConfigSelect label="Global Default Language" value={config.lang || 'TR'} options={['TR', 'EN', 'DE']} onChange={v => updateParam('lang', v)} />
    </>
  );

  const renderGeneric = () => (
    <div className="col-span-full space-y-4">
       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">JSON Konfigürasyon Verisi</label>
       <textarea 
         className="w-full h-80 bg-black/60 border-2 border-white/10 rounded-3xl p-8 font-mono text-xs text-emerald-400 focus:border-primary outline-none transition-all shadow-inner"
         value={JSON.stringify(config, null, 2)}
         onChange={(e) => { try { setConfig(JSON.parse(e.target.value)); } catch(err){} }}
       />
    </div>
  );

  switch (module.id) {
    case 'assessment': return renderAssessment();
    case 'session': return renderSession();
    case 'library': return renderLibrary();
    default: return renderGeneric();
  }
};

const ConfigKnob: React.FC<{ label: string, value: number, min: number, max: number, step: number, onChange: (v: number) => void }> = ({ label, value, min, max, step, onChange }) => (
  <div className="p-8 bg-white/5 rounded-[40px] border border-white/5 space-y-6">
     <div className="flex justify-between items-end">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
        <span className="text-xl font-black text-primary italic">{value.toLocaleString()}</span>
     </div>
     <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(parseInt(e.target.value))} className="w-full h-1.5 bg-black rounded-full accent-primary appearance-none cursor-pointer" />
  </div>
);

const ConfigSelect: React.FC<{ label: string, value: string, options: string[], onChange: (v: string) => void }> = ({ label, value, options, onChange }) => (
  <div className="p-8 bg-white/5 rounded-[40px] border border-white/5 space-y-4">
     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{label}</label>
     <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-black/40 border-2 border-white/10 rounded-2xl px-6 py-4 text-white font-black text-xs uppercase outline-none focus:border-primary cursor-pointer appearance-none">
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
     </select>
  </div>
);

const ConfigToggle: React.FC<{ label: string, active: boolean, onChange: (v: boolean) => void }> = ({ label, active, onChange }) => (
  <div className="p-8 bg-white/5 rounded-[40px] border border-white/5 flex items-center justify-between">
     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-10">{label}</label>
     <button onClick={() => onChange(!active)} className={`w-14 h-8 rounded-full transition-all relative shrink-0 ${active ? 'bg-primary' : 'bg-slate-800'}`}>
        <div className={`absolute top-1 size-6 bg-white rounded-full transition-all ${active ? 'left-7' : 'left-1'}`}></div>
     </button>
  </div>
);

export default AdminPortal;
