
import React, { useState } from 'react';

type BookingStep = 'select-therapist' | 'select-package' | 'checkout' | 'success';

const Booking: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState<BookingStep>('select-therapist');
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [coupon, setCoupon] = useState('');

  const renderStep = () => {
    switch (step) {
      case 'select-therapist':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10">
                   <span className="material-symbols-outlined text-[14px]">clinical_notes</span>
                   Klinik Rezervasyon Sistemi v6.0
                </div>
                <h2 className="text-5xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Uzmanını Seç</h2>
                <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto italic">Vaka profilinize en uygun deneyime sahip dil ve konuşma terapistleri ile tanışın.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <TherapistCard name="Dr. Selin Kaya" bio="Artikülasyon ve Gecikmiş Dil Uzmanı. 12+ yıl klinik deneyim." rating={4.9} sessions={1240} onSelect={() => { setSelectedTherapist("Selin"); setStep('select-package'); }} />
                <TherapistCard name="Uzm. Can Demir" bio="Kekemelik ve Akıcılık Bozuklukları. Bilişsel davranışçı yaklaşım." rating={4.8} sessions={850} onSelect={() => { setSelectedTherapist("Can"); setStep('select-package'); }} />
                <TherapistCard name="Dkt. Elif Ak" bio="Çocukluk Çağı Apraksisi ve OSB iletişim stratejileri." rating={5.0} sessions={620} onSelect={() => { setSelectedTherapist("Elif"); setStep('select-package'); }} />
             </div>
          </div>
        );
      case 'select-package':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="flex items-center justify-between">
                <button onClick={() => setStep('select-therapist')} className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
                   <span className="material-symbols-outlined text-lg">arrow_back</span> Geri Dön
                </button>
                <div className="hidden md:flex items-center gap-4 px-6 py-3 bg-primary/5 rounded-2xl border border-primary/10">
                   <div className="size-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg"><span className="material-symbols-outlined text-sm">person</span></div>
                   <span className="text-[10px] font-black text-primary uppercase tracking-widest">Seçili Uzman: Dr. {selectedTherapist}</span>
                </div>
             </div>
             
             <div className="text-center space-y-4">
                <h2 className="text-5xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Terapi Paketi Seç</h2>
                <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto italic">Gelişim hedeflerinize en uygun seans paketini belirleyin.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <PackageCard title="Temel Başlangıç" price="450 ₺" sessions="1 Seans" desc="Tanı ve ilk değerlendirme seansı." onSelect={() => { setSelectedPackage("Basic"); setStep('checkout'); }} />
                <PackageCard title="Gelişim Serisi" price="1,600 ₺" sessions="4 Seans" desc="Düzenli takip ve materyal erişimi." popular onSelect={() => { setSelectedPackage("Growth"); setStep('checkout'); }} />
                <PackageCard title="Klinik Master" price="3,000 ₺" sessions="8 Seans" desc="Uçtan uca terapi ve AI raporlama." onSelect={() => { setSelectedPackage("Pro"); setStep('checkout'); }} />
             </div>
          </div>
        );
      case 'checkout':
        return (
          <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <button onClick={() => setStep('select-package')} className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
                <span className="material-symbols-outlined text-lg">arrow_back</span> Geri Dön
             </button>
             
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Secure Checkout Form */}
                <div className="lg:col-span-8 space-y-8">
                   <div className="bg-white rounded-[56px] border border-slate-200 p-12 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                         <span className="material-symbols-outlined text-[200px]">shield_person</span>
                      </div>
                      
                      <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase mb-12 flex items-center gap-4">
                         <span className="material-symbols-outlined text-primary text-4xl">payments</span>
                         Güvenli İşlem Onayı
                      </h2>
                      
                      <div className="space-y-8 relative z-10">
                         <div className="group space-y-3">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Kart Sahibi Bilgisi</label>
                           <input className="w-full bg-slate-50 border-2 border-slate-100 rounded-[28px] px-8 py-5 text-slate-900 font-bold text-lg outline-none focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all italic" placeholder="AD SOYAD" />
                         </div>
                         
                         <div className="group space-y-3">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Kart Numarası</label>
                           <div className="relative">
                              <input className="w-full bg-slate-50 border-2 border-slate-100 rounded-[28px] px-8 py-5 text-slate-900 font-mono text-xl outline-none focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all" placeholder="0000 0000 0000 0000" />
                              <div className="absolute right-8 top-1/2 -translate-y-1/2 flex gap-2">
                                 <div className="w-10 h-6 bg-slate-200 rounded"></div>
                                 <div className="w-10 h-6 bg-slate-200 rounded"></div>
                              </div>
                           </div>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Geçerlilik Tarihi</label>
                              <input className="w-full bg-slate-50 border-2 border-slate-100 rounded-[28px] px-8 py-5 text-slate-900 font-bold text-lg outline-none focus:border-primary transition-all" placeholder="AA / YY" />
                            </div>
                            <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Güvenlik Kodu (CVC)</label>
                              <input className="w-full bg-slate-50 border-2 border-slate-100 rounded-[28px] px-8 py-5 text-slate-900 font-bold text-lg outline-none focus:border-primary transition-all" placeholder="123" />
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="p-8 bg-emerald-50 rounded-[40px] border border-emerald-100 flex items-center gap-8">
                      <div className="size-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-emerald-500">
                         <span className="material-symbols-outlined text-3xl font-black">verified</span>
                      </div>
                      <div>
                         <div className="text-sm font-black text-emerald-900 uppercase italic tracking-tight">SSL-256 Bit Şifreli Ödeme</div>
                         <p className="text-xs text-emerald-600 font-medium italic mt-1 leading-relaxed">Ödeme bilgileriniz uçtan uca şifrelenir ve TheraSpeech sunucularında asla depolanmaz. Tüm işlemler PCI-DSS standartlarına uygundur.</p>
                      </div>
                   </div>
                </div>

                {/* Summary Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                   <div className="bg-white rounded-[48px] border border-slate-200 p-10 shadow-2xl sticky top-10 flex flex-col group">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10 text-center">İşlem Özeti</h3>
                      
                      <div className="space-y-6 mb-10">
                         <SummaryRow label={`${selectedPackage} Paketi`} value="1,600 ₺" />
                         <SummaryRow label="Klinik Hizmet Bedeli" value="320 ₺" />
                         {coupon === 'THERA20' && <SummaryRow label="İndirim (THERA20)" value="-320 ₺" success />}
                         <div className="h-px bg-slate-100 my-4"></div>
                         <div className="flex justify-between items-end">
                            <span className="text-[11px] font-black text-slate-400 uppercase">Toplam Ödenecek</span>
                            <span className="text-4xl font-black text-slate-900 tracking-tighter italic">{coupon === 'THERA20' ? '1,600 ₺' : '1,920 ₺'}</span>
                         </div>
                      </div>

                      <div className="relative mb-10 group/input">
                         <input 
                           className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-black uppercase outline-none focus:border-primary transition-all pr-24" 
                           placeholder="KUPON KODU"
                           value={coupon}
                           onChange={(e) => setCoupon(e.target.value)}
                         />
                         <button className="absolute right-2 top-2 bottom-2 px-4 bg-slate-900 text-white text-[9px] font-black rounded-xl uppercase tracking-widest hover:bg-black transition-all">Uygula</button>
                      </div>

                      <button 
                        onClick={() => setStep('success')}
                        className="w-full py-6 bg-primary text-white font-black rounded-3xl shadow-3xl shadow-primary/30 hover:bg-primary-dark transition-all hover:scale-[1.02] active:scale-95 text-lg uppercase tracking-widest"
                      >
                        Ödemeyi Tamamla
                      </button>
                   </div>
                </div>
             </div>
          </div>
        );
      case 'success':
        return (
          <div className="flex flex-col items-center justify-center text-center space-y-10 animate-in zoom-in duration-1000 py-32">
             <div className="relative">
                <div className="size-40 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-3xl shadow-emerald-500/20 animate-morph relative z-10">
                   <span className="material-symbols-outlined text-7xl font-black">check_circle</span>
                </div>
                <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20"></div>
             </div>
             
             <div className="space-y-4">
                <h2 className="text-5xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">İşlem Başarılı!</h2>
                <p className="text-xl text-slate-500 font-medium max-w-md mx-auto italic leading-relaxed">Terapi paketiniz başarıyla oluşturuldu. Dr. {selectedTherapist} ile ilk seansınız takviminize eklendi.</p>
             </div>
             
             <div className="flex gap-6">
                <button onClick={onComplete} className="px-10 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-2xl uppercase text-[11px] tracking-widest active:scale-95">Paneli Görüntüle</button>
                <button className="px-10 py-5 bg-white border-2 border-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-50 transition-all uppercase text-[11px] tracking-widest active:scale-95">Makbuzu İndir</button>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 md:p-10 flex flex-col items-center no-scrollbar">
       <div className="max-w-7xl w-full">
          {renderStep()}
       </div>
    </div>
  );
};

// --- Helper Components ---

const TherapistCard: React.FC<{ name: string, bio: string, rating: number, sessions: number, onSelect: () => void }> = ({ name, bio, rating, sessions, onSelect }) => (
  <div className="bg-white p-10 rounded-[56px] border border-slate-100 shadow-sm hover:shadow-3xl hover:border-primary/20 transition-all group flex flex-col items-center text-center relative overflow-hidden">
     <div className="absolute top-0 inset-x-0 h-24 bg-slate-50 opacity-50 -z-0"></div>
     <div className="size-32 rounded-[48px] bg-slate-100 mb-8 border-8 border-white shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-700 relative z-10">
        <img src={`https://i.pravatar.cc/150?u=${name}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" alt={name} />
     </div>
     <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase mb-2 relative z-10 leading-none">{name}</h3>
     <p className="text-sm text-slate-500 font-medium italic mb-6 h-12 line-clamp-2 px-4 leading-relaxed">{bio}</p>
     
     <div className="grid grid-cols-2 gap-4 w-full mb-10 pt-6 border-t border-slate-50 relative z-10">
        <div className="text-center border-r border-slate-100">
           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rating</div>
           <div className="flex items-center justify-center gap-1.5 text-amber-500 font-black text-lg italic">
              <span className="material-symbols-outlined text-lg filled">star</span>
              {rating}
           </div>
        </div>
        <div className="text-center">
           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Seans</div>
           <div className="text-lg font-black text-slate-900 italic">{sessions.toLocaleString()}+</div>
        </div>
     </div>
     
     <button onClick={onSelect} className="w-full py-5 bg-slate-50 text-slate-700 font-black rounded-2xl hover:bg-primary hover:text-white transition-all border-2 border-slate-100 hover:border-transparent group-hover:shadow-2xl group-hover:shadow-primary/20 uppercase text-[10px] tracking-[0.2em] relative z-10">Randevu Seç</button>
  </div>
);

const PackageCard: React.FC<{ title: string, price: string, sessions: string, desc: string, popular?: boolean, onSelect: () => void }> = ({ title, price, sessions, desc, popular, onSelect }) => (
  <div className={`relative bg-white p-12 rounded-[56px] border transition-all hover:shadow-3xl flex flex-col ${popular ? 'border-primary ring-8 ring-primary/5 -translate-y-6 shadow-2xl' : 'border-slate-100 shadow-sm'}`}>
     {popular && (
       <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[9px] font-black uppercase tracking-[0.3em] px-5 py-2 rounded-full shadow-2xl">En Popüler Seçim</div>
     )}
     <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase mb-4 leading-none">{title}</h3>
     <div className="text-5xl font-black text-primary tracking-tighter italic mb-2 leading-none">{price}</div>
     <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">{sessions} • %20 KDV DAHİL</div>
     <p className="text-sm font-medium text-slate-500 italic mb-10 leading-relaxed">{desc}</p>
     
     <div className="space-y-4 mb-12 flex-1 text-left">
        <FeatureItem label="Canlı Görüntülü Görüşme" />
        <FeatureItem label="AI Materyal Erişimi" />
        <FeatureItem label="Klinik İlerleme Takibi" />
        {popular && <FeatureItem label="Haftalık Akademik Rapor" />}
     </div>
     
     <button onClick={onSelect} className={`w-full py-5 font-black rounded-[24px] transition-all uppercase text-[10px] tracking-[0.2em] ${popular ? 'bg-primary text-white shadow-xl shadow-primary/30 hover:bg-primary-dark' : 'bg-slate-50 text-slate-700 hover:bg-slate-900 hover:text-white border-2 border-slate-100 hover:border-transparent'}`}>Paketi Seç</button>
  </div>
);

const FeatureItem: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-3 text-sm text-slate-600 font-semibold italic">
     <div className="size-6 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-[16px] font-black">check</span>
     </div>
     {label}
  </div>
);

const SummaryRow: React.FC<{ label: string, value: string, success?: boolean }> = ({ label, value, success }) => (
  <div className="flex justify-between items-center group">
     <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">{label}</span>
     <span className={`text-sm font-black italic tracking-tight ${success ? 'text-emerald-500' : 'text-slate-900'}`}>{value}</span>
  </div>
);

export default Booking;
