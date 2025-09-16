// Frontend/src/pages/Signup.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', formData);
      setMessage(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response.data.message || 'An error occurred during signup.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-800">Create Your Account</h1>
            <p className="mt-2 text-slate-500">Let's get started with a free account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            onChange={handleChange}
            placeholder="Full Name (e.g. John Doe)"
            required
            minLength="20"
            maxLength="60"
            className="w-full px-4 py-3 text-slate-700 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input
            name="email"
            type="email"
            onChange={handleChange}
            placeholder="Email Address"
            required
            className="w-full px-4 py-3 text-slate-700 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <textarea
            name="address"
            onChange={handleChange}
            placeholder="Your Full Address"
            required
            maxLength="400"
            rows="3"
            className="w-full px-4 py-3 text-slate-700 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          ></textarea>
          <div>
            <input
              name="password"
              type="password"
              onChange={handleChange}
              placeholder="Create a Password"
              required
              minLength="8"
              maxLength="16"
              pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$"
              title="Password must be 8-16 characters, with at least one uppercase letter and one special character."
              className="w-full px-4 py-3 text-slate-700 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <p className="text-xs text-slate-500 mt-1 pl-1">8-16 chars, 1 uppercase, 1 special character (e.g., !@#$).</p>
          </div>
          
          {message && <p className="text-sm text-center text-green-700 bg-green-100 p-3 rounded-lg">{message}</p>}
          {error && <p className="text-sm text-center text-red-700 bg-red-100 p-3 rounded-lg">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 text-white font-semibold bg-teal-600 rounded-lg shadow-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all transform hover:-translate-y-1"
          >
            Create Account
          </button>
        </form>

        <p className="text-sm text-center text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-teal-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;