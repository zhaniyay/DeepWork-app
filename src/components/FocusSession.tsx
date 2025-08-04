import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, AppState, AppStateStatus } from 'react-native';
import { Text, Button, Card, ProgressBar, IconButton } from 'react-native-paper';
import { Task } from '@/types/task';
import { colors } from '@/constants/colors';

interface FocusSessionProps {
  task: Task;
  duration: number; // in minutes
  onSessionComplete: (outcome: 'completed' | 'partial' | 'abandoned') => void;
  onSessionPause: () => void;
}

export const FocusSession: React.FC<FocusSessionProps> = ({
  task,
  duration,
  onSessionComplete,
  onSessionPause,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(duration * 60); // in seconds
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [interruptions, setInterruptions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef = useRef(AppState.currentState);

  // Debug logging
  console.log('FocusSession Debug:', {
    taskTitle: task.title,
    taskEstimated: task.estimated_minutes,
    duration,
    timeRemaining,
    isActive
  });

  // Update timeRemaining when duration changes
  useEffect(() => {
    console.log('Duration changed:', duration, 'Setting timeRemaining to:', duration * 60);
    setTimeRemaining(duration * 60);
  }, [duration]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        isActive &&
        !isPaused
      ) {
        // App came back to foreground - count as interruption
        setInterruptions(prev => prev + 1);
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [isActive, isPaused]);

  useEffect(() => {
    if (isActive && !isPaused && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSessionComplete('completed');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
    onSessionPause();
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleSessionComplete = (outcome: 'completed' | 'partial' | 'abandoned') => {
    setIsActive(false);
    setIsPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    onSessionComplete(outcome);
  };

  // Calculate progress based on time elapsed, not remaining
  const totalSeconds = duration * 60;
  const elapsedSeconds = totalSeconds - timeRemaining;
  const progress = elapsedSeconds / totalSeconds;

  return (
    <View style={styles.container}>
      {/* Task Display */}
      <Card style={styles.taskCard}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.taskTitle}>
            {task.title}
          </Text>
          {task.description && (
            <Text variant="bodyMedium" style={styles.taskDescription}>
              {task.description}
            </Text>
          )}
          <View style={styles.taskMeta}>
            <Text variant="bodySmall" style={styles.taskMetaText}>
              Priority: {task.priority_score}
            </Text>
            <Text variant="bodySmall" style={styles.taskMetaText}>
              Estimated: {task.estimated_minutes} min
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Timer Display */}
      <Card style={styles.timerCard}>
        <Card.Content>
          <Text variant="displayLarge" style={styles.timer}>
            {formatTime(timeRemaining)}
          </Text>
          <ProgressBar 
            progress={progress} 
            color={colors.primary[600]}
            style={styles.progressBar}
          />
          <Text variant="bodySmall" style={styles.progressText}>
            {Math.round(progress * 100)}% complete
          </Text>
        </Card.Content>
      </Card>

      {/* Session Controls */}
      <Card style={styles.controlsCard}>
        <Card.Content>
          <View style={styles.controlButtons}>
            {!isActive ? (
              <Button
                mode="contained"
                onPress={handleStart}
                style={styles.controlButton}
                icon="play"
              >
                Start Session
              </Button>
            ) : (
              <>
                {isPaused ? (
                  <Button
                    mode="contained"
                    onPress={handleResume}
                    style={styles.controlButton}
                    icon="play"
                  >
                    Resume
                  </Button>
                ) : (
                  <Button
                    mode="outlined"
                    onPress={handlePause}
                    style={styles.controlButton}
                    icon="pause"
                  >
                    Pause
                  </Button>
                )}
                
                <Button
                  mode="outlined"
                  onPress={() => handleSessionComplete('abandoned')}
                  style={styles.controlButton}
                  icon="stop"
                  textColor={colors.error.primary}
                >
                  End Session
                </Button>
              </>
            )}
          </View>

          {interruptions > 0 && (
            <View style={styles.interruptionsContainer}>
              <Text variant="bodySmall" style={styles.interruptionsText}>
                Interruptions: {interruptions}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Session Actions */}
      {isActive && (
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.actionsTitle}>
              Session Actions
            </Text>
            <View style={styles.actionButtons}>
              <Button
                mode="outlined"
                onPress={() => handleSessionComplete('partial')}
                style={styles.actionButton}
                icon="check-circle"
              >
                Mark Partial
              </Button>
              <Button
                mode="outlined"
                onPress={() => handleSessionComplete('completed')}
                style={styles.actionButton}
                icon="check"
              >
                Mark Complete
              </Button>
            </View>
          </Card.Content>
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background.light,
  },
  taskCard: {
    marginBottom: 16,
    elevation: 2,
  },
  taskTitle: {
    color: colors.text.primary.light,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  taskDescription: {
    color: colors.text.secondary.light,
    marginBottom: 12,
  },
  taskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskMetaText: {
    color: colors.text.secondary.light,
  },
  timerCard: {
    marginBottom: 16,
    elevation: 2,
  },
  timer: {
    textAlign: 'center',
    color: colors.primary[600],
    fontWeight: 'bold',
    marginBottom: 16,
  },
  progressBar: {
    marginBottom: 8,
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    color: colors.text.secondary.light,
  },
  controlsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  controlButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  interruptionsContainer: {
    alignItems: 'center',
    paddingTop: 8,
  },
  interruptionsText: {
    color: colors.warning.primary,
  },
  actionsCard: {
    elevation: 2,
  },
  actionsTitle: {
    color: colors.text.primary.light,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
}); 