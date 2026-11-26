const jwt = require('jsonwebtoken');
const pool = require("../config/db");

const verifyToken = async(req, res, next) => {
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
        const result = await pool.query(`SELECT u.id,u.role,s.id AS student_id FROM users u LEFT JOIN students s ON s.user_id = u.id WHERE u.id = $1`,[decoded.id]);
        const user = result.rows[0];
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User account no longer exists."
            });
        }
        if (user.role === "student" && !user.student_id) {
            return res.status(401).json({
                success: false,
                message: "Student account no longer exists"
            });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
};

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
