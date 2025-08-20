import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config/api.js';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: ''
  });
  const [banner, setBanner] = useState(null);
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categories = ['Tech', 'Music', 'Art', 'Sports', 'Business', 'Education', 'Health', 'Other'];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setBanner(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();
    Object.keys(formData).forEach(k => fd.append(k, formData[k]));
    if (banner) fd.append('banner', banner);

    try {
      const res = await fetch(`${API_BASE_URL}/api/events/create`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Event created!');
        navigate('/');
      } else {
        toast.error(data.message || 'Failed to create event');
      }
    } catch {
      toast.error('Something went wrong.');
    }
    setLoading(false);
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Please log in to create an event</h2>
          <button onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-xl font-bold mb-6">Create New Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="title" required placeholder="Title" value={formData.title} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded" />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded" rows={3} />
          <input type="date" name="date" required value={formData.date} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded" />
          <input type="time" name="time" value={formData.time} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded" />
          <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded" />
          <select name="category" value={formData.category} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded">
            <option value="">Select Category</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <input type="file" name="banner" accept="image/*" onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded" />
          <button type="submit" disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
