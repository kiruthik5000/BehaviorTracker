const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/modify-schedule', aiController.modifySchedule);

module.exports = router;
