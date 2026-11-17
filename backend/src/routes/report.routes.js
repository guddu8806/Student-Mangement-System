const express = require("express");
const router = express.Router();
const { verifyToken, requireAdmin } = require("../middleware/auth.middleware");
const reportController = require("../controllers/report.controller");

router.use(verifyToken, requireAdmin);

router.get("/analytics", reportController.getAnalytics);
router.get("/roster", reportController.getEnrollmentRoster);
router.get("/export/csv", reportController.exportCsv);

module.exports = router;