import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm }) => (
  <div className="relative mb-6">
    <div className="bg-white bg-opacity-80 backdrop-blur-sm p-4 rounded-xl shadow-lg border-2 border-dashed border-blue-200 relative">
      {/* Doodle corner elements */}
      <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-blue-300 rounded-tl-lg"></div>
      <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-blue-300 rounded-tr-lg"></div>
      <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-blue-300 rounded-bl-lg"></div>
      <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-blue-300 rounded-br-lg"></div>

      <div className="relative">
        <input
          type="text"
          className="block w-full pl-12 pr-4 py-3 border-2 border-dashed border-blue-200 rounded-full bg-white bg-opacity-50 placeholder-blue-300 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all duration-300 font-handwritten text-lg text-gray-700"
          placeholder="Search events..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            fontStyle: 'italic'
          }}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        
        {/* Clear button */}
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-300 hover:text-blue-500 transition-colors duration-200"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        )}
      </div>
    </div>

    {/* Custom styles */}
    <style jsx>{`
      .font-handwritten {
        font-family: 'Gochi Hand', cursive, 'Comic Sans MS', sans-serif;
      }
      input::placeholder {
        color: #93c5fd;
        opacity: 0.8;
      }
      input:focus::placeholder {
        opacity: 0.5;
      }
    `}</style>
    
    {/* Load handwritten font from Google Fonts */}
    <link href="https://fonts.googleapis.com/css2?family=Gochi+Hand&display=swap" rel="stylesheet" />
  </div>
);

export default SearchBar;
/*2nd*/