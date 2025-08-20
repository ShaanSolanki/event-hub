import React from 'react';

const FilterBar = ({ selectedCategory, setSelectedCategory, dateFilter, setDateFilter }) => {
  const categories = ['Tech', 'Music', 'Art', 'Sports', 'Business', 'Education', 'Health', 'Other'];
  
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Dates</option>
          <option value="thisWeek">This Week</option>
          <option value="thisMonth">This Month</option>
        </select>
      </div>

      {/* Clear filters button */}
      {(selectedCategory || dateFilter) && (
        <button
          onClick={() => {
            setSelectedCategory('');
            setDateFilter('');
          }}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default FilterBar;
