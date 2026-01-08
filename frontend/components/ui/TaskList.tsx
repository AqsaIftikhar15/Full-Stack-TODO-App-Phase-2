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
  onUpdateTask?: (id: string, title: string, description?: string) => void;
  onToggleTask?: (id: string) => void;
  onDeleteTask?: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading,
  error,
  onUpdateTask,
  onToggleTask,
  onDeleteTask
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

  return (
    <div className="mt-4">
      <AnimatePresence>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdateTask={onUpdateTask}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;