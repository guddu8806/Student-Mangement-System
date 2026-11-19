const express = require('express');
const router = express.Router();
const activityLogController = require('../controllers/activityLog.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Accessible to both Admin and Student (authentication required)
router.use(verifyToken);

router.get('/filters', activityLogController.getFilterOptions);
router.get('/', activityLogController.getAllLogs);
router.get('/:id', activityLogController.getLogById);

module.exports = router;
