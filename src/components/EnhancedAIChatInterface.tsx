import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Card, Avatar, Chip, IconButton } from 'react-native-paper';
import { EnhancedAIService } from '@/services/ai/enhancedAIService';
import { useTaskStore } from '@/stores/taskStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { colors } from '@/constants/colors';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  followUpQuestions?: string[];
  actions?: string[];
  tasks?: any[];
  metadata?: {
    intent?: string;
    actions?: string[];
    tasksCreated?: string[];
  };
}

interface EnhancedAIChatInterfaceProps {
  onTaskCreated?: () => void;
  onClose?: () => void;
  onStartFocusSession?: (duration: number) => void;
}

export const EnhancedAIChatInterface: React.FC<EnhancedAIChatInterfaceProps> = ({
  onTaskCreated,
  onStartFocusSession,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your productivity assistant. How can I help you today?',
      timestamp: new Date(),
      suggestions: [
        'Create a task',
        'Plan a project',
        'Get advice',
        'Start focus session',
      ],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const { createTask, tasks, getTasks } = useTaskStore();
  const { preferences } = useSettingsStore();

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const getUserContext = () => {
    const currentTasks = tasks.filter(task => task.status === 'pending');
    const completedTasks = tasks.filter(task => task.status === 'completed');
    
    return {
      currentTasks,
      completedTasks,
      productivityPatterns: {
        preferredSessionDuration: preferences.sessionLength || 25,
        mostProductiveTime: 'morning',
        commonTags: Array.from(new Set(currentTasks.flatMap(task => task.tags))),
        averageTaskDuration: currentTasks.length > 0 
          ? currentTasks.reduce((sum, task) => sum + (task.estimated_minutes || 30), 0) / currentTasks.length
          : 30,
      },
      userPreferences: {
        aiTone: 'motivational',
        notificationPreferences: preferences.notifications,
        focusPreferences: preferences,
      },
    };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const userContext = getUserContext();
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
      }));

      const response = await EnhancedAIService.smartChatResponse(
        inputText.trim(),
        conversationHistory,
        userContext
      );

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions,
        followUpQuestions: response.followUpQuestions,
        actions: response.actions,
        tasks: response.tasks,
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (response.tasks && response.tasks.length > 0) {
        for (const task of response.tasks) {
          await createTask({
            title: task.title,
            description: task.description,
            priority_score: task.priority_score || 50,
            estimated_minutes: task.estimated_minutes || 30,
            tags: task.tags || [],
            due_date: task.due_date,
          });
        }
        onTaskCreated?.();
      }

      if (response.actions && response.actions.length > 0) {
        await handleActions(response.actions);
      }
    } catch (error) {
      console.error('Enhanced AI chat error:', error);
      
      // Provide a helpful error message to the user
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I\'m having trouble connecting right now, but I can still help you! Try saying something like "Create a task to write a report" or "Start a 25-minute focus session".',
        timestamp: new Date(),
        suggestions: ['Create task', 'Start focus session', 'Get help'],
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActions = async (actions: string[]) => {
    for (const action of actions) {
      if (action.includes('create_task')) {
        const taskData = extractTaskFromAction(action);
        if (taskData) {
          await createTask(taskData);
          onTaskCreated?.();
        }
      } else if (action.includes('start_focus_session')) {
        const duration = extractDurationFromAction(action);
        onStartFocusSession?.(duration);
      }
    }
  };

  // Add missing task creation handler
  const handleTaskCreation = useCallback(async (taskData: {
    title: string;
    description?: string;
    priority_score?: number;
    estimated_minutes?: number;
    tags?: string[];
  }) => {
    try {
      const newTask = await createTask({
        title: taskData.title,
        description: taskData.description,
        priority_score: taskData.priority_score || 50,
        estimated_minutes: taskData.estimated_minutes || 30,
        tags: taskData.tags || [],
        due_date: undefined,
      });

      onTaskCreated?.();

      // Add confirmation message
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Great! I've created a task: "${taskData.title}". You can start working on it now or add more tasks.`,
        timestamp: new Date(),
      }]);

      return newTask;
    } catch (error) {
      console.error('Failed to create task:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while creating your task. Please try again.',
        timestamp: new Date(),
      }]);
      throw error;
    }
  }, [createTask, onTaskCreated]);

  // Add missing focus session handler
  const handleFocusSession = useCallback(async (duration: number) => {
    try {
      const nextTask = useTaskStore.getState().getNextTask();
      
      if (nextTask) {
        useTaskStore.getState().selectTask(nextTask);
        onStartFocusSession?.(duration);
        
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Perfect! Starting a ${duration}-minute focus session for: "${nextTask.title}". Good luck!`,
          timestamp: new Date(),
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'You don\'t have any pending tasks. Let\'s create one first!',
          timestamp: new Date(),
        }]);
      }
    } catch (error) {
      console.error('Failed to start focus session:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while starting your focus session. Please try again.',
        timestamp: new Date(),
      }]);
    }
  }, [onStartFocusSession]);

  const extractTaskFromAction = (action: string) => {
    // Extract task data from action string
    const titleMatch = action.match(/create_task\s+(.+?)(?:\s+for\s+(\d+)\s*min|$)/i);
    const durationMatch = action.match(/(\d+)\s*min/i);
    const priorityMatch = action.match(/priority\s*(\d+)/i);
    
    if (titleMatch) {
      return {
        title: titleMatch[1]?.trim() || 'New Task',
        description: action.includes('description') ? action.split('description')[1]?.trim() : undefined,
        estimated_minutes: durationMatch ? parseInt(durationMatch[1]) : 30,
        priority_score: priorityMatch ? parseInt(priorityMatch[1]) : 50,
        tags: extractTagsFromAction(action),
      };
    }
    return null;
  };

  const extractDurationFromAction = (action: string): number => {
    const match = action.match(/(\d+)\s*(?:min|minute|minutes)/i);
    return match ? parseInt(match[1]) : preferences.sessionLength || 25;
  };

  const extractTagsFromAction = (action: string): string[] => {
    const tagMatches = action.match(/#(\w+)/g);
    return tagMatches ? tagMatches.map(tag => tag.slice(1)) : [];
  };

  const handleQuickAction = async (action: string) => {
    switch (action) {
      case 'Start a focus session':
      case 'Start 25-minute session':
        onStartFocusSession?.(25);
        break;
      case 'Start 50-minute session':
        onStartFocusSession?.(50);
        break;
      case 'Create a task':
        setInputText('I need to ');
        break;
      case 'Plan a project':
        setInputText('I want to plan a project to ');
        break;
      case 'Get advice':
        setInputText('Give me productivity advice about ');
        break;
      default:
        setInputText(action);
    }
  };

  const renderMessage = (message: ChatMessage) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.role === 'user' ? styles.userMessage : styles.assistantMessage,
      ]}
    >
      <View style={styles.messageContent}>
        {message.role === 'assistant' && (
          <Avatar.Icon size={28} icon="robot" style={styles.avatar} />
        )}
        <View style={[
          styles.messageBubble,
          message.role === 'user' ? styles.userBubble : styles.assistantBubble
        ]}>
          <Text variant="bodyMedium" style={styles.messageText}>
            {message.content}
          </Text>
          
          {/* Follow-up Questions - Simplified */}
          {message.followUpQuestions && message.followUpQuestions.length > 0 && (
            <View style={styles.followUpContainer}>
              {message.followUpQuestions.map((question, index) => (
                <Text key={index} variant="bodySmall" style={styles.followUpQuestion}>
                  • {question}
                </Text>
              ))}
            </View>
          )}
        </View>
        {message.role === 'user' && (
          <Avatar.Icon size={28} icon="account" style={styles.avatar} />
        )}
      </View>
      
      {/* Suggestions - Simplified */}
      {message.suggestions && message.suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {message.suggestions.map((suggestion, index) => (
            <Chip
              key={index}
              mode="outlined"
              onPress={() => handleQuickAction(suggestion)}
              style={styles.suggestionChip}
              textStyle={styles.suggestionText}
            >
              {suggestion}
            </Chip>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.headerTitle}>
          AI Assistant
        </Text>
        <IconButton
          icon="close"
          size={24}
          onPress={() => {/* Handle close if needed */}}
          iconColor={colors.text.secondary.light}
        />
      </View>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <Text variant="bodyMedium" style={styles.loadingText}>
                Thinking...
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Simple Input */}
        <View style={styles.inputContainer}>
          <TextInput
            mode="outlined"
            placeholder="Ask me anything..."
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSendMessage}
            disabled={isLoading}
            style={styles.input}
            multiline
            maxLength={500}
            right={
              <TextInput.Icon
                icon="send"
                onPress={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
              />
            }
          />
        </View>
      </KeyboardAvoidingView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface.secondary,
    backgroundColor: colors.surface.primary,
  },
  headerTitle: {
    color: colors.text.primary.light,
    fontWeight: '600',
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  assistantMessage: {
    alignItems: 'flex-start',
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    maxWidth: '85%',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    maxWidth: '100%',
  },
  userBubble: {
    backgroundColor: colors.primary[600],
    marginLeft: 8,
  },
  assistantBubble: {
    backgroundColor: colors.surface.secondary,
    marginRight: 8,
  },
  messageText: {
    color: colors.text.primary.light,
    lineHeight: 20,
  },
  avatar: {
    marginHorizontal: 4,
  },
  followUpContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.surface.primary,
  },
  followUpQuestion: {
    color: colors.text.secondary.light,
    marginBottom: 2,
    fontSize: 12,
  },
  suggestionsContainer: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  suggestionChip: {
    marginBottom: 4,
    backgroundColor: colors.surface.primary,
    borderColor: colors.primary[300],
  },
  suggestionText: {
    fontSize: 11,
    color: colors.primary[600],
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    color: colors.text.secondary.light,
    fontStyle: 'italic',
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.surface.secondary,
    backgroundColor: colors.surface.primary,
  },
  input: {
    backgroundColor: colors.background.light,
  },
}); 