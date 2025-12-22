
import React, { useState } from 'react';

interface FeedbackSystemProps {
  onComplete: () => void;
}

const FeedbackSystem: React.FC<FeedbackSystemProps> = ({ onComplete }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
       <div className="max-w-xl w-full bg-white rounded-[40px] border border-border p-10 shadow-2xl animate-in zoom-in duration-500">
          <div className="text-center space-y-4 mb-10">
             <div className="size-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-primary/5">
                <span className="material-symbols-outlined text-4xl font-black">celebration</span>
             </div>
             <h2 className="text-3xl font-black text-slate-900">Seans Tamamlandı!</h2>
             <p className="text-slate-500">Seansın nasıl geçtiğini değerlendirerek gelişim sürecine katkıda bulun.</p>
          </div>

          <div className="space-y-8">
             {/* Star Rating */}
             <div className="flex flex-col items-center gap-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Genel Deneyim</label>
                <div className="flex gap-2">
                   {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => setRating(star)}
                        className="transition-all hover:scale-125 focus:outline-none"
                      >
                         <span className={`material-symbols-outlined text-5xl ${(hover || rating) >= star ? 'text-amber-500 filled' : 'text-slate-200'}`}>
                            star
                         </span>
                      </button>
                   ))}
                </div>
             </div>

             {/* Questions */}
             <div className="space-y-6">
                <Question label="Materyaller yardımcı oldu mu?" />
                <Question label="Bağlantı kalitesi nasıldı?" />
             </div>

             {/* Comment */}
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Ek Notların (İsteğe bağlı)</label>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-5 text-sm focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none"
                  placeholder="Seans hakkında daha fazla bilgi paylaş..."
                  rows={4}
                ></textarea>
             </div>

             <button 
               onClick={onComplete}
               className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all hover:scale-[1.02] active:scale-95 text-lg"
             >
                Değerlendirmeyi Gönder
             </button>
          </div>
       </div>
    </div>
  );
};

const Question: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
     <span className="text-sm font-bold text-slate-700">{label}</span>
     <div className="flex gap-2">
        <button className="size-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-500 transition-all">
           <span className="material-symbols-outlined text-sm font-black">thumb_up</span>
        </button>
        <button className="size-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all">
           <span className="material-symbols-outlined text-sm font-black">thumb_down</span>
        </button>
     </div>
  </div>
);

export default FeedbackSystem;
