// Frontend/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// 1. Make sure this import line exists
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Make sure <App /> is wrapped inside <BrowserRouter> exactly like this */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);