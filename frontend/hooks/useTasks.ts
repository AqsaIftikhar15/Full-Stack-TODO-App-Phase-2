'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Task } from '../lib/types';
import { apiClient } from '../lib/api';
import { authManager } from '../lib/auth';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (title: string, description?: string, priority?: 'low' | 'medium' | 'high', tags?: string[], dueDate?: string | Date, reminderConfig?: { enabled: boolean; notifyBefore: number; method: 'email' | 'push' | 'both' }, recurrenceRule?: { enabled: boolean; pattern: 'daily' | 'weekly' | 'monthly' | 'interval'; intervalDays?: number; endsOn?: string | Date; occurrencesCount?: number }) => Promise<void>;
  updateTask: (id: string, title?: string, description?: string, priority?: 'low' | 'medium' | 'high', tags?: string[], dueDate?: string | Date, reminderConfig?: { enabled: boolean; notifyBefore: number; method: 'email' | 'push' | 'both' }, recurrenceRule?: { enabled: boolean; pattern: 'daily' | 'weekly' | 'monthly' | 'interval'; intervalDays?: number; endsOn?: string | Date; occurrencesCount?: number }, status?: 'pending' | 'completed' | 'archived') => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  archiveTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  searchTasks: (query: string) => Promise<Task[]>;
  configureReminder: (taskId: string, reminderConfig: { enabled: boolean; notifyBefore: number; method: 'email' | 'push' | 'both' }) => Promise<void>;
  configureRecurrence: (taskId: string, recurrenceRule: { enabled: boolean; pattern: 'daily' | 'weekly' | 'monthly' | 'interval'; intervalDays?: number; endsOn?: string | Date; occurrencesCount?: number }) => Promise<void>;
  getActivityLog: (taskId: string) => Promise<any>;
}

export const useTasks = (): UseTasksReturn => {
  const userId = authManager.getCurrentUser()?.id;
  const {
    data: tasks = [],
    error,
    isLoading,
    mutate,
  } = useSWR(userId ? `/tasks/` : null, () => apiClient.getTasks().then(res => res.tasks));

  const [mutationLoading, setMutationLoading] = useState(false);

  const createTask = async (
    title: string,
    description?: string,
    priority?: 'low' | 'medium' | 'high',
    tags?: string[],
    dueDate?: string | Date,
    reminderConfig?: { enabled: boolean; notifyBefore: number; method: 'email' | 'push' | 'both' },
    recurrenceRule?: { enabled: boolean; pattern: 'daily' | 'weekly' | 'monthly' | 'interval'; intervalDays?: number; endsOn?: string | Date; occurrencesCount?: number }
  ): Promise<void> => {
    if (!userId) throw new Error('User not authenticated');

    setMutationLoading(true);
    try {
      await apiClient.createTask({
        title,
        description,
        priority,
        tags,
        dueDate,
        reminderConfig,
        recurrenceRule
      });
      await mutate(); // Refresh the tasks list
    } catch (err) {
      console.error('Error creating task:', err);
      throw err;
    } finally {
      setMutationLoading(false);
    }
  };

  const updateTask = async (
    id: string, 
    title?: string, 
    description?: string, 
    priority?: 'low' | 'medium' | 'high', 
    tags?: string[], 
    dueDate?: string | Date, 
    reminderConfig?: { enabled: boolean; notifyBefore: number; method: 'email' | 'push' | 'both' }, 
    recurrenceRule?: { enabled: boolean; pattern: 'daily' | 'weekly' | 'monthly' | 'interval'; intervalDays?: number; endsOn?: string | Date; occurrencesCount?: number },
    status?: 'pending' | 'completed' | 'archived'
  ) => {
    if (!userId) throw new Error('User not authenticated');

    setMutationLoading(true);
    try {
      await apiClient.updateTask(id, { 
        title, 
        description, 
        priority, 
        tags, 
        dueDate,
        reminderConfig,
        recurrenceRule,
        status
      });
      await mutate(); // Refresh the tasks list
    } catch (err) {
      console.error('Error updating task:', err);
      throw err;
    } finally {
      setMutationLoading(false);
    }
  };

  const toggleTaskCompletion = async (id: string) => {
    if (!userId) throw new Error('User not authenticated');

    setMutationLoading(true);
    try {
      await apiClient.toggleTaskCompletion(id);
      await mutate(); // Refresh the tasks list
    } catch (err) {
      console.error('Error toggling task completion:', err);
      throw err;
    } finally {
      setMutationLoading(false);
    }
  };

  const completeTask = async (id: string) => {
    if (!userId) throw new Error('User not authenticated');

    setMutationLoading(true);
    try {
      await apiClient.completeTask(id);
      await mutate(); // Refresh the tasks list
    } catch (err) {
      console.error('Error completing task:', err);
      throw err;
    } finally {
      setMutationLoading(false);
    }
  };

  const archiveTask = async (id: string) => {
    if (!userId) throw new Error('User not authenticated');

    setMutationLoading(true);
    try {
      await apiClient.archiveTask(id);
      await mutate(); // Refresh the tasks list
    } catch (err) {
      console.error('Error archiving task:', err);
      throw err;
    } finally {
      setMutationLoading(false);
    }
  };

  const searchTasks = async (query: string): Promise<Task[]> => {
    if (!userId) throw new Error('User not authenticated');

    try {
      const result = await apiClient.searchTasks(query);
      return result.tasks;
    } catch (err) {
      console.error('Error searching tasks:', err);
      throw err;
    }
  };

  const configureReminder = async (taskId: string, reminderConfig: { enabled: boolean; notifyBefore: number; method: 'email' | 'push' | 'both' }) => {
    if (!userId) throw new Error('User not authenticated');

    try {
      await apiClient.configureReminder(taskId, reminderConfig);
    } catch (err) {
      console.error('Error configuring reminder:', err);
      throw err;
    }
  };

  const configureRecurrence = async (taskId: string, recurrenceRule: { enabled: boolean; pattern: 'daily' | 'weekly' | 'monthly' | 'interval'; intervalDays?: number; endsOn?: string | Date; occurrencesCount?: number }) => {
    if (!userId) throw new Error('User not authenticated');

    try {
      await apiClient.configureRecurrence(taskId, recurrenceRule);
    } catch (err) {
      console.error('Error configuring recurrence:', err);
      throw err;
    }
  };

  const getActivityLog = async (taskId: string) => {
    if (!userId) throw new Error('User not authenticated');

    try {
      return await apiClient.getActivityLog(taskId);
    } catch (err) {
      console.error('Error getting activity log:', err);
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    if (!userId) throw new Error('User not authenticated');

    setMutationLoading(true);
    try {
      await apiClient.deleteTask(id);
      await mutate(); // Refresh the tasks list
    } catch (err) {
      console.error('Error deleting task:', err);
      throw err;
    } finally {
      setMutationLoading(false);
    }
  };

  return {
    tasks: tasks || [],
    loading: mutationLoading || isLoading,
    error: error ? error.message : null,
    createTask,
    updateTask,
    toggleTaskCompletion,
    completeTask,
    archiveTask,
    deleteTask,
    searchTasks,
    configureReminder,
    configureRecurrence,
    getActivityLog
  };
};