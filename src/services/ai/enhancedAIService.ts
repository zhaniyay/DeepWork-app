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

  static async smartChatResponse(
    userMessage: string,
    conversationHistory: ChatMessage[],
    userContext: any
  ): Promise<AIResponse> {
    if (!OPENAI_API_KEY) {
      return this.createSmartFallbackResponse(userMessage, conversationHistory);
    }

    const systemPrompt = this.buildSmartSystemPrompt(userContext);
    const enhancedPrompt = this.buildEnhancedUserPrompt(userMessage, conversationHistory);

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          { role: 'user', content: enhancedPrompt }
        ],
        temperature: 0.7,
        max_tokens: 800,
        functions: [
          {
            name: 'create_task',
            description: 'Create a new task based on user input',
            parameters: {
              type: 'object',
              properties: {
                title: { type: 'string', description: 'Task title' },
                description: { type: 'string', description: 'Task description' },
                estimated_minutes: { type: 'number', description: 'Estimated time in minutes' },
                priority_score: { type: 'number', description: 'Priority score 0-100' },
                tags: { type: 'array', items: { type: 'string' } },
                due_date: { type: 'string', description: 'ISO date string if mentioned' }
              },
              required: ['title']
            }
          },
          {
            name: 'suggest_action',
            description: 'Suggest next actions for the user',
            parameters: {
              type: 'object',
              properties: {
                action: { type: 'string', enum: ['start_focus_session', 'prioritize_tasks', 'break_down_project', 'take_break', 'review_progress'] },
                reason: { type: 'string', description: 'Why this action is recommended' },
                duration: { type: 'number', description: 'Suggested duration in minutes' }
              },
              required: ['action', 'reason']
            }
          }
        ],
        function_call: 'auto'
      });

      const content = response.choices[0]?.message?.content;
      const functionCall = response.choices[0]?.message?.function_call;

      if (functionCall) {
        return this.handleFunctionCall(functionCall, userMessage);
      }

      return {
        content: content || 'I understand. How can I help you further?',
        suggestions: this.generateSmartSuggestions(userMessage, userContext),
        followUpQuestions: this.generateFollowUpQuestions(userMessage, userContext)
      };
    } catch (error) {
      console.error('Enhanced AI chat error:', error);
      return this.createSmartFallbackResponse(userMessage, conversationHistory);
    }
  }

  private static buildSmartSystemPrompt(userContext: any): string {
    return `
You are an advanced productivity assistant for the Focus-One-Task app. You have deep knowledge of productivity, time management, and cognitive psychology.

User Context:
${userContext ? `
- Current tasks: ${userContext.currentTasks?.length || 0}
- Preferred session duration: ${userContext.productivityPatterns?.preferredSessionDuration || 25} minutes
- Most productive time: ${userContext.productivityPatterns?.mostProductiveTime || 'morning'}
- AI tone preference: ${userContext.userPreferences?.aiTone || 'motivational'}
` : ''}

Your capabilities:
1. **Smart Task Creation**: Parse natural language into well-structured tasks with appropriate time estimates and priorities
2. **Context-Aware Suggestions**: Provide personalized advice based on user patterns and current workload
3. **Project Planning**: Help break down complex projects into manageable tasks
4. **Productivity Coaching**: Offer evidence-based productivity advice and motivation
5. **Focus Session Optimization**: Suggest optimal session durations and strategies

Guidelines:
- Be encouraging but realistic
- Provide actionable, specific advice
- Consider user's energy levels and time constraints
- Suggest concrete next steps
- Ask clarifying questions when needed
- Use the user's preferred tone (motivational, professional, or casual)

Always respond in a helpful, encouraging tone that matches the user's preferences.
`;
  }

  private static buildEnhancedUserPrompt(userMessage: string, conversationHistory: ChatMessage[]): string {
    const recentContext = conversationHistory
      .slice(-3)
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    return `
Recent conversation:
${recentContext}

Current user message: "${userMessage}"

Please provide a helpful, contextual response that builds on the conversation history and addresses the user's current needs.
`;
  }

  private static handleFunctionCall(functionCall: any, userMessage: string): AIResponse {
    const { name, arguments: args } = functionCall;
    const parsedArgs = JSON.parse(args);

    switch (name) {
      case 'create_task':
        return {
          content: `Great! I've created a task: "${parsedArgs.title}". ${this.generateTaskCreationResponse(parsedArgs)}`,
          tasks: [this.formatTask(parsedArgs)],
          suggestions: [
            'Start a focus session now',
            'Add more details to the task',
            'Create another related task',
            'View all your tasks'
          ]
        };

      case 'suggest_action':
        return {
          content: `Based on your current situation, I recommend: ${parsedArgs.reason}`,
          suggestions: [
            `Start ${parsedArgs.action.replace('_', ' ')}`,
            'Tell me more about this',
            'What else can I help with?'
          ],
          actions: [parsedArgs.action]
        };

      default:
        return {
          content: 'I understand. How can I help you further?',
          suggestions: ['Create a task', 'Get productivity advice', 'Plan a project']
        };
    }
  }

  private static generateTaskCreationResponse(taskData: any): string {
    const duration = taskData.estimated_minutes || 30;
    const priority = taskData.priority_score || 50;
    
    let response = `I've estimated it will take ${duration} minutes`;
    
    if (priority > 70) {
      response += ` and marked it as high priority (${priority}/100). This seems urgent!`;
    } else if (priority > 40) {
      response += ` with a priority of ${priority}/100.`;
    } else {
      response += ` with a lower priority (${priority}/100). You can tackle this when you have time.`;
    }

    if (taskData.tags && taskData.tags.length > 0) {
      response += ` I've tagged it with: ${taskData.tags.join(', ')}.`;
    }

    return response;
  }

  private static formatTask(taskData: any): Task {
    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      user_id: 'temp-user-id',
      title: taskData.title,
      description: taskData.description || '',
      priority_score: taskData.priority_score || 50,
      estimated_minutes: taskData.estimated_minutes || 30,
      due_date: taskData.due_date || undefined,
      tags: taskData.tags || [],
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      manual_priority: 0,
    };
  }

  private static generateSmartSuggestions(userMessage: string, userContext: any): string[] {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('task') || lowerMessage.includes('todo')) {
      return [
        'Start a focus session',
        'Break down this task further',
        'Set a deadline',
        'Add related tasks'
      ];
    }
    
    if (lowerMessage.includes('project') || lowerMessage.includes('plan')) {
      return [
        'Create project timeline',
        'Break into smaller tasks',
        'Set milestones',
        'Assign priorities'
      ];
    }
    
    if (lowerMessage.includes('focus') || lowerMessage.includes('session')) {
      return [
        'Start 25-minute session',
        'Start 50-minute session',
        'Review your tasks first',
        'Set up your workspace'
      ];
    }
    
    return [
      'Create a new task',
      'Review your progress',
      'Get productivity tips',
      'Plan your day'
    ];
  }

  private static generateFollowUpQuestions(userMessage: string, userContext: any): string[] {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('busy') || lowerMessage.includes('overwhelmed')) {
      return [
        'What\'s the most urgent thing you need to accomplish today?',
        'Would you like me to help you prioritize your tasks?',
        'How much time do you have available right now?'
      ];
    }
    
    if (lowerMessage.includes('motivation') || lowerMessage.includes('stuck')) {
      return [
        'What would make you feel accomplished today?',
        'What\'s the smallest step you can take right now?',
        'What\'s blocking you from making progress?'
      ];
    }
    
    return [
      'What would you like to work on next?',
      'How can I help you be more productive today?',
      'What\'s your biggest challenge right now?'
    ];
  }

  private static createSmartFallbackResponse(userMessage: string, conversationHistory: ChatMessage[]): AIResponse {
    const lowerMessage = userMessage.toLowerCase();
    
    // Analyze the message for intent
    if (this.isTaskCreationIntent(lowerMessage)) {
      return {
        content: "I'd be happy to help you create a task! Could you give me more details about what you need to accomplish? For example, you could say 'Create a task to finish the project report by Friday' or 'Add a task for reviewing the code changes'.",
        suggestions: ['Create a task', 'Break down a project', 'Set priorities'],
        followUpQuestions: ['What specific task do you want to create?', 'When does this need to be done?']
      };
    }
    
    if (this.isProjectPlanningIntent(lowerMessage)) {
      return {
        content: "Great! Let's break down your project into manageable pieces. What's the main goal, and what are the key steps to get there?",
        suggestions: ['Create project timeline', 'Break into tasks', 'Set milestones'],
        followUpQuestions: ['What\'s the main objective?', 'What\'s your timeline?', 'What resources do you need?']
      };
    }
    
    if (this.isProductivityAdviceIntent(lowerMessage)) {
      return {
        content: "I'm here to help with your productivity! Some proven strategies include time blocking, the Pomodoro Technique, and task prioritization. What specific area would you like to improve?",
        suggestions: ['Learn time blocking', 'Try Pomodoro technique', 'Prioritize tasks'],
        followUpQuestions: ['What\'s your biggest productivity challenge?', 'How do you currently manage your time?']
      };
    }
    
    return {
      content: "I'm your productivity assistant! I can help you create tasks, plan projects, optimize your workflow, and stay motivated. What would you like to work on?",
      suggestions: ['Create a task', 'Plan a project', 'Get productivity tips', 'Start a focus session'],
      followUpQuestions: ['What\'s your main goal today?', 'What\'s the most important thing you need to accomplish?']
    };
  }

  private static isTaskCreationIntent(message: string): boolean {
    const patterns = [
      /(?:create|add|make|set up|start) (?:a )?(?:task|todo|item)/i,
      /(?:need to|have to|should|must|want to) .+/i,
      /(?:call|email|meet|review|check|update) .+/i,
    ];
    return patterns.some(pattern => pattern.test(message));
  }

  private static isProjectPlanningIntent(message: string): boolean {
    const patterns = [
      /(?:project|plan|organize|structure)/i,
      /(?:break down|divide|split) .+/i,
      /(?:timeline|schedule|deadline)/i,
    ];
    return patterns.some(pattern => pattern.test(message));
  }

  private static isProductivityAdviceIntent(message: string): boolean {
    const patterns = [
      /(?:help|advice|tip|suggestion)/i,
      /(?:how to|what should|when should)/i,
      /(?:productivity|efficiency|focus)/i,
    ];
    return patterns.some(pattern => pattern.test(message));
  }
} 