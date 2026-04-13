const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

router.get('/all', logController.getAllLogs);
router.get('/:date', logController.getLogByDate);
router.patch('/:date/session/:sessionId/task/:taskId', logController.toggleTaskCompletion);

module.exports = router;
