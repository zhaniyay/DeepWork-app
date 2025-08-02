export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          hashed_password: string
          full_name: string | null
          avatar_url: string | null
          preferences: Json
          created_at: string
          updated_at: string
          last_active_at: string
        }
        Insert: {
          id?: string
          email: string
          hashed_password: string
          full_name?: string | null
          avatar_url?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
          last_active_at?: string
        }
        Update: {
          id?: string
          email?: string
          hashed_password?: string
          full_name?: string | null
          avatar_url?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
          last_active_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          priority_score: number
          estimated_minutes: number | null
          due_date: string | null
          tags: string[]
          status: string
          manual_priority: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          priority_score?: number
          estimated_minutes?: number | null
          due_date?: string | null
          tags?: string[]
          status?: string
          manual_priority?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          priority_score?: number
          estimated_minutes?: number | null
          due_date?: string | null
          tags?: string[]
          status?: string
          manual_priority?: number
          created_at?: string
          updated_at?: string
        }
      }
      focus_sessions: {
        Row: {
          id: string
          user_id: string
          task_id: string
          start_time: string
          end_time: string | null
          intended_duration_minutes: number
          actual_duration_minutes: number | null
          interruptions_count: number
          outcome: string
          subjective_difficulty: number | null
          distraction_notes: string | null
          productivity_score: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_id: string
          start_time: string
          end_time?: string | null
          intended_duration_minutes: number
          actual_duration_minutes?: number | null
          interruptions_count?: number
          outcome?: string
          subjective_difficulty?: number | null
          distraction_notes?: string | null
          productivity_score?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string
          start_time?: string
          end_time?: string | null
          intended_duration_minutes?: number
          actual_duration_minutes?: number | null
          interruptions_count?: number
          outcome?: string
          subjective_difficulty?: number | null
          distraction_notes?: string | null
          productivity_score?: number | null
          created_at?: string
        }
      }
      ai_recommendations: {
        Row: {
          id: string
          user_id: string
          task_id: string | null
          recommendation_type: string
          content: Json
          score: number | null
          feedback: string
          generated_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          task_id?: string | null
          recommendation_type: string
          content: Json
          score?: number | null
          feedback?: string
          generated_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string | null
          recommendation_type?: string
          content?: Json
          score?: number | null
          feedback?: string
          generated_at?: string
          expires_at?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          data: Json
          scheduled_for: string
          delivered_at: string | null
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          data?: Json
          scheduled_for?: string
          delivered_at?: string | null
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          data?: Json
          scheduled_for?: string
          delivered_at?: string | null
          read_at?: string | null
          created_at?: string
        }
      }
      task_feedback: {
        Row: {
          id: string
          user_id: string
          task_id: string
          session_id: string | null
          difficulty_rating: number | null
          satisfaction_rating: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_id: string
          session_id?: string | null
          difficulty_rating?: number | null
          satisfaction_rating?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string
          session_id?: string | null
          difficulty_rating?: number | null
          satisfaction_rating?: number | null
          notes?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      user_daily_stats: {
        Row: {
          user_id: string | null
          date: string | null
          sessions_count: number | null
          total_focus_minutes: number | null
          avg_productivity: number | null
          completed_sessions: number | null
          partial_sessions: number | null
        }
      }
      task_completion_stats: {
        Row: {
          task_id: string | null
          user_id: string | null
          title: string | null
          sessions_count: number | null
          avg_productivity: number | null
          avg_difficulty: number | null
          total_time_spent: number | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 