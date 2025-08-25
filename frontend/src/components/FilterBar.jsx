import React, { useState } from 'react';

const FilterBar = ({ selectedCategory, setSelectedCategory, dateFilter, setDateFilter }) => {
  const categories = [
    { name: 'Tech', icon: '💻' },
    { name: 'Music', icon: '🎵' },
    { name: 'Art', icon: '🎨' },
    { name: 'Sports', icon: '⚽' },
    { name: 'Business', icon: '💼' },
    { name: 'Education', icon: '📚' },
    { name: 'Health', icon: '💊' },
    { name: 'Other', icon: '📌' }
  ];

  const dateOptions = [
    { value: '', label: 'All Dates', icon: '📅' },
    { value: 'thisWeek', label: 'This Week', icon: '📆' },
    { value: 'thisMonth', label: 'This Month', icon: '🗓️' }
  ];

  const [isDateOpen, setIsDateOpen] = useState(false);

  return (
    <div className="bg-white bg-opacity-80 backdrop-blur-sm p-4 rounded-xl shadow-lg border-2 border-dashed border-pink-200 mb-6 relative">
      {/* Doodle corner elements */}
      <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-pink-300 rounded-tl-lg"></div>
      <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-pink-300 rounded-tr-lg"></div>
      <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-pink-300 rounded-bl-lg"></div>
      <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-pink-300 rounded-br-lg"></div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Category Filter - Pill Buttons */}
        <div className="flex-1 w-full">
          <h3 className="text-sm font-handwritten text-gray-600 mb-2 ml-2">Filter by Category:</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(
                  selectedCategory === category.name ? '' : category.name
                )}
                className={`px-4 py-2 rounded-full font-handwritten text-sm transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.name
                    ? 'bg-gradient-to-r from-pink-300 to-pink-400 text-gray-800 shadow-lg'
                    : 'bg-white text-gray-600 border-2 border-dashed border-gray-200 hover:border-pink-300 hover:shadow-md'
                }`}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Date Filter - Custom Dropdown */}
        <div className="flex-1 w-full">
          <h3 className="text-sm font-handwritten text-gray-600 mb-2 ml-2">Filter by Date:</h3>
          <div className="relative">
            <button
              onClick={() => setIsDateOpen(!isDateOpen)}
              className="w-full px-4 py-2 bg-white border-2 border-dashed border-blue-200 rounded-full text-left font-handwritten text-gray-600 hover:border-blue-300 hover:shadow-md transition-all duration-300 flex items-center justify-between"
            >
              <span>
                {dateOptions.find(opt => opt.value === dateFilter)?.icon || '📅'} 
                {dateOptions.find(opt => opt.value === dateFilter)?.label || 'All Dates'}
              </span>
              <span className="transform transition-transform duration-300">
                {isDateOpen ? '▲' : '▼'}
              </span>
            </button>
            
            {isDateOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-dashed border-blue-200 rounded-xl shadow-lg z-10 overflow-hidden">
                {dateOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setDateFilter(option.value);
                      setIsDateOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left font-handwritten transition-all duration-200 hover:bg-blue-50 ${
                      dateFilter === option.value
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600'
                    }`}
                  >
                    {option.icon} {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Clear filters button */}
        {(selectedCategory || dateFilter) && (
          <button
            onClick={() => {
              setSelectedCategory('');
              setDateFilter('');
            }}
            className="px-4 py-2 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 rounded-full font-handwritten text-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 flex items-center"
          >
            🗑️ Clear Filters
          </button>
        )}
      </div>

      {/* Active filters display */}
      {(selectedCategory || dateFilter) && (
        <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
          <p className="text-sm font-handwritten text-gray-600 mb-2">Active filters:</p>
          <div className="flex flex-wrap gap-2">
            {selectedCategory && (
              <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-handwritten flex items-center">
                🏷️ {selectedCategory}
                <button
                  onClick={() => setSelectedCategory('')}
                  className="ml-2 text-pink-600 hover:text-pink-800"
                >
                  ×
                </button>
              </span>
            )}
            {dateFilter && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-handwritten flex items-center">
                📅 {dateOptions.find(opt => opt.value === dateFilter)?.label}
                <button
                  onClick={() => setDateFilter('')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;