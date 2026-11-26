const express = require("express");
const router = express.Router();

const courseController = require('../controllers/course.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');

router.use(verifyToken);

router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

router.post('/', requireAdmin, courseController.createCourse);
router.put('/:id', requireAdmin, courseController.updateCourse);
router.delete('/:id', requireAdmin, courseController.deleteCourse);

module.exports = router;