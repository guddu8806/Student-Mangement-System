const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const { notFound, errorHandler } = require('./middleware/error.middleware');

const studentRoutes = require('./routes/student.route');
const courseRoutes = require('./routes/course.route');
const enrollmentRoutes = require('./routes/enrollment.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const authRoutes = require("./routes/auth.routes");
const notificationRoutes = require('./routes/notification.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check routes
app.get('/api/health', (req, res) => {
    res.status(200).json({
        message: 'Server is running smoothly!'
    });
});

// app.get('/api/db-health', async (req, res) => {
//     try {
//         const result = await pool.query('SELECT NOW() AS current_time');
//         return res.status(200).json({
//             message: 'PostgreSQL connected successfully!',
//             time: result.rows[0].current_time,
//         });
//     } catch (error) {
//         console.error('Database error:', error.message);
//         return res.status(500).json({
//             message: 'Database connection failed',
//             error: error.message,
//             code: error.code || 'UNKNOWN',
//         });
//     }
// });



// API routes
app.use("/api/auth", authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollment', enrollmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);

// Handle unknown routes
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
