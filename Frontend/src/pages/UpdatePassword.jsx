// Frontend/src/pages/UpdatePassword.jsx

import React, { useState } from 'react';
import axios from 'axios';

const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:3001/api/users/update-password',
        { newPassword },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800">Update Password</h1>
          <p className="mt-2 text-slate-500">Enter and confirm your new password.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength="8"
              maxLength="16"
              pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$"
              title="Password must be 8-16 characters, with at least one uppercase letter and one special character."
              className="w-full px-4 py-3 text-slate-700 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <p className="text-xs text-slate-500 mt-1 pl-1">8-16 chars, 1 uppercase, 1 special character.</p>
          </div>
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 text-slate-700 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          {message && <p className="text-sm text-center text-green-700 bg-green-100 p-3 rounded-lg">{message}</p>}
          {error && <p className="text-sm text-center text-red-700 bg-red-100 p-3 rounded-lg">{error}</p>}

          <button type="submit" className="w-full py-3 text-white font-semibold bg-teal-600 rounded-lg shadow-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all transform hover:-translate-y-1">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;