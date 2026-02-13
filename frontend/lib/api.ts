import { Task, User } from './types';

// Base API URL from environment (does not include /api/v1 - that's added in the request method)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// API Client with JWT token attachment
class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/v1`;
  }

  // Helper method to get JWT token from wherever it's stored
  private getAuthToken(): string | null {
    // In a real implementation, this would get the token from httpOnly cookie,
    // localStorage, or memory depending on the auth implementation
    if (typeof window !== 'undefined') {
      // For now, we'll look for token in localStorage (to be updated based on auth implementation)
      const token = localStorage.getItem('auth_token');

      // Validate that the token is in proper JWT format (has 3 parts separated by dots)
      if (token) {
        const parts = token.split('.');
        if (parts.length !== 3) {
          console.warn('Stored token is not a valid JWT format, removing it');
          localStorage.removeItem('auth_token');
          return null;
        }
      }

      // Check if token is expired before using it
      if (token && this.isTokenExpired(token)) {
        localStorage.removeItem('auth_token');
        return null;
      }

      return token;
    }
    return null;
  }

  // Helper method to check if token is expired
  private isTokenExpired(token: string): boolean {
    try {
      // JWT tokens have payload that includes expiration time
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      const parsedPayload = JSON.parse(decodedPayload);

      // Check if the token is expired (exp is in seconds)
      const currentTime = Math.floor(Date.now() / 1000);
      return parsedPayload.exp < currentTime;
    } catch (e) {
      console.error('Error checking token expiration', e);
      return true; // If we can't parse it, assume it's expired
    }
  }

  // Helper method to create headers with JWT token
  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 Unauthorized - token might be expired
      if (response.status === 401) {
        // For login requests, we want to show the specific error from the server
        // Check if this is a login request
        if (endpoint.includes('/auth/login')) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || errorData.message || 'Incorrect email or password');
        } else {
          // For other requests, it's likely an expired token scenario
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            // In a real app, you would redirect to login page
            // window.location.href = '/login';
          }
          throw new Error('Unauthorized: Please log in again');
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || `API request failed: ${response.status}`);
      }

      // Handle responses that don't have a body (like DELETE requests)
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error(`API request error for ${url}:`, error);
      throw error;
    }
  }

  // Authentication methods
  async signup(userData: { email: string; password: string; username: string }): Promise<{ user: User; token: string }> {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }): Promise<{ user: User; access_token: string; token_type: string }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Task methods
  async getTasks(): Promise<{ tasks: Task[] }> {
    const response: any = await this.request(`/tasks/`);

    // Map backend response to frontend Task interface
    const mappedTasks = response.tasks.map((task: any) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.is_completed,
      userId: task.user_id,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
      priority: task.priority,
      tags: task.tags,
      dueDate: task.due_date,
      reminderConfig: task.reminder_config,
      recurrenceRule: task.recurrence_rule,
      status: task.status
    }));

    return { tasks: mappedTasks };
  }

  async createTask(taskData: {
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    tags?: string[];
    dueDate?: string | Date;
    reminderConfig?: { enabled: boolean; notifyBefore: number; method: 'email' | 'push' | 'both' };
    recurrenceRule?: { enabled: boolean; pattern: 'daily' | 'weekly' | 'monthly' | 'interval'; intervalDays?: number; endsOn?: string | Date | null; occurrencesCount?: number };
  }): Promise<Task> {
    const response: any = await this.request(`/tasks/`, {
      method: 'POST',
      body: JSON.stringify(taskData),
    });

    // Map backend response to frontend Task interface
    return {
      id: response.id,
      title: response.title,
      description: response.description,
      completed: response.is_completed,
      userId: response.user_id,
      createdAt: response.created_at,
      updatedAt: response.updated_at,
      priority: response.priority,
      tags: response.tags,
      dueDate: response.due_date,
      reminderConfig: response.reminder_config,
      recurrenceRule: response.recurrence_rule,
      status: response.status
    };
  }

  async updateTask(taskId: string, taskData: { 
    title?: string; 
    description?: string; 
    completed?: boolean; 
    priority?: 'low' | 'medium' | 'high'; 
    tags?: string[]; 
    dueDate?: string | Date; 
    reminderConfig?: { enabled: boolean; notifyBefore: number; method: 'email' | 'push' | 'both' }; 
    recurrenceRule?: { enabled: boolean; pattern: 'daily' | 'weekly' | 'monthly' | 'interval'; intervalDays?: number; endsOn?: string | Date | null; occurrencesCount?: number }; 
    status?: 'pending' | 'completed' | 'archived';
  }): Promise<Task> {
    const response: any = await this.request(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });

    // Map backend response to frontend Task interface
    return {
      id: response.id,
      title: response.title,
      description: response.description,
      completed: response.is_completed,
      userId: response.user_id,
      createdAt: response.created_at,
      updatedAt: response.updated_at,
      priority: response.priority,
      tags: response.tags,
      dueDate: response.due_date,
      reminderConfig: response.reminder_config,
      recurrenceRule: response.recurrence_rule,
      status: response.status
    };
  }

  async toggleTaskCompletion(taskId: string): Promise<Task> {
    // First get the current task to know its current completion status
    const currentTask: any = await this.request(`/tasks/${taskId}`);

    // Toggle the completion status
    const updatedTask: any = await this.request(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify({ is_completed: !currentTask.is_completed }),
    });

    // Map backend response to frontend Task interface
    return {
      id: updatedTask.id,
      title: updatedTask.title,
      description: updatedTask.description,
      completed: updatedTask.is_completed,
      userId: updatedTask.user_id,
      createdAt: updatedTask.created_at,
      updatedAt: updatedTask.updated_at,
      priority: updatedTask.priority,
      tags: updatedTask.tags,
      dueDate: updatedTask.due_date,
      reminderConfig: updatedTask.reminder_config,
      recurrenceRule: updatedTask.recurrence_rule,
      status: updatedTask.status
    };
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.request(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  // Advanced feature methods
  async searchTasks(query: string): Promise<{ tasks: Task[] }> {
    const response: any = await this.request(`/tasks/search?q=${encodeURIComponent(query)}`);
    
    // Handle both array response (direct) and object response (with pagination)
    const tasksArray = Array.isArray(response) ? response : response.tasks;
    
    const mappedTasks = tasksArray.map((task: any) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.is_completed,
      userId: task.user_id,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
      priority: task.priority,
      tags: task.tags,
      dueDate: task.due_date,
      reminderConfig: task.reminder_config,
      recurrenceRule: task.recurrence_rule,
      status: task.status
    }));

    return { tasks: mappedTasks };
  }

  async configureReminder(taskId: string, reminderConfig: { enabled: boolean; notifyBefore: number; method: 'email' | 'push' | 'both' }): Promise<any> {
    const response: any = await this.request(`/tasks/${taskId}/reminder`, {
      method: 'POST',
      body: JSON.stringify(reminderConfig),
    });

    return response;
  }

  async getReminderConfig(taskId: string): Promise<any> {
    const response: any = await this.request(`/tasks/${taskId}/reminder`);
    
    return response;
  }

  async configureRecurrence(taskId: string, recurrenceRule: { enabled: boolean; pattern: 'daily' | 'weekly' | 'monthly' | 'interval'; intervalDays?: number; endsOn?: string | Date; occurrencesCount?: number }): Promise<any> {
    const response: any = await this.request(`/tasks/${taskId}/recurrence`, {
      method: 'POST',
      body: JSON.stringify(recurrenceRule),
    });

    return response;
  }

  async getRecurrenceConfig(taskId: string): Promise<any> {
    const response: any = await this.request(`/tasks/${taskId}/recurrence`);
    
    return response;
  }

  async completeTask(taskId: string): Promise<Task> {
    const response: any = await this.request(`/tasks/${taskId}/complete`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'completed' }),
    });

    return {
      id: response.id,
      title: response.title,
      description: response.description,
      completed: response.is_completed,
      userId: response.user_id,
      createdAt: response.created_at,
      updatedAt: response.updated_at,
      priority: response.priority,
      tags: response.tags,
      dueDate: response.due_date,
      reminderConfig: response.reminder_config,
      recurrenceRule: response.recurrence_rule,
      status: response.status
    };
  }

  async archiveTask(taskId: string): Promise<Task> {
    const response: any = await this.request(`/tasks/${taskId}/archive`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'archived' }),
    });

    return {
      id: response.id,
      title: response.title,
      description: response.description,
      completed: response.is_completed,
      userId: response.user_id,
      createdAt: response.created_at,
      updatedAt: response.updated_at,
      priority: response.priority,
      tags: response.tags,
      dueDate: response.due_date,
      reminderConfig: response.reminder_config,
      recurrenceRule: response.recurrence_rule,
      status: response.status
    };
  }

  async getActivityLog(taskId: string): Promise<any> {
    const response: any = await this.request(`/tasks/${taskId}/activity`);
    
    return response;
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export individual methods for convenience
export const {
  signup,
  login,
  logout,
  getTasks,
  createTask,
  updateTask,
  toggleTaskCompletion,
  deleteTask,
} = apiClient;