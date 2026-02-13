'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TaskFormProps {
  onCreateTask: (
    title: string,
    description?: string,
    priority?: 'low' | 'medium' | 'high',
    tags?: string[],
    dueDate?: string | Date,
    reminderConfig?: { enabled: boolean; notifyBefore: number; method: 'email' | 'push' | 'both' },
    recurrenceRule?: { enabled: boolean; pattern: 'daily' | 'weekly' | 'monthly' | 'interval'; intervalDays?: number; endsOn?: string | Date; occurrencesCount?: number }
  ) => Promise<void>;
}

const TaskForm: React.FC<TaskFormProps> = ({ onCreateTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [dueDate, setDueDate] = useState<string | Date | null>(null);
  const [reminderConfig, setReminderConfig] = useState({
    enabled: false,
    notifyBefore: 15,
    method: 'push' as 'email' | 'push' | 'both'
  });
  const [recurrenceRule, setRecurrenceRule] = useState({
    enabled: false,
    pattern: 'daily' as 'daily' | 'weekly' | 'monthly' | 'interval',
    intervalDays: 1,
    endsOn: null as string | Date | null,
    occurrencesCount: 10
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 10) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onCreateTask(
        title, 
        description, 
        priority, 
        tags, 
        dueDate ? (typeof dueDate === 'string' ? dueDate : dueDate.toISOString()) : undefined, 
        reminderConfig.enabled ? reminderConfig : undefined, 
        recurrenceRule.enabled ? { ...recurrenceRule, endsOn: recurrenceRule.endsOn || undefined } : undefined
      );
      setTitle('');
      setDescription('');
      setPriority('medium');
      setTags([]);
      setTagInput('');
      setDueDate(null);
      setReminderConfig({ enabled: false, notifyBefore: 15, method: 'push' });
      setRecurrenceRule({ enabled: false, pattern: 'daily', intervalDays: 1, endsOn: null, occurrencesCount: 10 });
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

        {/* Priority Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <div className="flex space-x-4">
            {(['low', 'medium', 'high'] as const).map((level) => (
              <label key={level} className="inline-flex items-center">
                <input
                  type="radio"
                  value={level}
                  checked={priority === level}
                  onChange={() => setPriority(level)}
                  className="h-4 w-4 text-bluish-600 focus:ring-bluish-500"
                  disabled={loading}
                />
                <span className="ml-2 text-gray-700 capitalize">{level}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tags Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <div className="flex">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-bluish-500 focus:border-transparent"
              placeholder="Add a tag (press Enter)"
              disabled={loading || tags.length >= 10}
            />
            <button
              type="button"
              onClick={handleAddTag}
              disabled={loading || tags.length >= 10}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-lg hover:bg-gray-300 disabled:opacity-50"
            >
              Add
            </button>
          </div>
          
          {/* Display current tags */}
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  className="ml-2 text-blue-800 hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          {tags.length >= 10 && (
            <p className="text-xs text-gray-500 mt-1">Maximum 10 tags allowed</p>
          )}
        </div>

        {/* Due Date Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate ? new Date(dueDate).toISOString().split('T')[0] : ''}
            onChange={(e) => setDueDate(e.target.value ? new Date(e.target.value) : null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bluish-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        {/* Reminder Configuration */}
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="reminder-enabled"
              checked={reminderConfig.enabled}
              onChange={(e) => setReminderConfig({...reminderConfig, enabled: e.target.checked})}
              className="h-4 w-4 text-bluish-600 focus:ring-bluish-500"
              disabled={loading}
            />
            <label htmlFor="reminder-enabled" className="ml-2 text-sm font-medium text-gray-700">
              Enable Reminder
            </label>
          </div>
          
          {reminderConfig.enabled && (
            <div className="ml-6 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notify before due date (minutes)
                </label>
                <input
                  type="number"
                  value={reminderConfig.notifyBefore}
                  onChange={(e) => setReminderConfig({...reminderConfig, notifyBefore: parseInt(e.target.value) || 15})}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bluish-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notification method
                </label>
                <div className="flex space-x-4">
                  {(['email', 'push', 'both'] as const).map((method) => (
                    <label key={method} className="inline-flex items-center">
                      <input
                        type="radio"
                        value={method}
                        checked={reminderConfig.method === method}
                        onChange={() => setReminderConfig({...reminderConfig, method})}
                        className="h-4 w-4 text-bluish-600 focus:ring-bluish-500"
                        disabled={loading}
                      />
                      <span className="ml-2 text-gray-700 capitalize">{method}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recurrence Configuration */}
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="recurrence-enabled"
              checked={recurrenceRule.enabled}
              onChange={(e) => setRecurrenceRule({...recurrenceRule, enabled: e.target.checked})}
              className="h-4 w-4 text-bluish-600 focus:ring-bluish-500"
              disabled={loading}
            />
            <label htmlFor="recurrence-enabled" className="ml-2 text-sm font-medium text-gray-700">
              Enable Recurrence
            </label>
          </div>
          
          {recurrenceRule.enabled && (
            <div className="ml-6 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recurrence Pattern
                </label>
                <select
                  value={recurrenceRule.pattern}
                  onChange={(e) => setRecurrenceRule({...recurrenceRule, pattern: e.target.value as any})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bluish-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="interval">Custom Interval</option>
                </select>
              </div>
              
              {recurrenceRule.pattern === 'interval' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interval (days)
                  </label>
                  <input
                    type="number"
                    value={recurrenceRule.intervalDays}
                    onChange={(e) => setRecurrenceRule({...recurrenceRule, intervalDays: parseInt(e.target.value) || 1})}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bluish-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ends on
                  </label>
                  <input
                    type="date"
                    value={recurrenceRule.endsOn ? new Date(recurrenceRule.endsOn).toISOString().split('T')[0] : ''}
                    onChange={(e) => setRecurrenceRule({...recurrenceRule, endsOn: e.target.value ? new Date(e.target.value) : null})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bluish-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Occurrences
                  </label>
                  <input
                    type="number"
                    value={recurrenceRule.occurrencesCount}
                    onChange={(e) => setRecurrenceRule({...recurrenceRule, occurrencesCount: parseInt(e.target.value) || 10})}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bluish-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          )}
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