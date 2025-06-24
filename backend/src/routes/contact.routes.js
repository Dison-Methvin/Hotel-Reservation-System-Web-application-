const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');

// Public endpoint to submit a contact message
router.post('/', contactController.createMessage);

// (Optional) Protected route to list messages – can be protected later
router.get('/', contactController.getMessages);

module.exports = router; 