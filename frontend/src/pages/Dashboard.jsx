import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config/api.js';

const Dashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalAttendees: 0,
    upcomingEvents: 0
  });
  const [activeTab, setActiveTab] = useState('events');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchMyEvents();
  }, [token, navigate]);

  const fetchMyEvents = async () => {
    setLoading(true);
    try {
      // Get all events and filter by current user
      const res = await fetch(`${API_BASE_URL}/api/events/get`);
      const allEvents = await res.json();
      
      // Filter events created by current user
      const userEvents = allEvents.filter(event => event.createdBy._id === user.id);
      setMyEvents(userEvents);
      
      // Calculate stats
      const now = new Date();
      const upcomingCount = userEvents.filter(event => new Date(event.date) >= now).length;
      const totalAttendees = userEvents.reduce((sum, event) => sum + event.attendees.length, 0);
      
      setStats({
        totalEvents: userEvents.length,
        totalAttendees,
        upcomingEvents: upcomingCount
      });
    } catch (error) {
      toast.error('Failed to fetch your events');
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId, eventTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/events/delete/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Event deleted successfully');
        fetchMyEvents(); // Refresh the events list
      } else {
        toast.error(data.message || 'Failed to delete event');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error('Delete error:', error);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 bg-[length:40px_40px] bg-grid-pattern">
        <div className="text-center bg-white bg-opacity-90 p-8 rounded-xl shadow-lg border-2 border-dashed border-pink-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-handwritten">Please log in to view your dashboard</h2>
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-pink-400 to-pink-500 text-white px-6 py-2 rounded-full font-handwritten text-lg hover:shadow-lg hover:glow-pink transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 bg-[length:40px_40px] bg-grid-pattern">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500"></div>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 bg-[length:40px_40px] bg-grid-pattern py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold font-handwritten bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent glow-text mb-2">
            My Dashboard
          </h1>
          <p className="text-gray-600 font-handwritten text-lg">Manage your events and track performance</p>
        </div>

        {/* Sticky Note Tabs */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-3 rounded-full font-handwritten text-lg transition-all transform hover:-translate-y-1 ${
              activeTab === 'events' 
                ? 'bg-pink-300 text-gray-800 shadow-lg' 
                : 'bg-white text-gray-600 shadow-md hover:shadow-lg'
            }`}
          >
            📋 My Events
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 rounded-full font-handwritten text-lg transition-all transform hover:-translate-y-1 ${
              activeTab === 'stats' 
                ? 'bg-blue-300 text-gray-800 shadow-lg' 
                : 'bg-white text-gray-600 shadow-md hover:shadow-lg'
            }`}
          >
            📊 Statistics
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 rounded-full font-handwritten text-lg transition-all transform hover:-translate-y-1 ${
              activeTab === 'create' 
                ? 'bg-green-300 text-gray-800 shadow-lg' 
                : 'bg-white text-gray-600 shadow-md hover:shadow-lg'
            }`}
          >
            ✨ Create New
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-dashed border-pink-300 transform rotate-1">
            <div className="flex items-center">
              <div className="p-3 bg-pink-100 rounded-xl text-2xl">
                📅
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 font-handwritten">Total Events</p>
                <p className="text-2xl font-bold text-gray-900 font-handwritten">{stats.totalEvents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-dashed border-blue-300 transform -rotate-1">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl text-2xl">
                👥
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 font-handwritten">Total Attendees</p>
                <p className="text-2xl font-bold text-gray-900 font-handwritten">{stats.totalAttendees}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-dashed border-green-300 transform rotate-2">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl text-2xl">
                ⏰
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 font-handwritten">Upcoming Events</p>
                <p className="text-2xl font-bold text-gray-900 font-handwritten">{stats.upcomingEvents}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Create Event Button */}
        <div className="mb-8 text-center">
          <Link
            to="/create-event"
            className="inline-flex items-center bg-gradient-to-r from-pink-400 to-purple-400 text-white px-8 py-4 rounded-full font-handwritten text-xl hover:shadow-lg hover:glow-pink transition-all transform hover:-translate-y-1"
          >
            <span className="mr-2">✨</span>
            Create New Event
          </Link>
        </div>

        {/* Events List */}
        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg border-2 border-dashed border-gray-300 p-6">
          <div className="mb-6">
            <h3 className="text-2xl font-medium text-gray-900 font-handwritten bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Your Events
            </h3>
          </div>

          {myEvents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-medium text-gray-900 font-handwritten">No events yet</h3>
              <p className="mt-2 text-gray-600 font-handwritten">Get started by creating your first event!</p>
              <div className="mt-6">
                <Link
                  to="/create-event"
                  className="inline-flex items-center bg-gradient-to-r from-pink-400 to-pink-500 text-white px-6 py-3 rounded-full font-handwritten text-lg hover:shadow-lg hover:glow-pink transition-all"
                >
                  <span className="mr-2">✨</span>
                  Create Your First Event
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myEvents.map((event) => {
                const eventDate = new Date(event.date);
                const now = new Date();
                const isUpcoming = eventDate >= now;
                const isPast = eventDate < now;
                const cardColor = getRandomPastelColor();
                
                return (
                  <div key={event._id} className={`relative rounded-lg shadow-md border-2 ${cardColor} transition-all duration-300 hover:-translate-y-1 hover:rotate-1 hover:shadow-xl`}>
                    {/* Paperclip decoration */}
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-gray-400 text-2xl">📎</div>
                    
                    <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-lg">
                      {event.banner ? (
                        <img
                          src={`${API_BASE_URL}${event.banner}`}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-200 text-white">
                          <div className="text-4xl">🎉</div>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 font-handwritten">
                        {event.title}
                      </h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500 font-handwritten">
                          <span className="mr-2">📅</span>
                          {eventDate.toLocaleDateString()} {event.time && `at ${event.time}`}
                        </div>
                        
                        {event.location && (
                          <div className="flex items-center text-sm text-gray-500 font-handwritten">
                            <span className="mr-2">📍</span>
                            {event.location}
                          </div>
                        )}
                        
                        <div className="flex items-center text-sm text-gray-500 font-handwritten">
                          <span className="mr-2">👥</span>
                          {event.attendees.length} registered
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500 font-handwritten">
                          <span className="mr-2">🏷️</span>
                          {event.category || 'No category'}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full font-handwritten ${
                          isUpcoming 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {isUpcoming ? 'Upcoming' : 'Past'}
                        </span>
                        
                        <div className="flex space-x-2">
                          <Link
                            to={`/event/${event._id}`}
                            className="text-blue-500 hover:text-blue-700 text-lg transition-transform hover:scale-110"
                            title="View Event"
                          >
                            👁️
                          </Link>
                          <Link
                            to={`/edit-event/${event._id}`}
                            className="text-yellow-500 hover:text-yellow-700 text-lg transition-transform hover:scale-110"
                            title="Edit Event"
                          >
                            ✏️
                          </Link>
                          <button
                            onClick={() => handleDeleteEvent(event._id, event.title)}
                            className="text-red-500 hover:text-red-700 text-lg transition-transform hover:scale-110"
                            title="Delete Event"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Doodle Chart Section */}
        {myEvents.length > 0 && (
          <div className="mt-8 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg border-2 border-dashed border-gray-300 p-6">
            <h3 className="text-2xl font-medium text-gray-900 font-handwritten bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent mb-4">
              Event Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border-2 border-dashed border-pink-300 rounded-lg">
                <h4 className="font-handwritten text-lg mb-3">Events by Status</h4>
                <div className="flex items-center justify-center h-40 relative">
                  {/* Hand-drawn pie chart */}
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 rounded-full border-4 border-pink-400" 
                         style={{ clipPath: `inset(0 0 0 ${50 - (stats.upcomingEvents / stats.totalEvents * 50)}%)` }}>
                    </div>
                    <div className="absolute inset-0 rounded-full border-4 border-gray-300" 
                         style={{ clipPath: `inset(0 ${50 - (stats.upcomingEvents / stats.totalEvents * 50)}% 0 0)` }}>
                    </div>
                  </div>
                  <div className="ml-6">
                    <div className="flex items-center mb-2">
                      <div className="w-4 h-4 bg-pink-400 rounded mr-2"></div>
                      <span className="font-handwritten">Upcoming: {stats.upcomingEvents}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
                      <span className="font-handwritten">Past: {stats.totalEvents - stats.upcomingEvents}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-2 border-dashed border-blue-300 rounded-lg">
                <h4 className="font-handwritten text-lg mb-3">Attendee Overview</h4>
                <div className="h-40 flex items-end justify-center space-x-4">
                  {myEvents.slice(0, 5).map((event, index) => (
                    <div key={event._id} className="flex flex-col items-center">
                      <div 
                        className="w-8 bg-gradient-to-t from-blue-400 to-purple-400 rounded-t transition-all hover:from-blue-500 hover:to-purple-500"
                        style={{ height: `${Math.min(100, (event.attendees.length / Math.max(1, Math.max(...myEvents.map(e => e.attendees.length))) * 100))}%` }}
                        title={`${event.title}: ${event.attendees.length} attendees`}
                      ></div>
                      <div className="text-xs mt-2 font-handwritten">{event.title.substring(0, 5)}...</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom styles */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(200, 200, 200, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200, 200, 200, 0.3) 1px, transparent 1px);
        }
        .font-handwritten {
          font-family: 'Gochi Hand', cursive, 'Comic Sans MS', sans-serif;
        }
        .glow-text {
          text-shadow: 0 0 10px rgba(255, 192, 203, 0.5),
                       0 0 20px rgba(255, 192, 203, 0.3);
        }
        .hover\:glow-pink:hover {
          box-shadow: 0 0 15px rgba(255, 192, 203, 0.8);
        }
      `}</style>
      
      {/* Load handwritten font from Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Gochi+Hand&display=swap" rel="stylesheet" />
    </div>
  );
};

export default Dashboard;
/*2nd*/