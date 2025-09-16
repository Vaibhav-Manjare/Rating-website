import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <header className="bg-gray-800 text-white shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Store Rating </h1>
          <div className="flex items-center">
            <Link to="/update-password" className="text-gray-300 hover:text-white mr-6">
              Update Password
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;