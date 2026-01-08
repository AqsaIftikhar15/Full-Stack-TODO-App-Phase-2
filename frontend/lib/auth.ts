import { User } from './types';

// Mock auth implementation for now - this would integrate with Better Auth when available
class AuthManager {
  // Check if user is authenticated
  isAuthenticated(): boolean {
    // In a real implementation, this would check for a valid JWT token
    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  }

  // Get the current user's token
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      // Try to get from localStorage first, but in a real app with Better Auth,
      // tokens would typically be stored in httpOnly cookies
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  // Set the user's token
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);

      // In a real implementation with Better Auth, the token would be stored
      // in an httpOnly cookie for security, which is not accessible via JS
    }
  }

  // Remove the user's token (logout)
  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');

      // In a real implementation, we would also clear the httpOnly cookie
      // via an API call to the auth provider
    }
  }

  // Get the current user from storage
  getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('current_user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch (e) {
          console.error('Error parsing current user from localStorage', e);
          return null;
        }
      }
    }
    return null;
  }

  // Set the current user in storage
  setCurrentUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('current_user', JSON.stringify(user));
    }
  }

  // Clear current user from storage
  clearCurrentUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('current_user');
    }
  }

  // Complete logout - clear both token and user data
  logout(): void {
    this.removeToken();
    this.clearCurrentUser();
  }

  // Check if the token is expired
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

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

  // Refresh the token if needed
  async refreshTokenIfNeeded(): Promise<boolean> {
    if (this.isTokenExpired()) {
      // In a real implementation, this would call the refresh endpoint
      // For now, we'll just return false to indicate refresh failed
      // In a real app with Better Auth, there would be an automatic refresh mechanism
      try {
        // Attempt to refresh the token using the refresh endpoint
        // This would typically be handled by Better Auth automatically
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include', // Include httpOnly cookies
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          this.setToken(data.token);
          return true;
        } else {
          // If refresh fails, clear the token
          this.logout();
          return false;
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        return false;
      }
    }
    return true;
  }
}

// Create and export a singleton instance
export const authManager = new AuthManager();

// Export convenience functions
export const {
  isAuthenticated,
  getToken,
  setToken,
  removeToken,
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  logout,
  isTokenExpired,
  refreshTokenIfNeeded,
} = authManager;