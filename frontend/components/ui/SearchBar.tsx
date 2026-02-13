'use client';

import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks by title or description..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-bluish-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-bluish-500 to-purplish-500 text-white rounded-r-lg hover:from-bluish-600 hover:to-purplish-600 transition"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;