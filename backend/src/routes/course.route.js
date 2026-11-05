const express = require("express");
const router = express.Router();

const courseController = require('../controllers/course.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');

// All course routes require a valid JWT token
router.use(verifyToken);

// 1. View courses (Accessible by both Admin and Student)
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

// 2. Create, Update, Delete courses (Admin only)
router.post('/', requireAdmin, courseController.createCourse);
router.put('/:id', requireAdmin, courseController.updateCourse);
router.delete('/:id', requireAdmin, courseController.deleteCourse);

module.exports = router;