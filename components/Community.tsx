
import React, { useState } from 'react';

const MOCK_POSTS = [
  {
    id: 1,
    author: "Uzm. Dkt. Ayşe Yılmaz",
    avatar: "https://i.pravatar.cc/150?u=ayse",
    content: "Yeni geliştirdiğim 'R' sesi oyun kartlarını kütüphaneye ekledim. 5-7 yaş arası çocuklarda çok etkili oldu. Deneyenlerin yorumlarını bekliyorum!",
    tags: ["Materyal", "Artikülasyon"],
    likes: 24,
    comments: 5,
    time: "2 saat önce"
  },
  {
    id: 2,
    author: "Dr. Selim Akın",
    avatar: "https://i.pravatar.cc/150?u=selim",
    content: "Vaka Tartışması: 4 yaşında, gecikmiş dil tanısı almış bir danışanım için ev ödevi takibini nasıl daha interaktif hale getirebilirim? Önerisi olan var mı?",
    tags: ["Vaka Tartışması", "Gecikmiş Dil"],
    likes: 12,
    comments: 18,
    time: "5 saat önce"
  }
];

const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState('feed');

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar: Categories */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white rounded-3xl border border-border p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4">Kanallar</h3>
              <div className="space-y-2">
                 <ChannelItem icon="forum" label="Genel Tartışma" active />
                 <ChannelItem icon="psychology" label="Vaka Paylaşımları" />
                 <ChannelItem icon="auto_fix" label="AI İpuçları" />
                 <ChannelItem icon="school" label="Akademik Haberler" />
              </div>
           </div>
           
           <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
              <h4 className="text-xs font-black text-primary uppercase mb-3">Haftalık Challenge</h4>
              <p className="text-sm font-medium text-slate-700 mb-4">En çok sevilen 'S' sesi materyalini sen tasarla!</p>
              <button className="w-full py-2 bg-primary text-white rounded-xl text-xs font-bold">Katıl</button>
           </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
           {/* Create Post */}
           <div className="bg-white rounded-[32px] border border-border p-6 shadow-sm">
              <div className="flex gap-4">
                 <div className="size-10 rounded-full bg-slate-100 flex-shrink-0"></div>
                 <textarea 
                   className="flex-1 bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                   placeholder="Meslektaşlarınla bir şeyler paylaş..."
                   rows={3}
                 ></textarea>
              </div>
              <div className="flex justify-between items-center mt-4">
                 <div className="flex gap-2">
                    <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors">
                       <span className="material-symbols-outlined text-[20px]">image</span>
                    </button>
                    <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors">
                       <span className="material-symbols-outlined text-[20px]">attach_file</span>
                    </button>
                 </div>
                 <button className="px-6 py-2 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20">Paylaş</button>
              </div>
           </div>

           {/* Posts List */}
           {MOCK_POSTS.map(post => (
             <div key={post.id} className="bg-white rounded-[32px] border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between mb-6">
                   <div className="flex gap-4">
                      <img src={post.avatar} className="size-12 rounded-full border-2 border-white shadow-sm" alt={post.author} />
                      <div>
                         <div className="font-bold text-slate-900">{post.author}</div>
                         <div className="text-xs text-slate-400">{post.time}</div>
                      </div>
                   </div>
                   <button className="text-slate-400"><span className="material-symbols-outlined">more_horiz</span></button>
                </div>
                <p className="text-slate-700 leading-relaxed mb-6">{post.content}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                   {post.tags.map(tag => (
                     <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-full border border-slate-100">#{tag}</span>
                   ))}
                </div>
                <div className="flex gap-6 pt-6 border-t border-slate-50">
                   <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-sm font-bold">
                      <span className="material-symbols-outlined text-[20px]">favorite</span> {post.likes}
                   </button>
                   <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-sm font-bold">
                      <span className="material-symbols-outlined text-[20px]">chat_bubble</span> {post.comments}
                   </button>
                   <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-sm font-bold ml-auto">
                      <span className="material-symbols-outlined text-[20px]">share</span>
                   </button>
                </div>
             </div>
           ))}
        </div>

        {/* Right Sidebar: Active Users / Stats */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white rounded-3xl border border-border p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6">Aktif Uzmanlar</h3>
              <div className="space-y-4">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="flex items-center gap-3">
                      <div className="relative">
                         <div className="size-9 rounded-full bg-slate-100"></div>
                         <div className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="text-xs font-bold text-slate-700">Dkt. Ahmet C.</div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-6 py-2 text-primary font-bold text-xs hover:underline">Tümünü Gör</button>
           </div>
           
           <div className="bg-slate-900 rounded-[32px] p-8 text-white">
              <div className="text-secondary font-black text-2xl mb-2">342+</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Paylaşılan Materyal</div>
              <p className="text-[10px] text-slate-400">Bu hafta topluluk tarafından 24 yeni materyal üretildi.</p>
           </div>
        </div>

      </div>
    </div>
  );
};

const ChannelItem: React.FC<{ icon: string, label: string, active?: boolean }> = ({ icon, label, active }) => (
  <button className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${active ? 'bg-primary/10 text-primary font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
     <span className="material-symbols-outlined text-[20px]">{icon}</span>
     <span className="text-sm">{label}</span>
  </button>
);

export default Community;
