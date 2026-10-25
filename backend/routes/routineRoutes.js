const express = require('express');
const router = express.Router();
const routineController = require('../controllers/routineController');

router.get('/', routineController.getRoutines);
router.post('/', routineController.createRoutine);

module.exports = router;
