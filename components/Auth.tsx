
import React from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const mockTherapist: User = { 
    id: 'u1', 
    name: 'Dr. Selin Kaya', 
    role: 'therapist', 
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?u=u1',
    email: 'selin@theraspeech.ai'
  };
  
  const mockAdmin: User = { 
    id: 'u3', 
    name: 'Sistem Admin', 
    role: 'admin', 
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?u=u3',
    email: 'admin@theraspeech.ai'
  };

  const mockClient: User = { 
    id: 'u2', 
    name: 'Ahmet Yılmaz', 
    role: 'client', 
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?u=u2',
    email: 'ahmet@gmail.com',
    streak: 12,
    subscription: {
      plan: 'Pro',
      status: 'active',
      nextBillingDate: '15 Nisan 2024',
      remainingSessions: 6
    },
    stats: {
      totalSessions: 24,
      completionRate: 85,
      xp: 12450,
      level: 14
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md bg-surface rounded-[32px] shadow-2xl shadow-primary/10 p-10 border border-border">
        <div className="text-center mb-8">
          <div className="size-16 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/30">
            <span className="material-symbols-outlined text-4xl font-bold">graphic_eq</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 italic tracking-tighter">Tekrar Hoş Geldiniz</h2>
          <p className="text-slate-500 mt-2 font-medium">TheraSpeech simülasyonu için bir rol seçin.</p>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => onLogin(mockTherapist)}
            className="w-full py-4.5 bg-primary text-white font-extrabold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
          >
            <span className="material-symbols-outlined font-black">psychology</span>
            Terapist Girişi Yap
          </button>

          <button 
            onClick={() => onLogin(mockClient)}
            className="w-full py-4.5 bg-emerald-500 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
          >
            <span className="material-symbols-outlined font-black">person_outline</span>
            Vaka Sahibi Girişi Yap
          </button>
          
          <button 
            onClick={() => onLogin(mockAdmin)}
            className="w-full py-4.5 bg-slate-900 text-white font-extrabold rounded-2xl shadow-lg shadow-slate-900/10 hover:bg-black transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
          >
            <span className="material-symbols-outlined font-black">admin_panel_settings</span>
            Admin Girişi Yap
          </button>
        </div>

        <div className="mt-8 flex flex-col gap-6">
           <div className="relative h-px bg-slate-100 w-full flex items-center justify-center">
              <span className="bg-white px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">veya manuel giriş</span>
           </div>
           
           <div className="space-y-3">
             <input className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-medium focus:border-primary transition-colors" placeholder="E-Posta Adresi" />
             <input className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-medium focus:border-primary transition-colors" type="password" placeholder="Şifre" />
           </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col items-center gap-4">
          <button className="w-full py-4 bg-slate-100 text-slate-600 font-black rounded-2xl text-sm hover:bg-slate-200 transition-all active:scale-95 uppercase tracking-widest">
             Giriş Yap
          </button>
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-slate-500">Hesabınız yok mu?</span>
            <button className="text-sm font-extrabold text-primary hover:underline">Kaydolun</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
