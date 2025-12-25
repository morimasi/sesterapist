
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import SidebarLeft from './components/SidebarLeft';
import Timeline from './components/Timeline';
import SidebarRight from './components/SidebarRight';
import Auth from './components/Auth';
import SessionRoom from './components/SessionRoom';
import ProgressReports from './components/ProgressReports';
import MaterialLibrary from './components/MaterialLibrary';
import Gamification from './components/Gamification';
import Booking from './components/Booking';
import Settings from './components/Settings';
import AcademicLibrary from './components/AcademicLibrary';
import Community from './components/Community';
import OfflineModule from './components/OfflineModule';
import FeedbackSystem from './components/FeedbackSystem';
import BottomNav from './components/BottomNav';
import AIAssessment from './components/AIAssessment';
import AdminPortal from './components/AdminPortal';
import HelpCenter from './components/HelpCenter';
import { Activity, AppView, User, SessionMetadata, PlatformModule } from './types';
import { INITIAL_SESSION_FLOW } from './constants';

const DEFAULT_MODULES: PlatformModule[] = [
  { id: 'dashboard', name: 'Ana Panel', icon: 'dashboard', enabled: true, minRole: 'client', category: 'core', description: 'Klinik süreçlerin merkezi yönetim ekranı.', config: {} },
  { id: 'builder', name: 'Planlayıcı', icon: 'construction', enabled: true, minRole: 'therapist', category: 'clinical', description: 'Seans akışı tasarlama ve özelleştirme aracı.', config: {} },
  { id: 'library', name: 'İçerik Stüdyosu', icon: 'book', enabled: true, minRole: 'client', category: 'core', description: 'Gemini 3.0 MULDIMODAL destekli materyal deposu.', config: {} },
  { id: 'progress', name: 'Gelişim Analizi', icon: 'trending_up', enabled: true, minRole: 'client', category: 'clinical', description: 'Veriye dayalı klinik ilerleme raporları ve tahminler.', config: {} },
  { id: 'assessment', name: 'Klinik Muhakeme', icon: 'psychology', enabled: true, minRole: 'therapist', category: 'clinical', description: 'AI ile vaka analizi ve raporlama.', config: {} },
  { id: 'community', name: 'Uzman Ağı', icon: 'group', enabled: true, minRole: 'therapist', category: 'core', description: 'Terapistler arası vaka tartışması ve iş birliği.', config: {} },
  { id: 'academic', name: 'Bilgi Üssü', icon: 'school', enabled: true, minRole: 'therapist', category: 'core', description: 'Küresel bilimsel literatür tarama.', config: {} },
  { id: 'gamification', name: 'Başarı Merkezi', icon: 'military_tech', enabled: true, minRole: 'client', category: 'core', description: 'Bağlılık sistemi.', config: {} },
  { id: 'booking', name: 'Randevu Yönetimi', icon: 'calendar_month', enabled: true, minRole: 'client', category: 'core', description: 'Seans planlama.', config: {} },
  { id: 'offline', name: 'Uzaktan Operasyon', icon: 'cloud_off', enabled: true, minRole: 'therapist', category: 'clinical', description: 'İnternetsiz seans yönetimi.', config: {} },
  { id: 'session', name: 'Canlı Oda', icon: 'videocam', enabled: true, minRole: 'therapist', category: 'clinical', description: 'Görüntülü seans.', config: {} },
  { id: 'admin_portal', name: 'Sistem Matrisi', icon: 'admin_panel_settings', enabled: true, minRole: 'admin', category: 'admin', description: 'IAM ve sistem yönetimi.', config: {} },
];

