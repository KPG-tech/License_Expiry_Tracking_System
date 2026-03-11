const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Access denied. Invalid header format.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret_dev_key_change_me');
        req.user = decoded; // Contains id, username, role
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token.' });
    }
};

// Optional: Admin guard middleware
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied. Admin role required.' });
    }
};

module.exports = { auth, adminOnly };
