import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  return (
    <nav className="bg-white shadow mb-6">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">EventHub</Link>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-gray-700 hover:text-blue-600">Events</Link>
          {user ? (
            <>
              <Link to="/create-event" className="text-gray-700 hover:text-blue-600">Create Event</Link>
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">My Events</Link>
              <button 
                onClick={() => { logout(); navigate('/'); }} 
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
