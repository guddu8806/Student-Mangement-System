require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/db-health', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW() AS current_time');

        return res.status(200).json({
            message: 'PostgreSQL connected successfully!',
            time: result.rows[0].current_time,
        });
    } catch (error) {
        console.error('Database error:', error.message);
        console.error('Error code:', error.code);

        return res.status(500).json({
            message: 'Database connection failed',
            error: error.message,
            code: error.code || 'UNKNOWN',
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});