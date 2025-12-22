
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

const HELP_CATEGORIES = [
  { id: 'start', title: 'Başlangıç Rehberi', icon: 'rocket_launch', color: 'bg-blue-50 text-blue-600' },
  { id: 'billing', title: 'Ödeme & Planlar', icon: 'account_balance_wallet', color: 'bg-emerald-50 text-emerald-600' },
  { id: 'tools', title: 'Terapi Araçları', icon: 'construction', color: 'bg-amber-50 text-amber-600' },
  { id: 'ai', title: 'AI & Analiz', icon: 'psychology', color: 'bg-indigo-50 text-indigo-600' },
];

const BLOG_POSTS = [
  {
    id: 4,
    title: "AI Materyal Oluşturucu: Başlangıç Rehberi",
    excerpt: "Yeni terapistler için saniyeler içinde kişiselleştirilmiş materyal üretme kılavuzu.",
    category: "Başlangıç Rehberi",
    image: "https://images.unsplash.com/photo-1675557009875-436f595b1842?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 1,
    title: "Kekemelik Terapisinde AI'nın Rolü",
    excerpt: "Modern teknolojiler konuşma bozukluklarının takibini nasıl dönüştürüyor?",
    category: "Teknoloji",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400"
  }
];

const HelpCenter: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [editorTitle, setEditorTitle] = useState('');
  const [isAiWriting, setIsAiWriting] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleAiWriter = async () => {
    if (!editorTitle.trim()) {
      alert("Lütfen önce makale için bir başlık girin.");
      return;
    }
    setIsAiWriting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `"${editorTitle}" başlığıyla ilgili dil ve konuşma terapisi üzerine profesyonel, klinik derinliği olan bir makale yaz. 
        Lütfen HTML formatında (h1, h2, p, ul, li kullanarak) yanıt ver. Sadece makale içeriğini döndür.`,
      });
      if (editorRef.current) {
        editorRef.current.innerHTML = response.text || "";
      }
    } catch (error) {
      console.error("AI Writer failed:", error);
    } finally {
      setIsAiWriting(false);
    }
  };

  const handleSave = () => {
    const content = editorRef.current?.innerHTML;
    console.log("Saving Article:", { title: editorTitle, content });
    setIsEditing(false);
    setEditorTitle('');
  };

  if (isEditing) {
    return (
      <div className="flex-1 overflow-y-auto bg-white p-4 md:p-12 animate-in fade-in duration-500">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Editor Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-6">
             <div className="flex items-center gap-4">
                <button onClick={() => setIsEditing(false)} className="size-10 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors">
                   <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-xl font-black text-slate-900 italic uppercase tracking-tight">Yeni_Makale_Yaz</h2>
             </div>
             <div className="flex gap-3">
                <button 
                  onClick={handleAiWriter}
                  disabled={isAiWriting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary/10 text-primary rounded-xl font-bold text-sm hover:bg-primary/20 transition-all disabled:opacity-50"
                >
                   {isAiWriting ? <span className="animate-spin material-symbols-outlined text-[18px]">sync</span> : <span className="material-symbols-outlined text-[18px]">auto_fix</span>}
                   AI ile Taslak Oluştur
                </button>
                <button onClick={handleSave} className="px-8 py-2.5 bg-slate-900 text-white rounded-xl font-black text-sm shadow-xl shadow-slate-900/10 hover:bg-black transition-all">
                   Yayınla
                </button>
             </div>
          </div>

          {/* Title Input */}
          <input 
            className="w-full text-4xl md:text-5xl font-black text-slate-900 border-none outline-none placeholder:text-slate-200"
            placeholder="Makale Başlığı..."
            value={editorTitle}
            onChange={(e) => setEditorTitle(e.target.value)}
          />

          {/* Toolbar */}
          <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-2 flex items-center gap-1 shadow-sm">
             <ToolbarBtn icon="format_bold" onClick={() => execCommand('bold')} label="Kalın" />
             <ToolbarBtn icon="format_italic" onClick={() => execCommand('italic')} label="İtalik" />
             <div className="w-px h-6 bg-slate-200 mx-1"></div>
             <ToolbarBtn icon="format_h1" onClick={() => execCommand('formatBlock', 'h1')} label="H1" />
             <ToolbarBtn icon="format_h2" onClick={() => execCommand('formatBlock', 'h2')} label="H2" />
             <div className="w-px h-6 bg-slate-200 mx-1"></div>
             <ToolbarBtn icon="format_list_bulleted" onClick={() => execCommand('insertUnorderedList')} label="Liste" />
             <ToolbarBtn icon="format_list_numbered" onClick={() => execCommand('insertOrderedList')} label="No. Liste" />
             <div className="w-px h-6 bg-slate-200 mx-1"></div>
             <ToolbarBtn icon="link" onClick={() => execCommand('createLink', prompt('Link URL:') || '')} label="Bağlantı" />
             <ToolbarBtn icon="format_clear" onClick={() => execCommand('removeFormat')} label="Temizle" />
          </div>

          {/* Content Area */}
          <div 
            ref={editorRef}
            contentEditable
            className="min-h-[600px] prose prose-slate max-w-none focus:outline-none text-slate-700 leading-relaxed text-lg pb-40"
            onInput={() => {}} // Handle input for state sync if needed
          >
             <p className="text-slate-400">Yazmaya buradan başlayın...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Hero Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10">
           <div className="text-left space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Size nasıl <span className="text-primary italic">yardımcı</span> olabiliriz?
              </h2>
              <p className="text-slate-500 font-medium">Uzman onaylı makaleler ve rehberlerle platformu keşfedin.</p>
           </div>
           <button 
             onClick={() => setIsEditing(true)}
             className="flex items-center gap-3 px-8 py-5 bg-white text-slate-900 font-black rounded-[24px] border-2 border-slate-100 hover:border-primary/20 hover:shadow-2xl transition-all active:scale-95 shadow-sm group"
           >
              <div className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                 <span className="material-symbols-outlined">edit_square</span>
              </div>
              Yeni Makale Yaz
           </button>
        </div>

        <div className="max-w-3xl mx-auto relative group">
          <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
          <input 
            className="w-full bg-white border-2 border-border rounded-[32px] pl-16 pr-6 py-6 text-lg focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-xl shadow-slate-200/50"
            placeholder="Örn: 'Ödeme yöntemleri', 'AI analizi nasıl çalışır?'..."
          />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
           {HELP_CATEGORIES.map(cat => (
             <div key={cat.id} className="bg-white p-8 rounded-[40px] border border-border hover:border-primary/20 hover:shadow-xl transition-all group cursor-pointer text-center">
                <div className={`size-16 mx-auto rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${cat.color}`}>
                   <span className="material-symbols-outlined text-3xl">{cat.icon}</span>
                </div>
                <h3 className="font-bold text-slate-800">{cat.title}</h3>
             </div>
           ))}
        </div>

        {/* Blog Section */}
        <section className="space-y-8">
           <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">TheraSpeech Blog</h3>
              <button className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                Tüm Yazıları Gör <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {BLOG_POSTS.map(post => (
                <div key={post.id} className="bg-white rounded-[40px] border border-border overflow-hidden hover:shadow-2xl transition-all group flex flex-col md:flex-row">
                   <div className="w-full md:w-48 h-48 md:h-auto overflow-hidden flex-shrink-0">
                      <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
                   </div>
                   <div className="p-8 flex-1 flex flex-col">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-3">{post.category}</span>
                      <h4 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-primary transition-colors">{post.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-6">{post.excerpt}</p>
                      <button className="mt-auto text-slate-900 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:text-primary transition-colors">
                        Okumaya Devam Et <span className="material-symbols-outlined text-sm">trending_flat</span>
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Support CTA */}
        <div className="bg-slate-900 rounded-[48px] p-12 md:p-20 text-white text-center relative overflow-hidden">
           <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-[300px] text-white/5 -rotate-12">support_agent</span>
           <div className="relative z-10 space-y-6">
              <h3 className="text-3xl md:text-4xl font-black tracking-tight">Hala bir sorunuz mu var?</h3>
              <p className="text-slate-400 max-w-xl mx-auto text-lg font-medium">Destek ekibimiz size yardımcı olmaktan mutluluk duyar. Haftanın 7 günü canlı destek hattımız aktif.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                 <button className="w-full sm:w-auto px-10 py-5 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
                    <span className="material-symbols-outlined">chat</span> Canlı Destek Başlat
                 </button>
                 <button className="w-full sm:w-auto px-10 py-5 bg-white/10 text-white font-black rounded-2xl border border-white/10 hover:bg-white/20 transition-all">
                    E-posta Gönder
                 </button>
              </div>
           </div>
        </div>
      </div>
      <footer className="mt-20 py-10 text-center border-t border-slate-200">
         <p className="text-sm text-slate-400 font-bold">© 2024 TheraSpeech AI Speech Pathology Systems. Tüm Hakları Saklıdır.</p>
      </footer>
    </div>
  );
};

const ToolbarBtn: React.FC<{ icon: string, onClick: () => void, label: string }> = ({ icon, onClick, label }) => (
  <button 
    onClick={(e) => { e.preventDefault(); onClick(); }}
    className="size-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-all relative group"
    title={label}
  >
    <span className="material-symbols-outlined text-[20px]">{icon}</span>
    <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">{label}</span>
  </button>
);

export default HelpCenter;
