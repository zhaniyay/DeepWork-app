# Focus-One-Task: Productivity App Specification

**Version:** 1.0  
**Date:** August 2, 2025  
**Author:** Product Team  

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [High-Level Overview](#2-high-level-overview)
3. [User Personas](#3-user-personas)
4. [User Flow](#4-user-flow)
5. [Features](#5-features)
6. [Data Models](#6-data-models)
7. [AI Task Prioritization](#7-ai-task-prioritization)
8. [API Endpoints](#8-api-endpoints)
9. [UI Component Breakdown](#9-ui-component-breakdown)
10. [State Management](#10-state-management)
11. [Edge Cases & Error Handling](#11-edge-cases--error-handling)
12. [Security & Privacy](#12-security--privacy)
13. [Metrics to Observe](#13-metrics-to-observe)
14. [Implementation Notes](#14-implementation-notes)
15. [Sample Session Lifecycle](#15-sample-session-lifecycle)

---

## 1. Purpose

This document describes the user flow, feature set, data models, and implementation guidance for a productivity application that helps users focus on one task at a time. The goal is to make it easy for a developer (frontend and backend) to understand the requirements and build the system with minimal ambiguity.

---

## 2. High-Level Overview

The app is centered around a single-task focus philosophy. Users are guided from a clean welcome/signup experience to an AI-prioritized dashboard, can add and refine tasks via quick-add or natural-language chat, and then enter a Focus Mode session that minimizes distractions. Post-session, progress is visualized, and the user can iterate.

### Key Pillars

- **AI Task Prioritization:** Automatically ranks tasks based on urgency, estimated effort, and user behavior
- **Single-Task Focus Mode:** Blocks interruptions, runs a timed session, and encourages disciplined work
- **Interactive Task Entry:** Quick-add + AI chat to capture and refine tasks naturally
- **Progress Feedback:** Immediate, digestible metrics after each session to reinforce momentum

---

## 3. User Personas

### The Overloaded Student
- Has many to-dos, wants to know which one to do next and get into a focused session quickly
- Values quick task entry and clear prioritization

### The Knowledge Worker
- Needs distraction-free timed sessions with smart task ordering and reflection
- Appreciates detailed analytics and progress tracking

### The Habit Builder
- Wants to build streaks, see progress, and trust the AI to guide daily priorities
- Focuses on consistency and long-term habit formation

---

## 4. User Flow

### 4.1 Launch / Welcome Screen
- Clean branding and value proposition
- Primary CTA: Sign up / Log in
- Secondary: Learn how it works (optional micro-tour)

### 4.2 Sign Up / Authentication
- Email/password or OAuth (optional for MVP)
- Optional onboarding questions (e.g., typical work session length, priority types)

### 4.3 Main Dashboard
- List of tasks sorted by AI priority
- Summary widget: Today's focus session status, streaks, quick metrics
- Quick-add input (natural language or structured)
- Chat with AI interface for task creation/refinement and strategy

### 4.4 Task Creation / Refinement
- **Via quick-add:** minimal fields (title, optional due/estimate tags)
- **Via AI chat:** user describes what they want done, AI parses into task(s), asks clarifying follow-ups if needed

### 4.5 Prepare to Focus
- User selects one task (or AI recommends best next task)
- Tweak session parameters (duration, goal statement, distraction note)

### 4.6 Enter Focus Mode
- Notifications suppressed (with whitelist exceptions if configured)
- Timer starts (e.g., Pomodoro-style or custom length)
- UI shows the single active task, time remaining, and an optional short encouragement

### 4.7 Session Completion
- Prompt user to mark task progress: complete / partial / reschedule
- Show session summary: time spent, interruptions (if tracked), productivity score
- Offer next suggested session or break

### 4.8 Progress Dashboard / History
- Aggregated metrics, streaks, deep work time, task completion rate
- Feedback loop to the AI for priority adjustment (e.g., user upvotes AI suggestion, marks a task as harder than estimated)

---

## 5. Features

### 5.1 Authentication & Onboarding
- Email/password signup, login, password reset
- Optional social OAuth (Google, Apple) for convenience
- Onboarding: ask session length preferences, preferred focus rhythms, allow importing existing tasks (future)

### 5.2 Dashboard
- **AI-prioritized task list:** Sorted by priority score (see section 7)
- **Quick-add bar:** Accepts free text like "Finish proposal by 4pm" and tokenizes/creates task with inferred metadata
- **AI chat panel:** Conversational assistant; can:
  - Accept multi-step task breakdowns
  - Suggest which task to do next
  - Turn vague goals into concrete first actions
- **Today view:** Highlights the current session, pending high-priority tasks, and upcoming due items

### 5.3 Task Entity
- Title / summary (required)
- Description / notes (optional)
- Priority score (computed)
- Estimated time / effort (user or AI-suggested)
- Due date / deadline (optional)
- Tags / categories
- Creation timestamp
- Status: pending, in-progress, completed, deferred
- History of focus sessions attached
- User feedback (difficulty, satisfaction)

### 5.4 AI Integration
- Natural language parsing for task creation
- Priority scoring engine (see section 7)
- Smart suggestions: next task, session length, break timing
- Clarification dialog when user input is ambiguous
- Learning from feedback: adjust future priorities based on task completion patterns

### 5.5 Focus Mode
- Single-task view (task title + optional goal statement)
- Timer with configurable duration (e.g., 25/50/Custom minutes)
- Interruptions tracking (optional): logs if user leaves the app or manually pauses
- Notifications suppressed (global DND push + in-app except critical overrides)
- Quick controls: pause, extend, end early, log distraction
- Ambient support: gentle sound, countdown animations, or motivational message (configurable)

### 5.6 Session Completion
- User marks outcome: Done / Partially done / Reschedule / Abandon
- Capture subjective difficulty and distraction notes
- Update task state and AI feedback
- Display micro-summary with a productivity score (combination of time focused vs. goal)
- Offer smart next step or suggested break (based on prior usage patterns)

### 5.7 Progress & Analytics
- Daily/weekly focus time
- Task completion rate
- Streaks (days with at least one successful focus session)
- Productivity score trends (e.g., average focus efficiency)
- Historical session timeline
- Custom reports (exportable in future iterations)

### 5.8 Notifications
**Types:**
- Upcoming session reminder
- Task due soon
- Suggested next task
- Break suggestion after a session
- Streak/achievement badge

**Delivery:** In-app, push, email (user should configure preferences)
- Quiet hours and auto-suppression during Focus Mode

### 5.9 Settings
- Session defaults (duration, auto-start next session, auto-log distractions)
- Notification preferences
- AI tuning (e.g., aggressiveness of prioritization, tone of suggestions)
- Theme (light/dark, minimal vs. rich)
- Export data / privacy controls

### 5.10 Accessibility
- Screen-reader labels
- High contrast mode
- Keyboard/navigation support
- Adjustable font sizes

---

## 6. Data Models

### User
```json
{
  "id": "uuid",
  "email": "string",
  "hashed_password": "string",
  "preferences": {
    "session_length": "number",
    "quiet_hours": "object",
    "ai_tone": "string",
    "theme": "string"
  },
  "created_at": "timestamp",
  "last_active_at": "timestamp"
}
```

### Task
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "string",
  "description": "string",
  "priority_score": "number",
  "estimate_minutes": "number",
  "due_date": "timestamp",
  "tags": ["string"],
  "status": "enum(pending|in-progress|completed|deferred)",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "feedback_history": [
    {
      "difficulty": "number",
      "satisfaction": "number",
      "notes": "string",
      "timestamp": "timestamp"
    }
  ]
}
```

### FocusSession
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "task_id": "uuid",
  "start_time": "timestamp",
  "end_time": "timestamp",
  "intended_duration": "number",
  "actual_duration": "number",
  "interruptions_count": "number",
  "outcome": "enum(completed|partial|abandoned)",
  "subjective_difficulty": "number",
  "created_at": "timestamp"
}
```

### AIRecommendation
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "task_id": "uuid?",
  "type": "enum(next_task|duration|break|reordering)",
  "generated_at": "timestamp",
  "score": "number",
  "feedback": "enum(upvote|downvote|none)"
}
```

### Notification
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "type": "string",
  "content": "string",
  "scheduled_for": "timestamp",
  "delivered_at": "timestamp?",
  "read_status": "boolean"
}
```

---

## 7. AI Task Prioritization

### Core Logic

**Inputs to the scoring function:**
- Due date proximity (sooner = higher weight)
- Estimated effort (shorter tasks may get quick-win boosts)
- Historical completion behavior (tasks similar to ones user completes vs. avoids)
- User-set importance / manual priority
- Recency (freshly added vs. stale)
- Dependency (if a task unlocks others or is blocked)
- Focus fatigue (avoid always pushing same category if user has overworked it)
- Feedback loop (if user consistently defers a task, its score is dampened until manual reactivation)

Score should be a weighted composite; weights can be tuned by user or learned over time.

---

## 8. API Endpoints

### Auth
```
POST /auth/signup
POST /auth/login
POST /auth/refresh-token
POST /auth/password-reset
```

### Tasks
```
GET /tasks (with filters, sort by AI priority)
POST /tasks (create, accepts natural language or structured)
PUT /tasks/:id (update fields, manual priority override)
PATCH /tasks/:id/status (mark complete / defer)
DELETE /tasks/:id
POST /tasks/parse (backend NLP endpoint to turn free text into structured task(s))
```

### AI Chat / Recommendation
```
POST /ai/chat (send user message, get clarifying questions / suggestions)
GET /ai/suggest-next (returns best next task + session params)
POST /ai/feedback (user feedback on suggestion)
```

### Focus Session
```
POST /focus/start (start a session)
POST /focus/pause
POST /focus/resume
POST /focus/end (submit outcome)
GET /focus/history
```

### Progress
```
GET /progress/summary
GET /progress/streaks
GET /progress/sessions
```

### Notifications
```
GET /notifications
POST /notifications/settings
PATCH /notifications/:id/read
```

### Settings
```
GET /settings
PUT /settings
```

---

## 9. UI Component Breakdown

### Core Components
- `WelcomeScreen`
- `AuthForm` (signup/login)
- `OnboardingWizard`
- `DashboardContainer`
- `TaskList` (sortable, AI-highlighted)
- `QuickAddInput`
- `AIChatSidebar` / `Overlay`
- `TaskDetailModal` / `Screen`
- `FocusModeView` (timer + single task + interruption tracker)
- `SessionSummaryCard`
- `ProgressDashboard`
- `NotificationCenter`
- `SettingsPanel`
- `FeedbackWidget` (thumbs up/down, difficulty sliders)

---

## 10. State Management

### Global State
- User profile & preferences
- Current task
- Session state
- Notification queue

### Local State
- Per-screen state: chat history, quick-add draft
- Optimistic updates for task completion with rollback on failure
- Sync layer to handle offline modifications and conflict resolution

---

## 11. Edge Cases & Error Handling

- Task created with ambiguous due date (prompt clarification)
- Focus session interrupted by OS-level forcible backgrounding (persist state, resume prompt)
- Network loss during AI chat or session completion (local cache + retry strategies)
- User overrides AI priority repeatedly (allow manual pinning and learn from behavior)
- Time zone inconsistencies in session logs

---

## 12. Security & Privacy

- JWT or session-based secure authentication with refresh tokens
- Passwords hashed with bcrypt / argon2
- TLS for all transport
- User data compartmentalized and exported on request
- Rate limits on AI/chat endpoints to prevent abuse

---

## 13. Metrics to Observe

- Task creation rate (quick-add vs. AI chat)
- Focus session start / completion ratio
- Average uninterrupted focus time
- Task deferral frequency and patterns
- AI suggestion acceptance rate
- Retention (weekly active users with at least one completed session)

---

## 14. Implementation Notes

### Tech Stack

#### Frontend
- **React Native** with **TypeScript** for type safety and better developer experience
- **Expo** for simplified development and deployment workflow
- **Expo Router** for file-based navigation and routing
- **React Native Paper** for consistent Material Design components and theming

#### Backend & Database
- **Supabase** for backend-as-a-service including:
  - PostgreSQL database for data persistence
  - Real-time subscriptions for live updates
  - Built-in authentication and authorization
  - Edge functions for serverless API endpoints
  - Storage for file uploads (if needed)

#### AI Processing
- **DeepSeek** for natural language processing and AI-powered features:
  - Task parsing and natural language understanding
  - Priority scoring and task recommendations
  - Smart suggestions for next actions
  - Conversational AI chat interface

### Architecture Considerations

#### Frontend Architecture
- File-based routing with Expo Router for screen navigation
- State management with Zustand for global state (user, session, notifications)
- React Context for theme and preferences
- Optimistic updates with rollback on failure

#### Backend Architecture
- Supabase Edge Functions for API endpoints
- Real-time subscriptions for live dashboard updates
- Row Level Security (RLS) for data protection
- Database triggers for automated priority scoring updates

#### AI Integration
- DeepSeek API integration for natural language processing
- Prompt engineering for task parsing and prioritization
- Feedback loop system for continuous AI improvement
- Rate limiting and caching for API efficiency

### Data Storage Strategy
- Supabase PostgreSQL for primary data storage
- Real-time subscriptions for immediate UI updates
- Materialized views for analytics and reporting
- Backup and recovery through Supabase dashboard

---

## 16. Database Schema

### Core Tables

#### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  hashed_password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for email lookups
CREATE INDEX idx_users_email ON users(email);
-- Index for active users
CREATE INDEX idx_users_last_active ON users(last_active_at);
```

#### tasks
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  priority_score DECIMAL(5,2) DEFAULT 0.0,
  estimated_minutes INTEGER,
  due_date TIMESTAMP WITH TIME ZONE,
  tags TEXT[] DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'deferred')),
  manual_priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority_score DESC);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);
```

#### focus_sessions
```sql
CREATE TABLE focus_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  intended_duration_minutes INTEGER NOT NULL,
  actual_duration_minutes INTEGER,
  interruptions_count INTEGER DEFAULT 0,
  outcome VARCHAR(20) DEFAULT 'in-progress' CHECK (outcome IN ('completed', 'partial', 'abandoned', 'in-progress')),
  subjective_difficulty INTEGER CHECK (subjective_difficulty >= 1 AND subjective_difficulty <= 10),
  distraction_notes TEXT,
  productivity_score DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for analytics
CREATE INDEX idx_focus_sessions_user_id ON focus_sessions(user_id);
CREATE INDEX idx_focus_sessions_task_id ON focus_sessions(task_id);
CREATE INDEX idx_focus_sessions_start_time ON focus_sessions(start_time);
CREATE INDEX idx_focus_sessions_outcome ON focus_sessions(outcome);
```

#### ai_recommendations
```sql
CREATE TABLE ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  recommendation_type VARCHAR(50) NOT NULL CHECK (recommendation_type IN ('next_task', 'session_duration', 'break_suggestion', 'task_reordering')),
  content JSONB NOT NULL,
  score DECIMAL(5,2),
  feedback VARCHAR(20) DEFAULT 'none' CHECK (feedback IN ('upvote', 'downvote', 'none')),
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_ai_recommendations_user_id ON ai_recommendations(user_id);
CREATE INDEX idx_ai_recommendations_type ON ai_recommendations(recommendation_type);
CREATE INDEX idx_ai_recommendations_generated_at ON ai_recommendations(generated_at);
```

#### notifications
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_scheduled_for ON notifications(scheduled_for);
CREATE INDEX idx_notifications_delivered_at ON notifications(delivered_at);
```

#### task_feedback
```sql
CREATE TABLE task_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  session_id UUID REFERENCES focus_sessions(id) ON DELETE SET NULL,
  difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 10),
  satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_task_feedback_user_id ON task_feedback(user_id);
CREATE INDEX idx_task_feedback_task_id ON task_feedback(task_id);
CREATE INDEX idx_task_feedback_session_id ON task_feedback(session_id);
```

### Views for Analytics

#### user_daily_stats
```sql
CREATE VIEW user_daily_stats AS
SELECT 
  user_id,
  DATE(start_time) as date,
  COUNT(*) as sessions_count,
  SUM(actual_duration_minutes) as total_focus_minutes,
  AVG(productivity_score) as avg_productivity,
  COUNT(CASE WHEN outcome = 'completed' THEN 1 END) as completed_sessions,
  COUNT(CASE WHEN outcome = 'partial' THEN 1 END) as partial_sessions
FROM focus_sessions 
WHERE outcome != 'in-progress'
GROUP BY user_id, DATE(start_time);
```

#### task_completion_stats
```sql
CREATE VIEW task_completion_stats AS
SELECT 
  t.id as task_id,
  t.user_id,
  t.title,
  COUNT(fs.id) as sessions_count,
  AVG(fs.productivity_score) as avg_productivity,
  AVG(fs.subjective_difficulty) as avg_difficulty,
  SUM(fs.actual_duration_minutes) as total_time_spent
FROM tasks t
LEFT JOIN focus_sessions fs ON t.id = fs.task_id
GROUP BY t.id, t.user_id, t.title;
```

### Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_feedback ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own tasks" ON tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own sessions" ON focus_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own recommendations" ON ai_recommendations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own feedback" ON task_feedback FOR ALL USING (auth.uid() = user_id);
```

### Functions and Triggers

#### Update task priority score
```sql
CREATE OR REPLACE FUNCTION update_task_priority_score()
RETURNS TRIGGER AS $$
BEGIN
  -- Complex priority calculation logic here
  -- This is a simplified version
  NEW.priority_score = 
    CASE 
      WHEN NEW.due_date IS NOT NULL THEN 
        GREATEST(0, 100 - EXTRACT(EPOCH FROM (NEW.due_date - NOW())) / 86400)
      ELSE 50
    END + 
    COALESCE(NEW.manual_priority, 0) * 10;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_task_priority
  BEFORE INSERT OR UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_task_priority_score();
```

#### Update session productivity score
```sql
CREATE OR REPLACE FUNCTION calculate_productivity_score(
  intended_duration INTEGER,
  actual_duration INTEGER,
  interruptions_count INTEGER,
  outcome VARCHAR
)
RETURNS DECIMAL AS $$
DECLARE
  completion_score DECIMAL;
  focus_score DECIMAL;
  outcome_multiplier DECIMAL;
BEGIN
  -- Completion score (40% weight)
  completion_score = CASE 
    WHEN intended_duration > 0 THEN 
      LEAST(1.0, actual_duration::DECIMAL / intended_duration::DECIMAL)
    ELSE 0.5
  END * 0.4;
  
  -- Focus score (30% weight) - fewer interruptions = higher score
  focus_score = GREATEST(0, 1 - (interruptions_count::DECIMAL / 10)) * 0.3;
  
  -- Outcome multiplier (30% weight)
  outcome_multiplier = CASE outcome
    WHEN 'completed' THEN 1.0
    WHEN 'partial' THEN 0.7
    WHEN 'abandoned' THEN 0.3
    ELSE 0.5
  END * 0.3;
  
  RETURN (completion_score + focus_score + outcome_multiplier) * 100;
END;
$$ LANGUAGE plpgsql;
```

---

## 17. Project Folder Structure

```
DeepWorkAI/
├── app/                          # Expo Router app directory
│   ├── (auth)/                   # Authentication routes
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── forgot-password.tsx
│   ├── (main)/                   # Main app routes
│   │   ├── dashboard.tsx         # Main dashboard
│   │   ├── focus/                # Focus mode routes
│   │   │   ├── [taskId].tsx     # Focus session for specific task
│   │   │   └── summary.tsx      # Session summary
│   │   ├── tasks/                # Task management routes
│   │   │   ├── index.tsx        # Task list
│   │   │   ├── [id].tsx         # Task detail/edit
│   │   │   └── create.tsx       # Create new task
│   │   ├── progress/             # Analytics routes
│   │   │   ├── index.tsx        # Progress dashboard
│   │   │   ├── streaks.tsx      # Streak tracking
│   │   │   └── analytics.tsx    # Detailed analytics
│   │   ├── settings/             # Settings routes
│   │   │   ├── index.tsx        # Settings main
│   │   │   ├── profile.tsx      # Profile settings
│   │   │   ├── notifications.tsx # Notification preferences
│   │   │   └── ai-preferences.tsx # AI behavior settings
│   │   └── chat/                 # AI chat routes
│   │       └── index.tsx        # AI assistant chat
│   ├── _layout.tsx              # Root layout
│   ├── index.tsx                # Welcome/onboarding
│   └── +not-found.tsx          # 404 page
├── src/
│   ├── components/               # Reusable components
│   │   ├── ui/                  # UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Timer.tsx
│   │   │   └── ProgressBar.tsx
│   │   ├── features/            # Feature-specific components
│   │   │   ├── auth/            # Authentication components
│   │   │   │   ├── AuthForm.tsx
│   │   │   │   └── OnboardingWizard.tsx
│   │   │   ├── dashboard/       # Dashboard components
│   │   │   │   ├── TaskList.tsx
│   │   │   │   ├── QuickAddInput.tsx
│   │   │   │   ├── SummaryWidget.tsx
│   │   │   │   └── AIChatSidebar.tsx
│   │   │   ├── focus/           # Focus mode components
│   │   │   │   ├── FocusModeView.tsx
│   │   │   │   ├── Timer.tsx
│   │   │   │   ├── InterruptionTracker.tsx
│   │   │   │   └── SessionSummary.tsx
│   │   │   ├── tasks/           # Task management components
│   │   │   │   ├── TaskCard.tsx
│   │   │   │   ├── TaskForm.tsx
│   │   │   │   ├── TaskDetail.tsx
│   │   │   │   └── TaskPriorityBadge.tsx
│   │   │   ├── progress/        # Progress components
│   │   │   │   ├── ProgressChart.tsx
│   │   │   │   ├── StreakCounter.tsx
│   │   │   │   ├── AnalyticsSummary.tsx
│   │   │   │   └── ProductivityScore.tsx
│   │   │   ├── settings/        # Settings components
│   │   │   │   ├── SettingsSection.tsx
│   │   │   │   ├── ThemeSelector.tsx
│   │   │   │   └── NotificationSettings.tsx
│   │   │   └── chat/            # AI chat components
│   │   │       ├── ChatInterface.tsx
│   │   │       ├── MessageBubble.tsx
│   │   │       └── SuggestionChips.tsx
│   │   └── layout/              # Layout components
│   │       ├── Header.tsx
│   │       ├── Navigation.tsx
│   │       ├── Sidebar.tsx
│   │       └── LoadingSpinner.tsx
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts           # Authentication hook
│   │   ├── useTasks.ts          # Task management hook
│   │   ├── useFocusSession.ts   # Focus session hook
│   │   ├── useAI.ts             # AI integration hook
│   │   ├── useNotifications.ts  # Notification hook
│   │   ├── useProgress.ts       # Progress tracking hook
│   │   └── useSupabase.ts       # Supabase client hook
│   ├── services/                # API and external services
│   │   ├── supabase/            # Supabase configuration
│   │   │   ├── client.ts        # Supabase client setup
│   │   │   ├── auth.ts          # Authentication service
│   │   │   ├── tasks.ts         # Task CRUD operations
│   │   │   ├── sessions.ts      # Focus session operations
│   │   │   ├── progress.ts      # Progress analytics
│   │   │   └── notifications.ts # Notification service
│   │   ├── ai/                  # AI service integration
│   │   │   ├── deepseek.ts      # DeepSeek API client
│   │   │   ├── taskParser.ts    # Task parsing logic
│   │   │   ├── priorityEngine.ts # Priority scoring
│   │   │   └── recommendations.ts # AI recommendations
│   │   └── utils/               # Utility services
│   │       ├── dateUtils.ts     # Date/time utilities
│   │       ├── validation.ts    # Form validation
│   │       ├── storage.ts       # Local storage utilities
│   │       └── permissions.ts   # Permission handling
│   ├── stores/                  # State management (Zustand)
│   │   ├── authStore.ts         # Authentication state
│   │   ├── taskStore.ts         # Task state management
│   │   ├── sessionStore.ts      # Focus session state
│   │   ├── uiStore.ts           # UI state (theme, modals)
│   │   ├── notificationStore.ts # Notification state
│   │   └── progressStore.ts     # Progress analytics state
│   ├── types/                   # TypeScript type definitions
│   │   ├── auth.ts              # Authentication types
│   │   ├── task.ts              # Task-related types
│   │   ├── session.ts           # Focus session types
│   │   ├── progress.ts          # Progress analytics types
│   │   ├── ai.ts                # AI-related types
│   │   ├── notification.ts      # Notification types
│   │   └── supabase.ts          # Supabase database types
│   ├── constants/               # App constants
│   │   ├── colors.ts            # Color palette
│   │   ├── fonts.ts             # Typography
│   │   ├── spacing.ts           # Spacing system
│   │   ├── sessionTypes.ts      # Session duration presets
│   │   └── api.ts               # API endpoints
│   ├── utils/                   # Utility functions
│   │   ├── formatters.ts        # Data formatting utilities
│   │   ├── validators.ts        # Input validation
│   │   ├── helpers.ts           # General helper functions
│   │   └── analytics.ts         # Analytics utilities
│   └── styles/                  # Global styles
│       ├── theme.ts             # Theme configuration
│       ├── globalStyles.ts      # Global style definitions
│       └── animations.ts        # Animation definitions
├── assets/                      # Static assets
│   ├── images/                  # Image assets
│   │   ├── icons/               # App icons
│   │   ├── illustrations/       # App illustrations
│   │   └── backgrounds/         # Background images
│   ├── fonts/                   # Custom fonts
│   └── sounds/                  # Audio assets (focus sounds)
├── docs/                        # Documentation
│   ├── CONTEXT.md               # This specification
│   ├── API.md                   # API documentation
│   ├── DEPLOYMENT.md            # Deployment guide
│   └── CONTRIBUTING.md          # Contribution guidelines
├── tests/                       # Test files
│   ├── unit/                    # Unit tests
│   ├── integration/             # Integration tests
│   └── e2e/                     # End-to-end tests
├── .env.example                 # Environment variables template
├── app.json                     # Expo configuration
├── babel.config.js              # Babel configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies and scripts
├── README.md                    # Project readme
└── .gitignore                   # Git ignore rules
```

### Key Structural Benefits

1. **Feature-based Organization**: Components are organized by feature rather than type, making it easier to find related code
2. **Expo Router Integration**: File-based routing with the `app/` directory structure
3. **Type Safety**: Comprehensive TypeScript types for all data structures
4. **State Management**: Centralized Zustand stores for different app domains
5. **Service Layer**: Clean separation between UI, business logic, and external services
6. **Scalability**: Structure supports adding new features without major refactoring

---

## 15. Sample Session Lifecycle

### State Transitions

1. **User selects task from dashboard**
2. **Calls `POST /focus/start`** → FocusSession created, timer starts
3. **During session:** interruption detected (state updated locally)
4. **Session ends** either by timer or user `POST /focus/end` → Outcome recorded, task status updated, AI feedback incorporated
5. **Summary shown:** user accepts suggestion for next task or schedules break

### Example Flow
```
Dashboard → Task Selection → Focus Mode → Session Completion → Progress Update → Next Task Suggestion
```

---

## Appendix

### A. Priority Scoring Formula
```
priority_score = (
  due_date_weight * due_date_score +
  effort_weight * effort_score +
  history_weight * completion_pattern_score +
  user_priority_weight * manual_priority +
  recency_weight * recency_score +
  dependency_weight * dependency_score
) * focus_fatigue_multiplier
```

### B. Session Types
- **Pomodoro:** 25-minute focused work + 5-minute break
- **Deep Work:** 50-minute focused work + 10-minute break
- **Custom:** User-defined duration
- **Quick Win:** 15-minute session for small tasks

### C. Productivity Score Calculation
```
productivity_score = (
  (actual_duration / intended_duration) * 0.4 +
  (1 - interruptions_count / max_interruptions) * 0.3 +
  (outcome_multiplier) * 0.3
) * 100
```

---

*This specification provides a comprehensive foundation for building the Focus-One-Task productivity application. The modular design allows for iterative development while maintaining focus on the core single-task philosophy.*
