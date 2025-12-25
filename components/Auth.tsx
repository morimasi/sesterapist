
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [authStep, setAuthStep] = useState<'form' | 'biometric' | 'verifying'>('form');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const mockUsers: Record<UserRole, User> = {
    therapist: { 
      id: 'u1', name: 'Dr. Selin Kaya', role: 'therapist', status: 'active',
      avatar: 'https://i.pravatar.cc/150?u=u1', email: 'selin@theraspeech.ai'
    },
    client: { 
      id: 'u2', name: 'Ahmet Yılmaz', role: 'client', status: 'active',
      avatar: 'https://i.pravatar.cc/150?u=u2', email: 'ahmet@gmail.com', streak: 12
    },
    admin: { 
      id: 'u3', name: 'SYSTEM_ROOT', role: 'admin', status: 'active',
      avatar: 'https://i.pravatar.cc/150?u=u3', email: 'admin@theraspeech.ai'
    }
  };

  const handleStartAuth = (role: UserRole) => {
    setSelectedRole(role);
    setAuthStep('biometric');
    setIsScanning(true);
  };

  useEffect(() => {
    if (authStep === 'biometric') {
      const timer = setTimeout(() => {
        setAuthStep('verifying');
        setTimeout(() => {
          if (selectedRole) onLogin(mockUsers[selectedRole]);
        }, 1500);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [authStep, selectedRole]);

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-[#020408] relative overflow-hidden font-sans">
      {/* Background Tech Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.08),transparent_70%)]"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
      
      <div className="w-full max-w-xl bg-[#0C0F16] rounded-[64px] border border-white/5 p-12 md:p-16 relative z-10 shadow-3xl shadow-black/50 overflow-hidden">
        {/* Animated Scanner Effect for Biometric Step */}
        {authStep === 'biometric' && (
          <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-3xl flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
             <div className="relative size-64 mb-10 group">
                <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-ping"></div>
                <div className="absolute inset-4 border border-primary/40 rounded-full animate-spin-slow"></div>
                <div className="size-full bg-primary/5 rounded-full flex items-center justify-center relative overflow-hidden">
                   <span className="material-symbols-outlined text-8xl text-primary animate-pulse">face_6</span>
                   {/* Scanner Line */}
                   <div className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_15px_rgba(14,165,233,1)] animate-bounce-slow top-0"></div>
                </div>
             </div>
             <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">Multimodal Biyometrik Tarama</h3>
             <p className="text-slate-500 text-sm font-medium tracking-widest uppercase animate-pulse">Lütfen Kameraya Odaklanın...</p>
          </div>
        )}

        {authStep === 'verifying' && (
          <div className="absolute inset-0 z-20 bg-[#0C0F16] flex flex-col items-center justify-center animate-in zoom-in duration-500">
             <div className="size-20 border-4 border-primary border-t-transparent rounded-full animate-spin mb-8"></div>
             <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Erişim Yetkisi Doğrulanıyor</h3>
             <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mt-2">Gemini 3.0 Identity Protocol v7.2</p>
          </div>
        )}

        <div className="relative z-10">
          <div className="text-center mb-12">
            <div className="size-20 bg-primary text-white rounded-[28px] flex items-center justify-center mx-auto mb-8 shadow-3xl shadow-primary/20 rotate-12 group hover:rotate-0 transition-transform duration-500">
              <span className="material-symbols-outlined text-4xl font-black">shield_person</span>
            </div>
            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none mb-3">Güvenli Geçit</h2>
            <p className="text-slate-500 font-medium italic">Klinik ekosisteme erişmek için kimlik protokolünüzü seçin.</p>
          </div>

          <div className="space-y-4">
            <AuthOption 
              icon="psychology" 
              label="Klinik_Uzman_Girişi" 
              desc="Terapistler ve Danışmanlar" 
              color="border-primary/20 hover:border-primary text-primary"
              onClick={() => handleStartAuth('therapist')}
            />
            <AuthOption 
              icon="person_search" 
              label="Vaka_Erişim_Protokolü" 
              desc="Danışanlar ve Ebeveynler" 
              color="border-emerald-500/20 hover:border-emerald-500 text-emerald-500"
              onClick={() => handleStartAuth('client')}
            />
            <AuthOption 
              icon="terminal" 
              label="Sistem_Matrisi_Root" 
              desc="Platform Yöneticileri" 
              color="border-slate-500/20 hover:border-white text-white"
              onClick={() => handleStartAuth('admin')}
            />
          </div>

          <div className="mt-12 flex flex-col gap-8">
             <div className="relative h-px bg-white/5 w-full flex items-center justify-center">
                <span className="bg-[#0C0F16] px-6 text-[9px] font-black text-slate-600 uppercase tracking-[0.5em]">veya manuel yetkilendirme</span>
             </div>
             
             <div className="space-y-4">
               <div className="relative group">
                 <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors">alternate_email</span>
                 <input className="w-full bg-white/5 border border-white/10 rounded-[24px] pl-16 pr-8 py-5 text-white font-bold text-sm outline-none focus:border-primary transition-all shadow-inner placeholder:text-slate-700" placeholder="Kurumsal E-Posta" />
               </div>
               <div className="relative group">
                 <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors">lock</span>
                 <input className="w-full bg-white/5 border border-white/10 rounded-[24px] pl-16 pr-8 py-5 text-white font-bold text-sm outline-none focus:border-primary transition-all shadow-inner placeholder:text-slate-700" type="password" placeholder="Erişim Anahtarı" />
               </div>
             </div>
          </div>

          <div className="mt-10 pt-10 border-t border-white/5 flex flex-col items-center gap-6">
            <button className="w-full py-5 bg-white text-black font-black rounded-[24px] text-xs uppercase tracking-[0.4em] hover:bg-primary hover:text-white transition-all shadow-2xl active:scale-95">
               Kimliği Doğrula
            </button>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-600">
               <span className="hover:text-primary cursor-pointer transition-colors">Şifremi Unuttum</span>
               <span className="size-1 bg-slate-800 rounded-full"></span>
               <span className="hover:text-primary cursor-pointer transition-colors">Yardım Merkezi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthOption: React.FC<{ icon: string, label: string, desc: string, color: string, onClick: () => void }> = ({ icon, label, desc, color, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full p-6 bg-white/[0.02] border-2 rounded-[32px] transition-all flex items-center gap-6 group active:scale-95 ${color}`}
  >
     <div className="size-14 rounded-2xl bg-current/5 flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-3xl font-black">{icon}</span>
     </div>
     <div className="text-left flex-1">
        <div className="text-sm font-black italic uppercase tracking-tight leading-none mb-1 text-white">{label}</div>
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">{desc}</div>
     </div>
     <span className="material-symbols-outlined text-slate-700 group-hover:text-white transition-colors">arrow_forward_ios</span>
  </button>
);

export default Auth;
