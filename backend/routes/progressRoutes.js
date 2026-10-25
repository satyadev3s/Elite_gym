const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

router.get('/', progressController.getProgress);
router.post('/', progressController.logProgress);
router.delete('/:id', progressController.deleteProgress);

module.exports = router;
