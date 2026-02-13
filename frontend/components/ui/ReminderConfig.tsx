'use client';

import React, { useState } from 'react';

interface ReminderConfigProps {
  reminderConfig: {
    enabled: boolean;
    notifyBefore: number;
    method: 'email' | 'push' | 'both';
  } | null;
  onSave: (config: {
    enabled: boolean;
    notifyBefore: number;
    method: 'email' | 'push' | 'both';
  }) => void;
}

const ReminderConfig: React.FC<ReminderConfigProps> = ({ reminderConfig, onSave }) => {
  const [enabled, setEnabled] = useState(reminderConfig?.enabled || false);
  const [notifyBefore, setNotifyBefore] = useState(reminderConfig?.notifyBefore || 15);
  const [method, setMethod] = useState< 'email' | 'push' | 'both' >(reminderConfig?.method || 'push');

  const handleSave = () => {
    onSave({
      enabled,
      notifyBefore,
      method
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h3 className="text-lg font-medium text-gray-800 mb-3">Reminder Configuration</h3>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="reminder-enabled"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="h-4 w-4 text-bluish-600 rounded focus:ring-bluish-500"
          />
          <label htmlFor="reminder-enabled" className="ml-2 text-gray-700">
            Enable Reminder
          </label>
        </div>
        
        {enabled && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notify before due date (minutes)
              </label>
              <input
                type="number"
                value={notifyBefore}
                onChange={(e) => setNotifyBefore(Number(e.target.value))}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bluish-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notification method
              </label>
              <div className="flex space-x-4">
                {(['email', 'push', 'both'] as const).map((option) => (
                  <label key={option} className="inline-flex items-center">
                    <input
                      type="radio"
                      value={option}
                      checked={method === option}
                      onChange={() => setMethod(option)}
                      className="h-4 w-4 text-bluish-600 focus:ring-bluish-500"
                    />
                    <span className="ml-2 text-gray-700 capitalize">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}
        
        <button
          onClick={handleSave}
          disabled={!enabled}
          className={`px-4 py-2 rounded-lg text-white font-medium ${
            enabled 
              ? 'bg-gradient-to-r from-bluish-500 to-purplish-500 hover:from-bluish-600 hover:to-purplish-600' 
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Save Reminder Settings
        </button>
      </div>
    </div>
  );
};

export default ReminderConfig;