import { create } from 'zustand';
import { FocusSession, SessionOutcome } from '@/types/session';

interface ProgressStats {
  totalSessions: number;
  totalFocusTime: number; // in minutes
  averageSessionLength: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  productivityScore: number;
  weeklyFocusTime: number[];
  monthlyFocusTime: number[];
}

interface ProgressState {
  stats: ProgressStats;
  sessions: FocusSession[];
  isLoading: boolean;
  error: string | null;
}

interface ProgressActions {
  // Data fetching
  getProgressStats: () => Promise<void>;
  getSessions: (filters?: any) => Promise<void>;
  
  // Analytics
  calculateStats: (sessions: FocusSession[]) => ProgressStats;
  calculateProductivityScore: (sessions: FocusSession[]) => number;
  calculateStreak: (sessions: FocusSession[]) => number;
  getWeeklyFocusTime: () => number[];
  getMonthlyFocusTime: () => number[];
  
  // Session tracking
  addSession: (session: FocusSession) => Promise<void>;
  updateSession: (id: string, updates: Partial<FocusSession>) => Promise<void>;
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const defaultStats: ProgressStats = {
  totalSessions: 0,
  totalFocusTime: 0,
  averageSessionLength: 0,
  completionRate: 0,
  currentStreak: 0,
  longestStreak: 0,
  productivityScore: 0,
  weeklyFocusTime: new Array(7).fill(0),
  monthlyFocusTime: new Array(30).fill(0),
};

export const useProgressStore = create<ProgressState & ProgressActions>((set, get) => ({
  stats: defaultStats,
  sessions: [],
  isLoading: false,
  error: null,

  // Data fetching
  getProgressStats: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement API call to Supabase
      // For now, use empty data - no mock sessions
      const stats = get().calculateStats([]);
      set({ stats, sessions: [], isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch progress stats',
        isLoading: false 
      });
    }
  },

  getSessions: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement API call to Supabase with filters
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch sessions',
        isLoading: false 
      });
    }
  },

  // Analytics
  calculateStats: (sessions: FocusSession[]): ProgressStats => {
    if (sessions.length === 0) return defaultStats;

    const totalSessions = sessions.length;
    const totalFocusTime = sessions.reduce((sum, session) => sum + (session.actual_duration_minutes || 0), 0);
    const averageSessionLength = totalFocusTime / totalSessions;
    
    const completedSessions = sessions.filter(s => s.outcome === SessionOutcome.COMPLETED).length;
    const completionRate = (completedSessions / totalSessions) * 100;
    
    const productivityScore = get().calculateProductivityScore(sessions);
    const currentStreak = get().calculateStreak(sessions);
    const longestStreak = currentStreak; // Use actual calculated streak
    
    const weeklyFocusTime = get().getWeeklyFocusTime();
    const monthlyFocusTime = get().getMonthlyFocusTime();

    return {
      totalSessions,
      totalFocusTime,
      averageSessionLength,
      completionRate,
      currentStreak,
      longestStreak,
      productivityScore,
      weeklyFocusTime,
      monthlyFocusTime,
    };
  },

  calculateProductivityScore: (sessions: FocusSession[]): number => {
    if (sessions.length === 0) return 0;

    const scores = sessions.map(session => {
      const completionScore = session.outcome === SessionOutcome.COMPLETED ? 1 : 
                             session.outcome === SessionOutcome.PARTIAL ? 0.7 : 0.3;
      
      const focusScore = Math.max(0, 1 - (session.interruptions_count || 0) / 10);
      
      const durationScore = session.intended_duration_minutes && session.actual_duration_minutes ?
        Math.min(1, session.actual_duration_minutes / session.intended_duration_minutes) : 0.5;

      return (completionScore * 0.4 + focusScore * 0.3 + durationScore * 0.3) * 100;
    });

    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  },

  calculateStreak: (sessions: FocusSession[]): number => {
    if (sessions.length === 0) return 0;

    // Sort sessions by date (newest first)
    const sortedSessions = sessions
      .filter(s => s.outcome === SessionOutcome.COMPLETED)
      .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());

    let streak = 0;
    let currentDate = new Date();

    for (const session of sortedSessions) {
      const sessionDate = new Date(session.start_time);
      const daysDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff <= 1) {
        streak++;
        currentDate = sessionDate;
      } else {
        break;
      }
    }

    return streak;
  },

  getWeeklyFocusTime: (): number[] => {
    // Empty data - in real app, calculate from actual sessions
    return new Array(7).fill(0);
  },

  getMonthlyFocusTime: (): number[] => {
    // Empty data - in real app, calculate from actual sessions
    return new Array(30).fill(0);
  },

  // Session tracking
  addSession: async (session: FocusSession) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement API call to Supabase
      set((state) => ({
        sessions: [...state.sessions, session],
        stats: get().calculateStats([...state.sessions, session]),
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add session',
        isLoading: false 
      });
    }
  },

  updateSession: async (id: string, updates: Partial<FocusSession>) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement API call to Supabase
      set((state) => ({
        sessions: state.sessions.map(session =>
          session.id === id ? { ...session, ...updates } : session
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update session',
        isLoading: false 
      });
    }
  },

  // State management
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
})); 