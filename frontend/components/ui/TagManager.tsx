'use client';

import React, { useState } from 'react';

interface TagManagerProps {
  initialTags?: string[];
  onTagsChange: (tags: string[]) => void;
  maxTags?: number;
}

const TagManager: React.FC<TagManagerProps> = ({ 
  initialTags = [], 
  onTagsChange, 
  maxTags = 10 
}) => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const addTag = () => {
    if (!inputValue.trim()) {
      setError('Tag cannot be empty');
      return;
    }

    if (tags.includes(inputValue.trim())) {
      setError('Tag already exists');
      return;
    }

    if (tags.length >= maxTags) {
      setError(`Maximum ${maxTags} tags allowed`);
      return;
    }

    const newTags = [...tags, inputValue.trim()];
    setTags(newTags);
    onTagsChange(newTags);
    setInputValue('');
    setError('');
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    onTagsChange(newTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // Remove last tag when backspace is pressed in empty input
      const newTags = tags.slice(0, -1);
      setTags(newTags);
      onTagsChange(newTags);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <span 
            key={index} 
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-2 text-blue-800 hover:text-blue-900"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      
      <div className="flex">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError('');
          }}
          onKeyDown={handleKeyDown}
          placeholder={`Add a tag (${tags.length}/${maxTags})`}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-bluish-500 focus:border-transparent"
          disabled={tags.length >= maxTags}
        />
        <button
          type="button"
          onClick={addTag}
          disabled={tags.length >= maxTags}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-lg hover:bg-gray-300 disabled:opacity-50"
        >
          Add
        </button>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {tags.length >= maxTags && (
        <p className="mt-1 text-sm text-gray-500">Maximum tags reached</p>
      )}
    </div>
  );
};

export default TagManager;