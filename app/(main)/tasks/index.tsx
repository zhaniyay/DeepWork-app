import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Chip, Button, FAB } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTaskStore } from '@/stores/taskStore';
import { TaskList } from '@/components/TaskList';
import { colors } from '@/constants/colors';

export default function TasksScreen() {
  const router = useRouter();
  const { tasks, getTasks } = useTaskStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'in-progress'>('all');

  useEffect(() => {
    getTasks();
  }, []);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const getFilterColor = (filterType: string) => {
    return filter === filterType ? colors.primary[600] : colors.text.secondary.light;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          All Tasks
        </Text>
        <Button
          mode="contained"
          onPress={() => router.push('chat')}
          icon="plus"
        >
          Add Task
        </Button>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <Chip
          mode={filter === 'all' ? 'flat' : 'outlined'}
          onPress={() => setFilter('all')}
          style={styles.filterChip}
          textStyle={{ color: getFilterColor('all') }}
        >
          All ({tasks.length})
        </Chip>
        <Chip
          mode={filter === 'pending' ? 'flat' : 'outlined'}
          onPress={() => setFilter('pending')}
          style={styles.filterChip}
          textStyle={{ color: getFilterColor('pending') }}
        >
          Pending ({tasks.filter(t => t.status === 'pending').length})
        </Chip>
        <Chip
          mode={filter === 'in-progress' ? 'flat' : 'outlined'}
          onPress={() => setFilter('in-progress')}
          style={styles.filterChip}
          textStyle={{ color: getFilterColor('in-progress') }}
        >
          In Progress ({tasks.filter(t => t.status === 'in-progress').length})
        </Chip>
        <Chip
          mode={filter === 'completed' ? 'flat' : 'outlined'}
          onPress={() => setFilter('completed')}
          style={styles.filterChip}
          textStyle={{ color: getFilterColor('completed') }}
        >
          Completed ({tasks.filter(t => t.status === 'completed').length})
        </Chip>
      </View>

      {/* Task List */}
      <View style={styles.taskListContainer}>
        {filteredTasks.length > 0 ? (
          <TaskList 
            onTaskSelect={(task) => {
              useTaskStore.getState().selectTask(task);
              router.push('focus/25');
            }}
            showCompleted={filter === 'all' || filter === 'completed'}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text variant="headlineSmall" style={styles.emptyTitle}>
              No tasks found
            </Text>
            <Text variant="bodyMedium" style={styles.emptyDescription}>
              {filter === 'all' 
                ? 'Create your first task to get started'
                : `No ${filter} tasks found`
              }
            </Text>
            <Button
              mode="contained"
              onPress={() => router.push('chat')}
              style={styles.emptyButton}
              icon="plus"
            >
              Add Task
            </Button>
          </View>
        )}
      </View>

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
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  taskListContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    color: colors.text.secondary.light,
    marginBottom: 8,
  },
  emptyDescription: {
    color: colors.text.secondary.light,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary[600],
  },
}); 