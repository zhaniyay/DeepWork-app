import React from 'react';
import { View, StyleSheet } from 'react-native';
import { EnhancedAIChatInterface } from '@/components/EnhancedAIChatInterface';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';

export default function ChatScreen() {
  const router = useRouter();

  const handleTaskCreated = () => {
    // Optionally navigate back to dashboard or show success message
    console.log('Task created via AI chat');
  };

  const handleClose = () => {
    router.back();
  };

  const handleStartFocusSession = (duration: number) => {
    // Navigate to focus session with the suggested duration
    router.push(`/focus/${duration}`);
  };

  return (
    <View style={styles.container}>
      <EnhancedAIChatInterface
        onTaskCreated={handleTaskCreated}
        onClose={handleClose}
        onStartFocusSession={handleStartFocusSession}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
}); 