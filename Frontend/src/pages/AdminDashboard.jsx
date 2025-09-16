// Frontend/src/pages/AdminDashboard.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';

const AdminDashboard = () => {
  const [storeOwnerFormData, setStoreOwnerFormData] = useState({
    storeName: '', storeEmail: '', storeAddress: '',
    ownerName: '', ownerEmail: '', ownerPassword: '', ownerAddress: ''
  });
  const [userFormData, setUserFormData] = useState({ name: '', email: '', password: '', address: '', role: 'Normal User' });
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [userFilters, setUserFilters] = useState({ name: '', email: '', role: '' });
  const [storeFilters, setStoreFilters] = useState({ name: '', email: '' });
  const [userSort, setUserSort] = useState({ sortBy: 'name', sortOrder: 'ASC' });
  const [storeSort, setStoreSort] = useState({ sortBy: 'name', sortOrder: 'ASC' });

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { 'Authorization': `Bearer ${token}` } };
    try {
      const userParams = new URLSearchParams({ ...userFilters, ...userSort }).toString();
      const storeParams = new URLSearchParams({ ...storeFilters, ...storeSort }).toString();
      const [statsRes, usersRes, storesRes] = await Promise.all([
        axios.get('http://localhost:3001/api/admin/stats', config),
        axios.get(`http://localhost:3001/api/admin/users?${userParams}`, config),
        axios.get(`http://localhost:3001/api/admin/stores?${storeParams}`, config)
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setStores(storesRes.data);
    } catch (err) {
      toast.error("Failed to load dashboard data.");
    }
  }, [userFilters, storeFilters, userSort, storeSort]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSort = (list, column) => {
    if (list === 'users') {
      const sortOrder = (userSort.sortBy === column && userSort.sortOrder === 'ASC') ? 'DESC' : 'ASC';
      setUserSort({ sortBy: column, sortOrder });
    } else if (list === 'stores') {
      const sortOrder = (storeSort.sortBy === column && storeSort.sortOrder === 'ASC') ? 'DESC' : 'ASC';
      setStoreSort({ sortBy: column, sortOrder });
    }
  };

  const handleStoreOwnerFormChange = (e) => setStoreOwnerFormData({ ...storeOwnerFormData, [e.target.name]: e.target.value });
  const handleUserFormChange = (e) => setUserFormData({ ...userFormData, [e.target.name]: e.target.value });

  const handleStoreOwnerSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:3001/api/stores/add', storeOwnerFormData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success(response.data.message);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create store and owner.');
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:3001/api/admin/users/add', userFormData, { headers: { 'Authorization': `Bearer ${token}` } });
      toast.success(response.data.message);
      setIsUserModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add user.');
    }
  };

  const SortableHeader = ({ list, column, label }) => {
    const currentSort = list === 'users' ? userSort : storeSort;
    const icon = currentSort.sortBy === column ? (currentSort.sortOrder === 'ASC' ? '▲' : '▼') : '↕';
    return (
      <th className="p-4 text-left font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort(list, column)}>
        {label} <span className="text-slate-400 ml-1">{icon}</span>
      </th>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl font-bold text-slate-800 mb-8">Administrator Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-teal-500"><h3 className="text-lg font-semibold text-slate-500">Total Users</h3><p className="text-5xl font-bold mt-2 text-teal-600">{stats ? stats.totalUsers : '...'}</p></div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-sky-500"><h3 className="text-lg font-semibold text-slate-500">Total Stores</h3><p className="text-5xl font-bold mt-2 text-sky-600">{stats ? stats.totalStores : '...'}</p></div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-amber-500"><h3 className="text-lg font-semibold text-slate-500">Total Ratings</h3><p className="text-5xl font-bold mt-2 text-amber-600">{stats ? stats.totalRatings : '...'}</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-xl">
          <form onSubmit={handleStoreOwnerSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-4">Create New Store & Owner</h2>
            <fieldset className="space-y-4">
              <legend className="text-lg font-semibold text-teal-700">Store Details</legend>
              <input name="storeName" onChange={handleStoreOwnerFormChange} placeholder="Store Name" required className="w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-teal-500" />
              <input name="storeEmail" type="email" onChange={handleStoreOwnerFormChange} placeholder="Store Email" required className="w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-teal-500" />
              <textarea name="storeAddress" onChange={handleStoreOwnerFormChange} placeholder="Store Address" required rows="3" className="w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-teal-500"></textarea>
            </fieldset>
            <fieldset className="space-y-4">
              <legend className="text-lg font-semibold text-teal-700">Owner Details</legend>
              <input name="ownerName" onChange={handleStoreOwnerFormChange} placeholder="Owner Full Name" required className="w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-teal-500" />
              <input name="ownerEmail" type="email" onChange={handleStoreOwnerFormChange} placeholder="Owner Login Email" required className="w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-teal-500" />
              <input name="ownerPassword" type="password" onChange={handleStoreOwnerFormChange} placeholder="Temporary Password" required className="w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-teal-500" />
              <textarea name="ownerAddress" onChange={handleStoreOwnerFormChange} placeholder="Owner Address" required rows="3" className="w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-teal-500"></textarea>
            </fieldset>
            <button type="submit" className="w-full py-3 text-white font-semibold bg-teal-600 rounded-lg shadow-lg hover:bg-teal-700 transition-colors">Create</button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">Manage Users</h2>
              <button onClick={() => setIsUserModalOpen(true)} className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition-colors">Add User</button>
            </div>
            <div className="p-4 flex gap-4 bg-slate-50/50"><input type="text" placeholder="Filter by Name..." value={userFilters.name} onChange={e => setUserFilters({ ...userFilters, name: e.target.value })} className="p-2 border rounded-lg w-full bg-white" /><input type="text" placeholder="Filter by Email..." value={userFilters.email} onChange={e => setUserFilters({ ...userFilters, email: e.target.value })} className="p-2 border rounded-lg w-full bg-white" /></div>
            <div className="overflow-x-auto"><table className="min-w-full"><thead><tr className="bg-slate-50"><SortableHeader list="users" column="name" label="Name" /><SortableHeader list="users" column="email" label="Email" /><SortableHeader list="users" column="role" label="Role" /><SortableHeader list="users" column="rating" label="Store Rating" /></tr></thead><tbody className="divide-y divide-slate-200">{users.map(user => (<tr key={user.id} className="hover:bg-slate-50"><td className="p-4 font-medium">{user.name}</td><td className="p-4 text-slate-500">{user.email}</td><td className="p-4">{user.role}</td><td className="p-4 font-semibold text-slate-700">{user.role === 'Store Owner' ? (user.rating ? parseFloat(user.rating).toFixed(2) : 'No Ratings') : 'N/A'}</td></tr>))}</tbody></table></div>
          </div>

          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-200"><h2 className="text-2xl font-bold text-slate-800">Manage Stores</h2></div>
            <div className="p-4 flex gap-4 bg-slate-50/50"><input type="text" placeholder="Filter by Name..." value={storeFilters.name} onChange={e => setStoreFilters({ ...storeFilters, name: e.target.value })} className="p-2 border rounded-lg w-full bg-white" /><input type="text" placeholder="Filter by Email..." value={storeFilters.email} onChange={e => setStoreFilters({ ...storeFilters, email: e.target.value })} className="p-2 border rounded-lg w-full bg-white" /></div>
            <div className="overflow-x-auto"><table className="min-w-full"><thead><tr className="bg-slate-50"><SortableHeader list="stores" column="name" label="Name" /><SortableHeader list="stores" column="email" label="Email" /><SortableHeader list="stores" column="rating" label="Rating" /></tr></thead><tbody className="divide-y divide-slate-200">{stores.map(store => (<tr key={store.id} className="hover:bg-slate-50"><td className="p-4 font-medium">{store.name}</td><td className="p-4 text-slate-500">{store.email}</td><td className="p-4 font-semibold text-slate-700">{store.rating ? parseFloat(store.rating).toFixed(2) : 'N/A'}</td></tr>))}</tbody></table></div>
          </div>
        </div>
      </div>

      <Modal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} title="Add New Admin or User">
        <form onSubmit={handleUserSubmit} className="space-y-4">
          <input name="name" onChange={handleUserFormChange} placeholder="Full Name" required className="w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-teal-500" />
          <input name="email" type="email" onChange={handleUserFormChange} placeholder="Email" required className="w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-teal-500" />
          <textarea name="address" onChange={handleUserFormChange} placeholder="Address" required className="w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-teal-500"></textarea>
          <input name="password" type="password" onChange={handleUserFormChange} placeholder="Password" required className="w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-teal-500" />
          <select name="role" onChange={handleUserFormChange} value={userFormData.role} className="w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-teal-500">
            <option value="Normal User">Normal User</option>
            <option value="System Administrator">System Administrator</option>
          </select>
          <button type="submit" className="w-full py-3 text-white font-semibold bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition-colors">Create User</button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;