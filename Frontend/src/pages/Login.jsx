// Frontend/src/pages/Login.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', formData);
      const token = response.data.token;
      localStorage.setItem('token', token);

      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;

      if (userRole === 'System Administrator') {
        navigate('/admin-dashboard');
      } else if (userRole === 'Store Owner') {
        navigate('/owner-dashboard');
      } else {
        navigate('/dashboard');
      }

    }
    catch (err) {
      setError(err.response?.data?.message || 'Login failed!');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 font-sans">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl transform transition-all hover:scale-105">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800">Welcome Back</h1>
          <p className="mt-2 text-slate-500">Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="peer w-full px-4 py-3 text-slate-700 bg-slate-50 border border-slate-300 rounded-lg placeholder-transparent focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <label htmlFor="email" className="absolute left-4 -top-3.5 text-slate-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-teal-600 peer-focus:text-sm">
              Email Address
            </label>
          </div>

          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="peer w-full px-4 py-3 text-slate-700 bg-slate-50 border border-slate-300 rounded-lg placeholder-transparent focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <label htmlFor="password" className="absolute left-4 -top-3.5 text-slate-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-teal-600 peer-focus:text-sm">
              Password
            </label>
          </div>

          {error && <p className="text-sm text-center text-red-600 bg-red-100 p-3 rounded-lg animate-pulse">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 text-white font-semibold bg-teal-600 rounded-lg shadow-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all transform hover:-translate-y-1"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center text-slate-500">
          No account yet?{' '}
          <Link to="/" className="font-semibold text-teal-600 hover:underline">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;