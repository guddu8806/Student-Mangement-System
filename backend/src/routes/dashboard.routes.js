const express = require('express');
const router = express.Router();

const dashboardController = require("../controllers/dashboard.controller");

router.get("/stats", dashboardController.getDashboardStats);

router.get("/students", dashboardController.getStudents);

router.get("/courses", dashboardController.getCurses);

router.get("/enrollments", dashboardController.getEnrollments);

module.exports = router;