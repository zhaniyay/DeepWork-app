import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTaskStore } from '@/stores/taskStore';
import { FocusSession } from '@/components/FocusSession';
import { colors } from '@/constants/colors';

export default function FocusSessionScreen() {
  const { duration } = useLocalSearchParams<{ duration: string }>();
  const router = useRouter();
  const { selectedTask, getNextTask } = useTaskStore();
  const [sessionOutcome, setSessionOutcome] = useState<'completed' | 'partial' | 'abandoned' | null>(null);
  const [sessionDuration, setSessionDuration] = useState(25); // default 25 minutes

  useEffect(() => {
    // Priority: 1. Task's estimated time, 2. URL parameter, 3. Default 25 minutes
    let finalDuration = 25;
    
    if (selectedTask?.estimated_minutes) {
      finalDuration = selectedTask.estimated_minutes;
    } else if (duration) {
      finalDuration = parseInt(duration);
    }
    
    console.log('Focus Session Duration Debug:', {
      taskEstimated: selectedTask?.estimated_minutes,
      urlDuration: duration,
      finalDuration,
      taskTitle: selectedTask?.title
    });
    
    setSessionDuration(finalDuration);
  }, [selectedTask, duration]);

  const handleSessionComplete = async (outcome: 'completed' | 'partial' | 'abandoned') => {
    setSessionOutcome(outcome);
    
    // TODO: Save session data to Supabase
    console.log('Session completed:', { outcome, task: selectedTask, duration: sessionDuration });
    
    // Navigate back to dashboard after a short delay
    setTimeout(() => {
      router.replace('dashboard');
    }, 2000);
  };

  const handleSessionPause = async () => {
    if (selectedTask) {
      try {
        // Mark task as paused when session is paused
        await useTaskStore.getState().markTaskPaused(selectedTask.id);
        console.log('Task paused:', selectedTask.title);
        
        // Show toast notification
        // Note: We'll need to implement a global toast system or pass this through props
        // For now, we'll just log it
        console.log('Toast: Task paused. [Resume]');
      } catch (error) {
        console.error('Failed to pause task:', error);
      }
    }
    console.log('Session paused');
  };

  const handleBackToDashboard = () => {
    router.replace('dashboard');
  };

  // If no task is selected, try to get the next recommended task
  const task = selectedTask || getNextTask();

  if (!task) {
    return (
      <View style={styles.container}>
        <Card style={styles.noTaskCard}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.noTaskTitle}>
              No Task Selected
            </Text>
            <Text variant="bodyMedium" style={styles.noTaskDescription}>
              Please select a task from the dashboard to start a focus session.
            </Text>
            <Button
              mode="contained"
              onPress={handleBackToDashboard}
              style={styles.backButton}
            >
              Back to Dashboard
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  if (sessionOutcome) {
    return (
      <View style={styles.container}>
        <Card style={styles.completionCard}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.completionTitle}>
              Session Complete!
            </Text>
            <Text variant="bodyLarge" style={styles.completionSubtitle}>
              {sessionOutcome === 'completed' && 'Great job completing your task!'}
              {sessionOutcome === 'partial' && 'Good progress! You made some headway.'}
              {sessionOutcome === 'abandoned' && 'No worries, you can try again later.'}
            </Text>
            <Text variant="bodyMedium" style={styles.completionDetails}>
              Task: {task.title}
            </Text>
            <Text variant="bodyMedium" style={styles.completionDetails}>
              Duration: {sessionDuration} minutes
            </Text>
            <Text variant="bodyMedium" style={styles.completionDetails}>
              Outcome: {sessionOutcome}
            </Text>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FocusSession
        task={task}
        duration={sessionDuration}
        onSessionComplete={handleSessionComplete}
        onSessionPause={handleSessionPause}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  noTaskCard: {
    margin: 16,
    elevation: 2,
  },
  noTaskTitle: {
    color: colors.text.primary.light,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  noTaskDescription: {
    color: colors.text.secondary.light,
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    marginTop: 16,
  },
  completionCard: {
    margin: 16,
    elevation: 2,
  },
  completionTitle: {
    color: colors.success.primary,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  completionSubtitle: {
    color: colors.text.primary.light,
    textAlign: 'center',
    marginBottom: 16,
  },
  completionDetails: {
    color: colors.text.secondary.light,
    textAlign: 'center',
    marginBottom: 8,
  },
}); 