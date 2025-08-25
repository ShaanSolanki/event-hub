import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentLetter, setCurrentLetter] = useState(0);
  
  // Animation for the brand name
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLetter(prev => (prev + 1) % 7); // 7 letters in "EventHub"
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="bg-transparent relative mb-6 py-4">
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Animated Brand Name */}
        <Link to="/" className="text-3xl font-handwritten font-bold relative">
          {['E', 'v', 'e', 'n', 't', 'H', 'u', 'b'].map((letter, index) => (
            <span 
              key={index}
              className={`inline-block transition-all duration-300 ${
                index === currentLetter 
                  ? 'text-pink-500 filter drop-shadow-[0_0_8px_rgba(255,182,193,0.8)] scale-110' 
                  : 'text-gray-700'
              }`}
              style={{
                background: index === currentLetter 
                  ? 'linear-gradient(to right, #FFB6C1, #B19CD9)' 
                  : 'none',
                WebkitBackgroundClip: index === currentLetter ? 'text' : 'none',
                WebkitTextFillColor: index === currentLetter ? 'transparent' : ''
              }}
            >
              {letter}
            </span>
          ))}
        </Link>
        
        <div className="flex items-center gap-6">
          <Link 
            to="/" 
            className="text-gray-700 hover:text-blue-400 font-handwritten text-lg relative group transition-all"
          >
            Events
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-300 transition-all duration-300 group-hover:w-full group-hover:rounded-full"></span>
          </Link>
          
          {user ? (
            <>
              <Link 
                to="/create-event" 
                className="text-gray-700 hover:text-purple-400 font-handwritten text-lg relative group transition-all"
              >
                Create Event
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-purple-300 transition-all duration-300 group-hover:w-full group-hover:rounded-full"></span>
              </Link>
              
              <Link 
                to="/dashboard" 
                className="text-gray-700 hover:text-green-400 font-handwritten text-lg relative group transition-all"
              >
                My Events
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-green-300 transition-all duration-300 group-hover:w-full group-hover:rounded-full"></span>
              </Link>
              
              <button 
                onClick={() => { logout(); navigate('/'); }} 
                className="bg-gradient-to-r from-pink-300 to-pink-400 hover:from-pink-400 hover:to-pink-500 text-gray-800 px-5 py-2 rounded-full font-handwritten text-lg hover:shadow-lg hover:glow-pink transition-all duration-300 hover:-translate-y-0.5"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="bg-gradient-to-r from-green-300 to-green-400 hover:from-green-400 hover:to-green-500 text-gray-800 px-5 py-2 rounded-full font-handwritten text-lg hover:shadow-lg hover:glow-mint transition-all duration-300 hover:-translate-y-0.5"
              >
                Login
              </Link>
              
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-purple-300 to-purple-400 hover:from-purple-400 hover:to-purple-500 text-gray-800 px-5 py-2 rounded-full font-handwritten text-lg hover:shadow-lg hover:glow-lavender transition-all duration-300 hover:-translate-y-0.5"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Custom styles */}
      <style jsx>{`
        .font-handwritten {
          font-family: 'Gochi Hand', cursive, 'Comic Sans MS', sans-serif;
        }
        .hover\:glow-mint:hover {
          box-shadow: 0 0 15px rgba(175, 238, 238, 0.7);
        }
        .hover\:glow-lavender:hover {
          box-shadow: 0 0 15px rgba(230, 230, 250, 0.7);
        }
        .hover\:glow-pink:hover {
          box-shadow: 0 0 15px rgba(255, 192, 203, 0.7);
        }
      `}</style>
      
      {/* Load handwritten font from Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Gochi+Hand&display=swap" rel="stylesheet" />
    </nav>
  );
};

export default Navbar;