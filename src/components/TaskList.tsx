import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Button, Chip, IconButton, Menu } from 'react-native-paper';
import { useTaskStore } from '@/stores/taskStore';
import { Task, TaskStatus, TaskStatusType } from '@/types/task';
import { colors } from '@/constants/colors';

interface TaskListProps {
  onTaskSelect?: (task: Task) => void;
  showCompleted?: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({ 
  onTaskSelect, 
  showCompleted = false 
}) => {
  const { tasks, markTaskComplete, markTaskInProgress, markTaskDeferred, deleteTask } = useTaskStore();
  const [menuVisible, setMenuVisible] = React.useState<string | null>(null);

  const filteredTasks = tasks.filter(task => 
    showCompleted ? true : task.status !== TaskStatus.COMPLETED
  );

  const getPriorityColor = (priority: number) => {
    if (priority >= 80) return colors.error.primary;
    if (priority >= 60) return colors.warning.primary;
    return colors.success.primary;
  };

  const getStatusColor = (status: TaskStatusType) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return colors.success.primary;
      case TaskStatus.IN_PROGRESS:
        return colors.warning.primary;
      case TaskStatus.DEFERRED:
        return colors.error.primary;
      default:
        return colors.text.primary.light;
    }
  };

  const getStatusText = (status: TaskStatusType) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return 'Completed';
      case TaskStatus.IN_PROGRESS:
        return 'In Progress';
      case TaskStatus.DEFERRED:
        return 'Deferred';
      default:
        return 'Pending';
    }
  };

  const handleTaskAction = async (taskId: string, action: string) => {
    setMenuVisible(null);
    
    switch (action) {
      case 'complete':
        await markTaskComplete(taskId);
        break;
      case 'start':
        await markTaskInProgress(taskId);
        break;
      case 'defer':
        await markTaskDeferred(taskId);
        break;
      case 'delete':
        await deleteTask(taskId);
        break;
    }
  };

  const renderTask = ({ item: task }: { item: Task }) => (
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
            <Menu.Item 
              onPress={() => handleTaskAction(task.id, 'start')}
              title="Start Task"
              leadingIcon="play"
            />
            <Menu.Item 
              onPress={() => handleTaskAction(task.id, 'complete')}
              title="Mark Complete"
              leadingIcon="check"
            />
            <Menu.Item 
              onPress={() => handleTaskAction(task.id, 'defer')}
              title="Defer"
              leadingIcon="clock-outline"
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
      </Card.Content>
    </Card>
  );

  return (
    <FlatList
      data={filteredTasks}
      renderItem={renderTask}
      keyExtractor={(item) => item.id}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
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
}); 