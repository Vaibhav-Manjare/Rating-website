const express = require('express');
const db = require('../config/db');
const { isStoreOwner } = require('../middleware/authMiddleware');

const router = express.Router();

// ROUTE: GET /api/owner/dashboard
router.get('/dashboard', isStoreOwner, async (req, res) => {
    try {
        const ownerId = req.user.id;

        const findStoreQuery = "SELECT id FROM stores WHERE owner_id = ?";
        const [stores] = await db.query(findStoreQuery, [ownerId]);

        if (stores.length === 0) {
            return res.status(404).json({ message: "No store found for this owner." });
        }
        const storeId = stores[0].id;

        const avgRatingQuery = "SELECT AVG(rating_value) as average_rating FROM ratings WHERE store_id = ?";
        const ratingsListQuery = `
            SELECT u.name, u.email, r.rating_value 
            FROM ratings r
            JOIN users u ON r.user_id = u.id
            WHERE r.store_id = ?
        `;

        const [[avgResult], [ratingsList]] = await Promise.all([
            db.query(avgRatingQuery, [storeId]),
            db.query(ratingsListQuery, [storeId])
        ]);

        res.status(200).json({
            averageRating: avgResult.average_rating,
            ratings: ratingsList
        });

    } catch (err) {
        console.error("Error fetching owner dashboard data:", err);
        res.status(500).json({ message: "Server error." });
    }
});

module.exports = router;