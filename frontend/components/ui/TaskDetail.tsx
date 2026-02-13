'use client';

import React from 'react';
import { Task } from '../../lib/types';

interface TaskDetailProps {
  task: Task;
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

const TaskDetail: React.FC<TaskDetailProps> = ({ task }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{task.title}</h2>
        {task.priority && (
          <span className={`px-3 py-1 rounded-full text-sm border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        )}
      </div>
      
      {task.description && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-700">Description</h3>
          <p className="mt-1 text-gray-600">{task.description}</p>
        </div>
      )}
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-md font-medium text-gray-700 mb-2">Task Details</h3>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium">{task.status || (task.completed ? 'Completed' : 'Pending')}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Created:</span>
              <span className="font-medium">{formatDate(task.createdAt)}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Updated:</span>
              <span className="font-medium">{formatDate(task.updatedAt)}</span>
            </li>
            {task.dueDate && (
              <li className="flex justify-between">
                <span className="text-gray-600">Due Date:</span>
                <span className="font-medium">{formatDate(task.dueDate)}</span>
              </li>
            )}
          </ul>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-md font-medium text-gray-700 mb-2">Tags</h3>
          {task.tags && task.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {task.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No tags assigned</p>
          )}
        </div>
      </div>
      
      {task.reminderConfig && task.reminderConfig.enabled && (
        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <h3 className="text-md font-medium text-gray-700 mb-2">Reminder Configuration</h3>
          <ul className="space-y-1">
            <li className="flex justify-between">
              <span className="text-gray-600">Enabled:</span>
              <span className="font-medium">{task.reminderConfig.enabled ? 'Yes' : 'No'}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Notify before:</span>
              <span className="font-medium">{task.reminderConfig.notifyBefore} minutes</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Method:</span>
              <span className="font-medium capitalize">{task.reminderConfig.method}</span>
            </li>
          </ul>
        </div>
      )}
      
      {task.recurrenceRule && task.recurrenceRule.enabled && (
        <div className="mt-6 bg-purple-50 p-4 rounded-lg">
          <h3 className="text-md font-medium text-gray-700 mb-2">Recurrence Configuration</h3>
          <ul className="space-y-1">
            <li className="flex justify-between">
              <span className="text-gray-600">Enabled:</span>
              <span className="font-medium">{task.recurrenceRule.enabled ? 'Yes' : 'No'}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Pattern:</span>
              <span className="font-medium capitalize">{task.recurrenceRule.pattern}</span>
            </li>
            {task.recurrenceRule.intervalDays && (
              <li className="flex justify-between">
                <span className="text-gray-600">Interval Days:</span>
                <span className="font-medium">{task.recurrenceRule.intervalDays}</span>
              </li>
            )}
            {task.recurrenceRule.endsOn && (
              <li className="flex justify-between">
                <span className="text-gray-600">Ends On:</span>
                <span className="font-medium">{formatDate(task.recurrenceRule.endsOn)}</span>
              </li>
            )}
            {task.recurrenceRule.occurrencesCount && (
              <li className="flex justify-between">
                <span className="text-gray-600">Max Occurrences:</span>
                <span className="font-medium">{task.recurrenceRule.occurrencesCount}</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;