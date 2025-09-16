const express = require('express');
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// ROUTE: GET /api/admin/stats
router.get('/stats', isAdmin, async (req, res) => {
    try {
        const userCountQuery = "SELECT COUNT(*) as totalUsers FROM users";
        const storeCountQuery = "SELECT COUNT(*) as totalStores FROM stores";
        const ratingCountQuery = "SELECT COUNT(*) as totalRatings FROM ratings";
        const [userResult] = await db.query(userCountQuery);
        const [storeResult] = await db.query(storeCountQuery);
        const [ratingResult] = await db.query(ratingCountQuery);
        res.status(200).json({
            totalUsers: userResult[0].totalUsers,
            totalStores: storeResult[0].totalStores,
            totalRatings: ratingResult[0].totalRatings
        });
    } catch (err) {
        res.status(500).json({ message: "Database error fetching stats." });
    }
});

// ROUTE: GET /api/admin/users
router.get('/users', isAdmin, async (req, res) => {
    try {
        const { name, email, role, sortBy, sortOrder } = req.query;
        let query = `
            SELECT 
                u.id, u.name, u.email, u.address, u.role,
                AVG(r.rating_value) as rating
            FROM users u
            LEFT JOIN stores s ON u.id = s.owner_id AND u.role = 'Store Owner'
            LEFT JOIN ratings r ON s.id = r.store_id
        `;
        let queryParams = [];
        let whereClauses = [];
        if (name) { whereClauses.push("u.name LIKE ?"); queryParams.push(`%${name}%`); }
        if (email) { whereClauses.push("u.email LIKE ?"); queryParams.push(`%${email}%`); }
        if (role) { whereClauses.push("u.role = ?"); queryParams.push(role); }
        if (whereClauses.length > 0) { query += " WHERE " + whereClauses.join(" AND "); }
        query += " GROUP BY u.id";
        const allowedSortBy = ['name', 'email', 'role', 'rating'];
        if (allowedSortBy.includes(sortBy)) {
            const order = (sortOrder && sortOrder.toUpperCase() === 'DESC') ? 'DESC' : 'ASC';
            query += ` ORDER BY ${sortBy} ${order}`;
        }
        const [results] = await db.query(query, queryParams);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: "Database error fetching users." });
    }
});

// ROUTE: GET /api/admin/stores
router.get('/stores', isAdmin, async (req, res) => {
    try {
        const { name, email, sortBy, sortOrder } = req.query;
        let query = `
            SELECT s.id, s.name, s.email, s.address, AVG(r.rating_value) as rating
            FROM stores s LEFT JOIN ratings r ON s.id = r.store_id
        `;
        let queryParams = [];
        let whereClauses = [];
        if (name) { whereClauses.push("s.name LIKE ?"); queryParams.push(`%${name}%`); }
        if (email) { whereClauses.push("s.email LIKE ?"); queryParams.push(`%${email}%`); }
        if (whereClauses.length > 0) { query += " WHERE " + whereClauses.join(" AND "); }
        query += " GROUP BY s.id";
        const allowedSortBy = ['name', 'email', 'rating'];
        if (allowedSortBy.includes(sortBy)) {
            const order = (sortOrder && sortOrder.toUpperCase() === 'DESC') ? 'DESC' : 'ASC';
            query += ` ORDER BY ${sortBy} ${order}`;
        }
        const [results] = await db.query(query, queryParams);
        res.status(200).json(results);
    } catch(err) {
        res.status(500).json({ message: "Database error fetching stores." });
    }
});

// ROUTE: POST /api/admin/users/add
router.post('/users/add', isAdmin, async (req, res) => {
    const { name, email, password, address, role } = req.body;
    if (!name || !email || !password || !address || !role) { return res.status(400).json({ message: "Please provide all user details." }); }
    if (!['Normal User', 'System Administrator', 'Store Owner'].includes(role)) { return res.status(400).json({ message: "Invalid user role specified." }); }
    try {
        const [existingUsers] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existingUsers.length > 0) { return res.status(409).json({ message: "Email already in use." }); }
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)";
        await db.query(query, [name, email, hashedPassword, address, role]);
        res.status(201).json({ message: `User '${name}' created successfully as a ${role}.` });
    } catch (err) {
        res.status(500).json({ message: "Database error while creating user." });
    }
});

module.exports = router;
