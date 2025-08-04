import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, Card, Chip, Button, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { useTaskStore } from '@/stores/taskStore';
import { colors } from '@/constants/colors';
import { QuickAddTask } from '@/components/QuickAddTask';

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

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');

  // Render header section
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text variant="headlineMedium" style={styles.title}>
          Focus
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Welcome back, {user?.full_name || 'Focus Master'}
        </Text>
      </View>
      <IconButton
        icon="logout"
        size={24}
        onPress={handleSignOut}
        disabled={isLoading}
        iconColor={colors.primary[600]}
      />
    </View>
  );

  // Render stats section
  const renderStats = () => (
    <View style={styles.statsContainer}>
      <Card style={styles.statCard}>
        <Card.Content style={styles.statContent}>
          <Text variant="headlineLarge" style={styles.statNumber}>
            {pendingTasks.length}
          </Text>
          <Text variant="bodyMedium" style={styles.statLabel}>
            Pending
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.statCard}>
        <Card.Content style={styles.statContent}>
          <Text variant="headlineLarge" style={styles.statNumber}>
            {inProgressTasks.length}
          </Text>
          <Text variant="bodyMedium" style={styles.statLabel}>
            In Progress
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.statCard}>
        <Card.Content style={styles.statContent}>
          <Text variant="headlineLarge" style={styles.statNumber}>
            {completedTasks.length}
          </Text>
          <Text variant="bodyMedium" style={styles.statLabel}>
            Completed
          </Text>
        </Card.Content>
      </Card>
    </View>
  );

  // Render actions section
  const renderActions = () => (
    <View style={styles.actionsContainer}>
      <Button
        mode="contained"
        onPress={() => router.push('chat')}
        style={styles.mainActionButton}
        icon="robot"
        contentStyle={styles.mainActionContent}
      >
        Start with AI
      </Button>
      
      <View style={styles.secondaryActions}>
        <Button
          mode="outlined"
          onPress={() => router.push('progress')}
          style={styles.secondaryButton}
          icon="chart-line"
        >
          Progress
        </Button>
        <Button
          mode="outlined"
          onPress={() => router.push('tasks')}
          style={styles.secondaryButton}
          icon="format-list-bulleted"
        >
          All Tasks
        </Button>
        <Button
          mode="outlined"
          onPress={() => router.push('settings')}
          style={styles.secondaryButton}
          icon="cog"
        >
          Settings
        </Button>
      </View>
    </View>
  );

  // Render quick add task section
  const renderQuickAdd = () => (
    <QuickAddTask onTaskAdded={getTasks} />
  );

  // Render priority tasks section
  const renderPriorityTasks = () => (
    <Card style={styles.tasksCard}>
      <Card.Content>
        <View style={styles.sectionHeader}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Priority Tasks
          </Text>
          <Text variant="bodySmall" style={styles.sectionSubtitle}>
            {pendingTasks.length} tasks waiting
          </Text>
        </View>
        
        {tasks.length > 0 ? (
          <View style={styles.taskListContainer}>
            {pendingTasks.slice(0, 3).map((task) => (
              <Card key={task.id} style={styles.taskItem} mode="outlined">
                <Card.Content>
                  <View style={styles.taskHeader}>
                    <Text variant="bodyLarge" style={styles.taskTitle}>
                      {task.title}
                    </Text>
                    <Chip 
                      mode="outlined" 
                      style={styles.priorityChip}
                      textStyle={{ color: colors.primary[600] }}
                    >
                      Priority: {task.priority_score}
                    </Chip>
                  </View>
                  {task.description && (
                    <Text variant="bodySmall" style={styles.taskDescription}>
                      {task.description}
                    </Text>
                  )}
                  <Button
                    mode="contained"
                    onPress={() => {
                      useTaskStore.getState().selectTask(task);
                      const duration = task.estimated_minutes || 25;
                      router.push(`focus/${duration}`);
                    }}
                    style={styles.startButton}
                    icon="play"
                  >
                    Start Focus Session
                  </Button>
                </Card.Content>
              </Card>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              No tasks yet
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtext}>
              Start by adding your first task
            </Text>
            <Button
              mode="contained"
              onPress={() => router.push('chat')}
              style={styles.emptyButton}
              icon="plus"
            >
              Add First Task
            </Button>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  // Render focus sessions section
  const renderFocusSessions = () => (
    <Card style={styles.sessionsCard}>
      <Card.Content>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Focus Sessions
        </Text>
        <Text variant="bodyMedium" style={styles.sectionSubtitle}>
          Choose your session type
        </Text>
        
        <View style={styles.sessionTypes}>
          <Chip
            mode="outlined"
            onPress={() => router.push('focus/25')}
            style={styles.sessionChip}
            textStyle={styles.sessionChipText}
          >
            🍅 Pomodoro (25min)
          </Chip>
          <Chip
            mode="outlined"
            onPress={() => router.push('focus/50')}
            style={styles.sessionChip}
            textStyle={styles.sessionChipText}
          >
            ⏰ Deep Work (50min)
          </Chip>
          <Chip
            mode="outlined"
            onPress={() => router.push('focus/90')}
            style={styles.sessionChip}
            textStyle={styles.sessionChipText}
          >
            🎯 Extended (90min)
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );

  // Main content sections
  const sections = [
    { key: 'header', render: renderHeader },
    { key: 'stats', render: renderStats },
    { key: 'actions', render: renderActions },
    { key: 'quickAdd', render: renderQuickAdd },
    { key: 'priorityTasks', render: renderPriorityTasks },
    { key: 'focusSessions', render: renderFocusSessions },
  ];

  const renderItem = ({ item }: { item: any }) => item.render();

  return (
    <View style={styles.container}>
      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      />
      
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('chat')}
        color={colors.surface.light}
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
    elevation: 1,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    color: colors.primary[600],
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitle: {
    color: colors.text.secondary.light,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  contentContainer: {
    paddingBottom: 80, // Add padding at the bottom for the FAB
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    elevation: 1,
    backgroundColor: colors.surface.primary,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  statNumber: {
    color: colors.primary[600],
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: colors.text.secondary.light,
    textAlign: 'center',
  },
  actionsContainer: {
    marginBottom: 24,
  },
  mainActionButton: {
    backgroundColor: colors.primary[600],
    marginBottom: 12,
    borderRadius: 12,
  },
  mainActionContent: {
    paddingVertical: 8,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    borderColor: colors.primary[300],
    borderRadius: 8,
  },
  tasksCard: {
    marginBottom: 24,
    elevation: 1,
    backgroundColor: colors.surface.primary,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.text.primary.light,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: colors.text.secondary.light,
  },
  taskListContainer: {
    maxHeight: 300,
  },
  taskItem: {
    marginBottom: 12,
    borderRadius: 8,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskTitle: {
    flex: 1,
    marginRight: 8,
  },
  priorityChip: {
    backgroundColor: colors.surface.secondary,
  },
  taskDescription: {
    color: colors.text.secondary.light,
    marginBottom: 8,
  },
  startButton: {
    backgroundColor: colors.primary[600],
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: colors.text.secondary.light,
    marginBottom: 8,
    fontWeight: '500',
  },
  emptySubtext: {
    color: colors.text.secondary.light,
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: colors.primary[600],
  },
  sessionsCard: {
    marginBottom: 24,
    elevation: 1,
    backgroundColor: colors.surface.primary,
  },
  sessionTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  sessionChip: {
    borderColor: colors.primary[300],
    backgroundColor: colors.surface.secondary,
  },
  sessionChipText: {
    color: colors.primary[600],
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary[600],
  },
}); 