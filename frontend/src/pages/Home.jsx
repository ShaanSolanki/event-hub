import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar.jsx";
import FilterBar from "../components/FilterBar.jsx";
import API_BASE_URL from '../config/api.js';
import toast from "react-hot-toast";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, selectedCategory, dateFilter]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/events/get`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setEvents(data);
      } else {
        console.error('Invalid data format:', data);
        setEvents([]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error("Failed to fetch events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events]; // Create a copy of the events array

    // Search filter
    if (searchTerm && searchTerm.trim() !== '') {
      filtered = filtered.filter(ev => 
        ev.title && ev.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory.trim() !== '') {
      filtered = filtered.filter(ev => 
        ev.category && ev.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Date filter
    if (dateFilter && dateFilter.trim() !== '') {
      const now = new Date();
      filtered = filtered.filter(ev => {
        if (!ev.date) return false;
        
        const eventDate = new Date(ev.date);
        
        if (dateFilter === "thisWeek") {
          const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          return eventDate >= now && eventDate <= weekFromNow;
        } else if (dateFilter === "thisMonth") {
          const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          return eventDate >= now && eventDate <= monthFromNow;
        }
        return true;
      });
    }

    setFilteredEvents(filtered);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Discover Local Events
        </h1>
        <p className="text-lg text-gray-600">
          Find workshops, meetups, and concerts near you.
        </p>
      </div>

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <FilterBar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />

      {/* Active filters display */}
      {(searchTerm || selectedCategory || dateFilter) && (
        <div className="mb-6 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {searchTerm && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
              Search: "{searchTerm}"
            </span>
          )}
          {selectedCategory && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
              Category: {selectedCategory}
            </span>
          )}
          {dateFilter && (
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
              Date: {dateFilter === 'thisWeek' ? 'This Week' : 'This Month'}
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((ev) => (
          <div key={ev._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {ev.banner ? (
                <img
                  src={`${API_BASE_URL}${ev.banner}`}
                  alt={ev.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 text-white">
                  <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {ev.title}
              </h3>
              
              <p className="text-gray-600 mb-4 line-clamp-2">
                {ev.description || 'No description available'}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  {new Date(ev.date).toLocaleDateString()} {ev.time && `at ${ev.time}`}
                </div>
                
                {ev.location && (
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    {ev.location}
                  </div>
                )}
                
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                  </svg>
                  {ev.attendees ? ev.attendees.length : 0} registered
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                {ev.category && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {ev.category}
                  </span>
                )}
                
                <Link
                  to={`/event/${ev._id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  View Details →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && !loading && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m-6-4h6"></path>
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedCategory || dateFilter 
              ? 'Try adjusting your search or filter criteria.' 
              : 'No events are currently available.'}
          </p>
          {(searchTerm || selectedCategory || dateFilter) && (
            <div className="mt-6">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setDateFilter('');
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Debug information (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm">
          <p><strong>Debug Info:</strong></p>
          <p>Total Events: {events.length}</p>
          <p>Filtered Events: {filteredEvents.length}</p>
          <p>Selected Category: {selectedCategory || 'None'}</p>
          <p>Date Filter: {dateFilter || 'None'}</p>
          <p>Search Term: {searchTerm || 'None'}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
