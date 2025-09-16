// Frontend/src/pages/UserDashboard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');

  const fetchStores = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const searchUrl = `http://localhost:3001/api/stores?name=${searchName}&address=${searchAddress}`;

    try {
      const response = await axios.get(searchUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setStores(response.data);
    } catch (err) {
      setError('Failed to fetch stores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStores();
  };

  const handleRatingSubmit = async (store_id, rating_value) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:3001/api/ratings',
        { store_id, rating_value },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      fetchStores();
    } catch (err) {
      alert('Failed to submit rating.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Discover Stores</h1>

        <div className="mb-10 p-6 bg-white rounded-xl shadow-lg">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-center">
            <input
              type="text"
              placeholder="Search by Store Name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="text"
              placeholder="Search by Address..."
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button type="submit" className="w-full md:w-auto px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition-colors shrink-0">Search</button>
          </form>
        </div>

        {loading ? <p className="text-center text-slate-500">Loading stores...</p> :
          error ? <p className="text-center text-red-500">{error}</p> :
            (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stores.length > 0 ? stores.map(store => (
                  <div key={store.id} className="bg-white rounded-xl shadow-lg flex flex-col overflow-hidden border-t-4 border-teal-500 transition-transform transform hover:-translate-y-2">
                    <div className="p-6 flex-grow">
                      <h2 className="text-2xl font-bold text-slate-800 mb-2">{store.name}</h2>
                      <p className="text-slate-500 mb-6">{store.address}</p>

                      <div className="space-y-3 text-md">
                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                          <p className="font-semibold text-slate-600">Overall Rating:</p>
                          <span className="font-bold text-xl text-teal-600">
                            {store.overall_rating ? parseFloat(store.overall_rating).toFixed(1) : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                          <p className="font-semibold text-slate-600">Your Rating:</p>
                          <span className="font-bold text-xl text-amber-600">
                            {store.user_submitted_rating ? store.user_submitted_rating : 'Not Rated'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-slate-50">
                      <p className="text-sm font-semibold text-slate-700 mb-3 text-center">Give Your Rating</p>
                      <div className="flex justify-around">
                        {[1, 2, 3, 4, 5].map(rating => (
                          <button
                            key={rating}
                            onClick={() => handleRatingSubmit(store.id, rating)}
                            className={`w-12 h-12 rounded-full font-bold text-lg transition-all duration-200 flex items-center justify-center ${store.user_submitted_rating === rating ? 'bg-teal-600 text-white shadow-lg scale-110' : 'bg-slate-200 text-slate-700 hover:bg-teal-200'}`}
                          >
                            {rating}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )) : <p className="col-span-full text-center text-slate-500 mt-8">No stores found with the current filters.</p>}
              </div>
            )}
      </div>
    </div>
  );
};

export default UserDashboard;