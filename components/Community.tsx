
import React, { useState, useEffect, useRef } from 'react';
import { ChatChannel, ChatMessage, User } from '../types';
import { aiService } from '../services/aiService';

const MOCK_CHANNELS: ChatChannel[] = [
  { id: 'c1', name: 'Artikülasyon & Fonoloji', description: 'Ses üretim hataları ve vaka paylaşımları.', icon: 'record_voice_over', type: 'public', members: 1240, category: 'clinical' },
  { id: 'c2', name: 'Otizm Spektrum Bozukluğu', description: 'İletişim stratejileri ve duyusal bütünleme.', icon: 'extension', type: 'public', members: 850, category: 'clinical' },
  { id: 'c3', name: 'Kekemelik & Akıcılık', description: 'Akıcılık şekillendirme ve duyarsızlaştırma.', icon: 'speed', type: 'public', members: 620, category: 'clinical' },
  { id: 'c4', name: 'Afazi & Nörojenik', description: 'Yetişkin rehabilitasyon ve dil geri kazanımı.', icon: 'psychology', type: 'public', members: 430, category: 'clinical' },
  { id: 'c5', name: 'Klinik İşletme & Kariyer', description: 'Ofis yönetimi ve profesyonel gelişim.', icon: 'work', type: 'public', members: 920, category: 'general' },
];

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'c1': [
    { id: 'm1', senderId: 'u1', senderName: 'Dr. Selin Kaya', content: 'Arkadaşlar, 5 yaşında lateral lisp vakası olan bir danışanımda /s/ sesi için geleneksel yöntemle çok yavaş ilerliyoruz. Alternatif motor öğrenme stratejisi öneren var mı?', timestamp: '10:30', type: 'text' },
    { id: 'm2', senderId: 'u2', senderName: 'Uzm. Dkt. Berk Atan', content: 'Dil ucu yerine dil yanlarının pozisyonuna odaklanan "Successive Approximation" yöntemini denediniz mi? Benzer bir vakada çok hızlı sonuç almıştım.', timestamp: '10:45', type: 'text' },
    { id: 'm3', senderId: 'u3', senderName: 'Dkt. Elif Ak', content: 'Berk Bey\'e katılıyorum. Ayrıca görsel geribildirim için aynada dil pozisyonu takibi çok kritik.', timestamp: '11:02', type: 'text' },
  ],
  'c2': [
    { id: 'm4', senderId: 'u4', senderName: 'Caner Öz', content: 'Görsel destek kartları kütüphanesini güncelledim, inceleyebilirsiniz.', timestamp: '09:15', type: 'material' },
  ]
};

