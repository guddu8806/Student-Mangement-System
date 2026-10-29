const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const AppError = require('./utils/AppError');
const { notFound, errorHandler } = require('./middleware/error.middleware');

const studentRoutes = require('./routes/student.route');
const courseRoutes = require('./routes/course.route');

const app = express();

app.use(cors());
app.use(express.json());

// Health check routes
app.get('/api/health', (req, res) => {
    res.status(200).json({
        message: 'Server is running smoothly!'
    });
});

app.get('/api/db-health', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW() AS current_time');
        return res.status(200).json({
            message: 'PostgreSQL connected successfully!',
            time: result.rows[0].current_time,
        });
    } catch (error) {
        console.error('Database error:', error.message);
        return res.status(500).json({
            message: 'Database connection failed',
            error: error.message,
            code: error.code || 'UNKNOWN',
        });
    }
});

// Temporary test route for centralized error handling
app.get('/api/test-error', (req, res, next) => {
    next(new AppError('This is a test error', 400));
});

// API routes
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);

// Handle unknown routes
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
