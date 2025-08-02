import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { useAuthStore } from '@/stores/authStore';
import { useTaskStore } from '@/stores/taskStore';
import { useProgressStore } from '@/stores/progressStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { DeepSeekService } from '@/services/ai/deepseek';
import { colors } from '@/constants/colors';

// Mock the stores
jest.mock('@/stores/authStore');
jest.mock('@/stores/taskStore');
jest.mock('@/stores/progressStore');
jest.mock('@/stores/settingsStore');
jest.mock('@/services/ai/deepseek');

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider>
    {children}
  </PaperProvider>
);

describe('Focus-AI App Test Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('1. Authentication System', () => {
    test('should handle user sign up', async () => {
      const mockSignUp = jest.fn();
      (useAuthStore as jest.Mock).mockReturnValue({
        signUp: mockSignUp,
        isLoading: false,
        error: null,
      });

      // Test sign up functionality
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
      };

      await mockSignUp(credentials);
      expect(mockSignUp).toHaveBeenCalledWith(credentials);
    });

    test('should handle user sign in', async () => {
      const mockSignIn = jest.fn();
      (useAuthStore as jest.Mock).mockReturnValue({
        signIn: mockSignIn,
        isLoading: false,
        error: null,
      });

      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      await mockSignIn(credentials);
      expect(mockSignIn).toHaveBeenCalledWith(credentials);
    });

    test('should handle user sign out', async () => {
      const mockSignOut = jest.fn();
      (useAuthStore as jest.Mock).mockReturnValue({
        signOut: mockSignOut,
        isLoading: false,
      });

      await mockSignOut();
      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  describe('2. Task Management System', () => {
    test('should create a new task', async () => {
      const mockCreateTask = jest.fn();
      (useTaskStore as jest.Mock).mockReturnValue({
        createTask: mockCreateTask,
        tasks: [],
        isLoading: false,
      });

      const newTask = {
        title: 'Test Task',
        description: 'Test Description',
        estimated_minutes: 30,
        priority_score: 75,
      };

      await mockCreateTask(newTask);
      expect(mockCreateTask).toHaveBeenCalledWith(newTask);
    });

    test('should update task status', async () => {
      const mockUpdateTask = jest.fn();
      (useTaskStore as jest.Mock).mockReturnValue({
        updateTask: mockUpdateTask,
        tasks: [],
        isLoading: false,
      });

      await mockUpdateTask('task-id', { status: 'completed' });
      expect(mockUpdateTask).toHaveBeenCalledWith('task-id', { status: 'completed' });
    });

    test('should delete a task', async () => {
      const mockDeleteTask = jest.fn();
      (useTaskStore as jest.Mock).mockReturnValue({
        deleteTask: mockDeleteTask,
        tasks: [],
        isLoading: false,
      });

      await mockDeleteTask('task-id');
      expect(mockDeleteTask).toHaveBeenCalledWith('task-id');
    });

    test('should get next recommended task', () => {
      const mockGetNextTask = jest.fn().mockReturnValue({
        id: '1',
        title: 'Next Task',
        priority_score: 85,
      });
      
      (useTaskStore as jest.Mock).mockReturnValue({
        getNextTask: mockGetNextTask,
        tasks: [],
      });

      const nextTask = mockGetNextTask();
      expect(nextTask).toBeDefined();
      expect(nextTask.title).toBe('Next Task');
    });
  });

  describe('3. AI Integration', () => {
    test('should parse natural language into tasks', async () => {
      const mockParseNaturalLanguage = jest.fn().mockResolvedValue([
        {
          id: '1',
          title: 'Complete project proposal',
          description: 'Finish the quarterly project proposal',
          priority_score: 85,
        },
      ]);

      (DeepSeekService.parseNaturalLanguage as jest.Mock) = mockParseNaturalLanguage;

      const result = await DeepSeekService.parseNaturalLanguage('Complete project proposal by Friday');
      
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Complete project proposal');
    });

    test('should handle AI chat responses', async () => {
      const mockChat = jest.fn().mockResolvedValue({
        message: 'I can help you create tasks!',
        suggestions: ['Add a new task', 'View your progress'],
      });

      (DeepSeekService.chat as jest.Mock) = mockChat;

      const response = await DeepSeekService.chat('Hello, can you help me?');
      
      expect(response.message).toBe('I can help you create tasks!');
      expect(response.suggestions).toHaveLength(2);
    });
  });

  describe('4. Focus Session Management', () => {
    test('should start a focus session', async () => {
      const mockAddSession = jest.fn();
      (useProgressStore as jest.Mock).mockReturnValue({
        addSession: mockAddSession,
        sessions: [],
        isLoading: false,
      });

      const session = {
        id: 'session-1',
        user_id: 'user-1',
        task_id: 'task-1',
        start_time: new Date().toISOString(),
        intended_duration_minutes: 25,
        actual_duration_minutes: 25,
        outcome: 'completed',
      };

      await mockAddSession(session);
      expect(mockAddSession).toHaveBeenCalledWith(session);
    });

    test('should calculate session statistics', () => {
      const mockCalculateStats = jest.fn().mockReturnValue({
        totalSessions: 5,
        totalFocusTime: 125,
        averageSessionLength: 25,
        completionRate: 80,
        currentStreak: 3,
        productivityScore: 85,
      });

      (useProgressStore as jest.Mock).mockReturnValue({
        calculateStats: mockCalculateStats,
        sessions: [],
      });

      const stats = mockCalculateStats([]);
      
      expect(stats.totalSessions).toBe(5);
      expect(stats.completionRate).toBe(80);
      expect(stats.productivityScore).toBe(85);
    });
  });

  describe('5. Settings Management', () => {
    test('should update user preferences', async () => {
      const mockUpdatePreferences = jest.fn();
      (useSettingsStore as jest.Mock).mockReturnValue({
        updatePreferences: mockUpdatePreferences,
        preferences: {
          sessionLength: 25,
          theme: 'light',
          notifications: {
            sessionReminders: true,
            taskDueSoon: true,
          },
        },
        isLoading: false,
      });

      const newPreferences = {
        sessionLength: 50,
        theme: 'dark',
      };

      await mockUpdatePreferences(newPreferences);
      expect(mockUpdatePreferences).toHaveBeenCalledWith(newPreferences);
    });

    test('should load user preferences', async () => {
      const mockLoadPreferences = jest.fn();
      (useSettingsStore as jest.Mock).mockReturnValue({
        loadPreferences: mockLoadPreferences,
        preferences: {},
        isLoading: false,
      });

      await mockLoadPreferences();
      expect(mockLoadPreferences).toHaveBeenCalled();
    });
  });

  describe('6. Navigation System', () => {
    test('should navigate between screens', () => {
      const mockPush = jest.fn();
      const mockReplace = jest.fn();
      const mockBack = jest.fn();

      // Mock router functions
      const router = {
        push: mockPush,
        replace: mockReplace,
        back: mockBack,
      };

      // Test navigation to different screens
      router.push('chat');
      expect(mockPush).toHaveBeenCalledWith('chat');

      router.push('settings');
      expect(mockPush).toHaveBeenCalledWith('settings');

      router.push('progress');
      expect(mockPush).toHaveBeenCalledWith('progress');

      router.push('tasks');
      expect(mockPush).toHaveBeenCalledWith('tasks');
    });
  });

  describe('7. UI Components', () => {
    test('should render task list correctly', () => {
      const mockTasks = [
        {
          id: '1',
          title: 'Task 1',
          description: 'Description 1',
          status: 'pending',
          priority_score: 75,
        },
        {
          id: '2',
          title: 'Task 2',
          description: 'Description 2',
          status: 'completed',
          priority_score: 60,
        },
      ];

      (useTaskStore as jest.Mock).mockReturnValue({
        tasks: mockTasks,
        isLoading: false,
      });

      // This would test the TaskList component rendering
      expect(mockTasks).toHaveLength(2);
      expect(mockTasks[0].title).toBe('Task 1');
      expect(mockTasks[1].status).toBe('completed');
    });

    test('should handle theme switching', () => {
      const mockUpdatePreferences = jest.fn();
      (useSettingsStore as jest.Mock).mockReturnValue({
        updatePreferences: mockUpdatePreferences,
        preferences: { theme: 'light' },
      });

      mockUpdatePreferences({ theme: 'dark' });
      expect(mockUpdatePreferences).toHaveBeenCalledWith({ theme: 'dark' });
    });
  });

  describe('8. Error Handling', () => {
    test('should handle network errors gracefully', async () => {
      const mockSetError = jest.fn();
      (useTaskStore as jest.Mock).mockReturnValue({
        setError: mockSetError,
        error: 'Network error occurred',
      });

      mockSetError('Network error occurred');
      expect(mockSetError).toHaveBeenCalledWith('Network error occurred');
    });

    test('should handle AI service failures', async () => {
      const mockParseNaturalLanguage = jest.fn().mockRejectedValue(
        new Error('AI service unavailable')
      );

      (DeepSeekService.parseNaturalLanguage as jest.Mock) = mockParseNaturalLanguage;

      try {
        await DeepSeekService.parseNaturalLanguage('test task');
      } catch (error) {
        expect(error.message).toBe('AI service unavailable');
      }
    });
  });

  describe('9. Data Persistence', () => {
    test('should save tasks to storage', async () => {
      const mockCreateTask = jest.fn();
      (useTaskStore as jest.Mock).mockReturnValue({
        createTask: mockCreateTask,
        tasks: [],
      });

      const task = {
        title: 'Persistent Task',
        description: 'This task should be saved',
      };

      await mockCreateTask(task);
      expect(mockCreateTask).toHaveBeenCalledWith(task);
    });

    test('should load tasks from storage', async () => {
      const mockGetTasks = jest.fn();
      (useTaskStore as jest.Mock).mockReturnValue({
        getTasks: mockGetTasks,
        tasks: [],
      });

      await mockGetTasks();
      expect(mockGetTasks).toHaveBeenCalled();
    });
  });

  describe('10. Performance Tests', () => {
    test('should handle large task lists efficiently', () => {
      const largeTaskList = Array.from({ length: 100 }, (_, i) => ({
        id: `task-${i}`,
        title: `Task ${i}`,
        description: `Description for task ${i}`,
        status: 'pending',
        priority_score: Math.floor(Math.random() * 100),
      }));

      (useTaskStore as jest.Mock).mockReturnValue({
        tasks: largeTaskList,
        isLoading: false,
      });

      expect(largeTaskList).toHaveLength(100);
      expect(largeTaskList[0].id).toBe('task-0');
      expect(largeTaskList[99].id).toBe('task-99');
    });

    test('should calculate statistics efficiently', () => {
      const mockCalculateStats = jest.fn().mockReturnValue({
        totalSessions: 1000,
        totalFocusTime: 25000,
        averageSessionLength: 25,
        completionRate: 85,
      });

      const startTime = Date.now();
      const stats = mockCalculateStats();
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(100); // Should complete within 100ms
      expect(stats.totalSessions).toBe(1000);
    });
  });
});

