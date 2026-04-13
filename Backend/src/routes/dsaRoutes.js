const express = require('express');
const router = express.Router();
const dsaController = require('../controllers/dsaController');

router.get('/', dsaController.getAllProblems);
router.post('/', dsaController.addProblem);
router.patch('/:id', dsaController.toggleStatus);

module.exports = router;
