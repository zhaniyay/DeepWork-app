import { create } from 'zustand';
import { User } from '@/types/auth';
import { supabase } from '@/services/supabase/client';

interface AuthState {
  user: User | null;
  session: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSession: (session: any | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement actual Supabase authentication
      const mockUser: User = {
        id: '1',
        email,
        full_name: 'Test User',
        created_at: new Date().toISOString(),
      };
      
      set({ 
        user: mockUser, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Sign in failed',
        isLoading: false 
      });
    }
  },

  signUp: async (email: string, password: string, fullName: string) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement actual Supabase authentication
      const mockUser: User = {
        id: '1',
        email,
        full_name: fullName,
        created_at: new Date().toISOString(),
      };
      
      set({ 
        user: mockUser, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Sign up failed',
        isLoading: false 
      });
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement actual Supabase sign out
      set({ 
        user: null, 
        session: null,
        isAuthenticated: false, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Sign out failed',
        isLoading: false 
      });
    }
  },

  forgotPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement actual Supabase password reset
      console.log('Password reset email sent to:', email);
      
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Password reset failed',
        isLoading: false 
      });
    }
  },

  resetPassword: async (token: string, newPassword: string) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement actual Supabase password reset
      console.log('Password reset with token:', token);
      
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Password reset failed',
        isLoading: false 
      });
    }
  },

  refreshUser: async () => {
    set({ isLoading: true });
    try {
      // TODO: Implement actual Supabase user refresh
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        full_name: 'Test User',
        created_at: new Date().toISOString(),
      };
      
      set({ 
        user: mockUser, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'User refresh failed',
        isLoading: false 
      });
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setSession: (session) => set({ session, isAuthenticated: !!session }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
})); 