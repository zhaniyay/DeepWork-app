import { Task, CreateTaskRequest } from '@/types/task';

const OPENAI_API_URL = process.env.EXPO_PUBLIC_OPENAI_API_URL || 'https://api.openai.com/v1';
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

interface AIResponse {
  tasks?: Task[];
  suggestions?: string[];
  nextTask?: Task;
  clarification?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class OpenAIService {
  private static async makeRequest(endpoint: string, data: any): Promise<any> {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

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
  }

  static async parseNaturalLanguage(text: string): Promise<Task[]> {
    // Check if API key is configured
    if (!OPENAI_API_KEY) {
      console.warn('OpenAI API key not configured. Using fallback task creation.');
      return this.createFallbackTask(text);
    }

    const prompt = `
You are a task parsing assistant. Parse the following user input into structured tasks.

User input: "${text}"

Return a JSON array of tasks with the following structure:
{
  "title": "Task title",
  "description": "Optional description",
  "estimated_minutes": 30,
  "priority_score": 75,
  "tags": ["work", "urgent"],
  "due_date": "2025-08-03T10:00:00Z" // optional ISO date string
}

Focus on:
1. Extracting clear task titles
2. Estimating reasonable time requirements
3. Assigning priority based on urgency indicators
4. Identifying relevant tags
5. Parsing due dates if mentioned

Return only valid JSON array.
`;

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful task parsing assistant. Always respond with valid JSON arrays.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from AI');
      }

      // Parse the JSON response
      const tasks = JSON.parse(content);
      return tasks.map((task: any) => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        user_id: 'temp-user-id', // Will be replaced with actual user ID
        title: task.title,
        description: task.description || '',
        priority_score: task.priority_score || 50,
        estimated_minutes: task.estimated_minutes || 30,
        due_date: task.due_date || undefined,
        tags: task.tags || [],
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        manual_priority: 0,
      }));
    } catch (error) {
      console.error('AI parsing error:', error);
      return this.createFallbackTask(text);
    }
  }

  private static createFallbackTask(text: string): Task[] {
    // Create a simple task from the input when AI is not available
    return [{
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      user_id: 'temp-user-id',
      title: text,
      description: `Task created from: "${text}"`,
      priority_score: 50,
      estimated_minutes: 30,
      due_date: undefined,
      tags: [],
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      manual_priority: 0,
    }];
  }

  static async getNextTaskRecommendation(tasks: Task[]): Promise<Task | null> {
    if (tasks.length === 0) return null;

    const pendingTasks = tasks.filter(task => task.status === 'pending');
    if (pendingTasks.length === 0) return null;

    const prompt = `
Given these tasks, recommend the best next task to work on:

${pendingTasks.map(task => `
- ${task.title}
  Priority: ${task.priority_score}
  Estimated: ${task.estimated_minutes} minutes
  Due: ${task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
  Tags: ${task.tags.join(', ')}
`).join('\n')}

Consider:
1. Priority scores
2. Due dates (urgent tasks first)
3. Estimated effort (mix of quick wins and longer tasks)
4. User patterns (avoid task fatigue)

Return the task ID of the recommended task, or "none" if no clear recommendation.
`;

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a productivity assistant. Recommend the best next task based on priority, urgency, and user patterns.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 100,
      });

      const content = response.choices[0]?.message?.content;
      if (!content || content.toLowerCase().includes('none')) {
        return null;
      }

      // Try to extract task ID from response
      const taskId = content.trim();
      return pendingTasks.find(task => task.id === taskId) || null;
    } catch (error) {
      console.error('AI recommendation error:', error);
      // Fallback: return highest priority task
      return pendingTasks.sort((a, b) => b.priority_score - a.priority_score)[0] || null;
    }
  }

  static async chatWithAI(messages: ChatMessage[]): Promise<AIResponse> {
    // Check if API key is configured
    if (!OPENAI_API_KEY) {
      console.warn('OpenAI API key not configured. Using fallback chat responses.');
      return this.createFallbackChatResponse(messages);
    }

    const systemPrompt = `
You are a productivity assistant for the Focus-One-Task app. Help users:
1. Break down complex tasks into smaller, actionable items
2. Prioritize their workload
3. Suggest focus session durations
4. Provide motivation and guidance
5. Answer questions about productivity and time management

Keep responses concise, actionable, and encouraging.
`;

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const content = response.choices[0]?.message?.content;
      return {
        suggestions: [content],
      };
    } catch (error) {
      console.error('AI chat error:', error);
      return this.createFallbackChatResponse(messages);
    }
  }

  private static createFallbackChatResponse(messages: ChatMessage[]): AIResponse {
    const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
    
    // Simple fallback responses based on common patterns
    if (lastMessage.includes('task') || lastMessage.includes('create')) {
      return {
        suggestions: [
          "I can help you create tasks! Try saying something like 'Create a task to finish the project by Friday' or 'Add a task for reviewing the code changes'."
        ]
      };
    }
    
    if (lastMessage.includes('priority') || lastMessage.includes('next')) {
      return {
        suggestions: [
          "To prioritize your tasks, focus on what's most urgent and important. Consider due dates, effort required, and your energy levels. What specific task are you thinking about?"
        ]
      };
    }
    
    if (lastMessage.includes('focus') || lastMessage.includes('session')) {
      return {
        suggestions: [
          "Great! For focus sessions, I recommend starting with 25-30 minutes. Choose a single task and eliminate distractions. Ready to start your focus session?"
        ]
      };
    }
    
    return {
      suggestions: [
        "I'm here to help with your productivity! You can ask me to create tasks, prioritize your work, or suggest focus session strategies. What would you like to work on?"
      ]
    };
  }

  static async suggestSessionDuration(task: Task): Promise<number> {
    if (!OPENAI_API_KEY) {
      // Fallback: suggest based on task complexity
      return Math.min(Math.max(task.estimated_minutes || 30, 15), 120);
    }

    const prompt = `
Based on this task, suggest an appropriate focus session duration (in minutes):

Task: ${task.title}
Description: ${task.description}
Estimated time: ${task.estimated_minutes} minutes
Priority: ${task.priority_score}

Consider:
- Task complexity
- User's typical focus patterns
- Time of day
- Available time

Return only a number (minutes), between 15-120.
`;

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a productivity assistant. Suggest appropriate focus session durations based on task complexity and user patterns.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 50,
      });

      const content = response.choices[0]?.message?.content;
      const duration = parseInt(content || '30');
      return Math.min(Math.max(duration, 15), 120);
    } catch (error) {
      console.error('AI session duration error:', error);
      return Math.min(Math.max(task.estimated_minutes || 30, 15), 120);
    }
  }
} 