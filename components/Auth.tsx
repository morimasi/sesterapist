
import React from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const mockUser: User = { id: '1', name: 'Dr. Selin Kaya', role: 'therapist' };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md bg-surface rounded-[32px] shadow-2xl shadow-primary/10 p-10 border border-border">
        <div className="text-center mb-8">
          <div className="size-16 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/30">
            <span className="material-symbols-outlined text-4xl">graphic_eq</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">Tekrar Hoş Geldiniz</h2>
          <p className="text-slate-500 mt-2">TheraSpeech hesabınıza giriş yapın.</p>
        </div>

        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onLogin(mockUser); }}>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">E-Posta</label>
            <input 
              type="email" 
              className="w-full px-5 py-4 bg-background border-none rounded-2xl focus:ring-2 focus:ring-primary/50 transition-all outline-none text-sm"
              placeholder="isim@klinik.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Şifre</label>
            <input 
              type="password" 
              className="w-full px-5 py-4 bg-background border-none rounded-2xl focus:ring-2 focus:ring-primary/50 transition-all outline-none text-sm"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button 
            type="submit"
            className="w-full py-4 bg-primary text-white font-extrabold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all hover:scale-[1.02] active:scale-95 mt-4"
          >
            Giriş Yap
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-border flex items-center justify-center gap-2">
          <span className="text-sm text-slate-500">Hesabınız yok mu?</span>
          <button className="text-sm font-extrabold text-primary hover:underline">Kaydolun</button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
