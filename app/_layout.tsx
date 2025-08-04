import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { getTheme } from '@/styles/theme';
import { useAuthStore } from '@/stores/authStore';
import { useTaskStore } from '@/stores/taskStore';
import { supabase } from '@/services/supabase/client';
import { AppLaunchBanner } from '@/components/AppLaunchBanner';

export default function RootLayout() {
  const colorScheme = useColorScheme() as 'light' | 'dark';
  const theme = getTheme(colorScheme);
  const { refreshUser, setSession } = useAuthStore();
  const { markTaskInProgress, selectTask } = useTaskStore();
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        if (session?.user) {
          await refreshUser();
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session?.user) {
          await refreshUser();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleResumeTask = async (taskId: string) => {
    try {
      await markTaskInProgress(taskId);
      // Find the task and select it for focus session
      const task = useTaskStore.getState().tasks.find(t => t.id === taskId);
      if (task) {
        selectTask(task);
      }
      setShowBanner(false);
    } catch (error) {
      console.error('Failed to resume task:', error);
    }
  };

  const handleDismissBanner = () => {
    setShowBanner(false);
  };

  return (
    <PaperProvider theme={theme}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(main)" />
      </Stack>
      {showBanner && (
        <AppLaunchBanner
          onResume={handleResumeTask}
          onDismiss={handleDismissBanner}
        />
      )}
    </PaperProvider>
  );
} 