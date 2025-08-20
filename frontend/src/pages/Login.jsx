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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded shadow">
        <h2 className="mt-6 text-center text-2xl font-bold">Sign in to your account</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="email" name="email" required placeholder="Email" value={formData.email} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded mb-3" />
          <input type="password" name="password" required placeholder="Password" value={formData.password} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded mb-3" />
          <button type="submit" disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">Don't have an account? <Link to="/register" className="text-blue-600">Sign Up</Link></p>
      </div>
    </div>
  );
};

export default Login;
