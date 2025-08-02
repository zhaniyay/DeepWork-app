import { create } from 'zustand';
import { AuthState, User, LoginCredentials, SignupCredentials } from '@/types/auth';
import { supabase } from '@/services/supabase/client';

interface AuthStore extends AuthState {
  // Actions
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signUp: (credentials: SignupCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSession: (session: any | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  session: null,
  isLoading: false,
  error: null,

  signIn: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      set({
        session: data.session,
        user: data.user ? {
          id: data.user.id,
          email: data.user.email!,
          full_name: data.user.user_metadata?.full_name,
          avatar_url: data.user.user_metadata?.avatar_url,
          preferences: data.user.user_metadata?.preferences || {
            session_length: 25,
            quiet_hours: { start: '22:00', end: '07:00' },
            ai_tone: 'encouraging',
            theme: 'auto',
            notifications: {
              session_reminders: true,
              task_due_soon: true,
              next_task_suggestions: true,
              break_suggestions: true,
              streak_achievements: true,
            }
          },
          created_at: data.user.created_at,
          updated_at: data.user.updated_at!,
          last_active_at: data.user.last_sign_in_at || data.user.created_at,
        } : null,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  signUp: async (credentials: SignupCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.full_name,
            preferences: {
              session_length: 25,
              quiet_hours: { start: '22:00', end: '07:00' },
              ai_tone: 'encouraging',
              theme: 'auto',
              notifications: {
                session_reminders: true,
                task_due_soon: true,
                next_task_suggestions: true,
                break_suggestions: true,
                streak_achievements: true,
              }
            }
          }
        }
      });

      if (error) throw error;

      set({
        session: data.session,
        user: data.user ? {
          id: data.user.id,
          email: data.user.email!,
          full_name: credentials.full_name,
          avatar_url: undefined,
          preferences: {
            session_length: 25,
            quiet_hours: { start: '22:00', end: '07:00' },
            ai_tone: 'encouraging',
            theme: 'auto',
            notifications: {
              session_reminders: true,
              task_due_soon: true,
              next_task_suggestions: true,
              break_suggestions: true,
              streak_achievements: true,
            }
          },
          created_at: data.user.created_at,
          updated_at: data.user.updated_at!,
          last_active_at: data.user.created_at,
        } : null,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      await supabase.auth.signOut();
      set({
        user: null,
        session: null,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  refreshUser: async () => {
    set({ isLoading: true });
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;

      if (user) {
        set({
          user: {
            id: user.id,
            email: user.email!,
            full_name: user.user_metadata?.full_name,
            avatar_url: user.user_metadata?.avatar_url,
            preferences: user.user_metadata?.preferences || {
              session_length: 25,
              quiet_hours: { start: '22:00', end: '07:00' },
              ai_tone: 'encouraging',
              theme: 'auto',
              notifications: {
                session_reminders: true,
                task_due_soon: true,
                next_task_suggestions: true,
                break_suggestions: true,
                streak_achievements: true,
              }
            },
            created_at: user.created_at,
            updated_at: user.updated_at!,
            last_active_at: user.last_sign_in_at || user.created_at,
          },
          isLoading: false,
        });
      } else {
        set({
          user: null,
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  setUser: (user: User | null) => set({ user }),
  setSession: (session: any | null) => set({ session }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
})); 