import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Layout from './components/Layout';
import UpdatePassword from './pages/UpdatePassword';

// 1. Import the ToastContainer and its required CSS file
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <div>
      {/* 2. This component MUST be here to display the notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><Layout><UserDashboard /></Layout></ProtectedRoute>} />
        <Route path="/owner-dashboard" element={<ProtectedRoute><Layout><OwnerDashboard /></Layout></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<ProtectedRoute><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
        <Route path="/update-password" element={<ProtectedRoute><Layout><UpdatePassword /></Layout></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;