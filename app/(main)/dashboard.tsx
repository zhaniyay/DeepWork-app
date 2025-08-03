import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, Card, Chip, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { useTaskStore } from '@/stores/taskStore';
import { colors } from '@/constants/colors';
import { QuickAddTask } from '@/components/QuickAddTask';
import { TaskList } from '@/components/TaskList';

export default function DashboardScreen() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const { tasks, getTasks, getNextTask } = useTaskStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getTasks();
  }, []);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Focus Dashboard
        </Text>
        <Button
          mode="text"
          onPress={handleSignOut}
          loading={isLoading}
          disabled={isLoading}
        >
          Sign Out
        </Button>
      </View>

      <FlatList
        style={styles.content}
        data={[{ key: 'dashboard' }]}
        renderItem={() => (
          <>
            {/* Welcome Section */}
            <Card style={styles.welcomeCard}>
              <Card.Content>
                <Text variant="titleLarge" style={styles.welcomeTitle}>
                  Welcome back, {user?.full_name || 'Focus Master'}!
                </Text>
                <Text variant="bodyMedium" style={styles.welcomeSubtitle}>
                  Ready to tackle your next priority task?
                </Text>
              </Card.Content>
            </Card>

            {/* Quick Stats */}
            <View style={styles.statsContainer}>
              <Card style={styles.statCard}>
                <Card.Content>
                  <Text variant="headlineSmall" style={styles.statNumber}>
                    {tasks.length}
                  </Text>
                  <Text variant="bodyMedium" style={styles.statLabel}>
                    Total Tasks
                  </Text>
                </Card.Content>
              </Card>

              <Card style={styles.statCard}>
                <Card.Content>
                  <Text variant="headlineSmall" style={styles.statNumber}>
                    {tasks.filter(t => t.status === 'completed').length}
                  </Text>
                  <Text variant="bodyMedium" style={styles.statLabel}>
                    Completed
                  </Text>
                </Card.Content>
              </Card>

              <Card style={styles.statCard}>
                <Card.Content>
                  <Text variant="headlineSmall" style={styles.statNumber}>
                    {tasks.filter(t => t.status === 'pending').length}
                  </Text>
                  <Text variant="bodyMedium" style={styles.statLabel}>
                    Pending
                  </Text>
                </Card.Content>
              </Card>
            </View>

            {/* Quick Actions */}
            <Card style={styles.actionsCard}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Quick Actions
                </Text>
                <View style={styles.actionButtons}>
                                  <Button
                  mode="contained"
                  onPress={() => router.push('chat/index')}
                  style={styles.actionButton}
                  icon="robot"
                >
                  AI Chat
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => router.push('progress/index')}
                  style={styles.actionButton}
                  icon="chart-line"
                >
                  Progress
                </Button>
                </View>
                <View style={styles.actionButtons}>
                                  <Button
                  mode="outlined"
                  onPress={() => router.push('settings/index')}
                  style={styles.actionButton}
                  icon="cog"
                >
                  Settings
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => router.push('tasks/index')}
                  style={styles.actionButton}
                  icon="format-list-bulleted"
                >
                  All Tasks
                </Button>
                </View>
              </Card.Content>
            </Card>

            {/* Quick Add Task */}
            <QuickAddTask onTaskAdded={getTasks} />

            {/* Task List */}
            <Card style={styles.tasksCard}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Priority Tasks
                </Text>
                {tasks.length > 0 ? (
                  <View style={styles.taskListContainer}>
                    <TaskList 
                      onTaskSelect={(task) => {
                        // Select the task and navigate to focus session
                        useTaskStore.getState().selectTask(task);
                        router.push('focus/25');
                      }}
                    />
                  </View>
                ) : (
                  <View style={styles.emptyState}>
                    <Text variant="bodyLarge" style={styles.emptyText}>
                      No tasks yet
                    </Text>
                    <Text variant="bodyMedium" style={styles.emptySubtext}>
                      Add your first task to get started
                    </Text>
                                    <Button
                  mode="contained"
                  onPress={() => router.push('chat/index')}
                  style={styles.emptyButton}
                >
                  Add First Task
                </Button>
                  </View>
                )}
              </Card.Content>
            </Card>

            {/* Session Types */}
            <Card style={styles.sessionTypesCard}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Focus Session Types
                </Text>
                <View style={styles.sessionTypes}>
                  <Chip
                    mode="outlined"
                    onPress={() => router.push('focus/25')}
                    style={styles.sessionChip}
                  >
                    Pomodoro (25min)
                  </Chip>
                  <Chip
                    mode="outlined"
                    onPress={() => router.push('focus/50')}
                    style={styles.sessionChip}
                  >
                    Deep Work (50min)
                  </Chip>
                  <Chip
                    mode="outlined"
                    onPress={() => router.push('focus/15')}
                    style={styles.sessionChip}
                  >
                    Quick Win (15min)
                  </Chip>
                </View>
              </Card.Content>
            </Card>
          </>
        )}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('chat')}
        label="Add Task"
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: colors.surface.light,
    elevation: 2,
  },
  title: {
    color: colors.primary[600],
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  welcomeCard: {
    marginBottom: 16,
    elevation: 2,
  },
  welcomeTitle: {
    color: colors.primary[600],
    fontWeight: 'bold',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    color: colors.text.secondary.light,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
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
    elevation: 2,
  },
  sectionTitle: {
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
  tasksCard: {
    marginBottom: 16,
    elevation: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: colors.text.secondary.light,
    marginBottom: 8,
  },
  emptySubtext: {
    color: colors.text.secondary.light,
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 8,
  },
  sessionTypesCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sessionTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sessionChip: {
    marginBottom: 8,
  },
  taskListContainer: {
    maxHeight: 400,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary[600],
  },
}); 