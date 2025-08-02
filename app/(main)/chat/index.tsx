import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AIChatInterface } from '@/components/AIChatInterface';
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

  return (
    <View style={styles.container}>
      <AIChatInterface
        onTaskCreated={handleTaskCreated}
        onClose={handleClose}
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