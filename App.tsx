
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
import HelpCenter from './components/HelpCenter';
import QualityControl from './components/QualityControl';
import DeploymentDashboard from './components/DeploymentDashboard';
import MarketingDashboard from './components/MarketingDashboard';
import AdminPortal from './components/AdminPortal';
import { Activity, AppView, User, SessionMetadata, PlatformModule } from './types';
import { INITIAL_SESSION_FLOW } from './constants';

const DEFAULT_MODULES: PlatformModule[] = [
  { id: 'dashboard', name: 'Ana Panel', icon: 'dashboard', enabled: true, minRole: 'client', category: 'core', description: 'Klinik süreçlerin merkezi yönetim ekranı.', config: { welcomeMessage: "Hoş geldiniz" } },
  { id: 'builder', name: 'Planlayıcı', icon: 'construction', enabled: true, minRole: 'therapist', category: 'clinical', description: 'Seans akışı tasarlama ve özelleştirme aracı.', config: { autoSave: true } },
  { id: 'library', name: 'İçerik Stüdyosu', icon: 'book', enabled: true, minRole: 'client', category: 'core', description: 'AI destekli materyal ve interaktif oyun deposu.', config: { aiImageGen: true, maxResults: 20 } },
  { id: 'progress', name: 'Gelişim Analizi', icon: 'trending_up', enabled: true, minRole: 'client', category: 'clinical', description: 'Veriye dayalı klinik ilerleme raporları ve tahminler.', config: { showPredictions: true } },
  { id: 'assessment', name: 'Klinik Muhakeme', icon: 'psychology', enabled: true, minRole: 'therapist', category: 'clinical', description: 'Vaka analizi ve ICF standartlarında raporlama.', config: { model: 'gemini-3-flash-preview', thinkingBudget: 0 } },
  { id: 'community', name: 'Uzman Ağı', icon: 'group', enabled: true, minRole: 'therapist', category: 'core', description: 'Terapistler arası vaka tartışması ve iş birliği.', config: { moderated: true } },
  { id: 'academic', name: 'Bilgi Üssü', icon: 'school', enabled: true, minRole: 'therapist', category: 'core', description: 'Küresel bilimsel literatür tarama ve özetleme.', config: { googleSearch: true, autoSummary: true } },
  { id: 'gamification', name: 'Başarı Merkezi', icon: 'military_tech', enabled: true, minRole: 'client', category: 'core', description: 'XP, rozet ve ödül bazlı klinik bağlılık sistemi.', config: { xpMultiplier: 1.0, dailyQuestCount: 3 } },
  { id: 'booking', name: 'Randevu Yönetimi', icon: 'calendar_month', enabled: true, minRole: 'client', category: 'core', description: 'Seans planlama ve operasyonel iş akışı.', config: {} },
  { id: 'offline', name: 'Uzaktan Operasyon', icon: 'cloud_off', enabled: true, minRole: 'therapist', category: 'clinical', description: 'İnternetsiz ortamda seans yönetimi ve senkronizasyon.', config: {} },
  { id: 'session', name: 'Canlı Oda', icon: 'videocam', enabled: true, minRole: 'therapist', category: 'clinical', description: 'Görüntülü seans ve eş zamanlı AI analizi.', config: { samplingRate: 16000, voice: 'Kore' } },
  { id: 'admin_portal', name: 'Sistem Matrisi', icon: 'admin_panel_settings', enabled: true, minRole: 'admin', category: 'admin', description: 'Platform genel yönetimi ve yetkilendirme.', config: { logsRetentionDays: 30 } },
];

