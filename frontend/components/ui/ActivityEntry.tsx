'use client';

import React from 'react';

interface ActivityEntryProps {
  activity: {
    id: string;
    operation: string;
    timestamp: string;
    userId: string;
    previousState?: any;
    changes?: any;
  };
}

const ActivityEntry: React.FC<ActivityEntryProps> = ({ activity }) => {
  const getOperationLabel = (operation: string) => {
    switch (operation.toUpperCase()) {
      case 'CREATE': return 'Task Created';
      case 'UPDATE': return 'Task Updated';
      case 'COMPLETE': return 'Task Completed';
      case 'ARCHIVE': return 'Task Archived';
      case 'DELETE': return 'Task Deleted';
      default: return operation;
    }
  };

  const getOperationColor = (operation: string) => {
    switch (operation.toUpperCase()) {
      case 'CREATE': return 'bg-green-100 text-green-800';
      case 'UPDATE': return 'bg-blue-100 text-blue-800';
      case 'COMPLETE': return 'bg-purple-100 text-purple-800';
      case 'ARCHIVE': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border-l-2 border-gray-200 pl-4 py-2">
      <div className="flex items-center">
        <span className={`text-xs px-2 py-1 rounded-full ${getOperationColor(activity.operation)}`}>
          {getOperationLabel(activity.operation)}
        </span>
        <span className="ml-2 text-xs text-gray-500">
          {new Date(activity.timestamp).toLocaleString()}
        </span>
      </div>
      
      {activity.changes && Object.keys(activity.changes).length > 0 && (
        <div className="mt-2 text-sm">
          <p className="font-medium text-gray-700">Changes:</p>
          <ul className="list-disc list-inside ml-2 text-gray-600">
            {Object.entries(activity.changes).map(([field, change], index) => {
              const changeObj = change as { old: any; new: any };
              return (
                <li key={index}>
                  <span className="capitalize">{field.replace(/([A-Z])/g, ' $1')}:</span> 
                  <span className="line-through text-red-500"> {changeObj.old} </span>
                  <span className="text-green-500">→ {changeObj.new}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActivityEntry;