import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config/api.js';

const EventDetail = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => { fetchEvent(); }, [id]);

  useEffect(() => {
    if (event && user) {
      setIsRegistered(event.attendees.some(att => att._id === user.id));
    }
  }, [event, user]);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/events/getbyid/${id}`);
      const data = await res.json();
      setEvent(data);
    } catch { toast.error('Failed to fetch event details'); }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!token) {
      toast.error('Login first!');
      navigate('/login');
      return;
    }
    setRegistering(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/events/register/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Registered!');
        setIsRegistered(true);
        fetchEvent();
      } else {
        toast.error(data.message || 'Failed to register');
      }
    } catch { toast.error('Something went wrong.'); }
    setRegistering(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/events/delete/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Event deleted');
        navigate('/');
      } else {
        toast.error(data.message || 'Failed to delete event');
      }
    } catch { toast.error('Something went wrong.'); }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 bg-[length:40px_40px] bg-grid-pattern">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500"></div>
    </div>
  );
  
  if (!event) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 bg-[length:40px_40px] bg-grid-pattern">
      <div className="bg-white bg-opacity-90 p-8 rounded-xl shadow-lg border-2 border-dashed border-pink-300 text-center">
        <h2 className="text-2xl font-bold mb-4 font-handwritten">Event not found</h2>
        <Link to="/" className="text-blue-500 font-handwritten text-lg hover:underline">← Back to events</Link>
      </div>
    </div>
  );

  const isCreator = user && event.createdBy._id === user.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 bg-[length:40px_40px] bg-grid-pattern py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center mb-6 text-blue-500 font-handwritten text-lg hover:underline">
          ← Back to all events
        </Link>

        {/* Event Card */}
        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg border-2 border-dashed border-blue-200 p-6 relative">
          {/* Doodle border elements */}
          <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-blue-300 rounded-tl-lg"></div>
          <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-blue-300 rounded-tr-lg"></div>
          <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-blue-300 rounded-bl-lg"></div>
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-blue-300 rounded-br-lg"></div>

          {/* Event Banner */}
          <div className="h-60 bg-gradient-to-br from-blue-200 to-purple-200 mb-6 rounded-lg flex items-center justify-center overflow-hidden">
            {event.banner ? (
              <img src={`${API_BASE_URL}${event.banner}`} alt={event.title} className="w-full h-full object-cover" />
            ) : (
              <div className="text-4xl text-white">🎉</div>
            )}
          </div>

          {/* Event Title */}
          <h1 className="text-3xl font-bold mb-4 font-handwritten bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            {event.title}
          </h1>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-gray-700 font-handwritten">
              <span className="text-2xl mr-2">📅</span>
              <div>
                <div className="font-semibold">{new Date(event.date).toLocaleDateString()}</div>
                {event.time && <div className="text-sm">{event.time}</div>}
              </div>
            </div>

            <div className="flex items-center text-gray-700 font-handwritten">
              <span className="text-2xl mr-2">📍</span>
              <div>
                <div className="font-semibold">{event.location || 'Location TBA'}</div>
                <div className="text-sm">Venue</div>
              </div>
            </div>

            <div className="flex items-center text-gray-700 font-handwritten">
              <span className="text-2xl mr-2">🏷️</span>
              <div>
                <div className="font-semibold">{event.category || 'No category'}</div>
                <div className="text-sm">Category</div>
              </div>
            </div>

            <div className="flex items-center text-gray-700 font-handwritten">
              <span className="text-2xl mr-2">👥</span>
              <div>
                <div className="font-semibold">{event.attendees.length} attendees</div>
                <div className="text-sm">Registered</div>
              </div>
            </div>
          </div>

          {/* Event Description */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-300">
            <h3 className="text-lg font-semibold mb-2 font-handwritten">About this event</h3>
            <p className="text-gray-700 font-handwritten">{event.description || 'No description provided.'}</p>
          </div>

          {/* Event Organizer */}
          <div className="mb-6 p-4 bg-pink-50 rounded-lg border-l-4 border-pink-300">
            <h3 className="text-lg font-semibold mb-2 font-handwritten">Organized by</h3>
            <p className="text-gray-700 font-handwritten">
              {event.createdBy.name} ({event.createdBy.email})
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-6">
            {isCreator ? (
              <>
                <Link
                  to={`/edit-event/${event._id}`}
                  className="bg-gradient-to-r from-blue-400 to-blue-500 text-white px-6 py-3 rounded-full font-handwritten text-lg hover:shadow-lg hover:glow-blue transition-all"
                >
                  ✏️ Edit Event
                </Link>
                <button
                  onClick={handleDelete}
                  className="bg-gradient-to-r from-red-400 to-red-500 text-white px-6 py-3 rounded-full font-handwritten text-lg hover:shadow-lg hover:glow-red transition-all"
                >
                  🗑️ Delete Event
                </button>
              </>
            ) : (
              <button
                onClick={handleRegister}
                disabled={registering || isRegistered}
                className={`px-6 py-3 rounded-full font-handwritten text-lg transition-all ${
                  isRegistered
                    ? 'bg-green-400 text-white cursor-not-allowed'
                    : registering
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-400 to-pink-500 text-white hover:shadow-lg hover:glow-pink'
                }`}
              >
                {registering ? "Registering..." : isRegistered ? "✅ Registered" : "🎟️ Register Now"}
              </button>
            )}
          </div>

          {/* Attendees List */}
          <div className="bg-white rounded-lg p-4 border-2 border-dashed border-green-200">
            <h3 className="text-xl font-semibold mb-4 font-handwritten bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
              Attendees ({event.attendees.length})
            </h3>
            
            {event.attendees.length === 0 ? (
              <p className="text-gray-500 font-handwritten text-center py-4">No one has registered yet. Be the first!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {event.attendees.map(att => (
                  <div key={att._id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                      {att.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-gray-800 font-handwritten">{att.name}</div>
                      <div className="text-sm text-gray-500">{att.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
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
        .hover\:glow-blue:hover {
          box-shadow: 0 0 15px rgba(173, 216, 230, 0.8);
        }
        .hover\:glow-pink:hover {
          box-shadow: 0 0 15px rgba(255, 192, 203, 0.8);
        }
        .hover\:glow-red:hover {
          box-shadow: 0 0 15px rgba(255, 99, 132, 0.8);
        }
      `}</style>
      
      {/* Load handwritten font from Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Gochi+Hand&display=swap" rel="stylesheet" />
    </div>
  );
};

export default EventDetail;
/*2nd*/