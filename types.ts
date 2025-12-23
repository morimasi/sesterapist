
export type AppView = 'landing' | 'login' | 'dashboard' | 'builder' | 'session' | 'progress' | 'library' | 'gamification' | 'booking' | 'settings' | 'academic' | 'community' | 'offline' | 'feedback' | 'assessment' | 'help' | 'qa' | 'deployment' | 'marketing' | 'admin_portal';

export type UserRole = 'therapist' | 'client' | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  email?: string;
  status: 'active' | 'suspended' | 'pending';
  lastSeen?: string;
  joinedAt?: string;
  subscription?: {
    plan: 'Free' | 'Basic' | 'Pro' | 'Clinic';
    status: 'active' | 'past_due' | 'canceled';
    nextBillingDate: string;
  };
  stats?: {
    totalSessions: number;
    completionRate: number;
    xp: number;
  };
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'case' | 'material';
  metadata?: any;
}

export interface ChatChannel {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'public' | 'private' | 'dm';
  members: number;
  lastMessage?: string;
  category: 'clinical' | 'general' | 'case_study';
}

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: string;
  source: 'PubMed' | 'Google Scholar' | 'ResearchGate' | 'Cochrane';
  uri: string;
  abstract?: string;
  clinicalImpact?: string;
  tags: string[];
  isSaved?: boolean;
}

export interface PlatformModule {
  id: AppView;
  name: string;
  icon: string;
  enabled: boolean;
  minRole: UserRole;
  description: string;
  category: 'core' | 'clinical' | 'growth' | 'admin';
  config: Record<string, any>;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  duration: number;
  type: string;
  category: string;
  image: string;
  settings?: {
    targetSoundPosition: string;
    difficulty: string;
    notes: string;
  };
}

// Added Category interface to fix error in constants.tsx
export interface Category {
  name: string;
  activities: Activity[];
}

export interface SessionMetadata {
  id: string;
  clientName: string;
  therapistName?: string;
  startTime: string;
  type: string;
  status: 'active' | 'completed' | 'scheduled';
  flow?: Activity[];
}

export interface Badge {
  id: string;
  title: string;
  icon: string;
  unlocked: boolean;
  date?: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: string;
  service: string;
}

export interface ProgressMetric {
  date: string;
  accuracy: number;
  fluency: number;
  engagement: number;
}

// Added LiveStats interface to fix error in SessionRoom.tsx
export interface LiveStats {
  accuracy: number;
  fluency: number;
  engagement: number;
}

export interface SystemHealth {
  apiStatus: 'online' | 'offline' | 'maintenance';
  latency: number;
  lastSync: string;
  activeUsers: number;
}

export interface DeploymentStatus {
  region: string;
  instances: number;
  load: number;
  status: 'healthy' | 'warning' | 'error';
}

export interface Campaign {
  id: string;
  name: string;
  platform: string;
  spend: string;
  conversions: number;
  status: 'active' | 'paused' | 'completed';
}
