import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Card, Avatar, Chip, IconButton } from 'react-native-paper';
import { DeepSeekService } from '@/services/ai/deepseek';
import { useTaskStore } from '@/stores/taskStore';
import { colors } from '@/constants/colors';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIChatInterfaceProps {
  onTaskCreated?: () => void;
  onClose?: () => void;
}

export const AIChatInterface: React.FC<AIChatInterfaceProps> = ({
  onTaskCreated,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your productivity assistant. I can help you create tasks, break down complex projects, and suggest the best way to tackle your workload. What would you like to work on?',
      timestamp: new Date(),
      suggestions: [
        'Add a new task',
        'Break down a project',
        'Prioritize my tasks',
        'Suggest next steps',
      ],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const { createTask, tasks } = useTaskStore();

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

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
      // Check if the message contains task-related keywords
      const taskKeywords = ['task', 'todo', 'do', 'finish', 'complete', 'work on', 'create'];
      const isTaskRequest = taskKeywords.some(keyword => 
        inputText.toLowerCase().includes(keyword)
      );

      if (isTaskRequest) {
        // Parse as task
        const parsedTasks = await DeepSeekService.parseNaturalLanguage(inputText.trim());
        
        if (parsedTasks.length > 0) {
          // Create the first task
          await createTask({
            title: parsedTasks[0].title,
            description: parsedTasks[0].description,
            estimated_minutes: parsedTasks[0].estimated_minutes,
            priority_score: parsedTasks[0].priority_score,
            tags: parsedTasks[0].tags,
          });

          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `Great! I've created a task: "${parsedTasks[0].title}". I've estimated it will take ${parsedTasks[0].estimated_minutes} minutes and set the priority to ${parsedTasks[0].priority_score}/100. Would you like me to suggest the best time to work on it?`,
            timestamp: new Date(),
            suggestions: [
              'Start focus session now',
              'Add more details',
              'Create another task',
              'View all tasks',
            ],
          };

          setMessages(prev => [...prev, assistantMessage]);
          onTaskCreated?.();
        }
      } else {
        // General chat
        const chatMessages = messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        }));

        const response = await DeepSeekService.chatWithAI([
          ...chatMessages,
          { role: 'user', content: inputText.trim() },
        ]);

        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.suggestions?.[0] || 'I\'m here to help! What would you like to work on?',
          timestamp: new Date(),
          suggestions: [
            'Add a new task',
            'View my tasks',
            'Start a focus session',
            'Get productivity tips',
          ],
        };

        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('AI chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble processing your request right now. Please try again or add your task manually.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setInputText(suggestion);
  };

  const handleQuickAction = async (action: string) => {
    switch (action) {
      case 'Start focus session now':
        // TODO: Navigate to focus session
        break;
      case 'View all tasks':
        // TODO: Navigate to task list
        break;
      case 'Add a new task':
        setInputText('I need to ');
        break;
      case 'Get productivity tips':
        setInputText('Give me some productivity tips');
        break;
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
          <Avatar.Icon size={32} icon="robot" style={styles.avatar} />
        )}
        <Card style={styles.messageCard}>
          <Card.Content>
            <Text variant="bodyMedium" style={styles.messageText}>
              {message.content}
            </Text>
            {message.suggestions && (
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
          </Card.Content>
        </Card>
        {message.role === 'user' && (
          <Avatar.Icon size={32} icon="account" style={styles.avatar} />
        )}
      </View>
      <Text variant="bodySmall" style={styles.timestamp}>
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium" style={styles.headerTitle}>
          AI Assistant
        </Text>
        {onClose && (
          <IconButton icon="close" onPress={onClose} />
        )}
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

        <View style={styles.inputContainer}>
          <TextInput
            mode="outlined"
            placeholder="Type your message..."
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
    </View>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface.secondary,
  },
  headerTitle: {
    color: colors.text.primary.light,
    fontWeight: 'bold',
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
    maxWidth: '80%',
  },
  messageCard: {
    flex: 1,
    backgroundColor: colors.surface.primary,
  },
  messageText: {
    color: colors.text.primary.light,
    lineHeight: 20,
  },
  suggestionsContainer: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    marginBottom: 4,
    backgroundColor: colors.surface.secondary,
  },
  suggestionText: {
    fontSize: 12,
  },
  avatar: {
    marginHorizontal: 8,
  },
  timestamp: {
    color: colors.text.secondary.light,
    marginTop: 4,
    textAlign: 'center',
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
  },
  input: {
    backgroundColor: colors.surface.primary,
  },
}); 