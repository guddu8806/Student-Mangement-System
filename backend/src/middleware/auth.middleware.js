const jwt = require('jsonwebtoken');

// Middleware to verify if request has a valid JWT token
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authorization header missing or malformed',
            });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role, student_id }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
};

// Middleware to check if logged-in user is an Admin
const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Forbidden: Access denied. Admin privileges required.',
        });
    }
    next();
};



module.exports = {
    verifyToken,
    requireAdmin,
};
