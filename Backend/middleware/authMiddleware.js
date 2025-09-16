const jwt = require('jsonwebtoken');

// Checks if a user is logged in
const isAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden - invalid token
        }
        req.user = user;
        next();
    });
};

// Checks if the logged-in user is a System Administrator
const isAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        
        if (user.role !== 'System Administrator') {
            return res.status(403).json({ message: "Admin access required." });
        }
        
        req.user = user;
        next();
    });
};

// Checks if the logged-in user is a Store Owner
const isStoreOwner = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        
        if (user.role !== 'Store Owner') {
            return res.status(403).json({ message: "Store Owner access required." });
        }
        
        req.user = user;
        next();
    });
};

module.exports = { isAuth, isAdmin, isStoreOwner };