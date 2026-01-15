'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '../../lib/types';

interface TaskTableProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  onUpdateTask?: (id: string, title: string, description?: string) => void;
  onToggleTask?: (id: string) => void;
  onDeleteTask?: (id: string) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  loading,
  error,
  onUpdateTask,
  onToggleTask,
  onDeleteTask
}) => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const formatDate = (dateValue: string | Date | undefined): string => {
    if (!dateValue) return 'Invalid Date';

    try {
      // Handle both string and Date objects
      const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  };

  const handleSaveEdit = () => {
    if (editingTaskId && onUpdateTask) {
      onUpdateTask(editingTaskId, editTitle, editDescription);
      setEditingTaskId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
  };

  const handleToggleCompletion = (id: string) => {
    onToggleTask?.(id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDeleteTask?.(id);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded mb-2"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
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
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
              Status
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Task
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.tr
                key={task.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`transition-colors duration-200 ${
                  task.completed ? 'bg-gray-50 text-gray-500' : ''
                }`}
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleCompletion(task.id)}
                    className="h-4 w-4 text-bluish-600 rounded focus:ring-bluish-500"
                  />
                </td>
                <td className="px-4 py-3">
                  {editingTaskId === task.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-bluish-500 text-sm"
                        autoFocus
                      />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-bluish-500 text-sm"
                        rows={2}
                      />
                      <div className="flex space-x-2 mt-1">
                        <button
                          onClick={handleSaveEdit}
                          className="px-2 py-1 bg-bluish-500 text-white rounded text-xs hover:bg-bluish-600 transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-2 py-1 bg-gray-300 text-gray-700 rounded text-xs hover:bg-gray-400 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className={`font-medium ${task.completed ? 'line-through' : ''}`}>
                        {task.title}
                      </div>
                      {task.description && (
                        <div className={`text-sm ${task.completed ? 'line-through' : ''} text-gray-600`}>
                          {task.description}
                        </div>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(task.createdAt)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  {editingTaskId !== task.id && (
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => startEditing(task)}
                        className="text-sm px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="text-sm px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;