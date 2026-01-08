import { Task, User } from './types';

// Base API URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

// API Client with JWT token attachment
class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Helper method to get JWT token from wherever it's stored
  private getAuthToken(): string | null {
    // In a real implementation, this would get the token from httpOnly cookie,
    // localStorage, or memory depending on the auth implementation
    if (typeof window !== 'undefined') {
      // For now, we'll look for token in localStorage (to be updated based on auth implementation)
      const token = localStorage.getItem('auth_token');

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
        // In a real app, you might want to redirect to login or refresh the token
        // For now, we'll remove the token and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          // In a real app, you would redirect to login page
          // window.location.href = '/login';
        }
        throw new Error('Unauthorized: Please log in again');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API request failed: ${response.status}`);
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
  async signup(userData: { email: string; password: string; name: string }): Promise<{ user: User; token: string }> {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }): Promise<{ user: User; token: string }> {
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
  async getTasks(userId: string): Promise<{ tasks: Task[] }> {
    return this.request(`/api/${userId}/tasks`);
  }

  async createTask(userId: string, taskData: { title: string; description?: string }): Promise<Task> {
    return this.request(`/api/${userId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(userId: string, taskId: string, taskData: { title: string; description?: string }): Promise<Task> {
    return this.request(`/api/${userId}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async toggleTaskCompletion(userId: string, taskId: string): Promise<Task> {
    return this.request(`/api/${userId}/tasks/${taskId}/complete`, {
      method: 'PATCH',
    });
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    await this.request(`/api/${userId}/tasks/${taskId}`, {
      method: 'DELETE',
    });
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