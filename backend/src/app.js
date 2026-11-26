const express = require('express');
const cors = require('cors');
const compression = require('compression');
const { notFound, errorHandler } = require('./middleware/error.middleware');

const studentRoutes = require('./routes/student.route');
const courseRoutes = require('./routes/course.route');
const enrollmentRoutes = require('./routes/enrollment.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const authRoutes = require("./routes/auth.routes");
const notificationRoutes = require('./routes/notification.routes');
const reportRoutes = require('./routes/report.routes');
const activityLogRoutes = require('./routes/activityLog.route');
const helmet = require("helmet");

const app = express();
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({
    extended: true,
    limit: '10kb'
}));

app.get('/api/health', (req, res) => {
    res.status(200).json({
        message: 'Server is running smoothly!'
    });
});

app.use("/api/auth", authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollment', enrollmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/activity-logs", activityLogRoutes);

app.use(notFound);

app.use(errorHandler);

module.exports = app;
