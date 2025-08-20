import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config/api.js';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Account created! You can now log in.');
        navigate('/login');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch {
      toast.error('Something went wrong.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded shadow">
        <h2 className="mt-6 text-center text-2xl font-bold">Create your account</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="text" name="name" required placeholder="Name" value={formData.name} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded mb-3" />
          <input type="email" name="email" required placeholder="Email" value={formData.email} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded mb-3" />
          <input type="password" name="password" required placeholder="Password" value={formData.password} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded mb-3" />
          <input type="password" name="confirmPassword" required placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded mb-3" />
          <button type="submit" disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;
