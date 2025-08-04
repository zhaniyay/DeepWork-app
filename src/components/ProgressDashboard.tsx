import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, ProgressBar, Button, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTaskStore } from '@/stores/taskStore';
import { TaskStatus } from '@/types/task';
import { colors } from '@/constants/colors';

interface ProgressDashboardProps {
  onViewSessions?: () => void;
  onViewAnalytics?: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = React.memo(({
  onViewSessions,
  onViewAnalytics,
}) => {
  const { tasks } = useTaskStore();
  const router = useRouter();

  // Calculate simple, meaningful stats with useMemo
  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === TaskStatus.COMPLETED).length;
    const inProgressTasks = tasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length;
    const pausedTasks = tasks.filter(task => task.status === TaskStatus.PAUSED).length;
    const pendingTasks = tasks.filter(task => task.status === TaskStatus.PENDING).length;
    
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      pausedTasks,
      pendingTasks,
      completionRate,
    };
  }, [tasks]);

  // Memoize filtered tasks for better performance
  const pausedTasksList = useMemo(() => 
    tasks.filter(task => task.status === TaskStatus.PAUSED).slice(0, 3),
    [tasks]
  );

  const completedTasksList = useMemo(() => 
    tasks.filter(task => task.status === TaskStatus.COMPLETED).slice(0, 3),
    [tasks]
  );

  const formatTime = useMemo(() => (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }, []);

  const handleResumeTask = useMemo(() => async (task: any) => {
    try {
      await useTaskStore.getState().markTaskInProgress(task.id);
      useTaskStore.getState().selectTask(task);
      // Use task's estimated time or default to 25 minutes
      const duration = task.estimated_minutes || 25;
      router.push(`focus/${duration}`);
    } catch (error) {
      console.error('Failed to resume task:', error);
    }
  }, [router]);

  const handleStartFocusSession = useMemo(() => () => {
    const nextTask = tasks.find(task => task.status === TaskStatus.PENDING);
    if (nextTask) {
      useTaskStore.getState().selectTask(nextTask);
      // Use task's estimated time or default to 25 minutes
      const duration = nextTask.estimated_minutes || 25;
      router.push(`focus/${duration}`);
    } else {
      router.push('chat');
    }
  }, [tasks, router]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Simple Overview Stats */}
      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.statNumber}>
              {stats.totalTasks}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Total Tasks
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.statNumber}>
              {stats.completedTasks}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Completed
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.statNumber}>
              {stats.inProgressTasks}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              In Progress
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.statNumber}>
              {stats.completionRate}%
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Completion Rate
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Quick Actions */}
      <Card style={styles.actionsCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            Quick Actions
          </Text>
          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              onPress={handleStartFocusSession}
              style={styles.actionButton}
              icon="play"
            >
              Start Focus Session
            </Button>
            <Button
              mode="outlined"
              onPress={() => router.push('chat')}
              style={styles.actionButton}
              icon="plus"
            >
              Add New Task
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Paused Tasks - Only show if there are any */}
      {stats.pausedTasks > 0 && (
        <Card style={styles.tasksCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              Paused Tasks ({stats.pausedTasks})
            </Text>
            {pausedTasksList.map((task) => (
              <View key={task.id} style={styles.taskItem}>
                <View style={styles.taskHeader}>
                  <Text variant="bodyLarge" style={styles.taskTitle}>
                    ⏸️ {task.title}
                  </Text>
                </View>
                {task.description && (
                  <Text variant="bodySmall" style={styles.taskDescription}>
                    {task.description}
                  </Text>
                )}
                <Button
                  mode="contained"
                  onPress={() => handleResumeTask(task)}
                  style={styles.resumeButton}
                  icon="play"
                >
                  Resume
                </Button>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Recent Completed Tasks */}
      {stats.completedTasks > 0 && (
        <Card style={styles.tasksCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              Recently Completed
            </Text>
            {completedTasksList.map((task) => (
              <View key={task.id} style={styles.taskItem}>
                <View style={styles.taskHeader}>
                  <Text variant="bodyLarge" style={styles.taskTitle}>
                    ✅ {task.title}
                  </Text>
                </View>
                {task.description && (
                  <Text variant="bodySmall" style={styles.taskDescription}>
                    {task.description}
                  </Text>
                )}
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Empty State */}
      {stats.totalTasks === 0 && (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.emptyTitle}>
              No Tasks Yet
            </Text>
            <Text variant="bodyMedium" style={styles.emptyDescription}>
              Start by adding your first task to track your progress.
            </Text>
            <Button
              mode="contained"
              onPress={() => router.push('chat')}
              style={styles.emptyButton}
              icon="plus"
            >
              Add Your First Task
            </Button>
          </Card.Content>
        </Card>
      )}

      {/* Progress Overview */}
      {stats.totalTasks > 0 && (
        <Card style={styles.progressCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              Progress Overview
            </Text>
            <View style={styles.progressItem}>
              <Text variant="bodyMedium">Pending</Text>
              <Text variant="bodyLarge" style={styles.progressNumber}>
                {stats.pendingTasks}
              </Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.progressItem}>
              <Text variant="bodyMedium">In Progress</Text>
              <Text variant="bodyLarge" style={styles.progressNumber}>
                {stats.inProgressTasks}
              </Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.progressItem}>
              <Text variant="bodyMedium">Completed</Text>
              <Text variant="bodyLarge" style={styles.progressNumber}>
                {stats.completedTasks}
              </Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.progressItem}>
              <Text variant="bodyMedium">Completion Rate</Text>
              <Text variant="bodyLarge" style={styles.progressNumber}>
                {stats.completionRate}%
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
});

ProgressDashboard.displayName = 'ProgressDashboard';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    elevation: 1,
    backgroundColor: colors.surface.primary,
    borderRadius: 12,
  },
  statNumber: {
    color: colors.primary[600],
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statLabel: {
    color: colors.text.secondary.light,
    textAlign: 'center',
    marginTop: 4,
  },
  actionsCard: {
    marginBottom: 16,
    elevation: 1,
    backgroundColor: colors.surface.primary,
    borderRadius: 12,
  },
  cardTitle: {
    color: colors.text.primary.light,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
  },
  tasksCard: {
    marginBottom: 16,
    elevation: 1,
    backgroundColor: colors.surface.primary,
    borderRadius: 12,
  },
  taskItem: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface.secondary,
  },
  taskHeader: {
    marginBottom: 8,
  },
  taskTitle: {
    color: colors.text.primary.light,
    flex: 1,
  },
  taskDescription: {
    color: colors.text.secondary.light,
    marginBottom: 8,
  },
  resumeButton: {
    marginTop: 8,
    backgroundColor: colors.primary[600],
    borderRadius: 8,
  },
  emptyCard: {
    marginBottom: 16,
    elevation: 1,
    backgroundColor: colors.surface.primary,
    borderRadius: 12,
  },
  emptyTitle: {
    color: colors.text.primary.light,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyDescription: {
    color: colors.text.secondary.light,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyButton: {
    marginTop: 8,
    backgroundColor: colors.primary[600],
    borderRadius: 8,
  },
  progressCard: {
    marginBottom: 16,
    elevation: 1,
    backgroundColor: colors.surface.primary,
    borderRadius: 12,
  },
  progressItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  progressNumber: {
    color: colors.primary[600],
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 4,
    backgroundColor: colors.surface.secondary,
  },
});