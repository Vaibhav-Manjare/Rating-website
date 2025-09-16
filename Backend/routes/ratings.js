const express = require('express');
const db = require('../config/db');
const { isAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// ROUTE: POST /api/ratings - UPDATED with async/await
// Allows a Normal User to submit ratings (between 1 to 5)
router.post('/', isAuth, async (req, res) => {
    try {
        const user_id = req.user.id;
        const { store_id, rating_value } = req.body;

        if (![1, 2, 3, 4, 5].includes(rating_value)) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
        }

        const query = `
            INSERT INTO ratings (user_id, store_id, rating_value)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE rating_value = ?;
        `;

        await db.query(query, [user_id, store_id, rating_value, rating_value]);
        
        res.status(200).json({ message: 'Rating submitted successfully!' });

    } catch (err) {
        console.error("Error submitting rating:", err);
        res.status(500).json({ message: 'Database error.' });
    }
});

module.exports = router;