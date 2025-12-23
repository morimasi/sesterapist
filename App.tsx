
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
  { id: 'dashboard', name: 'Panel', icon: 'dashboard', enabled: true, minRole: 'client', category: 'core', description: 'Ana yönetim ekranı.', config: {} },
  { id: 'builder', name: 'Planlayıcı', icon: 'construction', enabled: true, minRole: 'therapist', category: 'clinical', description: 'Seans akışı tasarlama aracı.', config: {} },
  { id: 'library', name: 'Kütüphane', icon: 'book', enabled: true, minRole: 'client', category: 'core', description: 'Materyal ve oyun deposu.', config: {} },
  { id: 'progress', name: 'Gelişim', icon: 'trending_up', enabled: true, minRole: 'client', category: 'clinical', description: 'Klinik ilerleme raporları.', config: {} },
  { id: 'assessment', name: 'AI Analiz', icon: 'psychology', enabled: true, minRole: 'therapist', category: 'clinical', description: 'Vaka analizi ve ICF raporlama.', config: { model: 'gemini-3-flash-preview', thinkingBudget: 16000 } },
  { id: 'community', name: 'Topluluk', icon: 'group', enabled: true, minRole: 'therapist', category: 'core', description: 'Uzmanlar arası vaka tartışması.', config: {} },
  { id: 'academic', name: 'Akademik', icon: 'school', enabled: true, minRole: 'therapist', category: 'core', description: 'Bilimsel literatür tarama.', config: { googleSearch: true } },
  { id: 'admin_portal', name: 'Yönetim', icon: 'admin_panel_settings', enabled: true, minRole: 'admin', category: 'admin', description: 'Sistem yönetimi.', config: {} },
  { id: 'session', name: 'Seans Odası', icon: 'videocam', enabled: true, minRole: 'therapist', category: 'clinical', description: 'Görüntülü seans ve canlı AI analizi.', config: { samplingRate: 16000, voice: 'Kore' } },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('landing');
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
     return saved ? JSON.parse(saved) : [];
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

  // State'ler değiştiğinde localStorage'ı güncelle
  useEffect(() => {
    if (user) localStorage.setItem('theraspeech_user', JSON.stringify(user));
    localStorage.setItem('theraspeech_flow', JSON.stringify(sessionFlow));
    localStorage.setItem('theraspeech_modules', JSON.stringify(modules));
  }, [user, sessionFlow, modules]);

  const navigateTo = (view: AppView) => {
    // Modül devre dışıysa erişimi engelle (Admin hariç)
    const targetMod = modules.find(m => m.id === view);
    if (targetMod && !targetMod.enabled && user?.role !== 'admin') {
      alert("Bu modül şu an sistem yöneticisi tarafından bakıma alınmıştır.");
      return;
    }
    setCurrentView(view);
  };

  const selectedActivity = useMemo(() => 
    sessionFlow.find(a => a.id === selectedActivityId), 
    [sessionFlow, selectedActivityId]
  );

  const handleStartSession = (session: SessionMetadata) => {
    setActiveSession({ ...session, flow: sessionFlow });
    navigateTo('session');
  };

  const handleAddActivity = (activity: Activity) => {
    const newActivity = { ...activity, id: `session-${Date.now()}` };
    setSessionFlow(prev => [...prev, newActivity]);
    setSelectedActivityId(newActivity.id);
  };

  const renderModule = () => {
    switch (currentView) {
      case 'landing': return <LandingPage onGetStarted={() => navigateTo('login')} />;
      case 'login': return <Auth onLogin={(u) => { setUser(u); navigateTo('dashboard'); }} />;
      case 'dashboard': return <Dashboard user={user} onStartBuilder={() => navigateTo('builder')} onJoinSession={handleStartSession} onStartAssessment={() => navigateTo('assessment')} />;
      case 'builder': return (
        <div className="flex flex-1 flex-col md:flex-row overflow-hidden animate-in fade-in duration-500">
          <SidebarLeft onAddActivity={handleAddActivity} />
          <Timeline 
            sessionFlow={sessionFlow} 
            selectedId={selectedActivityId} 
            onSelect={setSelectedActivityId}
            onRemove={(id) => setSessionFlow(prev => prev.filter(a => a.id !== id))}
            onClearAll={() => setSessionFlow([])}
          />
          <SidebarRight 
            activity={selectedActivity} 
            onUpdate={(updated) => setSessionFlow(prev => prev.map(a => a.id === updated.id ? updated : a))}
            onRemove={() => setSessionFlow(prev => prev.filter(a => a.id !== selectedActivityId))}
          />
        </div>
      );
      case 'session': return <SessionRoom session={activeSession} onEndSession={() => navigateTo('feedback')} />;
      case 'progress': return <ProgressReports />;
      case 'library': return <MaterialLibrary onAdd={(a) => { handleAddActivity(a); navigateTo('builder'); }} />;
      case 'gamification': return <Gamification />;
      case 'booking': return <Booking onComplete={() => navigateTo('dashboard')} />;
      case 'settings': return <Settings user={user} config={accessibility} onUpdateConfig={setAccessibility} />;
      case 'academic': return <AcademicLibrary />;
      case 'community': return <Community />;
      case 'offline': return <OfflineModule />;
      case 'feedback': return <FeedbackSystem onComplete={() => navigateTo('dashboard')} />;
      case 'assessment': return <AIAssessment />;
      case 'help': return <HelpCenter />;
      case 'qa': return <QualityControl />;
      case 'deployment': return <DeploymentDashboard />;
      case 'marketing': return <MarketingDashboard />;
      case 'admin_portal': return <AdminPortal modules={modules} onUpdateModules={setModules} users={users} onUpdateUsers={setUsers} />;
      default: return <LandingPage onGetStarted={() => navigateTo('login')} />;
    }
  };

  return (
    <div className={`flex flex-col h-screen transition-all duration-300 bg-background ${accessibility.highContrast ? 'contrast-125 saturate-150' : ''}`}>
      <Header 
        currentView={currentView} 
        user={user} 
        onNavigate={navigateTo} 
        modules={modules} 
      />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {renderModule()}
      </main>

      {user && !['landing', 'login', 'session', 'admin_portal'].includes(currentView) && (
        <BottomNav currentView={currentView} onNavigate={navigateTo} />
      )}
    </div>
  );
};

export default App;
