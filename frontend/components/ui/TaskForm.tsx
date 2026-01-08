'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TaskFormProps {
  onCreateTask: (title: string, description?: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onCreateTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onCreateTask(title, description);
      setTitle('');
      setDescription('');
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow p-6 mb-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Task</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bluish-500 focus:border-transparent"
            placeholder="What needs to be done?"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bluish-500 focus:border-transparent"
            rows={3}
            placeholder="Add details (optional)"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium transition duration-300 ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-bluish-500 to-purplish-500 hover:from-bluish-600 hover:to-purplish-600'
          }`}
        >
          {loading ? 'Creating task...' : 'Add Task'}
        </button>
      </form>
    </motion.div>
  );
};

export default TaskForm;