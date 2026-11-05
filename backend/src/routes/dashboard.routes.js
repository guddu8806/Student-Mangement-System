const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');

const dashboardController = require("../controllers/dashboard.controller");

router.use(verifyToken, requireAdmin);

router.get("/stats", dashboardController.getDashboardStats);

router.get("/students", dashboardController.getStudents);

router.get("/courses", dashboardController.getCourses);

router.get("/enrollments", dashboardController.getEnrollments);

module.exports = router;