
import React from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const mockTherapist: User = { id: '1', name: 'Dr. Selin Kaya', role: 'therapist', status: 'active' };
  const mockAdmin: User = { id: 'admin-001', name: 'Sistem Yöneticisi', role: 'admin', status: 'active' };

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

        <div className="space-y-4">
          <button 
            onClick={() => onLogin(mockTherapist)}
            className="w-full py-5 bg-primary text-white font-extrabold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined">psychology</span>
            Terapist Girişi Yap
          </button>
          
          <button 
            onClick={() => onLogin(mockAdmin)}
            className="w-full py-5 bg-slate-900 text-white font-extrabold rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-black transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined">admin_panel_settings</span>
            Admin Girişi Yap
          </button>
        </div>

        <div className="mt-10 flex flex-col gap-6">
           <div className="relative h-px bg-slate-100 w-full flex items-center justify-center">
              <span className="bg-white px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">veya</span>
           </div>
           
           <div className="space-y-3">
             <input className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-medium" placeholder="E-Posta" />
             <input className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-medium" type="password" placeholder="Şifre" />
           </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex items-center justify-center gap-2">
          <span className="text-sm text-slate-500">Hesabınız yok mu?</span>
          <button className="text-sm font-extrabold text-primary hover:underline">Kaydolun</button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
