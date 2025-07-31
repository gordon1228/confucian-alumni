// src/components/UI/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'red' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const colorClasses = {
    red: 'text-red-600',
    blue: 'text-blue-600',
    gray: 'text-gray-600'
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-current ${sizeClasses[size]} ${colorClasses[color]}`}>
      </div>
    </div>
  );
};

export default LoadingSpinner;