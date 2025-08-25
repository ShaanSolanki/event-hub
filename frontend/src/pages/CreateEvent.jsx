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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 bg-[length:40px_40px] bg-grid-pattern">
        <div className="text-center bg-white bg-opacity-90 p-8 rounded-xl shadow-lg border-2 border-dashed border-pink-300">
          <h2 className="text-xl font-bold mb-4 font-handwritten">Please log in to create an event</h2>
          <button onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-pink-400 to-pink-500 text-white px-6 py-2 rounded-full font-handwritten text-lg hover:shadow-lg hover:glow-pink transition-all">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 bg-[length:40px_40px] bg-grid-pattern py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Notebook Paper Form */}
        <div className="bg-gradient-to-b from-white to-blue-50 p-8 rounded-lg shadow-lg relative border-2 border-dashed border-blue-200">
          {/* Doodle border elements */}
          <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-blue-300 rounded-tl-lg"></div>
          <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-blue-300 rounded-tr-lg"></div>
          <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-blue-300 rounded-bl-lg"></div>
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-blue-300 rounded-br-lg"></div>
          
          {/* Notebook lines */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="h-6 border-b border-gray-300 mx-2"></div>
            ))}
          </div>
          
          <h2 className="text-2xl font-bold mb-6 text-center font-handwritten bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent glow-text">
            Create New Event
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="relative">
              <input 
                type="text" 
                name="title" 
                required 
                placeholder="Event Title" 
                value={formData.title} 
                onChange={handleChange}
                className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-400 transition-colors font-handwritten text-lg" 
              />
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-focus-within:w-full"></div>
            </div>
            
            <div className="relative">
              <textarea 
                name="description" 
                placeholder="Event Description" 
                value={formData.description} 
                onChange={handleChange}
                className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-purple-400 transition-colors font-handwritten text-lg resize-none" 
                rows={3} 
              />
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-focus-within:w-full"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input 
                  type="date" 
                  name="date" 
                  required 
                  value={formData.date} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-green-400 transition-colors font-handwritten text-lg" 
                />
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-focus-within:w-full"></div>
              </div>
              
              <div className="relative">
                <input 
                  type="time" 
                  name="time" 
                  value={formData.time} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-green-400 transition-colors font-handwritten text-lg" 
                />
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-focus-within:w-full"></div>
              </div>
            </div>
            
            <div className="relative">
              <input 
                type="text" 
                name="location" 
                placeholder="Event Location" 
                value={formData.location} 
                onChange={handleChange}
                className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-pink-400 transition-colors font-handwritten text-lg" 
              />
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-400 transition-all duration-300 group-focus-within:w-full"></div>
            </div>
            
            <div className="relative">
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-yellow-400 transition-colors font-handwritten text-lg appearance-none"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.name} value={cat.name}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-focus-within:w-full"></div>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <span className="text-gray-400">▼</span>
              </div>
            </div>
            
            {/* Polaroid-style file upload */}
            <div className="relative group">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-blue-50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="w-12 h-10 mb-3 bg-gradient-to-r from-pink-300 to-purple-300 rounded flex items-center justify-center text-white text-2xl">
                    📷
                  </div>
                  <p className="mb-2 text-sm text-gray-500 font-handwritten">
                    {banner ? 'Change Banner Image' : 'Click to Upload Banner'}
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG up to 10MB
                  </p>
                </div>
                <input 
                  type="file" 
                  name="banner" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </label>
              {banner && (
                <p className="mt-2 text-sm text-center text-green-600 font-handwritten">
                  ✓ {banner.name}
                </p>
              )}
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-full font-handwritten text-xl hover:shadow-lg hover:glow-blue transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Creating Event...' : 'Create Event ✨'}
            </button>
          </form>
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
        .glow-text {
          text-shadow: 0 0 10px rgba(173, 216, 230, 0.5),
                       0 0 20px rgba(173, 216, 230, 0.3);
        }
        .hover\:glow-blue:hover {
          box-shadow: 0 0 15px rgba(173, 216, 230, 0.8);
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

export default CreateEvent;