const INITIAL_MOCK_USERS: User[] = [
  { id: 'u1', name: 'Dr. Selin Kaya', role: 'therapist', email: 'selin@theraspeech.ai', status: 'active', avatar: 'https://i.pravatar.cc/150?u=u1' },
  { id: 'u2', name: 'Ahmet Yılmaz', role: 'client', email: 'ahmet@gmail.com', status: 'active', streak: 12, avatar: 'https://i.pravatar.cc/150?u=u2' },
  { id: 'u4', name: 'Mert Demir', role: 'client', email: 'mert@gmail.com', status: 'active', avatar: 'https://i.pravatar.cc/150?u=u4' },
  { id: 'u3', name: 'SYSTEM_ROOT', role: 'admin', email: 'admin@theraspeech.ai', status: 'active', avatar: 'https://i.pravatar.cc/150?u=u3' }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theraspeech_theme') as 'light' | 'dark') || 'dark');
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('theraspeech_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [modules, setModules] = useState<PlatformModule[]>(() => {
    const saved = localStorage.getItem('theraspeech_modules');
    return saved ? JSON.parse(saved) : DEFAULT_MODULES;
  });

  const [users, setUsers] = useState<User[]>(() => {
     const saved = localStorage.getItem('theraspeech_all_users');
     return saved ? JSON.parse(saved) : INITIAL_MOCK_USERS;
  });
  
  const [activeSession, setActiveSession] = useState<SessionMetadata | null>(null);
  const [sessionFlow, setSessionFlow] = useState<Activity[]>(INITIAL_SESSION_FLOW);
  const [selectedActivityId, setSelectedActivityId] = useState<string>("");
  const [accessibility, setAccessibility] = useState({ highContrast: false, largeText: false, animationsEnabled: true });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theraspeech_theme', theme);
  }, [theme]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('theraspeech_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('theraspeech_user');
    }
    localStorage.setItem('theraspeech_modules', JSON.stringify(modules));
    localStorage.setItem('theraspeech_all_users', JSON.stringify(users));
  }, [user, modules, users]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const navigateTo = (view: AppView) => {
    if (view === 'landing' || view === 'login') {
      setCurrentView(view);
      return;
    }
    if (!user) {
      setCurrentView('login');
      return;
    }
    setCurrentView(view);
  };

  const startSessionWithClient = (client: User) => {
    const newSession: SessionMetadata = {
      id: `session-${Date.now()}`,
      clientName: client.name,
      therapistName: user?.name,
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'Terapi',
      status: 'active',
      flow: sessionFlow
    };
    setActiveSession(newSession);
    navigateTo('session');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
  };

  const renderModule = () => {
    switch (currentView) {
      case 'landing': return <LandingPage onGetStarted={() => navigateTo('login')} />;
      case 'login': return <Auth onLogin={(u) => { setUser(u); navigateTo('dashboard'); }} />;
      case 'dashboard': return <Dashboard user={user} onStartBuilder={() => navigateTo('builder')} onJoinSession={(s) => { setActiveSession({...s, flow: sessionFlow}); navigateTo('session'); }} onStartAssessment={() => navigateTo('assessment')} />;
      case 'builder': return (
        <div className="flex flex-1 flex-col md:flex-row overflow-hidden animate-in fade-in duration-500">
          <SidebarLeft onAddActivity={(a) => { const id = `s-${Date.now()}`; setSessionFlow([...sessionFlow, {...a, id}]); setSelectedActivityId(id); }} />
          <Timeline 
            sessionFlow={sessionFlow} 
            selectedId={selectedActivityId} 
            onSelect={setSelectedActivityId} 
            onRemove={(id) => setSessionFlow(sessionFlow.filter(a => a.id !== id))} 
            onClearAll={() => setSessionFlow([])} 
            users={users}
            onLaunchSession={startSessionWithClient}
          />
          <SidebarRight activity={sessionFlow.find(a => a.id === selectedActivityId)} onUpdate={(u) => setSessionFlow(sessionFlow.map(a => a.id === u.id ? u : a))} onRemove={() => { setSessionFlow(sessionFlow.filter(a => a.id !== selectedActivityId)); setSelectedActivityId(""); }} />
        </div>
      );
      case 'session': return <SessionRoom session={activeSession} onEndSession={() => { setActiveSession(null); setSessionFlow([]); navigateTo('feedback'); }} />;
      case 'progress': return <ProgressReports />;
      case 'library': return <MaterialLibrary onAdd={(a) => { const id = `s-${Date.now()}`; setSessionFlow([...sessionFlow, {...a, id}]); setSelectedActivityId(id); navigateTo('builder'); }} />;
      case 'gamification': return <Gamification />;
      case 'booking': return <Booking onComplete={() => navigateTo('dashboard')} />;
      case 'settings': return <Settings user={user} onUpdateUser={setUser} onLogout={handleLogout} config={accessibility} onUpdateConfig={setAccessibility} />;
      case 'academic': return <AcademicLibrary />;
      case 'community': return <Community />;
      case 'offline': return <OfflineModule />;
      case 'feedback': return <FeedbackSystem onComplete={() => navigateTo('dashboard')} />;
      case 'assessment': return <AIAssessment />;
      case 'admin_portal': return <AdminPortal modules={modules} onUpdateModules={setModules} users={users} onUpdateUsers={setUsers} />;
      default: return <LandingPage onGetStarted={() => navigateTo('login')} />;
    }
  };

  return (
    <div className={`flex flex-col h-screen transition-all duration-300 bg-slate-50 dark:bg-dark text-slate-900 dark:text-slate-100 ${accessibility.highContrast ? 'contrast-125 saturate-150' : ''}`}>
      <Header currentView={currentView} user={user} theme={theme} toggleTheme={toggleTheme} onNavigate={navigateTo} modules={modules} />
      <main className="flex-1 flex flex-col overflow-hidden relative">{renderModule()}</main>
      {user && !['landing', 'login', 'session'].includes(currentView) && <BottomNav currentView={currentView} onNavigate={navigateTo} />}
    </div>
  );
};

export default App;
