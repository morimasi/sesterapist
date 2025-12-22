
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
import { Activity, AppView, User, SessionMetadata, ModuleDefinition } from './types';
import { INITIAL_SESSION_FLOW } from './constants';

const MODULE_REGISTRY: ModuleDefinition[] = [
  { id: 'dashboard', label: 'Panel', icon: 'dashboard', roles: ['therapist', 'client'], category: 'core' },
  { id: 'builder', label: 'Planlayıcı', icon: 'construction', roles: ['therapist'], category: 'clinical' },
  { id: 'library', label: 'Kütüphane', icon: 'book', roles: ['therapist', 'client'], category: 'core' },
  { id: 'progress', label: 'Gelişim', icon: 'trending_up', roles: ['therapist', 'client'], category: 'clinical' },
  { id: 'assessment', label: 'Analiz', icon: 'psychology', roles: ['therapist'], category: 'clinical' },
  { id: 'community', label: 'Topluluk', icon: 'group', roles: ['therapist'], category: 'core' },
  { id: 'academic', label: 'Akademik', icon: 'school', roles: ['therapist'], category: 'core' },
  { id: 'help', label: 'Yardım', icon: 'help', roles: ['therapist', 'client'], category: 'core' },
  { id: 'qa', label: 'QA', icon: 'terminal', roles: ['admin'], category: 'admin' },
  { id: 'deployment', label: 'Bulut', icon: 'cloud', roles: ['admin'], category: 'admin' },
  { id: 'marketing', label: 'Growth', icon: 'rocket_launch', roles: ['admin'], category: 'growth' },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('theraspeech_user');
    return saved ? JSON.parse(saved) : null;
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
    if (user) localStorage.setItem('theraspeech_user', JSON.stringify(user));
    localStorage.setItem('theraspeech_flow', JSON.stringify(sessionFlow));
  }, [user, sessionFlow]);

  const navigateTo = (view: AppView) => {
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
    // Bağımsız Modül Render Mantığı
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
      default: return <LandingPage onGetStarted={() => navigateTo('login')} />;
    }
  };

  return (
    <div className={`flex flex-col h-screen transition-all duration-300 bg-background ${accessibility.highContrast ? 'contrast-125 saturate-150' : ''}`}>
      <Header 
        currentView={currentView} 
        user={user} 
        onNavigate={navigateTo} 
        modules={MODULE_REGISTRY}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {renderModule()}
      </main>

      {user && !['landing', 'login', 'session'].includes(currentView) && (
        <BottomNav currentView={currentView} onNavigate={navigateTo} />
      )}
    </div>
  );
};

export default App;
