'use client';

import React from 'react';

interface ActivityExportProps {
  activities: Array<{
    id: string;
    operation: string;
    timestamp: string;
    userId: string;
    previousState?: any;
    changes?: any;
  }>;
  taskId?: string;
}

const ActivityExport: React.FC<ActivityExportProps> = ({ activities, taskId }) => {
  const exportToCSV = () => {
    if (!activities || activities.length === 0) {
      alert('No activities to export');
      return;
    }

    // Prepare CSV content
    const headers = ['ID', 'Operation', 'Timestamp', 'User ID', 'Previous State', 'Changes'];
    const csvContent = [
      headers.join(','),
      ...activities.map(activity => [
        activity.id,
        activity.operation,
        activity.timestamp,
        activity.userId,
        activity.previousState ? JSON.stringify(activity.previousState) : '',
        activity.changes ? JSON.stringify(activity.changes) : ''
      ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const fileName = taskId ? `activity-log-${taskId}.csv` : 'activity-log.csv';
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    if (!activities || activities.length === 0) {
      alert('No activities to export');
      return;
    }

    const jsonContent = JSON.stringify(activities, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const fileName = taskId ? `activity-log-${taskId}.json` : 'activity-log.json';
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h3 className="text-lg font-medium text-gray-800 mb-3">Export Activity Log</h3>
      <div className="flex space-x-2">
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Export as CSV
        </button>
        <button
          onClick={exportToJSON}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Export as JSON
        </button>
      </div>
    </div>
  );
};

export default ActivityExport;