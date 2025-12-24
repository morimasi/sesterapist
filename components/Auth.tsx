
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
    name: 'SYSTEM_ROOT', 
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
    <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 size-[600px] bg-primary/10 rounded-full blur-[120px] -z-0"></div>
      
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[64px] shadow-[0_50px_100px_rgba(0,0,0,0.1)] dark:shadow-none p-12 md:p-16 border border-slate-100 dark:border-white/5 relative z-10 animate-in zoom-in duration-700">
        <div className="text-center mb-12">
          <div className="size-20 bg-primary text-white rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-3xl shadow-primary/30 rotate-12">
            <span className="material-symbols-outlined text-4xl font-black">graphic_eq</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase leading-none mb-3">Tekrar Hoş Geldiniz</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic">Simülasyon protokolü için bir erişim seviyesi seçin.</p>
        </div>

        <div className="space-y-4">
          <AuthBtn onClick={() => onLogin(mockTherapist)} label="Terapist_Girisi" icon="psychology" color="bg-primary" />
          <AuthBtn onClick={() => onLogin(mockClient)} label="Vaka_Sahibi_Girisi" icon="person_outline" color="bg-emerald-500" />
          <AuthBtn onClick={() => onLogin(mockAdmin)} label="Sistem_Admin_Girisi" icon="terminal" color="bg-slate-900 dark:bg-white dark:text-slate-950" />
        </div>

        <div className="mt-12 flex flex-col gap-8">
           <div className="relative h-px bg-slate-100 dark:bg-white/10 w-full flex items-center justify-center">
              <span className="bg-white dark:bg-slate-900 px-6 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em]">veya manuel kimlik</span>
           </div>
           
           <div className="space-y-4">
             <input className="w-full px-8 py-5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-3xl outline-none text-sm font-bold focus:border-primary dark:focus:border-primary transition-all shadow-inner placeholder:text-slate-300 dark:placeholder:text-slate-700" placeholder="Kullanıcı Adı / E-Posta" />
             <input className="w-full px-8 py-5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-3xl outline-none text-sm font-bold focus:border-primary dark:focus:border-primary transition-all shadow-inner placeholder:text-slate-300 dark:placeholder:text-slate-700" type="password" placeholder="Erişim Şifresi" />
           </div>
        </div>

        <div className="mt-12 pt-10 border-t border-slate-100 dark:border-white/5 flex flex-col items-center gap-6">
          <button className="w-full py-5 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-black rounded-3xl text-xs uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all active:scale-95">
             Erişimi Doğrula
          </button>
          <div className="flex items-center justify-center gap-3">
            <span className="text-xs text-slate-400 font-medium italic">Hesabınız yok mu?</span>
            <button className="text-xs font-black text-primary hover:underline uppercase tracking-widest">Kayıt Ol</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthBtn: React.FC<{ onClick: () => void, label: string, icon: string, color: string }> = ({ onClick, label, icon, color }) => (
  <button 
    onClick={onClick}
    className={`w-full py-5 ${color} text-white font-black rounded-3xl shadow-2xl transition-all hover:scale-[1.05] active:scale-95 flex items-center justify-center gap-4 uppercase text-[11px] tracking-[0.2em]`}
  >
    <span className="material-symbols-outlined font-black">{icon}</span>
    {label}
  </button>
);

export default Auth;
