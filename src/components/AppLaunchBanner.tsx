import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { useTaskStore } from '@/stores/taskStore';
import { TaskStatus } from '@/types/task';
import { colors } from '@/constants/colors';

interface AppLaunchBannerProps {
  onResume: (taskId: string) => void;
  onDismiss: () => void;
}

export const AppLaunchBanner: React.FC<AppLaunchBannerProps> = ({
  onResume,
  onDismiss,
}) => {
  const { tasks } = useTaskStore();
  const [recentPausedTask, setRecentPausedTask] = useState<any>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    // Find recently paused tasks (paused in the last 24 hours)
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const pausedTasks = tasks.filter(task => 
      task.status === TaskStatus.PAUSED &&
      new Date(task.updated_at) > twentyFourHoursAgo
    );

    if (pausedTasks.length > 0) {
      // Get the most recently paused task
      const mostRecent = pausedTasks.sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )[0];
      
      setRecentPausedTask(mostRecent);
      
      // Animate banner in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [tasks]);

  const handleResume = () => {
    if (recentPausedTask) {
      onResume(recentPausedTask.id);
    }
  };

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  if (!recentPausedTask) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Card style={styles.banner}>
        <Card.Content>
          <Text variant="bodyLarge" style={styles.message}>
            You paused '{recentPausedTask.title}'. Resume?
          </Text>
          <View style={styles.actions}>
            <Button
              mode="contained"
              onPress={handleResume}
              style={styles.resumeButton}
              icon="play"
            >
              Resume
            </Button>
            <Button
              mode="text"
              onPress={handleDismiss}
              style={styles.dismissButton}
            >
              Dismiss
            </Button>
          </View>
        </Card.Content>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  banner: {
    backgroundColor: colors.surface.light,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  message: {
    color: colors.text.primary.light,
    marginBottom: 16,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  resumeButton: {
    backgroundColor: colors.primary[600],
  },
  dismissButton: {
    marginLeft: 8,
  },
}); 