import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 'md', text, className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-4 border-bluish-200 border-t-purplish-500 rounded-full animate-spin`}
      ></div>
      {text && <p className="mt-2 text-gray-600">{text}</p>}
    </div>
  );
};

export default Loader;