const express = require('express');
const router = express.Router();
const enrollmentController = require("../controllers/enrollment.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// All enrollment endpoints require a valid JWT token
router.use(verifyToken);

router.post("/", enrollmentController.createEnroll);

// View enrollments: student gets their own enrollments; admin gets all
router.get("/", enrollmentController.findAllEnrollment);


router.delete("/:id", enrollmentController.dropEnrollment);

module.exports = router;
