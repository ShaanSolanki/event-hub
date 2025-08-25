import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config/api.js';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token);
        navigate('/');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch {
      toast.error('Something went wrong.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background with notebook grid and floating elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-blue-50 bg-[length:40px_40px] bg-grid-pattern z-0"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 text-2xl text-pink-300 animate-float">❤️</div>
      <div className="absolute top-1/3 right-20 text-xl text-blue-300 animate-float" style={{animationDelay: '2s'}}>⭐</div>
      <div className="absolute bottom-1/4 left-1/4 text-xl text-yellow-300 animate-float" style={{animationDelay: '1s'}}>✨</div>
      <div className="absolute top-1/2 right-1/3 text-2xl text-purple-300 animate-float" style={{animationDelay: '3s'}}>❤️</div>
      <div className="absolute bottom-20 right-10 text-xl text-green-300 animate-float" style={{animationDelay: '4s'}}>⭐</div>
      
      <div className="max-w-md w-full space-y-8 p-8 rounded-lg relative z-10">
        {/* Form container with doodle outline */}
        <div className="relative bg-white bg-opacity-90 backdrop-blur-sm p-8 rounded-xl shadow-lg border-2 border-dashed border-pink-300 transform rotate-1">
          {/* Doodle corner elements */}
          <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-pink-400 rounded-tl-lg"></div>
          <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-pink-400 rounded-tr-lg"></div>
          <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-pink-400 rounded-bl-lg"></div>
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-pink-400 rounded-br-lg"></div>
          
          <h2 className="text-center text-4xl font-handwritten font-bold mb-8 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent glow-text">
            Welcome Back!
          </h2>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <input 
                type="email" 
                name="email" 
                required 
                placeholder="Email" 
                value={formData.email} 
                onChange={handleChange}
                className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-pink-400 transition-colors font-handwritten text-lg" 
              />
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-400 transition-all duration-300 group-focus-within:w-full"></div>
            </div>
            
            <div className="relative">
              <input 
                type="password" 
                name="password" 
                required 
                placeholder="Password" 
                value={formData.password} 
                onChange={handleChange}
                className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-pink-400 transition-colors font-handwritten text-lg" 
              />
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-400 transition-all duration-300 group-focus-within:w-full"></div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-full font-handwritten text-xl hover:shadow-lg hover:glow-pink transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <p className="mt-6 text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link 
              to="/register" 
              className="text-blue-500 font-handwritten text-base underline decoration-wavy decoration-blue-300 hover:text-blue-600 hover:glow-blue transition-all"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Custom styles */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(200, 200, 200, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200, 200, 200, 0.3) 1px, transparent 1px);
        }
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .font-handwritten {
          font-family: 'Gochi Hand', cursive, 'Comic Sans MS', sans-serif;
        }
        .glow-text {
          text-shadow: 0 0 10px rgba(255, 192, 203, 0.5),
                       0 0 20px rgba(255, 192, 203, 0.3);
        }
        .hover\:glow-pink:hover {
          box-shadow: 0 0 15px rgba(255, 182, 193, 0.8);
        }
        .hover\:glow-blue:hover {
          text-shadow: 0 0 10px rgba(173, 216, 230, 0.8);
        }
      `}</style>
      
      {/* Load handwritten font from Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Gochi+Hand&display=swap" rel="stylesheet" />
    </div>
  );
};

export default Login;