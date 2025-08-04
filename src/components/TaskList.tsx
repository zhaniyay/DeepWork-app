import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Button, Chip, IconButton, Menu } from 'react-native-paper';
import { useTaskStore } from '@/stores/taskStore';
import { Task, TaskStatus, TaskStatusType } from '@/types/task';
import { colors } from '@/constants/colors';
import { Toast } from './Toast';

interface TaskListProps {
  onTaskSelect?: (task: Task) => void;
  showCompleted?: boolean;
}

export const TaskList: React.FC<TaskListProps> = React.memo(({ 
  onTaskSelect, 
  showCompleted = false 
}) => {
  const { tasks, markTaskComplete, markTaskInProgress, markTaskDeferred, deleteTask, selectTask } = useTaskStore();
  const [menuVisible, setMenuVisible] = React.useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastAction, setToastAction] = useState<{ label: string; onPress: () => void } | undefined>();

  // Memoize filtered tasks for better performance
  const filteredTasks = useMemo(() => 
    tasks.filter(task => 
      showCompleted ? true : task.status !== TaskStatus.COMPLETED
    ),
    [tasks, showCompleted]
  );

  // Memoize utility functions
  const getPriorityColor = useCallback((priority: number) => {
    if (priority >= 80) return colors.error.primary;
    if (priority >= 60) return colors.warning.primary;
    return colors.success.primary;
  }, []);

  const getStatusColor = useCallback((status: TaskStatusType) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return colors.success.primary;
      case TaskStatus.IN_PROGRESS:
        return colors.warning.primary;
      case TaskStatus.PAUSED:
        return colors.warning.primary;
      case TaskStatus.DEFERRED:
        return colors.error.primary;
      default:
        return colors.text.primary.light;
    }
  }, []);

  const getStatusText = useCallback((status: TaskStatusType) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return 'Completed';
      case TaskStatus.IN_PROGRESS:
        return 'In Progress';
      case TaskStatus.PAUSED:
        return 'Paused';
      case TaskStatus.DEFERRED:
        return 'Deferred';
      default:
        return 'Pending';
    }
  }, []);

  const handleTaskAction = useCallback(async (taskId: string, action: string) => {
    setMenuVisible(null);
    
    try {
      switch (action) {
        case 'complete':
          await markTaskComplete(taskId);
          break;
        case 'start':
          await markTaskInProgress(taskId);
          break;
        case 'resume':
          await markTaskInProgress(taskId);
          break;
        case 'defer':
          await markTaskDeferred(taskId);
          break;
        case 'delete':
          await deleteTask(taskId);
          break;
      }
    } catch (error) {
      console.error('Task action failed:', error);
    }
  }, [markTaskComplete, markTaskInProgress, markTaskDeferred, deleteTask]);

  const showPauseToast = useCallback((taskTitle: string) => {
    setToastMessage(`Task paused.`);
    setToastAction({
      label: 'Resume',
      onPress: () => {
        const pausedTask = tasks.find(t => t.title === taskTitle && t.status === TaskStatus.PAUSED);
        if (pausedTask) {
          handleTaskAction(pausedTask.id, 'resume');
        }
        setToastVisible(false);
      },
    });
    setToastVisible(true);
  }, [tasks, handleTaskAction]);

  const renderTask = useCallback(({ item: task }: { item: Task }) => (
    <Card style={styles.taskCard} mode="outlined">
      <Card.Content>
        <View style={styles.taskHeader}>
          <View style={styles.taskInfo}>
            <Text 
              variant="titleMedium" 
              style={[
                styles.taskTitle,
                task.status === TaskStatus.COMPLETED && styles.completedTask
              ]}
            >
              {task.title}
            </Text>
            {task.description && (
              <Text variant="bodySmall" style={styles.taskDescription}>
                {task.description}
              </Text>
            )}
          </View>
          
          <Menu
            visible={menuVisible === task.id}
            onDismiss={() => setMenuVisible(null)}
            anchor={
              <IconButton
                icon="dots-vertical"
                onPress={() => setMenuVisible(task.id)}
              />
            }
          >
            {task.status === TaskStatus.PENDING && (
              <Menu.Item 
                onPress={() => handleTaskAction(task.id, 'start')}
                title="Start Task"
                leadingIcon="play"
              />
            )}
            {task.status === TaskStatus.PAUSED && (
              <Menu.Item 
                onPress={() => handleTaskAction(task.id, 'resume')}
                title="Resume Task"
                leadingIcon="play"
              />
            )}
            <Menu.Item 
              onPress={() => handleTaskAction(task.id, 'complete')}
              title="Mark Complete"
              leadingIcon="check"
            />
            <Menu.Item 
              onPress={() => handleTaskAction(task.id, 'defer')}
              title="Defer"
              leadingIcon="clock"
            />
            <Menu.Item 
              onPress={() => handleTaskAction(task.id, 'delete')}
              title="Delete"
              leadingIcon="delete"
            />
          </Menu>
        </View>

        <View style={styles.taskMeta}>
          <View style={styles.metaRow}>
            <Chip 
              mode="outlined" 
              style={[styles.priorityChip, { borderColor: getPriorityColor(task.priority_score) }]}
              textStyle={{ color: getPriorityColor(task.priority_score) }}
            >
              Priority: {task.priority_score}
            </Chip>
            
            <Chip 
              mode="outlined"
              style={[styles.statusChip, { borderColor: getStatusColor(task.status) }]}
              textStyle={{ color: getStatusColor(task.status) }}
              onPress={task.status === TaskStatus.PAUSED ? () => handleTaskAction(task.id, 'resume') : undefined}
            >
              {getStatusText(task.status)}
            </Chip>
          </View>

          <View style={styles.metaRow}>
            {task.estimated_minutes && (
              <Chip mode="outlined" style={styles.metaChip}>
                {task.estimated_minutes} min
              </Chip>
            )}
            
            {task.due_date && (
              <Chip mode="outlined" style={styles.metaChip}>
                Due: {new Date(task.due_date).toLocaleDateString()}
              </Chip>
            )}
          </View>

          {task.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {task.tags.map((tag, index) => (
                <Chip key={index} mode="outlined" style={styles.tagChip}>
                  {tag}
                </Chip>
              ))}
            </View>
          )}
        </View>

        {onTaskSelect && task.status === TaskStatus.PENDING && (
          <Button
            mode="contained"
            onPress={() => onTaskSelect(task)}
            style={styles.startButton}
            icon="play"
          >
            Start Focus Session
          </Button>
        )}
        
        {task.status === TaskStatus.PAUSED && (
          <Button
            mode="contained"
            onPress={() => handleTaskAction(task.id, 'resume')}
            style={styles.resumeButton}
            icon="play"
          >
            Resume Task
          </Button>
        )}
      </Card.Content>
    </Card>
  ), [menuVisible, handleTaskAction, getPriorityColor, getStatusColor, getStatusText, onTaskSelect]);

  const keyExtractor = useCallback((item: Task) => item.id, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredTasks}
        renderItem={renderTask}
        keyExtractor={keyExtractor}
        style={styles.listContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      />
      <Toast
        visible={toastVisible}
        message={toastMessage}
        action={toastAction}
        onDismiss={() => setToastVisible(false)}
      />
    </View>
  );
});

TaskList.displayName = 'TaskList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  taskCard: {
    marginBottom: 12,
    backgroundColor: colors.surface.primary,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskInfo: {
    flex: 1,
    marginRight: 8,
  },
  taskTitle: {
    color: colors.text.primary.light,
    marginBottom: 4,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: colors.text.secondary.light,
  },
  taskDescription: {
    color: colors.text.secondary.light,
    marginBottom: 8,
  },
  taskMeta: {
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  priorityChip: {
    backgroundColor: colors.surface.secondary,
  },
  statusChip: {
    backgroundColor: colors.surface.secondary,
  },
  metaChip: {
    backgroundColor: colors.surface.secondary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  tagChip: {
    backgroundColor: colors.surface.secondary,
    marginRight: 4,
    marginBottom: 4,
  },
  startButton: {
    marginTop: 8,
  },
  resumeButton: {
    marginTop: 8,
    backgroundColor: colors.warning.primary,
  },
}); 