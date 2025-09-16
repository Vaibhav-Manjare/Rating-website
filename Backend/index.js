require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware Setup ---

// 1. IMPORTANT: Enable CORS for all requests. This must come before your routes.
app.use(cors());

// 2. Enable the server to parse JSON from request bodies
app.use(express.json());


// --- Import All Route Files ---
const authRoutes = require('./routes/auth');
const storeRoutes = require('./routes/stores');
const ratingRoutes = require('./routes/ratings');
const ownerRoutes = require('./routes/owner');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');


// --- Use Routes ---
// Connect the route handlers to the application
app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);


// A simple test route
app.get("/api", (req, res) => {
    res.json({ message: "Hello from the Express server!" });
});

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});