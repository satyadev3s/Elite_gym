const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.post('/', contactController.submitMessage);
router.get('/', contactController.getMessages);

module.exports = router;