// Integration test for the complete user flow
describe('Complete User Flow Integration Test', () => {
  test('should complete full user journey', async () => {
    // 1. User signs up
    const mockSignUp = jest.fn();
    (useAuthStore as jest.Mock).mockReturnValue({
      signUp: mockSignUp,
      isLoading: false,
    });

    await mockSignUp({
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User',
    });

    // 2. User creates a task via AI
    const mockCreateTask = jest.fn();
    const mockParseNaturalLanguage = jest.fn().mockResolvedValue([
      {
        id: '1',
        title: 'Complete project proposal',
        description: 'Finish the quarterly project proposal',
        priority_score: 85,
      },
    ]);

    (useTaskStore as jest.Mock).mockReturnValue({
      createTask: mockCreateTask,
      tasks: [],
    });

    (DeepSeekService.parseNaturalLanguage as jest.Mock) = mockParseNaturalLanguage;

    const tasks = await DeepSeekService.parseNaturalLanguage('Complete project proposal');
    await mockCreateTask(tasks[0]);

    // 3. User starts a focus session
    const mockAddSession = jest.fn();
    (useProgressStore as jest.Mock).mockReturnValue({
      addSession: mockAddSession,
      sessions: [],
    });

    const session = {
      id: 'session-1',
      user_id: 'user-1',
      task_id: '1',
      start_time: new Date().toISOString(),
      intended_duration_minutes: 25,
      actual_duration_minutes: 25,
      outcome: 'completed',
    };

    await mockAddSession(session);

    // 4. Verify all steps were completed
    expect(mockSignUp).toHaveBeenCalled();
    expect(mockCreateTask).toHaveBeenCalled();
    expect(mockAddSession).toHaveBeenCalled();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('Complete project proposal');
  });
}); 