// src/components/Events/EventFilter.js
import React from 'react';
import { Filter } from 'lucide-react';
import { EVENT_CATEGORIES, EVENT_STATUS } from '../../constants';

const EventFilter = ({ filters, onFilterChange }) => {
  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFilterChange({
      category: '',
      status: ''
    });
  };

  const hasActiveFilters = filters.category || filters.status;

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter className="w-5 h-5 text-gray-400 mr-2" />
          <h3 className="font-medium text-gray-800">筛选活动</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            清除筛选
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            活动类别
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
          >
            <option value="">全部类别</option>
            {EVENT_CATEGORIES.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            活动状态
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
          >
            <option value="">全部状态</option>
            {EVENT_STATUS.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default EventFilter;