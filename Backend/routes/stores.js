const express = require('express');
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { isAuth, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// ROUTE: POST /api/stores/add - REWRITTEN FOR COMBINED CREATION
// A System Administrator can add new stores and the associated user.
router.post('/add', isAdmin, async (req, res) => {
    // We now expect both store and new owner details in the body
    const { storeName, storeEmail, storeAddress, ownerName, ownerEmail, ownerPassword, ownerAddress } = req.body;

    if (!storeName || !storeEmail || !storeAddress || !ownerName || !ownerEmail || !ownerPassword || !ownerAddress) {
        return res.status(400).json({ message: 'Please provide all details for the store and the new owner.' });
    }

    let connection;
    try {
        // Get a connection from the pool to run a transaction
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Check if a user with the new owner's email already exists
        const [existingUsers] = await connection.query("SELECT * FROM users WHERE email = ?", [ownerEmail]);
        if (existingUsers.length > 0) {
            await connection.rollback();
            connection.release();
            return res.status(409).json({ message: "A user with the owner's email already exists." });
        }

        // 2. Create the new Store Owner user
        const hashedPassword = await bcrypt.hash(ownerPassword, 10);
        const userQuery = "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)";
        const [userResult] = await connection.query(userQuery, [ownerName, ownerEmail, hashedPassword, ownerAddress, 'Store Owner']);
        
        const newOwnerId = userResult.insertId;

        // 3. Create the new store and assign it to the new owner
        const storeQuery = 'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)';
        await connection.query(storeQuery, [storeName, storeEmail, storeAddress, newOwnerId]);

        // 4. If everything is successful, commit the transaction
        await connection.commit();
        connection.release();

        res.status(201).json({ message: `Store '${storeName}' and Owner '${ownerName}' created successfully!` });

    } catch (err) {
        // If any step fails, roll back the entire transaction
        if (connection) {
            await connection.rollback();
            connection.release();
        }
        res.status(500).json({ message: 'Database error during creation.' });
    }
});

// ROUTE: GET /api/stores - This route remains the same
router.get('/', isAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user.id;
        const { name, address } = req.query;
        let queryParams = [loggedInUserId];
        let query = `
            SELECT 
                s.id, s.name, s.address,
                AVG(r_all.rating_value) as overall_rating,
                r_user.rating_value as user_submitted_rating
            FROM stores s
            LEFT JOIN ratings r_all ON s.id = r_all.store_id
            LEFT JOIN ratings r_user ON s.id = r_user.store_id AND r_user.user_id = ?
        `;
        let whereClauses = [];
        if (name) { whereClauses.push("s.name LIKE ?"); queryParams.push(`%${name}%`); }
        if (address) { whereClauses.push("s.address LIKE ?"); queryParams.push(`%${address}%`); }
        if (whereClauses.length > 0) { query += " WHERE " + whereClauses.join(" AND "); }
        query += " GROUP BY s.id;";
        const [results] = await db.query(query, queryParams);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: 'Database query error.' });
    }
});

module.exports = router;