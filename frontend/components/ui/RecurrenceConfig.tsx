'use client';

import React, { useState } from 'react';

interface RecurrenceConfigProps {
  recurrenceRule: {
    enabled: boolean;
    pattern: 'daily' | 'weekly' | 'monthly' | 'interval';
    intervalDays?: number;
    endsOn?: string | Date;
    occurrencesCount?: number;
  } | null;
  onSave: (rule: {
    enabled: boolean;
    pattern: 'daily' | 'weekly' | 'monthly' | 'interval';
    intervalDays?: number;
    endsOn?: string | Date;
    occurrencesCount?: number;
  }) => void;
}

const RecurrenceConfig: React.FC<RecurrenceConfigProps> = ({ recurrenceRule, onSave }) => {
  const [enabled, setEnabled] = useState(recurrenceRule?.enabled || false);
  const [pattern, setPattern] = useState< 'daily' | 'weekly' | 'monthly' | 'interval' >(recurrenceRule?.pattern || 'daily');
  const [intervalDays, setIntervalDays] = useState(recurrenceRule?.intervalDays || 1);
  const [endsOn, setEndsOn] = useState<string>(recurrenceRule?.endsOn ? new Date(recurrenceRule.endsOn).toISOString().split('T')[0] : '');
  const [occurrencesCount, setOccurrencesCount] = useState(recurrenceRule?.occurrencesCount || 10);

  const handleSave = () => {
    onSave({
      enabled,
      pattern,
      ...(pattern === 'interval' && { intervalDays }),
      ...(endsOn && { endsOn }),
      ...(occurrencesCount && { occurrencesCount })
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h3 className="text-lg font-medium text-gray-800 mb-3">Recurrence Configuration</h3>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="recurrence-enabled"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="h-4 w-4 text-bluish-600 rounded focus:ring-bluish-500"
          />
          <label htmlFor="recurrence-enabled" className="ml-2 text-gray-700">
            Enable Recurrence
          </label>
        </div>
        
        {enabled && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recurrence Pattern
              </label>
              <div className="flex flex-wrap gap-4">
                {(['daily', 'weekly', 'monthly', 'interval'] as const).map((option) => (
                  <label key={option} className="inline-flex items-center">
                    <input
                      type="radio"
                      value={option}
                      checked={pattern === option}
                      onChange={() => setPattern(option)}
                      className="h-4 w-4 text-bluish-600 focus:ring-bluish-500"
                    />
                    <span className="ml-2 text-gray-700 capitalize">{option}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {pattern === 'interval' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interval (days)
                </label>
                <input
                  type="number"
                  value={intervalDays}
                  onChange={(e) => setIntervalDays(Number(e.target.value))}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bluish-500 focus:border-transparent"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ends after
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Specific date</label>
                  <input
                    type="date"
                    value={endsOn}
                    onChange={(e) => setEndsOn(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bluish-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Number of occurrences</label>
                  <input
                    type="number"
                    value={occurrencesCount}
                    onChange={(e) => setOccurrencesCount(Number(e.target.value))}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bluish-500 focus:border-transparent"
                  />
                </div>
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
          Save Recurrence Settings
        </button>
      </div>
    </div>
  );
};

export default RecurrenceConfig;