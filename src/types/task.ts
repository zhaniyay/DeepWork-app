export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  priority_score: number;
  estimated_minutes?: number;
  due_date?: string;
  tags: string[];
  status: TaskStatusType;
  manual_priority: number;
  created_at: string;
  updated_at: string;
}

export const TaskStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  DEFERRED: 'deferred',
} as const;

export type TaskStatusType = typeof TaskStatus[keyof typeof TaskStatus];

export interface TaskFeedback {
  id: string;
  user_id: string;
  task_id: string;
  session_id?: string;
  difficulty_rating: number; // 1-10
  satisfaction_rating: number; // 1-10
  notes?: string;
  created_at: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  estimated_minutes?: number;
  due_date?: string;
  tags?: string[];
  manual_priority?: number;
  priority_score?: number;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  status?: TaskStatusType;
}

export interface TaskFilters {
  status?: TaskStatusType;
  tags?: string[];
  due_date_from?: string;
  due_date_to?: string;
  priority_min?: number;
  priority_max?: number;
}

export interface TaskStats {
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  average_priority: number;
  total_estimated_time: number;
} 