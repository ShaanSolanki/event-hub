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
    if (!window.confirm('Delete event?')) return;
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
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
    </div>
  );
  if (!event) return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-4">Event not found</h2>
      <Link to="/" className="text-blue-600">Back to events</Link>
    </div>
  );

  const isCreator = user && event.createdBy._id === user.id;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white shadow rounded p-6">
        <div className="h-60 bg-gray-200 mb-4 flex items-center justify-center">
          {event.banner ? (
            <img src={`${API_BASE_URL}${event.banner}`} alt={event.title} className="w-full h-full object-cover" />
          ) : (<span className="text-2xl text-blue-600">{event.title}</span>)}
        </div>
        <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
        <p className="mb-2">Date: {new Date(event.date).toLocaleDateString()} {event.time}</p>
        <p className="mb-2">Location: {event.location}</p>
        <span className="mb-2">Category: {event.category}</span>
        <div className="mt-2 mb-2">{event.attendees.length} attendees</div>
        <p className="mb-4 text-gray-700">{event.description}</p>
        <div className="mb-4">
          <p>Created by: {event.createdBy.name} ({event.createdBy.email})</p>
        </div>
        {isCreator ? (
          <>
            <Link to={`/edit-event/${event._id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded inline-block mr-2 hover:bg-blue-700">Edit Event</Link>
            <button onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete Event</button>
          </>
        ) : (
          <button onClick={handleRegister} disabled={registering || isRegistered}
            className={`bg-blue-600 text-white px-4 py-2 rounded ${isRegistered ? "bg-green-600 cursor-not-allowed" : "hover:bg-blue-700"}`}>
            {registering ? "Registering..." : isRegistered ? "Registered" : "Register"}
          </button>
        )}
        <div className="mt-10 mb-2">
          <h3 className="text-lg font-bold mb-2">Attendees</h3>
          <ul>
            {event.attendees.map(att => (
              <li key={att._id} className="mb-1">{att.name} ({att.email})</li>
            ))}
          </ul>
        </div>
        <Link to="/" className="mt-4 text-blue-600 block">← Back to all events</Link>
      </div>
    </div>
  );
};

export default EventDetail;
