import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserPreferences {
  sessionLength: number; // default session length in minutes
  autoStartNextSession: boolean;
  autoLogDistractions: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string; // HH:mm format
  };
  notifications: {
    sessionReminders: boolean;
    taskDueSoon: boolean;
    suggestedNextTask: boolean;
    breakSuggestions: boolean;
    streakAchievements: boolean;
  };
  aiPreferences: {
    aggressiveness: 'conservative' | 'balanced' | 'aggressive';
    tone: 'professional' | 'friendly' | 'motivational';
    autoSuggestions: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

interface SettingsState {
  preferences: UserPreferences;
  isLoading: boolean;
  error: string | null;
}

interface SettingsActions {
  // Preferences management
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => Promise<void>;
  
  // Storage operations
  loadPreferences: () => Promise<void>;
  savePreferences: () => Promise<void>;
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const defaultPreferences: UserPreferences = {
  sessionLength: 25,
  autoStartNextSession: false,
  autoLogDistractions: true,
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
  },
  notifications: {
    sessionReminders: true,
    taskDueSoon: true,
    suggestedNextTask: true,
    breakSuggestions: true,
    streakAchievements: true,
  },
  aiPreferences: {
    aggressiveness: 'balanced',
    tone: 'friendly',
    autoSuggestions: true,
  },
  theme: 'auto',
  soundEnabled: true,
  vibrationEnabled: true,
};

export const useSettingsStore = create<SettingsState & SettingsActions>((set, get) => ({
  preferences: defaultPreferences,
  isLoading: false,
  error: null,

  // Preferences management
  updatePreferences: async (updates) => {
    set({ isLoading: true, error: null });
    try {
      const newPreferences = { ...get().preferences, ...updates };
      set({ preferences: newPreferences });
      await get().savePreferences();
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update preferences',
        isLoading: false 
      });
    }
  },

  resetPreferences: async () => {
    set({ isLoading: true, error: null });
    try {
      set({ preferences: defaultPreferences });
      await get().savePreferences();
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to reset preferences',
        isLoading: false 
      });
    }
  },

  // Storage operations
  loadPreferences: async () => {
    set({ isLoading: true, error: null });
    try {
      const stored = await AsyncStorage.getItem('user_preferences');
      if (stored) {
        const preferences = JSON.parse(stored);
        set({ preferences: { ...defaultPreferences, ...preferences }, isLoading: false });
      } else {
        set({ preferences: defaultPreferences, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
      set({ preferences: defaultPreferences, isLoading: false });
    }
  },

  savePreferences: async () => {
    try {
      await AsyncStorage.setItem('user_preferences', JSON.stringify(get().preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
      throw error;
    }
  },

  // State management
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
})); 