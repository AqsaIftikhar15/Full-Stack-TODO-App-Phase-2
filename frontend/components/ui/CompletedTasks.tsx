'use client';

import React from 'react';
import { Task } from '../../lib/types';
import TaskCard from './TaskCard';

interface CompletedTasksProps {
  tasks: Task[];
  onUpdateTask?: (id: string, title?: string, description?: string, priority?: 'low' | 'medium' | 'high', tags?: string[], dueDate?: string | Date, reminderConfig?: { enabled: boolean; notifyBefore: number; method: 'email' | 'push' | 'both' }, recurrenceRule?: { enabled: boolean; pattern: 'daily' | 'weekly' | 'monthly' | 'interval'; intervalDays?: number; endsOn?: string | Date; occurrencesCount?: number }, status?: 'pending' | 'completed' | 'archived') => void;
  onToggleTask?: (id: string) => void;
  onDeleteTask?: (id: string) => void;
}

const CompletedTasks: React.FC<CompletedTasksProps> = ({ 
  tasks, 
  onUpdateTask, 
  onToggleTask, 
  onDeleteTask 
}) => {
  const completedTasks = tasks.filter(task => task.status === 'completed' || task.completed);

  if (completedTasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Completed Tasks</h2>
        <p className="text-gray-500">No completed tasks yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Completed Tasks</h2>
      <div className="mt-4">
        {completedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdateTask={onUpdateTask}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
};

export default CompletedTasks;