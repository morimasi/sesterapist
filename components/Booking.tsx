
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
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="text-center">
                <h2 className="text-3xl font-black text-slate-900 mb-2">Uzmanını Seç</h2>
                <p className="text-slate-500">Alanında uzman dil ve konuşma terapistleri ile tanışın.</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <TherapistCard name="Dr. Selin Kaya" bio="Artikülasyon ve Gecikmiş Dil Uzmanı" rating={4.9} onSelect={() => { setSelectedTherapist("Selin"); setStep('select-package'); }} />
                <TherapistCard name="Uzm. Can Demir" bio="Kekemelik ve Akıcılık Bozuklukları" rating={4.8} onSelect={() => { setSelectedTherapist("Can"); setStep('select-package'); }} />
                <TherapistCard name="Dkt. Elif Ak" bio="Çocukluk Çağı Apraksisi" rating={5.0} onSelect={() => { setSelectedTherapist("Elif"); setStep('select-package'); }} />
             </div>
          </div>
        );
      case 'select-package':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <button onClick={() => setStep('select-therapist')} className="flex items-center gap-2 text-primary font-bold hover:underline mb-4">
                <span className="material-symbols-outlined">arrow_back</span> Geri
             </button>
             <div className="text-center">
                <h2 className="text-3xl font-black text-slate-900 mb-2">Terapi Paketi Seç</h2>
                <p className="text-slate-500">Size en uygun seans paketini belirleyin.</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <PackageCard title="Tekil Seans" price="450 ₺" sessions="1 Seans" onSelect={() => { setSelectedPackage("Basic"); setStep('checkout'); }} />
                <PackageCard title="Gelişim Paketi" price="1,600 ₺" sessions="4 Seans" popular onSelect={() => { setSelectedPackage("Growth"); setStep('checkout'); }} />
                <PackageCard title="Uzman Paketi" price="3,000 ₺" sessions="8 Seans" onSelect={() => { setSelectedPackage("Pro"); setStep('checkout'); }} />
             </div>
          </div>
        );
      case 'checkout':
        return (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <button onClick={() => setStep('select-package')} className="flex items-center gap-2 text-primary font-bold hover:underline">
                <span className="material-symbols-outlined">arrow_back</span> Geri
             </button>
             
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Payment Form */}
                <div className="lg:col-span-2 space-y-6">
                   <div className="bg-white rounded-[40px] border border-border p-8 shadow-sm">
                      <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-2">
                         <span className="material-symbols-outlined text-primary">shield_person</span>
                         Ödeme Bilgileri
                      </h2>
                      <div className="space-y-6">
                         <div className="group">
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Kart Sahibi</label>
                           <input className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold" placeholder="AD SOYAD" />
                         </div>
                         <div className="group">
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Kart Numarası</label>
                           <input className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none transition-all font-mono text-lg" placeholder="0000 0000 0000 0000" />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Son Kullanma</label>
                              <input className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="AA / YY" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">CVC / CVV</label>
                              <input className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="123" />
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex items-start gap-4">
                      <span className="material-symbols-outlined text-emerald-500">lock</span>
                      <div>
                         <div className="text-sm font-bold text-emerald-900">Güvenli Ödeme</div>
                         <p className="text-xs text-emerald-600 mt-1">Ödeme bilgileriniz uçtan uca şifrelenir ve TheraSpeech sunucularında asla saklanmaz.</p>
                      </div>
                   </div>
                </div>

                {/* Summary Panel */}
                <div className="lg:col-span-1 space-y-6">
                   <div className="bg-white rounded-[40px] border border-border p-8 shadow-xl sticky top-8">
                      <h3 className="font-bold text-slate-900 mb-6">Sipariş Özeti</h3>
                      <div className="space-y-4 mb-8">
                         <div className="flex justify-between text-sm">
                            <span className="text-slate-500">{selectedPackage} Paketi</span>
                            <span className="font-bold">1,600 ₺</span>
                         </div>
                         <div className="flex justify-between text-sm">
                            <span className="text-slate-500">KDV (%20)</span>
                            <span className="font-bold">320 ₺</span>
                         </div>
                         {coupon === 'THERA20' && (
                            <div className="flex justify-between text-sm text-emerald-600">
                               <span>İndirim (THERA20)</span>
                               <span className="font-bold">-320 ₺</span>
                            </div>
                         )}
                         <div className="h-px bg-slate-100 my-2"></div>
                         <div className="flex justify-between text-xl font-black text-slate-900">
                            <span>Toplam</span>
                            <span>{coupon === 'THERA20' ? '1,600 ₺' : '1,920 ₺'}</span>
                         </div>
                      </div>

                      <div className="relative mb-8">
                         <input 
                           className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-primary/20 outline-none" 
                           placeholder="Kupon Kodu"
                           value={coupon}
                           onChange={(e) => setCoupon(e.target.value)}
                         />
                         <button className="absolute right-2 top-2 bottom-2 px-3 bg-slate-900 text-white text-[10px] font-black rounded-lg">Uygula</button>
                      </div>

                      <button 
                        onClick={() => setStep('success')}
                        className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/30 hover:bg-primary-dark transition-all hover:scale-[1.02] active:scale-95 text-lg"
                      >
                        Şimdi Öde
                      </button>
                   </div>
                </div>
             </div>
          </div>
        );
      case 'success':
        return (
          <div className="flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in duration-700 py-20">
             <div className="size-32 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/20">
                <span className="material-symbols-outlined text-6xl font-black">verified_user</span>
             </div>
             <div>
                <h2 className="text-4xl font-black text-slate-900 mb-3">Harika! Randevun Alındı</h2>
                <p className="text-lg text-slate-500 max-w-md mx-auto">Terapi paketin başarıyla oluşturuldu. İlk seansın için takvimine göz atabilirsin.</p>
             </div>
             <div className="flex gap-4">
                <button onClick={onComplete} className="px-8 py-4 bg-slate-900 text-white font-extrabold rounded-2xl hover:bg-black transition-all shadow-xl">Paneli Görüntüle</button>
                <button className="px-8 py-4 bg-white border border-border text-slate-700 font-extrabold rounded-2xl hover:bg-slate-50 transition-all">Makbuzu İndir</button>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-10 flex flex-col items-center">
       <div className="max-w-6xl w-full">
          {renderStep()}
       </div>
    </div>
  );
};

