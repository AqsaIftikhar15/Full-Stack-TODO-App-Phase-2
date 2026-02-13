'use client';

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { Task } from '../../lib/types';
import Navbar from '../../components/ui/Navbar';
import TaskForm from '../../components/ui/TaskForm';
import TaskTable from '../../components/ui/TaskTable';
import Loader from '../../components/ui/Loader';

const TasksPage: React.FC = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { tasks, loading: tasksLoading, error, createTask, updateTask, toggleTaskCompletion, deleteTask } = useTasks();

  // For non-authenticated users, maintain temporary tasks in local state
  const [tempTasks, setTempTasks] = useState<Task[]>([]);
  const [tempLoading, setTempLoading] = useState(false);

  // Determine which tasks to display based on authentication status
  const displayTasks = isAuthenticated ? tasks : tempTasks;
  const displayLoading = isAuthenticated ? tasksLoading : tempLoading;

  // Handle temporary tasks for non-authenticated users
  const handleCreateTempTask = async (
    title: string,
    description?: string,
    priority?: 'low' | 'medium' | 'high',
    tags?: string[],
    dueDate?: string | Date,
    reminderConfig?: { enabled: boolean; notifyBefore: number; method: 'email' | 'push' | 'both' },
    recurrenceRule?: { enabled: boolean; pattern: 'daily' | 'weekly' | 'monthly' | 'interval'; intervalDays?: number; endsOn?: string | Date; occurrencesCount?: number }
  ): Promise<void> => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description: description || '',
      completed: false,
      userId: 'guest',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      priority: priority || 'medium',
      tags: tags || [],
      dueDate: dueDate ? (typeof dueDate === 'string' ? dueDate : new Date(dueDate).toISOString()) : undefined,
      reminderConfig: reminderConfig || { enabled: false, notifyBefore: 15, method: 'push' },
      recurrenceRule: recurrenceRule || { enabled: false, pattern: 'daily', endsOn: undefined },
      status: 'pending'
    };
    setTempTasks(prev => [...prev, newTask]);
  };

  const handleUpdateTempTask = async (
    id: string,
    title?: string,
    description?: string,
    priority?: 'low' | 'medium' | 'high',
    tags?: string[],
    dueDate?: string | Date,
    reminderConfig?: { enabled: boolean; notifyBefore: number; method: 'email' | 'push' | 'both' },
    recurrenceRule?: { enabled: boolean; pattern: 'daily' | 'weekly' | 'monthly' | 'interval'; intervalDays?: number; endsOn?: string | Date; occurrencesCount?: number },
    status?: 'pending' | 'completed' | 'archived'
  ): Promise<void> => {
    setTempTasks(prev =>
      prev.map(task =>
        task.id === id
          ? {
              ...task,
              title: title || task.title,
              description: description || task.description,
              priority: priority || task.priority,
              tags: tags || task.tags,
              dueDate: dueDate || task.dueDate,
              reminderConfig: reminderConfig || task.reminderConfig,
              recurrenceRule: recurrenceRule || task.recurrenceRule,
              status: status || task.status,
              updatedAt: new Date().toISOString()
            }
          : task
      )
    );
  };

  const handleToggleTempTask = async (id: string): Promise<void> => {
    setTempTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const handleDeleteTempTask = async (id: string): Promise<void> => {
    setTempTasks(prev => prev.filter(task => task.id !== id));
  };

  // Determine which functions to use based on authentication status
  const currentCreateTask = isAuthenticated 
    ? (title: string, description?: string, priority?: 'low' | 'medium' | 'high', tags?: string[], dueDate?: string | Date, reminderConfig?: { enabled: boolean; notifyBefore: number; method: 'email' | 'push' | 'both' }, recurrenceRule?: { enabled: boolean; pattern: 'daily' | 'weekly' | 'monthly' | 'interval'; intervalDays?: number; endsOn?: string | Date; occurrencesCount?: number }) => 
        createTask(title, description, priority, tags, dueDate, reminderConfig, recurrenceRule)
    : handleCreateTempTask;
  const currentUpdateTask = isAuthenticated
    ? (id: string, title?: string, description?: string, priority?: 'low' | 'medium' | 'high', tags?: string[], dueDate?: string | Date, reminderConfig?: { enabled: boolean; notifyBefore: number; method: 'email' | 'push' | 'both' }, recurrenceRule?: { enabled: boolean; pattern: 'daily' | 'weekly' | 'monthly' | 'interval'; intervalDays?: number; endsOn?: string | Date; occurrencesCount?: number }, status?: 'pending' | 'completed' | 'archived') => 
        updateTask(id, title, description, priority, tags, dueDate, reminderConfig, recurrenceRule, status)
    : handleUpdateTempTask;
  const currentToggleTask = isAuthenticated 
    ? (id: string) => toggleTaskCompletion(id)
    : handleToggleTempTask;
  const currentDeleteTask = isAuthenticated 
    ? (id: string) => deleteTask(id)
    : handleDeleteTempTask;

  if (authLoading) {
    return <Loader text="Loading..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bluish-50 to-purplish-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Task Table */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {isAuthenticated ? `Hello, ${user?.name || user?.email}!` : 'AquaTodo'}
            </h1>
            <p className="text-gray-600 mb-4">
              {isAuthenticated
                ? 'Here are your tasks'
                : 'Manage your tasks - Login to save your tasks permanently'
              }
            </p>

            {!isAuthenticated && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-6 text-center">
                <p className="font-medium">Note: Your tasks are temporary and will be lost when you refresh the page.</p>
                <p className="mt-1">Login to save your tasks permanently.</p>
              </div>
            )}

            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Tasks</h2>
                <TaskTable
                  tasks={displayTasks}
                  loading={displayLoading}
                  error={error}
                  onUpdateTask={currentUpdateTask}
                  onToggleTask={currentToggleTask}
                  onDeleteTask={currentDeleteTask}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Task Form */}
          <div>
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Task</h2>
              <TaskForm onCreateTask={currentCreateTask} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;