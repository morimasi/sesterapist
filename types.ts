
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
  subscription?: {
    plan: 'Free' | 'Basic' | 'Pro' | 'Clinic';
    status: 'active' | 'past_due' | 'canceled';
    nextBillingDate: string;
  };
}

export interface PlatformModule {
  id: string;
  name: string;
  enabled: boolean;
  minRole: UserRole;
  description: string;
}

export interface GlobalStats {
  totalRevenue: number;
  activeSessions: number;
  apiUsage: number;
  serverHealth: number;
}

export interface ActivitySettings {
  targetSoundPosition: string;
  difficulty: string;
  notes: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  duration: number;
  type: string;
  category: string;
  image: string;
  settings?: ActivitySettings;
}

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

export interface LiveStats {
  articulationScore: number;
  fluencyScore: number;
  engagementLevel: number;
  detectedErrors: string[];
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

export interface ModuleDefinition {
  id: AppView;
  label: string;
  icon: string;
  roles: UserRole[];
  category: 'core' | 'clinical' | 'growth' | 'admin';
}
