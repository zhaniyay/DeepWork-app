import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/constants/colors';

export default function WelcomeScreen() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  // Only redirect if user is already authenticated
  useEffect(() => {
    if (!isLoading && user) {
      const timer = setTimeout(() => {
        router.replace('/(main)/dashboard');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text variant="headlineMedium">Loading...</Text>
      </View>
    );
  }

  // If user is authenticated, show loading while redirecting
  if (user) {
    return (
      <View style={styles.container}>
        <Text variant="headlineMedium">Redirecting...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <Text variant="displaySmall" style={styles.title}>
            Focus-One-Task
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Master one task at a time with AI-powered focus
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            Transform your productivity with intelligent task prioritization and distraction-free focus sessions.
          </Text>
          
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => router.push('/(auth)/signup')}
              style={styles.button}
            >
              Get Started
            </Button>
            <Button
              mode="outlined"
              onPress={() => router.push('/(auth)/login')}
              style={styles.button}
            >
              Sign In
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background.light,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    elevation: 4,
  },
  content: {
    alignItems: 'center',
    padding: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: colors.primary[600],
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 16,
    color: colors.text.secondary.light,
  },
  description: {
    textAlign: 'center',
    marginBottom: 32,
    color: colors.text.secondary.light,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    marginVertical: 4,
  },
}); 