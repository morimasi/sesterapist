
export type AppView = 'landing' | 'login' | 'dashboard' | 'builder' | 'session' | 'progress' | 'library' | 'gamification' | 'booking' | 'settings' | 'academic' | 'community' | 'offline' | 'feedback' | 'assessment' | 'help' | 'qa' | 'deployment' | 'marketing' | 'admin_portal' | 'client_hub';

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
  bio?: string;
  interests?: string[];
  guardianName?: string;
  streak?: number;
  subscription?: {
    plan: 'Free' | 'Basic' | 'Pro' | 'Clinic';
    status: 'active' | 'past_due' | 'canceled';
    nextBillingDate: string;
    remainingSessions: number;
  };
  stats?: {
    totalSessions: number;
    completionRate: number;
    xp: number;
    level: number;
  };
}

export interface ActivityContent {
  instructions: string[];
  wordList?: string[];
  sentences?: string[];
  clinicalSteps?: string[];
  interactivePrompt?: string;
  homeworkNotes?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  duration: number;
  type: string;
  category: string;
  image: string;
  content?: ActivityContent;
  settings?: {
    targetSoundPosition: string;
    difficulty: string;
    notes: string;
  };
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

/**
 * PlatformModule interface for managing system modules and features.
 * Added to fix "no exported member 'PlatformModule'" errors in App.tsx and AdminPortal.tsx.
 */
export interface PlatformModule {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  minRole: UserRole;
  category: 'core' | 'clinical' | 'admin';
  description: string;
  config: Record<string, any>;
}

/**
 * Paper interface for academic research articles and sources.
 * Added to fix "no exported member 'Paper'" error in AcademicLibrary.tsx.
 */
export interface Paper {
  id: string;
  title: string;
  uri: string;
  source: string;
  year: number;
  clinicalImpact: string;
  tags: string[];
  authors: string[];
  isSaved?: boolean;
}

/**
 * ChatChannel interface for community discussion groups.
 * Added to fix "no exported member 'ChatChannel'" error in Community.tsx.
 */
export interface ChatChannel {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'public' | 'private';
  members: number;
  category: 'clinical' | 'general';
}

/**
 * ChatMessage interface for community messaging and shared clinical notes.
 * Added to fix "no exported member 'ChatMessage'" error in Community.tsx.
 */
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  type: 'text' | 'material';
}
