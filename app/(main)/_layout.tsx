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
      <Stack.Screen name="chat/index" />
      <Stack.Screen name="focus/[duration]" />
      <Stack.Screen name="progress/index" />
      <Stack.Screen name="settings/index" />
      <Stack.Screen name="tasks/index" />
    </Stack>
  );
} 