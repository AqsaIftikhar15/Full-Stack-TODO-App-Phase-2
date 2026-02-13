'use client';

import React from 'react';

interface TaskFiltersProps {
  priorityFilter: string;
  tagFilter: string;
  statusFilter: string;
  onPriorityChange: (priority: string) => void;
  onTagChange: (tag: string) => void;
  onStatusChange: (status: string) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  priorityFilter,
  tagFilter,
  statusFilter,
  onPriorityChange,
  onTagChange,
  onStatusChange
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Priority</label>
        <select
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bluish-500 focus:border-transparent"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bluish-500 focus:border-transparent"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Tag</label>
        <input
          type="text"
          value={tagFilter}
          onChange={(e) => onTagChange(e.target.value)}
          placeholder="Enter tag name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bluish-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default TaskFilters;