import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { ProgressDashboard } from '@/components/ProgressDashboard';
import { colors } from '@/constants/colors';

export default function ProgressScreen() {
  const router = useRouter();

  const handleViewSessions = () => {
    // TODO: Navigate to sessions history
    console.log('View sessions');
  };

  const handleViewAnalytics = () => {
    // TODO: Navigate to detailed analytics
    console.log('View analytics');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Progress & Analytics
        </Text>
      </View>
      
      <ProgressDashboard
        onViewSessions={handleViewSessions}
        onViewAnalytics={handleViewAnalytics}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  header: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: colors.surface.light,
    elevation: 2,
  },
  title: {
    color: colors.primary[600],
    fontWeight: 'bold',
  },
}); 