const INITIAL_MOCK_USERS: User[] = [
  { 
    id: 'u1', name: 'Dr. Selin Kaya', role: 'therapist', email: 'selin@theraspeech.ai', status: 'active', 
    subscription: { plan: 'Clinic', status: 'active', nextBillingDate: '2024-12-01', remainingSessions: 99 },
    stats: { totalSessions: 124, completionRate: 98, xp: 12400, level: 25 }
  },
  { 
    id: 'u2', name: 'Ahmet Yılmaz', role: 'client', email: 'ahmet@gmail.com', status: 'active',
    subscription: { plan: 'Pro', status: 'active', nextBillingDate: '2024-11-15', remainingSessions: 6 },
    stats: { totalSessions: 24, completionRate: 85, xp: 4500, level: 14 }
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theraspeech_theme') as 'light' | 'dark') || 'light';
  });
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
  const [sessionFlow, setSessionFlow] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('theraspeech_flow');
    return saved ? JSON.parse(saved) : INITIAL_SESSION_FLOW;
  });

  const [selectedActivityId, setSelectedActivityId] = useState<string>("session-1");
  const [accessibility, setAccessibility] = useState({
    highContrast: false,
    largeText: false,
    animationsEnabled: true,
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theraspeech_theme', theme);
  }, [theme]);

  useEffect(() => {
    if (user) localStorage.setItem('theraspeech_user', JSON.stringify(user));
    localStorage.setItem('theraspeech_flow', JSON.stringify(sessionFlow));
    localStorage.setItem('theraspeech_modules', JSON.stringify(modules));
    localStorage.setItem('theraspeech_all_users', JSON.stringify(users));
  }, [user, sessionFlow, modules, users]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const navigateTo = (view: AppView) => {
    const targetMod = modules.find(m => m.id === view);
    if (targetMod && !targetMod.enabled && user?.role !== 'admin') {
      alert("Bu modül şu an sistem yöneticisi tarafından bakıma alınmıştır.");
      return;
    }
    if (view === 'session' && !activeSession) {
      handleStartSession({
        id: `quick-${Date.now()}`,
        clientName: 'Hızlı Katılım',
        startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'Hızlı Başlatma',
        status: 'active'
      });
      return;
    }
    setCurrentView(view);
  };

  const handleStartSession = (session: SessionMetadata) => {
    setActiveSession({ ...session, flow: sessionFlow });
    setCurrentView('session');
  };

  const renderModule = () => {
    const config = modules.find(m => m.id === currentView)?.config || {};
    switch (currentView) {
      case 'landing': return <LandingPage onGetStarted={() => navigateTo('login')} />;
      case 'login': return <Auth onLogin={(u) => { setUser(u); navigateTo('dashboard'); }} />;
      case 'dashboard': return <Dashboard user={user} onStartBuilder={() => navigateTo('builder')} onJoinSession={handleStartSession} onStartAssessment={() => navigateTo('assessment')} onQuickSession={() => navigateTo('session')} />;
      case 'builder': return (
        <div className="flex flex-1 flex-col md:flex-row overflow-hidden animate-in fade-in duration-500">
          <SidebarLeft onAddActivity={(a) => {
             const newActivity = { ...a, id: `session-${Date.now()}` };
             setSessionFlow(prev => [...prev, newActivity]);
             setSelectedActivityId(newActivity.id);
          }} />
          <Timeline 
            sessionFlow={sessionFlow} 
            selectedId={selectedActivityId} 
            onSelect={setSelectedActivityId}
            onRemove={(id) => setSessionFlow(prev => prev.filter(a => a.id !== id))}
            onClearAll={() => setSessionFlow([])}
          />
          <SidebarRight 
            activity={sessionFlow.find(a => a.id === selectedActivityId)} 
            onUpdate={(updated) => setSessionFlow(prev => prev.map(a => a.id === updated.id ? updated : a))}
            onRemove={() => setSessionFlow(prev => prev.filter(a => a.id !== selectedActivityId))}
          />
        </div>
      );
      case 'session': return <SessionRoom session={activeSession} onEndSession={() => { setActiveSession(null); navigateTo('feedback'); }} />;
      case 'progress': return <ProgressReports />;
      case 'library': return <MaterialLibrary onAdd={(a) => {
          const newActivity = { ...a, id: `session-${Date.now()}` };
          setSessionFlow(prev => [...prev, newActivity]);
          setSelectedActivityId(newActivity.id);
          navigateTo('builder');
      }} />;
      case 'gamification': return <Gamification />;
      case 'booking': return <Booking onComplete={() => navigateTo('dashboard')} />;
      case 'settings': return <Settings user={user} config={accessibility} onUpdateConfig={setAccessibility} />;
      case 'academic': return <AcademicLibrary />;
      case 'community': return <Community />;
      case 'offline': return <OfflineModule />;
      case 'feedback': return <FeedbackSystem onComplete={() => navigateTo('dashboard')} />;
      case 'assessment': return <AIAssessment config={config} />;
      case 'admin_portal': return <AdminPortal modules={modules} onUpdateModules={setModules} users={users} onUpdateUsers={setUsers} />;
      default: return <LandingPage onGetStarted={() => navigateTo('login')} />;
    }
  };

  return (
    <div className={`flex flex-col h-screen transition-all duration-300 bg-background dark:bg-slate-950 text-slate-900 dark:text-slate-100 ${accessibility.highContrast ? 'contrast-125 saturate-150' : ''}`}>
      <Header currentView={currentView} user={user} theme={theme} toggleTheme={toggleTheme} onNavigate={navigateTo} modules={modules} />
      <main className="flex-1 flex flex-col overflow-hidden relative">{renderModule()}</main>
      {user && !['landing', 'login', 'session', 'admin_portal'].includes(currentView) && <BottomNav currentView={currentView} onNavigate={navigateTo} />}
    </div>
  );
};

export default App;
