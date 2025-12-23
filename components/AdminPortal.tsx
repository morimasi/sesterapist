
import React, { useState, useEffect } from 'react';
import { User, PlatformModule, UserRole } from '../types';

interface AdminPortalProps {
  modules: PlatformModule[];
  onUpdateModules: (newModules: PlatformModule[]) => void;
  users: User[];
  onUpdateUsers: (newUsers: User[]) => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ modules, onUpdateModules, users, onUpdateUsers }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'modules' | 'sessions' | 'system'>('modules');
  const [search, setSearch] = useState('');
  const [editingModule, setEditingModule] = useState<PlatformModule | null>(null);

  const toggleModule = (id: string) => {
    const updated = modules.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m);
    onUpdateModules(updated);
  };

  const updateModuleRole = (id: string, role: UserRole) => {
    const updated = modules.map(m => m.id === id ? { ...m, minRole: role } : m);
    onUpdateModules(updated);
  };

  const handleSaveConfig = (config: Record<string, any>) => {
    if (!editingModule) return;
    const updated = modules.map(m => m.id === editingModule.id ? { ...m, config } : m);
    onUpdateModules(updated);
    setEditingModule(null);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#0A0D14] font-sans selection:bg-primary/30">
      {/* Admin Sidebar */}
      <aside className="w-72 bg-[#111827] border-r border-white/5 flex flex-col p-6 gap-8">
        <div className="px-4 py-4 bg-primary/10 border border-primary/20 rounded-2xl">
           <div className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-1">TheraSpeech</div>
           <div className="text-white font-black text-lg italic tracking-tighter">OmniPanel v5.2</div>
        </div>

        <nav className="space-y-2">
           <AdminNavBtn active={activeTab === 'users'} icon="group" label="Kullanıcı Yönetimi" onClick={() => setActiveTab('users')} />
           <AdminNavBtn active={activeTab === 'modules'} icon="extension" label="Modül Matrisi" onClick={() => setActiveTab('modules')} />
           <AdminNavBtn active={activeTab === 'sessions'} icon="videocam" label="Canlı İzleme" onClick={() => setActiveTab('sessions')} />
           <AdminNavBtn active={activeTab === 'system'} icon="terminal" label="Sistem Sağlığı" onClick={() => setActiveTab('system')} />
        </nav>

        <div className="mt-auto p-6 bg-slate-900/50 rounded-[32px] border border-white/5">
           <div className="flex justify-between items-center mb-4">
              <span className="text-[9px] font-black text-slate-500 uppercase">Bulut Kapasite</span>
              <span className="text-xs text-emerald-500 font-bold">%64</span>
           </div>
           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: '64%' }}></div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
         <header className="h-24 border-b border-white/5 flex items-center justify-between px-10 bg-[#0F172A]/40 backdrop-blur-3xl">
            <div>
               <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">
                  {activeTab === 'modules' ? 'Modül_Kontrol_Matrisi' : 'Admin_Panel'}
               </h2>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Platform özelliklerini gerçek zamanlı yönetin.</p>
            </div>
            
            <div className="flex items-center gap-6">
               <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-primary">search</span>
                  <input 
                    className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-sm text-white focus:ring-4 focus:ring-primary/10 outline-none w-80 transition-all font-medium" 
                    placeholder="Global filtrele..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
               </div>
               <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary animate-pulse">
                  <span className="material-symbols-outlined">shield</span>
               </div>
            </div>
         </header>

         <div className="flex-1 overflow-y-auto p-10 no-scrollbar space-y-10">
            {activeTab === 'modules' && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                 {modules.filter(m => m.name.toLowerCase().includes(search.toLowerCase())).map(mod => (
                   <div key={mod.id} className={`group bg-[#111827] p-8 rounded-[48px] border-2 transition-all relative overflow-hidden flex flex-col gap-6 ${mod.enabled ? 'border-white/5 hover:border-primary/30' : 'border-rose-500/20 opacity-60'}`}>
                      {/* Status Indicator */}
                      <div className="absolute top-0 right-0 p-8 flex flex-col items-end gap-2">
                         <div className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${mod.enabled ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                            {mod.enabled ? 'AKTİF' : 'DEVRE DIŞI'}
                         </div>
                      </div>

                      <div className="flex items-start gap-6 relative z-10">
                         <div className={`size-16 rounded-3xl flex items-center justify-center shadow-2xl transition-all ${mod.enabled ? 'bg-primary/20 text-primary group-hover:scale-110 group-hover:rotate-12' : 'bg-slate-800 text-slate-500'}`}>
                            <span className="material-symbols-outlined text-4xl">{mod.icon}</span>
                         </div>
                         <div className="flex-1">
                            <h3 className="text-xl font-black text-white italic tracking-tight mb-1">{mod.name}</h3>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-sm">{mod.description}</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                         <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Erişim_Sınırı</label>
                            <select 
                              value={mod.minRole} 
                              onChange={(e) => updateModuleRole(mod.id, e.target.value as UserRole)}
                              className="w-full bg-black/40 border border-white/10 rounded-xl text-[10px] font-black text-primary uppercase px-4 py-2.5 outline-none cursor-pointer hover:border-primary/40 transition-all appearance-none"
                            >
                               <option value="therapist">Sadece Terapist</option>
                               <option value="client">Tüm Kullanıcılar</option>
                               <option value="admin">Sadece Admin</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Donanım_Durumu</label>
                            <div className="flex h-[42px] bg-black/40 rounded-xl border border-white/10 p-1">
                               <button 
                                 onClick={() => toggleModule(mod.id)}
                                 className={`flex-1 rounded-lg text-[10px] font-black uppercase transition-all ${mod.enabled ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                               >ON</button>
                               <button 
                                 onClick={() => toggleModule(mod.id)}
                                 className={`flex-1 rounded-lg text-[10px] font-black uppercase transition-all ${!mod.enabled ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                               >OFF</button>
                            </div>
                         </div>
                      </div>

                      <div className="flex gap-4">
                         <button 
                           onClick={() => setEditingModule(mod)}
                           className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl border border-white/5 transition-all flex items-center justify-center gap-3"
                         >
                            <span className="material-symbols-outlined text-sm">settings</span>
                            Gelişmiş Ayarlar
                         </button>
                         <button className="px-6 py-4 bg-white/5 text-slate-500 rounded-2xl hover:text-rose-500 transition-all border border-white/5">
                            <span className="material-symbols-outlined">delete</span>
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
            )}
         </div>
      </main>

      {/* Advanced Settings Modal */}
      {editingModule && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-10 bg-black/80 backdrop-blur-xl animate-in fade-in">
           <div className="bg-[#111827] w-full max-w-2xl rounded-[56px] border-2 border-primary/20 p-12 shadow-3xl flex flex-col gap-10">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="size-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center">
                       <span className="material-symbols-outlined text-3xl">{editingModule.icon}</span>
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">{editingModule.name}</h3>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Sistem Yapılandırma Paneli</p>
                    </div>
                 </div>
                 <button onClick={() => setEditingModule(null)} className="size-12 rounded-2xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center">
                    <span className="material-symbols-outlined">close</span>
                 </button>
              </div>

              <div className="space-y-8 overflow-y-auto max-h-[500px] pr-4 no-scrollbar">
                 {editingModule.id === 'assessment' && (
                   <AIConfigForm config={editingModule.config} onSave={handleSaveConfig} />
                 )}
                 {editingModule.id === 'session' && (
                   <SessionConfigForm config={editingModule.config} onSave={handleSaveConfig} />
                 )}
                 {editingModule.id === 'academic' && (
                   <AcademicConfigForm config={editingModule.config} onSave={handleSaveConfig} />
                 )}
                 {!['assessment', 'session', 'academic'].includes(editingModule.id) && (
                   <div className="p-12 text-center bg-white/5 rounded-[40px] border border-dashed border-white/10">
                      <span className="material-symbols-outlined text-6xl text-slate-700 mb-6">dynamic_settings</span>
                      <p className="text-slate-500 font-bold italic uppercase tracking-widest text-sm">Bu modül için ek parametre bulunamadı.</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// --- Modüle Özel Form Bileşenleri ---

const AIConfigForm: React.FC<{ config: any, onSave: (c: any) => void }> = ({ config, onSave }) => {
  const [local, setLocal] = useState(config || { model: 'gemini-3-flash-preview', thinkingBudget: 16000 });
  return (
    <div className="space-y-6">
       <div className="group">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-2">Metin_Motoru_Secimi</label>
          <select 
            value={local.model} 
            onChange={e => setLocal({...local, model: e.target.value})}
            className="w-full bg-black/40 border-2 border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-primary transition-all appearance-none"
          >
             <option value="gemini-3-flash-preview">Gemini 3 Flash (Hızlı)</option>
             <option value="gemini-3-pro-preview">Gemini 3 Pro (Derin)</option>
          </select>
       </div>
       <div className="group">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-2">Thinking_Budget (Tokens: {local.thinkingBudget})</label>
          <input 
            type="range" min="0" max="32768" step="1024"
            value={local.thinkingBudget} 
            onChange={e => setLocal({...local, thinkingBudget: parseInt(e.target.value)})}
            className="w-full h-2 bg-white/5 rounded-full appearance-none accent-primary cursor-pointer"
          />
       </div>
       <button onClick={() => onSave(local)} className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/30 active:scale-95 transition-all">DEĞİŞİKLİKLERİ KAYDET</button>
    </div>
  );
};

const AcademicConfigForm: React.FC<{ config: any, onSave: (c: any) => void }> = ({ config, onSave }) => {
   const [local, setLocal] = useState(config || { googleSearch: true, autoSummary: true });
   return (
     <div className="space-y-6">
        <ConfigToggle label="Google Search Grounding" active={local.googleSearch} onToggle={() => setLocal({...local, googleSearch: !local.googleSearch})} />
        <ConfigToggle label="Otomatik Makale Özeti" active={local.autoSummary} onToggle={() => setLocal({...local, autoSummary: !local.autoSummary})} />
        <button onClick={() => onSave(local)} className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/30 active:scale-95 transition-all">KONFİGÜRASYONU YAYINLA</button>
     </div>
   );
};

const SessionConfigForm: React.FC<{ config: any, onSave: (c: any) => void }> = ({ config, onSave }) => {
   const [local, setLocal] = useState(config || { samplingRate: 16000, voice: 'Kore' });
   return (
     <div className="space-y-6">
        <div className="group">
           <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-2">Audio_Sampling_Rate (Hz)</label>
           <select 
             value={local.samplingRate} 
             onChange={e => setLocal({...local, samplingRate: parseInt(e.target.value)})}
             className="w-full bg-black/40 border-2 border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-primary transition-all appearance-none"
           >
              <option value={16000}>16000 Hz (Optimal)</option>
              <option value={24000}>24000 Hz (HQ)</option>
              <option value={44100}>44100 Hz (Broadcasting)</option>
           </select>
        </div>
        <div className="group">
           <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-2">Asistan_Sesi_Secimi</label>
           <div className="grid grid-cols-2 gap-3">
              {['Kore', 'Zephyr', 'Puck', 'Charon'].map(v => (
                <button 
                  key={v}
                  onClick={() => setLocal({...local, voice: v})}
                  className={`py-3 rounded-xl text-[10px] font-black uppercase border-2 transition-all ${local.voice === v ? 'bg-primary border-primary text-white' : 'bg-white/5 border-white/5 text-slate-500'}`}
                >
                   {v}
                </button>
              ))}
           </div>
        </div>
        <button onClick={() => onSave(local)} className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/30 active:scale-95 transition-all">CANLI AYARLARI GÜNCELLE</button>
     </div>
   );
};

const ConfigToggle: React.FC<{ label: string, active: boolean, onToggle: () => void }> = ({ label, active, onToggle }) => (
   <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5">
      <span className="text-sm font-bold text-white italic">{label}</span>
      <button 
        onClick={onToggle}
        className={`w-14 h-8 rounded-full transition-all relative ${active ? 'bg-emerald-500' : 'bg-slate-800'}`}
      >
         <div className={`absolute top-1 size-6 bg-white rounded-full shadow-lg transition-all ${active ? 'left-7' : 'left-1'}`}></div>
      </button>
   </div>
);

const AdminNavBtn: React.FC<{ active: boolean, icon: string, label: string, onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${active ? 'bg-primary text-white shadow-2xl shadow-primary/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
  >
     <span className="material-symbols-outlined text-2xl font-bold">{icon}</span>
     <span className="text-xs font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default AdminPortal;
