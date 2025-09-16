const express = require('express');
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { isAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// ROUTE: POST /api/users/update-password
router.post('/update-password', isAuth, (req, res) => {
    const userId = req.user.id;
    const { newPassword } = req.body;

    // Validate the new password against the rules
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!newPassword || !passwordRegex.test(newPassword)) {
        return res.status(400).json({ 
            message: "Password must be 8-16 characters, with at least one uppercase letter and one special character." 
        });
    }

    // Hash the new password
    bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: "Error hashing password." });
        }

        const query = "UPDATE users SET password = ? WHERE id = ?";
        db.query(query, [hashedPassword, userId], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Database error." });
            }
            res.status(200).json({ message: "Password updated successfully!" });
        });
    });
});

module.exports = router;