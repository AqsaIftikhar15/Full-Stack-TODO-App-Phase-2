// User interface based on data-model.md
export interface User {
  id: string;           // unique identifier from authentication system
  email: string;        // user's email address
  name: string;         // user's display name
  createdAt: Date;      // account creation timestamp
  updatedAt: Date;      // last update timestamp
}

// Task interface based on data-model.md
export interface Task {
  id: string;           // unique identifier from backend
  title: string;        // task title, required
  description?: string; // optional task description
  completed: boolean;   // completion status, default: false
  userId: string;       // foreign key to user who owns this task
  createdAt: string;    // task creation timestamp
  updatedAt: string;    // last update timestamp
}

// Auth state interface
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Tasks state interface
export interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  selectedTask: Task | null;
}

// UI state interface
export interface UIState {
  showCreateForm: boolean;
  showEditModal: boolean;
  animationsEnabled: boolean;
}