'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Task } from '../../lib/types';
import TaskCard from './TaskCard';
import Loader from './Loader';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  onUpdateTask?: (id: string, title?: string, description?: string, priority?: 'low' | 'medium' | 'high', tags?: string[], dueDate?: string | Date, reminderConfig?: { enabled: boolean; notifyBefore: number; method: 'email' | 'push' | 'both' }, recurrenceRule?: { enabled: boolean; pattern: 'daily' | 'weekly' | 'monthly' | 'interval'; intervalDays?: number; endsOn?: string | Date; occurrencesCount?: number }, status?: 'pending' | 'completed' | 'archived') => void;
  onToggleTask?: (id: string) => void;
  onDeleteTask?: (id: string) => void;
  priorityFilter?: string;
  tagFilter?: string;
  statusFilter?: string;
  sortBy?: string;
  sortOrder?: string;
  searchQuery?: string;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading,
  error,
  onUpdateTask,
  onToggleTask,
  onDeleteTask,
  priorityFilter,
  tagFilter,
  statusFilter,
  sortBy,
  sortOrder,
  searchQuery
}) => {
  if (loading) {
    return <Loader text="Loading tasks..." />;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">Error: {error}</span>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No tasks yet. Add your first task to get started!</p>
      </div>
    );
  }

  // Filter tasks based on filters
  let filteredTasks = [...tasks];

  if (priorityFilter) {
    filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter);
  }

  if (tagFilter) {
    filteredTasks = filteredTasks.filter(task =>
      task.tags && task.tags.some(tag => tag.toLowerCase().includes(tagFilter.toLowerCase()))
    );
  }

  if (statusFilter) {
    if (statusFilter === 'completed') {
      filteredTasks = filteredTasks.filter(task => task.completed || task.status === 'completed');
    } else if (statusFilter === 'pending') {
      filteredTasks = filteredTasks.filter(task => !task.completed && task.status !== 'completed' && task.status !== 'archived');
    } else if (statusFilter === 'archived') {
      filteredTasks = filteredTasks.filter(task => task.status === 'archived');
    }
  }

  if (searchQuery) {
    filteredTasks = filteredTasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  // Sort tasks based on sort criteria
  if (sortBy && sortOrder) {
    filteredTasks.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'priority':
          // Define priority order: high > medium > low
          const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
          aValue = priorityOrder[a.priority || 'medium'];
          bValue = priorityOrder[b.priority || 'medium'];
          break;
        case 'due_date':
          aValue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          bValue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          break;
        case 'created_at':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  return (
    <div className="mt-4">
      {filteredTasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No tasks match the current filters.</p>
        </div>
      ) : (
        <AnimatePresence>
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdateTask={onUpdateTask}
              onToggleTask={onToggleTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

export default TaskList;