const express = require('express');
const router = express.Router();
const enrollmentController = require("../controllers/enrollment.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.use(verifyToken);

router.post("/", enrollmentController.createEnroll);

router.get("/", enrollmentController.findAllEnrollment);

router.delete("/:id", enrollmentController.dropEnrollment);

module.exports = router;
