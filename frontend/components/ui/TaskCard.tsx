'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Task } from '../../lib/types';

interface TaskCardProps {
  task: Task;
  onUpdateTask?: (id: string, title?: string, description?: string, priority?: 'low' | 'medium' | 'high', tags?: string[], dueDate?: string | Date, reminderConfig?: { enabled: boolean; notifyBefore: number; method: 'email' | 'push' | 'both' }, recurrenceRule?: { enabled: boolean; pattern: 'daily' | 'weekly' | 'monthly' | 'interval'; intervalDays?: number; endsOn?: string | Date; occurrencesCount?: number }, status?: 'pending' | 'completed' | 'archived') => void;
  onToggleTask?: (id: string) => void;
  onDeleteTask?: (id: string) => void;
}

const formatDate = (dateValue: string | Date | undefined): string => {
  if (!dateValue) return 'No date';

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

const getPriorityColor = (priority: 'low' | 'medium' | 'high' | undefined) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800 border-red-300';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'low': return 'bg-green-100 text-green-800 border-green-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdateTask, onToggleTask, onDeleteTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editPriority, setEditPriority] = useState<'low' | 'medium' | 'high'>(task.priority || 'medium');
  const [editTags, setEditTags] = useState<string[]>(task.tags || []);
  const [editDueDate, setEditDueDate] = useState<string | Date | null>(task.dueDate || null);
  const [editReminderConfig, setEditReminderConfig] = useState({
    enabled: task.reminderConfig?.enabled || false,
    notifyBefore: task.reminderConfig?.notifyBefore || 15,
    method: task.reminderConfig?.method || 'push' as 'email' | 'push' | 'both'
  });
  const [editRecurrenceRule, setEditRecurrenceRule] = useState({
    enabled: task.recurrenceRule?.enabled || false,
    pattern: task.recurrenceRule?.pattern || 'daily' as 'daily' | 'weekly' | 'monthly' | 'interval',
    intervalDays: task.recurrenceRule?.intervalDays || 1,
    endsOn: task.recurrenceRule?.endsOn || undefined,
    occurrencesCount: task.recurrenceRule?.occurrencesCount || 10
  });
  const [tagInput, setTagInput] = useState('');

  const handleToggleCompletion = async () => {
    onToggleTask?.(task.id);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !editTags.includes(tagInput.trim()) && editTags.length < 10) {
      setEditTags([...editTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setEditTags(editTags.filter((_, i) => i !== index));
  };

  const handleEdit = async () => {
    onUpdateTask?.(
      task.id,
      editTitle,
      editDescription,
      editPriority,
      editTags,
      editDueDate || undefined,
      editReminderConfig.enabled ? editReminderConfig : undefined,
      editRecurrenceRule.enabled ? editRecurrenceRule : undefined
    );
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

          {/* Priority Selector */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Priority
            </label>
            <div className="flex space-x-2">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <label key={level} className="inline-flex items-center">
                  <input
                    type="radio"
                    value={level}
                    checked={editPriority === level}
                    onChange={() => setEditPriority(level)}
                    className="h-4 w-4 text-bluish-600 focus:ring-bluish-500"
                  />
                  <span className="ml-1 text-xs capitalize">{level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags Input */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
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
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-bluish-500"
                placeholder="Add tag..."
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-2 py-1 bg-gray-200 text-gray-700 text-sm rounded-r hover:bg-gray-300"
              >
                +
              </button>
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              {editTags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="ml-1 text-blue-800 hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Due Date Picker */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={editDueDate ? new Date(editDueDate).toISOString().split('T')[0] : ''}
              onChange={(e) => setEditDueDate(e.target.value ? new Date(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-bluish-500"
            />
          </div>

          {/* Reminder Configuration */}
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`reminder-enabled-${task.id}`}
                checked={editReminderConfig.enabled}
                onChange={(e) => setEditReminderConfig({...editReminderConfig, enabled: e.target.checked})}
                className="h-4 w-4 text-bluish-600 focus:ring-bluish-500"
              />
              <label htmlFor={`reminder-enabled-${task.id}`} className="ml-2 text-xs font-medium text-gray-700">
                Enable Reminder
              </label>
            </div>

            {editReminderConfig.enabled && (
              <div className="ml-6 space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Notify before due date (minutes)
                  </label>
                  <input
                    type="number"
                    value={editReminderConfig.notifyBefore}
                    onChange={(e) => setEditReminderConfig({...editReminderConfig, notifyBefore: parseInt(e.target.value) || 15})}
                    min="1"
                    className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-bluish-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Notification method
                  </label>
                  <div className="flex space-x-2">
                    {(['email', 'push', 'both'] as const).map((method) => (
                      <label key={method} className="inline-flex items-center">
                        <input
                          type="radio"
                          value={method}
                          checked={editReminderConfig.method === method}
                          onChange={() => setEditReminderConfig({...editReminderConfig, method})}
                          className="h-4 w-4 text-bluish-600 focus:ring-bluish-500"
                        />
                        <span className="ml-1 text-xs capitalize">{method}</span>
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
                id={`recurrence-enabled-${task.id}`}
                checked={editRecurrenceRule.enabled}
                onChange={(e) => setEditRecurrenceRule({...editRecurrenceRule, enabled: e.target.checked})}
                className="h-4 w-4 text-bluish-600 focus:ring-bluish-500"
              />
              <label htmlFor={`recurrence-enabled-${task.id}`} className="ml-2 text-xs font-medium text-gray-700">
                Enable Recurrence
              </label>
            </div>

            {editRecurrenceRule.enabled && (
              <div className="ml-6 space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Recurrence Pattern
                  </label>
                  <select
                    value={editRecurrenceRule.pattern}
                    onChange={(e) => setEditRecurrenceRule({...editRecurrenceRule, pattern: e.target.value as any})}
                    className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-bluish-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="interval">Custom Interval</option>
                  </select>
                </div>

                {editRecurrenceRule.pattern === 'interval' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Interval (days)
                    </label>
                    <input
                      type="number"
                      value={editRecurrenceRule.intervalDays}
                      onChange={(e) => setEditRecurrenceRule({...editRecurrenceRule, intervalDays: parseInt(e.target.value) || 1})}
                      min="1"
                      className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-bluish-500"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Ends on
                    </label>
                    <input
                      type="date"
                      value={editRecurrenceRule.endsOn ? new Date(editRecurrenceRule.endsOn).toISOString().split('T')[0] : ''}
                      onChange={(e) => setEditRecurrenceRule({...editRecurrenceRule, endsOn: e.target.value ? new Date(e.target.value) : undefined})}
                      className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-bluish-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Max Occurrences
                    </label>
                    <input
                      type="number"
                      value={editRecurrenceRule.occurrencesCount}
                      onChange={(e) => setEditRecurrenceRule({...editRecurrenceRule, occurrencesCount: parseInt(e.target.value) || 10})}
                      min="1"
                      className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-bluish-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className="px-3 py-1 bg-bluish-500 text-white rounded hover:bg-bluish-600 transition text-sm"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <Link href={`/tasks/${task.id}`} className="block">
          <div className="flex items-start">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggleCompletion}
              className="mt-1 h-5 w-5 text-bluish-600 rounded focus:ring-bluish-500"
            />
            <div className="ml-3 flex-1">
              <div className="flex items-baseline justify-between">
                <h3
                  className={`text-lg font-medium ${
                    task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                  }`}
                >
                  {task.title}
                </h3>

                {/* Priority indicator */}
                {task.priority && (
                  <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                )}
              </div>

              {task.description && (
                <p className={`mt-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-600'}`}>
                  {task.description}
                </p>
              )}

              {/* Tags display */}
              {task.tags && task.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {task.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Due date display */}
              {task.dueDate && (
                <div className="mt-2 text-xs text-gray-500 flex items-center">
                  <span>📅 Due: {formatDate(task.dueDate)}</span>
                </div>
              )}

              {/* Reminder indicator */}
              {task.reminderConfig?.enabled && (
                <div className="mt-1 text-xs text-gray-500 flex items-center">
                  <span>🔔 Reminder: {task.reminderConfig.notifyBefore} min {task.reminderConfig.method}</span>
                </div>
              )}

              {/* Recurrence indicator */}
              {task.recurrenceRule?.enabled && (
                <div className="mt-1 text-xs text-gray-500 flex items-center">
                  <span>🔄 Recurs: {task.recurrenceRule.pattern}{task.recurrenceRule.pattern === 'interval' && task.recurrenceRule.intervalDays ? ` every ${task.recurrenceRule.intervalDays} days` : ''}</span>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-2">
                Created: {formatDate(task.createdAt)}
              </p>
            </div>
          </div>
        </Link>
      )}
      {!isEditing && (
        <div className="flex justify-end space-x-2 mt-3">
          <Link href={`/tasks/${task.id}`}
            className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            View Details
          </Link>
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
      )}
    </motion.div>
  );
};

export default TaskCard;