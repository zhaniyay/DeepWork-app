import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Card, Text, Chip } from 'react-native-paper';
import { useTaskStore } from '@/stores/taskStore';
import { colors } from '@/constants/colors';

interface QuickAddTaskProps {
  onTaskAdded?: () => void;
}

export const QuickAddTask: React.FC<QuickAddTaskProps> = ({ onTaskAdded }) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { createTask, parseNaturalLanguage } = useTaskStore();

  const handleAddTask = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    try {
      // Parse natural language input
      const parsedTasks = await parseNaturalLanguage(inputText.trim());
      
      // Create the first parsed task
      if (parsedTasks.length > 0) {
        await createTask({
          title: parsedTasks[0].title,
          description: parsedTasks[0].description,
          estimated_minutes: parsedTasks[0].estimated_minutes,
          priority_score: parsedTasks[0].priority_score,
          tags: parsedTasks[0].tags,
        });
        
        setInputText('');
        onTaskAdded?.();
      }
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAdd = (quickText: string) => {
    setInputText(quickText);
  };

  const quickAdds = [
    'Review emails',
    'Call client',
    'Update documentation',
    'Plan tomorrow',
  ];

  return (
    <Card style={styles.container}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          Quick Add Task
        </Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            mode="outlined"
            placeholder="e.g., Finish proposal by 4pm"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleAddTask}
            disabled={isLoading}
            style={styles.input}
            right={
              <TextInput.Icon
                icon="plus"
                onPress={handleAddTask}
                disabled={!inputText.trim() || isLoading}
              />
            }
          />
        </View>

        <View style={styles.quickAddsContainer}>
          <Text variant="bodySmall" style={styles.quickAddsLabel}>
            Quick adds:
          </Text>
          <View style={styles.chipsContainer}>
            {quickAdds.map((text, index) => (
              <Chip
                key={index}
                mode="outlined"
                onPress={() => handleQuickAdd(text)}
                style={styles.chip}
                textStyle={styles.chipText}
              >
                {text}
              </Chip>
            ))}
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    elevation: 2,
  },
  title: {
    marginBottom: 12,
    color: colors.text.primary.light,
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.surface.primary,
  },
  quickAddsContainer: {
    marginTop: 8,
  },
  quickAddsLabel: {
    marginBottom: 8,
    color: colors.text.secondary.light,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: colors.surface.secondary,
  },
  chipText: {
    fontSize: 12,
  },
}); 