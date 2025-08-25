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
    let filtered = [...events];

    if (searchTerm && searchTerm.trim() !== '') {
      filtered = filtered.filter(ev => 
        ev.title && ev.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory.trim() !== '') {
      filtered = filtered.filter(ev => 
        ev.category && ev.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

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

  // Function to get a random pastel color for cards
  const getRandomPastelColor = () => {
    const colors = [
      'bg-pink-100 border-pink-200',
      'bg-blue-100 border-blue-200',
      'bg-green-100 border-green-200',
      'bg-purple-100 border-purple-200',
      'bg-yellow-100 border-yellow-200'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Function to get category icon
  const getCategoryIcon = (category) => {
    if (!category) return '📌';
    
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('music') || categoryLower.includes('concert')) return '🎵';
    if (categoryLower.includes('art') || categoryLower.includes('design')) return '🎨';
    if (categoryLower.includes('tech') || categoryLower.includes('coding')) return '💻';
    if (categoryLower.includes('food') || categoryLower.includes('cooking')) return '🍕';
    if (categoryLower.includes('sports') || categoryLower.includes('fitness')) return '⚽';
    if (categoryLower.includes('education') || categoryLower.includes('workshop')) return '📚';
    return '📌';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        {/* Simple Pastel Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-pink-200 via-purple-100 to-blue-200"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-handwritten bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Discover Local Events
            </h1>
            <p className="text-xl md:text-2xl text-pink-700 font-light max-w-2xl mx-auto">
              Find workshops, meetups, and concerts near you.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-8 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
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
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  Search: "{searchTerm}"
                </span>
              )}
              {selectedCategory && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                  Category: {selectedCategory}
                </span>
              )}
              {dateFilter && (
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
                  Date: {dateFilter === 'thisWeek' ? 'This Week' : 'This Month'}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((ev) => {
            const cardColor = getRandomPastelColor();
            return (
              <div 
                key={ev._id} 
                className={`relative rounded-lg shadow-md border-2 ${cardColor} transition-all duration-300 hover:shadow-xl`}
              >
                {/* Paperclip decoration */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-gray-400 text-2xl">📎</div>
                
                <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-lg">
                  {ev.banner ? (
                    <img
                      src={`${API_BASE_URL}${ev.banner}`}
                      alt={ev.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-200 text-white">
                      <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
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
                      <span className="inline-flex items-center bg-white text-gray-800 text-xs px-3 py-1 rounded-full border">
                        {getCategoryIcon(ev.category)} {ev.category}
                      </span>
                    )}
                    
                    <Link
                      to={`/event/${ev._id}`}
                      className="bg-yellow-300 hover:bg-yellow-400 text-gray-800 font-medium py-2 px-4 rounded-full transition-all duration-200 hover:shadow-md"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredEvents.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg mt-8">
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
      </div>
    </div>
  );
};

export default Home;