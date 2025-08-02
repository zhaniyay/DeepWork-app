import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="focus" />
      <Stack.Screen name="progress" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="tasks" />
    </Stack>
  );
} 