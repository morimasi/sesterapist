
import React, { useState } from 'react';

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
  },
  {
    id: 2,
    title: "Evde Dil Egzersizleri İçin 5 İpucu",
    excerpt: "Ebeveynlerin çocuklarıyla yapabileceği pratik ve eğlenceli aktiviteler.",
    category: "Eğitim",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 3,
    title: "Artikülasyon Bozuklukları Hakkında Her Şey",
    excerpt: "Tanıdan tedaviye artikülasyon bozuklukları rehberi.",
    category: "Klinik",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400"
  }
];

const FAQS = [
  { q: "Seans ücretleri nasıl belirleniyor?", a: "Seans ücretleri seçtiğiniz uzmana ve paket içeriğine göre değişiklik göstermektedir." },
  { q: "İptal politikası nedir?", a: "Seanslarınızdan 24 saat öncesine kadar ücretsiz iptal veya erteleme yapabilirsiniz." },
  { q: "AI raporları ne kadar güvenilir?", a: "Raporlarımız Gemini Pro altyapısıyla klinik veriler ışığında hazırlanır ve bir uzman kontrolü önerilir." },
];

const HelpCenter: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Hero Search */}
        <div className="text-center space-y-6 pt-10">
           <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
             Size nasıl <span className="text-primary italic">yardımcı</span> olabiliriz?
           </h2>
           <div className="max-w-2xl mx-auto relative group">
              <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
              <input 
                className="w-full bg-white border-2 border-border rounded-[32px] pl-16 pr-6 py-6 text-lg focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-xl shadow-slate-200/50"
                placeholder="Örn: 'Ödeme yöntemleri', 'AI analizi nasıl çalışır?'..."
              />
           </div>
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

        {/* Adım Adım AI Rehberi - Yeni Bölüm */}
        <section className="bg-white rounded-[48px] border border-border p-10 md:p-16 shadow-sm overflow-hidden relative">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
              <span className="material-symbols-outlined text-[320px]">magic_button</span>
           </div>
           
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                 <div className="inline-flex px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary/20">Hızlı Rehber</div>
                 <h3 className="text-3xl font-black text-slate-900 tracking-tight italic">AI Materyal Oluşturucu Nasıl Kullanılır?</h3>
                 <p className="text-slate-500 font-medium leading-relaxed">Yeni danışanlarınız için kişiselleştirilmiş terapi materyallerini saniyeler içinde üretmek için bu adımları izleyin.</p>
                 
                 <div className="space-y-6">
                    <GuideStep number="1" text="Kütüphaneye Gidin" desc="Üst menüden 'Kütüphane' sekmesine tıklayarak materyal merkezine erişin." />
                    <GuideStep number="2" text="AI Barını Kullanın" desc="Sayfanın üst kısmındaki 'AI Materyal Oluşturucu' giriş alanını bulun." />
                    <GuideStep number="3" text="İsteğinizi Tanımlayın" desc="Danışanın yaşına ve hedefine uygun bir prompt yazın. Ne kadar detay verirseniz sonuç o kadar iyi olur." />
                    <GuideStep number="4" text="Onaylayın ve Ekleyin" desc="'Oluştur' butonuna basın. AI tarafından üretilen materyali 'Ekle' butonuyla seansınıza dahil edin." />
                 </div>
              </div>

              <div className="bg-slate-50 rounded-[40px] p-8 border border-slate-200 shadow-inner">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="size-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg">
                       <span className="material-symbols-outlined text-xl">lightbulb</span>
                    </div>
                    <h4 className="text-lg font-black text-slate-800 italic">Örnek Kullanım</h4>
                 </div>
                 <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm italic text-slate-600 text-sm leading-relaxed mb-6">
                    "Danışanım 6 yaşında ve korsanlara bayılıyor. /k/ sesini kelime başında üretmekte zorlanıyor. Ona özel, korsan temalı 5 kartlık bir hikaye egzersizi oluştur."
                 </div>
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="size-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm">check</span>
                       </div>
                       <span className="text-xs font-bold text-slate-700">Kişiselleştirilmiş içerik</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="size-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm">check</span>
                       </div>
                       <span className="text-xs font-bold text-slate-700">İlgi alanına dayalı motivasyon</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="size-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm">check</span>
                       </div>
                       <span className="text-xs font-bold text-slate-700">Klinik hedefe odaklı (Artikülasyon)</span>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Blog Section */}
        <section className="space-y-8">
           <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">TheraSpeech Blog</h3>
              <button className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                Tüm Yazıları Gör <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {BLOG_POSTS.map(post => (
                <div key={post.id} className="bg-white rounded-[40px] border border-border overflow-hidden hover:shadow-2xl transition-all group flex flex-col">
                   <div className="aspect-[16/10] overflow-hidden">
                      <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
                   </div>
                   <div className="p-8 flex-1 flex flex-col">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-3">{post.category}</span>
                      <h4 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-primary transition-colors">{post.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{post.excerpt}</p>
                      <button className="mt-6 text-slate-900 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                        Okumaya Devam Et <span className="material-symbols-outlined text-sm">trending_flat</span>
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white rounded-[48px] border border-border p-10 md:p-16 shadow-sm">
           <div className="text-center mb-12">
              <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Sıkça Sorulan Sorular</h3>
              <p className="text-slate-500">Merak ettiğiniz her şey burada.</p>
           </div>
           <div className="max-w-3xl mx-auto space-y-4">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="border-b border-slate-100 last:border-none">
                   <button 
                     onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                     className="w-full flex items-center justify-between py-6 text-left hover:text-primary transition-colors group"
                   >
                      <span className="font-bold text-lg text-slate-800 group-hover:text-primary">{faq.q}</span>
                      <span className={`material-symbols-outlined transition-transform duration-300 ${expandedFaq === idx ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                   </button>
                   {expandedFaq === idx && (
                     <div className="pb-6 animate-in slide-in-from-top-2 duration-300">
                        <p className="text-slate-600 leading-relaxed font-medium">{faq.a}</p>
                     </div>
                   )}
                </div>
              ))}
           </div>
        </section>

        {/* Support CTA */}
        <div className="bg-slate-900 rounded-[48px] p-12 md:p-20 text-white text-center relative overflow-hidden">
           <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-[300px] text-white/5 -rotate-12">support_agent</span>
           <div className="relative z-10 space-y-6">
              <h3 className="text-3xl md:text-4xl font-black tracking-tight">Hala bir sorunuz mu var?</h3>
              <p className="text-slate-400 max-w-xl mx-auto text-lg">Destek ekibimiz size yardımcı olmaktan mutluluk duyar. Haftanın 7 günü canlı destek hattımız aktif.</p>
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

const GuideStep: React.FC<{ number: string, text: string, desc: string }> = ({ number, text, desc }) => (
  <div className="flex gap-4 group">
     <div className="size-8 rounded-full bg-slate-100 text-slate-500 font-black flex items-center justify-center text-xs group-hover:bg-primary group-hover:text-white transition-all shadow-sm border border-slate-200">
        {number}
     </div>
     <div>
        <h5 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{text}</h5>
        <p className="text-xs text-slate-500 mt-1">{desc}</p>
     </div>
  </div>
);

export default HelpCenter;
