// Frontend/src/pages/OwnerDashboard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3001/api/owner/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setDashboardData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="p-8 text-center text-slate-500">Loading dashboard...</p>;
  if (error) return <p className="p-8 text-center text-red-500 bg-red-100 rounded-lg">{error}</p>;

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Owner's Dashboard</h1>

        <div className="mb-10 p-8 bg-white rounded-xl shadow-xl text-center border-t-4 border-teal-500">
          <h2 className="text-xl font-semibold text-slate-500 uppercase tracking-widest">Average Store Rating</h2>
          <p className="text-7xl font-bold text-teal-600 mt-2">
            {dashboardData?.averageRating ? parseFloat(dashboardData.averageRating).toFixed(2) : 'N/A'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800">Recent Customer Ratings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-4 font-semibold text-slate-600 uppercase tracking-wider">User Name</th>
                  <th className="text-left p-4 font-semibold text-slate-600 uppercase tracking-wider">User Email</th>
                  <th className="text-center p-4 font-semibold text-slate-600 uppercase tracking-wider">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {dashboardData?.ratings && dashboardData.ratings.length > 0 ? (
                  dashboardData.ratings.map((rating, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors duration-200">
                      <td className="p-4 whitespace-nowrap font-medium text-slate-800">{rating.name}</td>
                      <td className="p-4 whitespace-nowrap text-slate-500">{rating.email}</td>
                      <td className="p-4 whitespace-nowrap text-center">
                        <span className="px-4 py-1 font-bold text-lg text-teal-800 bg-teal-100 rounded-full">
                          {rating.rating_value}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-10 text-center text-slate-500">You have not received any ratings yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;