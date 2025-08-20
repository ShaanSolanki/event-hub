import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm }) => (
  <div className="relative mb-4">
    <input
      type="text"
      className="block w-full pl-4 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      placeholder="Search events..."
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
    />
  </div>
);

export default SearchBar;