const Community: React.FC = () => {
  const [activeChannel, setActiveChannel] = useState<ChatChannel>(MOCK_CHANNELS[0]);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChannel]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      senderName: 'Siz (Uzman)',
      content: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };
    setMessages(prev => ({
      ...prev,
      [activeChannel.id]: [...(prev[activeChannel.id] || []), newMessage]
    }));
    setInputText('');
  };

  const handleAiSummary = async () => {
    const channelMsgs = messages[activeChannel.id] || [];
    if (channelMsgs.length === 0) return;
    
    setIsSummarizing(true);
    setSummary(null);
    try {
      const result = await aiService.summarizeDiscussion(channelMsgs);
      setSummary(result || "Özet oluşturulamadı.");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#F8FAFC]">
      {/* Sol Sidebar: Kanallar & DMs */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
         <div className="p-8 border-b border-slate-50">
            <h2 className="text-xl font-black text-slate-900 italic tracking-tighter uppercase mb-2">Klinik_Network</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Uzman Ağı v6.0</p>
         </div>
         
         <div className="flex-1 overflow-y-auto p-4 space-y-8 no-scrollbar">
            <section>
               <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Uzmanlık_Kanalları</h3>
               <div className="space-y-1">
                  {MOCK_CHANNELS.map(channel => (
                    <button 
                      key={channel.id} 
                      onClick={() => { setActiveChannel(channel); setSummary(null); }}
                      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${activeChannel.id === channel.id ? 'bg-slate-900 text-white shadow-xl shadow-black/20' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                       <span className="material-symbols-outlined text-2xl">{channel.icon}</span>
                       <div className="flex-1 text-left min-w-0">
                          <div className={`text-xs font-black truncate uppercase tracking-tight ${activeChannel.id === channel.id ? 'text-white' : 'text-slate-700'}`}>{channel.name}</div>
                          <div className="text-[9px] font-bold opacity-50 truncate">{channel.members.toLocaleString()} Uzman</div>
                       </div>
                    </button>
                  ))}
               </div>
            </section>

            <section>
               <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Direkt_Mesajlar</h3>
               <div className="space-y-4 px-4">
                  <DMItem name="Dr. Selin Kaya" status="online" />
                  <DMItem name="Uzm. Dkt. Berk Atan" status="offline" />
                  <DMItem name="Dkt. Elif Ak" status="online" />
               </div>
            </section>
         </div>

         <div className="p-6 border-t border-slate-50 bg-slate-50/50">
            <button className="w-full py-4 bg-primary/10 text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
               YENİ KANAL OLUŞTUR
            </button>
         </div>
      </aside>

      {/* Ana Sohbet Alanı */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
         <header className="h-24 border-b border-slate-200 px-10 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-5 min-w-0">
               <div className="size-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-900 shadow-sm">
                  <span className="material-symbols-outlined text-2xl font-black">{activeChannel.icon}</span>
               </div>
               <div className="min-w-0">
                  <h2 className="text-xl font-black text-slate-900 italic tracking-tighter uppercase truncate">{activeChannel.name}</h2>
                  <p className="text-[10px] text-slate-400 font-bold truncate">{activeChannel.description}</p>
               </div>
            </div>
            
            <div className="flex items-center gap-4">
               <button 
                 onClick={handleAiSummary}
                 disabled={isSummarizing}
                 className="flex items-center gap-3 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-black/20 disabled:opacity-50 active:scale-95"
               >
                  {isSummarizing ? <span className="animate-spin material-symbols-outlined text-[18px]">sync</span> : <span className="material-symbols-outlined text-[18px]">auto_awesome</span>}
                  TARTIŞMAYI SENTEZLE
               </button>
               <button className="p-2.5 text-slate-400 hover:text-slate-900 transition-colors">
                  <span className="material-symbols-outlined">person_add</span>
               </button>
               <button className="p-2.5 text-slate-400 hover:text-slate-900 transition-colors">
                  <span className="material-symbols-outlined">settings</span>
               </button>
            </div>
         </header>

         <div className="flex-1 flex overflow-hidden">
            {/* Mesaj Listesi */}
            <div className="flex-1 flex flex-col overflow-y-auto p-10 space-y-8 no-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-[0.98]">
               {summary && (
                 <div className="bg-amber-50 rounded-[40px] border-2 border-amber-200 p-10 shadow-xl animate-in fade-in slide-in-from-top-4 duration-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                       <span className="material-symbols-outlined text-9xl">psychology</span>
                    </div>
                    <div className="flex items-center justify-between mb-6">
                       <h4 className="text-[11px] font-black text-amber-600 uppercase tracking-[0.3em] flex items-center gap-3">
                          <span className="material-symbols-outlined text-lg">auto_awesome</span>
                          KLİNİK_TARTIŞMA_SENTEZİ
                       </h4>
                       <button onClick={() => setSummary(null)} className="text-amber-400 hover:text-amber-600"><span className="material-symbols-outlined">close</span></button>
                    </div>
                    <div className="prose prose-sm max-w-none text-amber-900 font-medium italic whitespace-pre-wrap leading-relaxed">
                       {summary}
                    </div>
                 </div>
               )}

               {(messages[activeChannel.id] || []).map((msg) => (
                 <div key={msg.id} className={`flex gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.senderId === 'me' ? 'flex-row-reverse' : ''}`}>
                    <div className="size-12 rounded-2xl overflow-hidden shrink-0 border-2 border-white shadow-lg">
                       <img src={msg.senderAvatar || `https://i.pravatar.cc/150?u=${msg.senderId}`} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className={`flex flex-col gap-2 max-w-[70%] ${msg.senderId === 'me' ? 'items-end' : ''}`}>
                       <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-slate-900 uppercase italic tracking-tight">{msg.senderName}</span>
                          <span className="text-[9px] font-bold text-slate-400">{msg.timestamp}</span>
                       </div>
                       <div className={`p-6 rounded-[32px] text-sm font-medium leading-relaxed shadow-sm border ${
                         msg.senderId === 'me' ? 'bg-primary text-white border-primary/20 rounded-tr-none' : 'bg-slate-50 text-slate-700 border-slate-100 rounded-tl-none'
                       }`}>
                          {msg.content}
                       </div>
                    </div>
                 </div>
               ))}
               <div ref={messagesEndRef} />
            </div>

            {/* Sağ Panel: Kanal Kaynakları */}
            <aside className="hidden 2xl:flex w-96 border-l border-slate-100 bg-slate-50/30 flex-col p-8 gap-10 overflow-y-auto no-scrollbar">
               <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Paylaşılan_Kaynaklar</h3>
                  <div className="space-y-4">
                     <SharedResource icon="description" title="ICF_Articulation_Guide.pdf" size="2.4 MB" />
                     <SharedResource icon="videocam" title="Therapy_Session_Example.mp4" size="48 MB" />
                     <SharedResource icon="auto_fix" title="Custom_R_Exercise_Set" size="1.1 MB" />
                  </div>
               </div>

               <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Aktif_Danışmanlar</h3>
                  <div className="space-y-4">
                     {[1,2,3].map(i => (
                       <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                          <div className="relative">
                             <img src={`https://i.pravatar.cc/150?u=expert-${i}`} className="size-10 rounded-xl" alt="" />
                             <div className="absolute -bottom-1 -right-1 size-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                          </div>
                          <div>
                             <div className="text-xs font-black text-slate-900 uppercase italic">Dr. Uzman {i}</div>
                             <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Klinik Psikolog</div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </aside>
         </div>

         {/* Mesaj Girişi */}
         <footer className="p-8 border-t border-slate-200 bg-white">
            <div className="relative group max-w-6xl mx-auto flex items-center gap-4">
               <div className="flex-1 relative">
                  <button className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors">
                     <span className="material-symbols-outlined text-2xl font-black">add_circle</span>
                  </button>
                  <input 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[32px] pl-16 pr-24 py-6 text-lg focus:ring-8 focus:ring-primary/5 focus:border-primary outline-none transition-all shadow-inner font-bold italic"
                    placeholder="Mesajınızı yazın veya vaka dosyasını sürükleyin..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                     <button className="p-2.5 text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">mood</span>
                     </button>
                     <button className="p-2.5 text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">attach_file</span>
                     </button>
                  </div>
               </div>
               <button 
                 onClick={handleSendMessage}
                 className="size-16 bg-slate-900 text-white rounded-[24px] flex items-center justify-center shadow-xl shadow-black/20 hover:bg-black transition-all active:scale-90 shrink-0"
               >
                  <span className="material-symbols-outlined text-2xl font-black">send</span>
               </button>
            </div>
         </footer>
      </main>
    </div>
  );
};

// --- Yardımcı Bileşenler ---

const SharedResource: React.FC<{ icon: string, title: string, size: string }> = ({ icon, title, size }) => (
  <div className="p-4 bg-white rounded-2xl border border-slate-100 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer flex items-center gap-4 group">
     <div className="size-10 bg-slate-50 text-slate-400 group-hover:text-primary group-hover:bg-primary/5 rounded-xl flex items-center justify-center transition-colors">
        <span className="material-symbols-outlined text-xl">{icon}</span>
     </div>
     <div className="min-w-0">
        <div className="text-[11px] font-black text-slate-900 truncate uppercase tracking-tight">{title}</div>
        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{size}</div>
     </div>
  </div>
);

const DMItem: React.FC<{ name: string, status: 'online' | 'offline' }> = ({ name, status }) => (
  <div className="flex items-center gap-4 group cursor-pointer">
     <div className="relative">
        <img src={`https://i.pravatar.cc/150?u=${name}`} className="size-10 rounded-xl group-hover:scale-110 transition-transform" alt="" />
        <div className={`absolute -bottom-1 -right-1 size-3 border-2 border-white rounded-full ${status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
     </div>
     <div className="min-w-0">
        <div className="text-xs font-black text-slate-700 truncate uppercase tracking-tight group-hover:text-primary transition-colors">{name}</div>
        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{status}</div>
     </div>
  </div>
);

export default Community;
