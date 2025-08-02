import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { QuickAddTask } from '@/components/QuickAddTask';
import { TaskList } from '@/components/TaskList';
import { FocusSession } from '@/components/FocusSession';
import { AIChatInterface } from '@/components/AIChatInterface';
import { ProgressDashboard } from '@/components/ProgressDashboard';
import { useTaskStore } from '@/stores/taskStore';
import { useProgressStore } from '@/stores/progressStore';
import { TaskStatus } from '@/types/task';

// Mock the stores
jest.mock('@/stores/taskStore');
jest.mock('@/stores/progressStore');

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider>
    {children}
  </PaperProvider>
);

describe('Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('QuickAddTask Component', () => {
    test('should render quick add task input', () => {
      const mockOnTaskAdded = jest.fn();
      
      const { getByPlaceholderText, getByText } = render(
        <TestWrapper>
          <QuickAddTask onTaskAdded={mockOnTaskAdded} />
        </TestWrapper>
      );

      expect(getByPlaceholderText('Add a quick task...')).toBeTruthy();
      expect(getByText('Add')).toBeTruthy();
    });

    test('should handle task input and submission', async () => {
      const mockOnTaskAdded = jest.fn();
      const mockCreateTask = jest.fn();
      
      (useTaskStore as jest.Mock).mockReturnValue({
        createTask: mockCreateTask,
        isLoading: false,
      });

      const { getByPlaceholderText, getByText } = render(
        <TestWrapper>
          <QuickAddTask onTaskAdded={mockOnTaskAdded} />
        </TestWrapper>
      );

      const input = getByPlaceholderText('Add a quick task...');
      const addButton = getByText('Add');

      fireEvent.changeText(input, 'Test task');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(mockCreateTask).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Test task',
          })
        );
      });
    });
  });

  describe('TaskList Component', () => {
    test('should render task list with tasks', () => {
      const mockTasks = [
        {
          id: '1',
          title: 'Task 1',
          description: 'Description 1',
          status: TaskStatus.PENDING,
          priority_score: 75,
          estimated_minutes: 30,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: 'user-1',
          tags: [],
          manual_priority: 0,
        },
        {
          id: '2',
          title: 'Task 2',
          description: 'Description 2',
          status: TaskStatus.COMPLETED,
          priority_score: 60,
          estimated_minutes: 45,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: 'user-1',
          tags: [],
          manual_priority: 0,
        },
      ];

      (useTaskStore as jest.Mock).mockReturnValue({
        tasks: mockTasks,
        isLoading: false,
      });

      const mockOnTaskSelect = jest.fn();

      const { getByText } = render(
        <TestWrapper>
          <TaskList onTaskSelect={mockOnTaskSelect} />
        </TestWrapper>
      );

      expect(getByText('Task 1')).toBeTruthy();
      expect(getByText('Task 2')).toBeTruthy();
    });

    test('should handle task selection', () => {
      const mockTasks = [
        {
          id: '1',
          title: 'Task 1',
          description: 'Description 1',
          status: TaskStatus.PENDING,
          priority_score: 75,
          estimated_minutes: 30,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: 'user-1',
          tags: [],
          manual_priority: 0,
        },
      ];

      (useTaskStore as jest.Mock).mockReturnValue({
        tasks: mockTasks,
        isLoading: false,
      });

      const mockOnTaskSelect = jest.fn();

      const { getByText } = render(
        <TestWrapper>
          <TaskList onTaskSelect={mockOnTaskSelect} />
        </TestWrapper>
      );

      const taskElement = getByText('Task 1');
      fireEvent.press(taskElement);

      expect(mockOnTaskSelect).toHaveBeenCalledWith(mockTasks[0]);
    });

    test('should show empty state when no tasks', () => {
      (useTaskStore as jest.Mock).mockReturnValue({
        tasks: [],
        isLoading: false,
      });

      const mockOnTaskSelect = jest.fn();

      const { getByText } = render(
        <TestWrapper>
          <TaskList onTaskSelect={mockOnTaskSelect} />
        </TestWrapper>
      );

      expect(getByText('No tasks yet')).toBeTruthy();
    });
  });

  describe('FocusSession Component', () => {
    test('should render focus session with timer', () => {
      const mockTask = {
        id: '1',
        title: 'Focus Task',
        description: 'Task description',
        status: TaskStatus.PENDING,
        priority_score: 85,
        estimated_minutes: 25,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'user-1',
        tags: [],
        manual_priority: 0,
      };

      const mockOnSessionComplete = jest.fn();
      const mockOnSessionPause = jest.fn();

      const { getByText } = render(
        <TestWrapper>
          <FocusSession
            task={mockTask}
            duration={25}
            onSessionComplete={mockOnSessionComplete}
            onSessionPause={mockOnSessionPause}
          />
        </TestWrapper>
      );

      expect(getByText('Focus Task')).toBeTruthy();
      expect(getByText('25:00')).toBeTruthy(); // Initial timer display
    });

    test('should handle session pause and resume', () => {
      const mockTask = {
        id: '1',
        title: 'Focus Task',
        description: 'Task description',
        status: TaskStatus.PENDING,
        priority_score: 85,
        estimated_minutes: 25,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'user-1',
        tags: [],
        manual_priority: 0,
      };

      const mockOnSessionComplete = jest.fn();
      const mockOnSessionPause = jest.fn();

      const { getByText } = render(
        <TestWrapper>
          <FocusSession
            task={mockTask}
            duration={25}
            onSessionComplete={mockOnSessionComplete}
            onSessionPause={mockOnSessionPause}
          />
        </TestWrapper>
      );

      const pauseButton = getByText('Pause');
      fireEvent.press(pauseButton);

      expect(mockOnSessionPause).toHaveBeenCalled();
    });
  });

  describe('AIChatInterface Component', () => {
    test('should render chat interface', () => {
      const mockOnTaskCreated = jest.fn();
      const mockOnClose = jest.fn();

      const { getByPlaceholderText, getByText } = render(
        <TestWrapper>
          <AIChatInterface
            onTaskCreated={mockOnTaskCreated}
            onClose={mockOnClose}
          />
        </TestWrapper>
      );

      expect(getByPlaceholderText('Ask me anything...')).toBeTruthy();
      expect(getByText('Send')).toBeTruthy();
    });

    test('should handle message input and sending', async () => {
      const mockOnTaskCreated = jest.fn();
      const mockOnClose = jest.fn();

      const { getByPlaceholderText, getByText } = render(
        <TestWrapper>
          <AIChatInterface
            onTaskCreated={mockOnTaskCreated}
            onClose={mockOnClose}
          />
        </TestWrapper>
      );

      const input = getByPlaceholderText('Ask me anything...');
      const sendButton = getByText('Send');

      fireEvent.changeText(input, 'Create a task to finish the project');
      fireEvent.press(sendButton);

      await waitFor(() => {
        expect(input.props.value).toBe('Create a task to finish the project');
      });
    });
  });

  describe('ProgressDashboard Component', () => {
    test('should render progress dashboard with stats', () => {
      const mockStats = {
        totalSessions: 10,
        totalFocusTime: 250,
        averageSessionLength: 25,
        completionRate: 80,
        currentStreak: 5,
        longestStreak: 7,
        productivityScore: 85,
        weeklyFocusTime: [30, 45, 60, 25, 40, 35, 50],
        monthlyFocusTime: new Array(30).fill(20),
      };

      (useProgressStore as jest.Mock).mockReturnValue({
        stats: mockStats,
        isLoading: false,
      });

      const mockOnViewSessions = jest.fn();
      const mockOnViewAnalytics = jest.fn();

      const { getByText } = render(
        <TestWrapper>
          <ProgressDashboard
            onViewSessions={mockOnViewSessions}
            onViewAnalytics={mockOnViewAnalytics}
          />
        </TestWrapper>
      );

      expect(getByText('10')).toBeTruthy(); // Total sessions
      expect(getByText('250 min')).toBeTruthy(); // Total focus time
      expect(getByText('80%')).toBeTruthy(); // Completion rate
      expect(getByText('5 days')).toBeTruthy(); // Current streak
    });

    test('should handle analytics navigation', () => {
      const mockStats = {
        totalSessions: 0,
        totalFocusTime: 0,
        averageSessionLength: 0,
        completionRate: 0,
        currentStreak: 0,
        longestStreak: 0,
        productivityScore: 0,
        weeklyFocusTime: new Array(7).fill(0),
        monthlyFocusTime: new Array(30).fill(0),
      };

      (useProgressStore as jest.Mock).mockReturnValue({
        stats: mockStats,
        isLoading: false,
      });

      const mockOnViewSessions = jest.fn();
      const mockOnViewAnalytics = jest.fn();

      const { getByText } = render(
        <TestWrapper>
          <ProgressDashboard
            onViewSessions={mockOnViewSessions}
            onViewAnalytics={mockOnViewAnalytics}
          />
        </TestWrapper>
      );

      const analyticsButton = getByText('View Analytics');
      fireEvent.press(analyticsButton);

      expect(mockOnViewAnalytics).toHaveBeenCalled();
    });
  });
}); 