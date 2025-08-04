import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { ProgressDashboard } from '@/components/ProgressDashboard';
import { colors } from '@/constants/colors';

export default function ProgressScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Progress & Analytics
        </Text>
      </View>
      
      <ProgressDashboard />
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