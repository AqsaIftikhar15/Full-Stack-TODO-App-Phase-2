'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Task } from '../../lib/types';

interface TaskCardProps {
  task: Task;
  onUpdateTask?: (id: string, title: string, description?: string) => void;
  onToggleTask?: (id: string) => void;
  onDeleteTask?: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdateTask, onToggleTask, onDeleteTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const handleToggleCompletion = async () => {
    onToggleTask?.(task.id);
  };

  const handleEdit = async () => {
    onUpdateTask?.(task.id, editTitle, editDescription);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDeleteTask?.(task.id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white rounded-lg shadow p-4 mb-3 border-l-4 ${
        task.completed ? 'border-bluish-300' : 'border-purplish-500'
      }`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-bluish-500"
            autoFocus
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-bluish-500"
            rows={2}
          />
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className="px-3 py-1 bg-bluish-500 text-white rounded hover:bg-bluish-600 transition"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggleCompletion}
              className="mt-1 h-5 w-5 text-bluish-600 rounded focus:ring-bluish-500"
            />
            <div className="ml-3 flex-1">
              <h3
                className={`text-lg font-medium ${
                  task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                }`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className={`mt-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-600'}`}>
                  {task.description}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Created: {new Date(task.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-3">
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TaskCard;