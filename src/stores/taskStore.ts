import { create } from 'zustand';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskStatus } from '@/types/task';
import { OpenAIService } from '@/services/ai/openai';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  selectedTask: Task | null;
}

interface TaskActions {
  // CRUD Operations
  createTask: (task: CreateTaskRequest) => Promise<void>;
  updateTask: (id: string, updates: UpdateTaskRequest) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getTasks: () => Promise<void>;
  
  // Task Management
  selectTask: (task: Task | null) => void;
  markTaskComplete: (id: string) => Promise<void>;
  markTaskInProgress: (id: string) => Promise<void>;
  markTaskDeferred: (id: string) => Promise<void>;
  markTaskPaused: (id: string) => Promise<void>;
  
  // AI Integration
  parseNaturalLanguage: (text: string) => Promise<Task[]>;
  getNextTask: () => Task | null;
  
  // State Management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useTaskStore = create<TaskState & TaskActions>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  selectedTask: null,

  // CRUD Operations
  createTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement API call to Supabase
      const newTask: Task = {
        id: Date.now().toString(), // Temporary ID generation
        user_id: 'temp-user-id', // TODO: Get from auth store
        title: taskData.title,
        description: taskData.description || '',
        priority_score: taskData.priority_score || 0,
        estimated_minutes: taskData.estimated_minutes || 30,
        due_date: taskData.due_date || undefined,
        tags: taskData.tags || [],
        status: TaskStatus.PENDING,
        manual_priority: taskData.manual_priority || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      set((state) => ({
        tasks: [...state.tasks, newTask],
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create task',
        isLoading: false 
      });
    }
  },

  updateTask: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement API call to Supabase
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id
            ? { ...task, ...updates, updated_at: new Date().toISOString() }
            : task
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update task',
        isLoading: false 
      });
    }
  },

  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement API call to Supabase
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete task',
        isLoading: false 
      });
    }
  },

  getTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement API call to Supabase
      // For now, keep existing tasks in memory instead of clearing them
      // This prevents tasks created via AI chat from disappearing
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch tasks',
        isLoading: false 
      });
    }
  },

  // Task Management
  selectTask: (task) => {
    set({ selectedTask: task });
  },

  markTaskComplete: async (id) => {
    await get().updateTask(id, { status: TaskStatus.COMPLETED });
  },

  markTaskInProgress: async (id) => {
    await get().updateTask(id, { status: TaskStatus.IN_PROGRESS });
  },

  markTaskDeferred: async (id) => {
    await get().updateTask(id, { status: TaskStatus.DEFERRED });
  },

  markTaskPaused: async (id) => {
    await get().updateTask(id, { status: TaskStatus.PAUSED });
  },

  // AI Integration
  parseNaturalLanguage: async (text) => {
    try {
      return await OpenAIService.parseNaturalLanguage(text);
    } catch (error) {
      console.error('AI parsing failed:', error);
      // Fallback: create a simple task from the text
      const task: Task = {
        id: Date.now().toString(),
        user_id: 'temp-user-id',
        title: text,
        description: '',
        priority_score: 50,
        estimated_minutes: 30,
        due_date: undefined,
        tags: [],
        status: TaskStatus.PENDING,
        manual_priority: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      return [task];
    }
  },

  getNextTask: () => {
    const { tasks } = get();
    const pendingTasks = tasks.filter((task) => task.status === TaskStatus.PENDING);
    
    if (pendingTasks.length === 0) return null;
    
    // Sort by priority score (highest first)
    return pendingTasks.sort((a, b) => b.priority_score - a.priority_score)[0];
  },

  // State Management
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
})); 