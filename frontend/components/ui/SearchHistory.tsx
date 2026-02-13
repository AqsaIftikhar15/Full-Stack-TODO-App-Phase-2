'use client';

import React, { useState, useEffect } from 'react';

interface SearchHistoryProps {
  onSearch: (query: string) => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ onSearch }) => {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    // Load search history from localStorage
    const savedHistory = localStorage.getItem('taskSearchHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory)) {
          setSearchHistory(parsedHistory);
        }
      } catch (e) {
        console.error('Failed to parse search history:', e);
      }
    }
  }, []);

  const addToHistory = (query: string) => {
    if (!query.trim()) return;

    // Remove the query if it already exists in history
    const filteredHistory = searchHistory.filter(item => item !== query);
    
    // Add the new query to the beginning
    const newHistory = [query, ...filteredHistory].slice(0, 10); // Keep only last 10 searches
    
    setSearchHistory(newHistory);
    
    // Save to localStorage
    localStorage.setItem('taskSearchHistory', JSON.stringify(newHistory));
  };

  const handleSearch = (query: string) => {
    onSearch(query);
    addToHistory(query);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('taskSearchHistory');
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium text-gray-800">Recent Searches</h3>
        {searchHistory.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Clear
          </button>
        )}
      </div>
      
      {searchHistory.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {searchHistory.map((query, index) => (
            <button
              key={index}
              onClick={() => handleSearch(query)}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition"
            >
              {query}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No recent searches</p>
      )}
    </div>
  );
};

export default SearchHistory;