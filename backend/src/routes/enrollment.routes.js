const express = require('express');
const router = express.Router();
const enrollmentController = require("../controllers/enrollment.controller");

router.post("/", enrollmentController.createEnroll);
router.get("/", enrollmentController.findAllEnrollment);
router.delete("/:id", enrollmentController.dropEnrollment);

module.exports = router;
