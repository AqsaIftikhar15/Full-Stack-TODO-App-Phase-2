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
  createTask: (title: string, description?: string) => Promise<void>;
  updateTask: (id: string, title: string, description?: string) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTasks = (): UseTasksReturn => {
  const userId = authManager.getCurrentUser()?.id;
  const {
    data: tasks = [],
    error,
    isLoading,
    mutate,
  } = useSWR(userId ? `/api/${userId}/tasks` : null, () => apiClient.getTasks(userId!).then(res => res.tasks));

  const [mutationLoading, setMutationLoading] = useState(false);

  const createTask = async (title: string, description?: string) => {
    if (!userId) throw new Error('User not authenticated');

    setMutationLoading(true);
    try {
      await apiClient.createTask(userId, { title, description });
      await mutate(); // Refresh the tasks list
    } catch (err) {
      console.error('Error creating task:', err);
      throw err;
    } finally {
      setMutationLoading(false);
    }
  };

  const updateTask = async (id: string, title: string, description?: string) => {
    if (!userId) throw new Error('User not authenticated');

    setMutationLoading(true);
    try {
      await apiClient.updateTask(userId, id, { title, description });
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
      await apiClient.toggleTaskCompletion(userId, id);
      await mutate(); // Refresh the tasks list
    } catch (err) {
      console.error('Error toggling task completion:', err);
      throw err;
    } finally {
      setMutationLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    if (!userId) throw new Error('User not authenticated');

    setMutationLoading(true);
    try {
      await apiClient.deleteTask(userId, id);
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
    deleteTask,
  };
};