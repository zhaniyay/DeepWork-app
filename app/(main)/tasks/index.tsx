import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Chip, Button, FAB } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTaskStore } from '@/stores/taskStore';
import { TaskList } from '@/components/TaskList';
import { TaskStatus, TaskStatusType } from '@/types/task';
import { colors } from '@/constants/colors';

export default function TasksScreen() {
  const router = useRouter();
  const { tasks, getTasks } = useTaskStore();
  const [filter, setFilter] = useState<'all' | TaskStatusType>('all');

  useEffect(() => {
    getTasks();
  }, []);

  // Memoized filter calculations for better performance
  const taskCounts = useMemo(() => ({
    all: tasks.length,
    pending: tasks.filter(t => t.status === TaskStatus.PENDING).length,
    'in-progress': tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
    paused: tasks.filter(t => t.status === TaskStatus.PAUSED).length,
    completed: tasks.filter(t => t.status === TaskStatus.COMPLETED).length,
  }), [tasks]);

  const filteredTasks = useMemo(() => {
    if (filter === 'all') return tasks;
    return tasks.filter(task => task.status === filter);
  }, [tasks, filter]);

  const getFilterColor = (filterType: string) => {
    return filter === filterType ? colors.primary[600] : colors.text.secondary.light;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          All Tasks
        </Text>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <Chip
          mode={filter === 'all' ? 'flat' : 'outlined'}
          onPress={() => setFilter('all')}
          style={styles.filterChip}
          textStyle={{ color: getFilterColor('all') }}
        >
          All ({taskCounts.all})
        </Chip>
        <Chip
          mode={filter === TaskStatus.PENDING ? 'flat' : 'outlined'}
          onPress={() => setFilter(TaskStatus.PENDING)}
          style={styles.filterChip}
          textStyle={{ color: getFilterColor(TaskStatus.PENDING) }}
        >
          Pending ({taskCounts.pending})
        </Chip>
        <Chip
          mode={filter === TaskStatus.IN_PROGRESS ? 'flat' : 'outlined'}
          onPress={() => setFilter(TaskStatus.IN_PROGRESS)}
          style={styles.filterChip}
          textStyle={{ color: getFilterColor(TaskStatus.IN_PROGRESS) }}
        >
          In Progress ({taskCounts['in-progress']})
        </Chip>
        <Chip
          mode={filter === TaskStatus.PAUSED ? 'flat' : 'outlined'}
          onPress={() => setFilter(TaskStatus.PAUSED)}
          style={styles.filterChip}
          textStyle={{ color: getFilterColor(TaskStatus.PAUSED) }}
        >
          Paused ({taskCounts.paused})
        </Chip>
        <Chip
          mode={filter === TaskStatus.COMPLETED ? 'flat' : 'outlined'}
          onPress={() => setFilter(TaskStatus.COMPLETED)}
          style={styles.filterChip}
          textStyle={{ color: getFilterColor(TaskStatus.COMPLETED) }}
        >
          Completed ({taskCounts.completed})
        </Chip>
      </View>

      {/* Task List */}
      <View style={styles.taskListContainer}>
        {filteredTasks.length > 0 ? (
          <TaskList 
            onTaskSelect={(task) => {
              useTaskStore.getState().selectTask(task);
              // Let the focus screen use the task's estimated time instead of hardcoding 25
              router.push('focus/0');
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
    justifyContent: 'center',
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary[600],
  },
}); 