const TherapistCard: React.FC<{ name: string, bio: string, rating: number, onSelect: () => void }> = ({ name, bio, rating, onSelect }) => (
  <div className="bg-white p-8 rounded-[40px] border border-border shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all group flex flex-col items-center text-center">
     <div className="size-24 rounded-full bg-slate-100 mb-6 border-4 border-white shadow-xl overflow-hidden group-hover:scale-110 transition-transform">
        <img src={`https://i.pravatar.cc/150?u=${name}`} className="w-full h-full object-cover" alt={name} />
     </div>
     <h3 className="text-xl font-black text-slate-900 mb-2">{name}</h3>
     <p className="text-sm text-slate-500 mb-4 h-10 line-clamp-2">{bio}</p>
     <div className="flex items-center gap-1.5 text-amber-500 font-black mb-8">
        <span className="material-symbols-outlined text-lg filled">star</span>
        {rating}
     </div>
     <button onClick={onSelect} className="w-full py-4 bg-slate-50 text-slate-700 font-black rounded-2xl hover:bg-primary hover:text-white transition-all border border-border hover:border-transparent group-hover:shadow-lg group-hover:shadow-primary/20">Randevu Seç</button>
  </div>
);

const PackageCard: React.FC<{ title: string, price: string, sessions: string, popular?: boolean, onSelect: () => void }> = ({ title, price, sessions, popular, onSelect }) => (
  <div className={`relative bg-white p-10 rounded-[40px] border shadow-sm transition-all hover:shadow-2xl flex flex-col ${popular ? 'border-primary ring-4 ring-primary/10 -translate-y-4' : 'border-border'}`}>
     {popular && (
       <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">En Popüler</div>
     )}
     <h3 className="text-xl font-black text-slate-900 mb-4">{title}</h3>
     <div className="text-4xl font-black text-primary mb-2">{price}</div>
     <div className="text-sm font-bold text-slate-400 mb-8">{sessions}</div>
     <div className="space-y-4 mb-10 flex-1 text-left">
        <FeatureItem label="Canlı Video Görüşme" />
        <FeatureItem label="Materyal Erişimi" />
        <FeatureItem label="AI İlerleme Takibi" />
        {popular && <FeatureItem label="Öncelikli Destek" />}
     </div>
     <button onClick={onSelect} className={`w-full py-4 font-black rounded-2xl transition-all ${popular ? 'bg-primary text-white shadow-xl shadow-primary/20 hover:bg-primary-dark' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-border'}`}>Seç ve Devam Et</button>
  </div>
);

const FeatureItem: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
     <span className="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>
     {label}
  </div>
);

export default Booking;
