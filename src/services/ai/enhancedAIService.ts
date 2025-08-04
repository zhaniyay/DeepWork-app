import { Task, CreateTaskRequest } from '@/types/task';

const OPENAI_API_URL = process.env.EXPO_PUBLIC_OPENAI_API_URL || 'https://api.openai.com/v1';
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

interface AIResponse {
  content: string;
  suggestions?: string[];
  actions?: string[];
  tasks?: Task[];
  followUpQuestions?: string[];
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    intent?: string;
    actions?: string[];
    tasksCreated?: string[];
  };
}

export class EnhancedAIService {
  private static async makeRequest(endpoint: string, data: any): Promise<any> {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await fetch(`${OPENAI_API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.warn('AI service network error, using fallback:', error);
      throw new Error('Network request failed');
    }
  }

  static async smartChatResponse(
    userMessage: string,
    conversationHistory: ChatMessage[],
    userContext: any
  ): Promise<AIResponse> {
    // Always use fallback for now since we don't have API keys configured
    return this.createSmartFallbackResponse(userMessage, conversationHistory, userContext);
  }

  private static createSmartFallbackResponse(
    userMessage: string, 
    conversationHistory: ChatMessage[],
    userContext?: any
  ): AIResponse {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for task creation intent
    if (this.isTaskCreationIntent(lowerMessage)) {
      const taskData = this.extractTaskFromMessage(userMessage);
      return {
        content: `I'll create a task for you: "${taskData.title}". This will help you stay organized and focused.`,
        suggestions: ['Start focus session', 'Add more details', 'Set priority'],
        actions: ['create_task'],
        tasks: [taskData],
        followUpQuestions: ['Would you like to start a focus session for this task?', 'Should I set a specific priority?']
      };
    }
    
    // Check for focus session intent
    if (lowerMessage.includes('start') || lowerMessage.includes('focus') || lowerMessage.includes('session')) {
      const duration = this.extractDurationFromMessage(userMessage) || 25;
      return {
        content: `Great! Let's start a ${duration}-minute focus session. I'll help you stay productive and track your progress.`,
        suggestions: ['Choose task', 'Set timer', 'Take break'],
        actions: ['start_focus_session'],
        followUpQuestions: ['Which task would you like to work on?', 'Do you want to set a specific duration?']
      };
    }
    
    // Check for productivity advice
    if (this.isProductivityAdviceIntent(lowerMessage)) {
      return {
        content: 'Here are some productivity tips: 1) Use the Pomodoro technique (25min work, 5min break), 2) Prioritize tasks by importance, 3) Take regular breaks to maintain focus.',
        suggestions: ['Start Pomodoro session', 'Review tasks', 'Set goals'],
        actions: ['start_focus_session', 'review_progress'],
        followUpQuestions: ['Would you like to try a Pomodoro session?', 'Should we review your current tasks?']
      };
    }
    
    // Check for project planning
    if (this.isProjectPlanningIntent(lowerMessage)) {
      return {
        content: 'I can help you break down your project into manageable tasks. Let me create a structured plan for you.',
        suggestions: ['Break down project', 'Set milestones', 'Create timeline'],
        actions: ['break_down_project'],
        followUpQuestions: ['What\'s the main goal of your project?', 'When do you need to complete it?']
      };
    }
    
    // Default helpful response
    return {
      content: 'I\'m here to help you stay productive! I can create tasks, start focus sessions, and provide productivity advice. What would you like to do?',
      suggestions: ['Create task', 'Start focus session', 'Get advice', 'Review progress'],
      actions: ['create_task', 'start_focus_session'],
      followUpQuestions: ['What task would you like to work on?', 'How can I help you be more productive today?']
    };
  }

  private static extractTaskFromMessage(message: string): Task {
    // Simple task extraction logic
    const titleMatch = message.match(/(?:create|add|new task|make task)\s+(.+?)(?:\s+for\s+(\d+)\s*min|$)/i);
    const durationMatch = message.match(/(\d+)\s*min/i);
    const priorityMatch = message.match(/priority\s*(\d+)/i);
    
    return {
      id: Date.now().toString(),
      title: titleMatch?.[1]?.trim() || 'New Task',
      description: message.includes('description') ? message.split('description')[1]?.trim() : undefined,
      estimated_minutes: durationMatch ? parseInt(durationMatch[1]) : 30,
      priority_score: priorityMatch ? parseInt(priorityMatch[1]) : 50,
      status: 'pending',
      tags: this.extractTagsFromMessage(message),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      due_date: undefined,
    };
  }

  private static extractDurationFromMessage(message: string): number | null {
    const match = message.match(/(\d+)\s*(?:min|minute|minutes)/i);
    return match ? parseInt(match[1]) : null;
  }

  private static extractTagsFromMessage(message: string): string[] {
    const tagMatches = message.match(/#(\w+)/g);
    return tagMatches ? tagMatches.map(tag => tag.slice(1)) : [];
  }

  private static isTaskCreationIntent(message: string): boolean {
    return message.includes('create') || message.includes('add') || message.includes('new task') || message.includes('make task');
  }

  private static isProjectPlanningIntent(message: string): boolean {
    return message.includes('project') || message.includes('plan') || message.includes('organize') || message.includes('structure');
  }

  private static isProductivityAdviceIntent(message: string): boolean {
    return message.includes('help') || message.includes('advice') || message.includes('tip') || message.includes('productive');
  }

  // Keep the existing methods for when API is available
  private static buildSmartSystemPrompt(userContext: any): string {
    return `You are an AI productivity assistant helping users manage tasks and focus sessions. 
    User context: ${JSON.stringify(userContext)}
    Provide helpful, actionable responses.`;
  }

  private static buildEnhancedUserPrompt(userMessage: string, conversationHistory: ChatMessage[]): string {
    return `User message: ${userMessage}
    Conversation history: ${conversationHistory.length} messages
    Provide a helpful response.`;
  }

  private static handleFunctionCall(functionCall: any, userMessage: string): AIResponse {
    // Handle function calls when API is available
    return {
      content: 'Function call handled',
      suggestions: ['Continue', 'Next step'],
    };
  }

  private static generateTaskCreationResponse(taskData: any): string {
    return `Task created: ${taskData.title}`;
  }

  private static formatTask(taskData: any): Task {
    return {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description,
      estimated_minutes: taskData.estimated_minutes || 30,
      priority_score: taskData.priority_score || 50,
      status: 'pending',
      tags: taskData.tags || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      due_date: taskData.due_date,
    };
  }

  private static generateSmartSuggestions(userMessage: string, userContext: any): string[] {
    return ['Create task', 'Start session', 'Review progress'];
  }

  private static generateFollowUpQuestions(userMessage: string, userContext: any): string[] {
    return ['What would you like to do next?', 'How can I help you?'];
  }
} 