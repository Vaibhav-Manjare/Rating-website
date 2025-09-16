const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();

// ROUTE: POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, address, password } = req.body;

        const [existingUsers] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: "Email already in use." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertUserQuery = "INSERT INTO users (name, email, address, password, role) VALUES (?, ?, ?, ?, ?)";
        const role = 'Normal User';
        
        await db.query(insertUserQuery, [name, email, address, hashedPassword, role]);
        
        res.status(201).json({ message: "User registered successfully!" });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error during registration." });
    }
});

// ROUTE: POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const payload = { id: user.id, name: user.name, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ 
            message: "Logged in successfully!",
            token: token
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error during login." });
    }
});

module.exports = router;