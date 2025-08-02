export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  preferences: UserPreferences;
  created_at: string;
  updated_at: string;
  last_active_at: string;
}

export interface UserPreferences {
  session_length: number; // in minutes
  quiet_hours: {
    start: string; // HH:mm format
    end: string; // HH:mm format
  };
  ai_tone: 'encouraging' | 'neutral' | 'directive';
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    session_reminders: boolean;
    task_due_soon: boolean;
    next_task_suggestions: boolean;
    break_suggestions: boolean;
    streak_achievements: boolean;
  };
}

export interface AuthState {
  user: User | null;
  session: any | null; // Supabase session
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  full_name: string;
}

export interface AuthError {
  message: string;
  code?: string;
} 