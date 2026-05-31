const express = require('express');
const router = express.Router();
const mcqController = require('../controllers/mcqcontroller');

router.get('/', mcqController.getAllMCQs);
router.get('/:id', mcqController.getMCQById);
router.post('/', mcqController.createMCQ);
router.put('/:id', mcqController.updateMCQ);
router.delete('/:id', mcqController.deleteMCQ);

module.exports = router;
