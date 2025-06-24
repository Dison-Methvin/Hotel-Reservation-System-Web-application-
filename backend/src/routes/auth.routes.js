const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');

// Registration route
router.post('/register', [
    // Validation middleware
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('phoneNumber').notEmpty().withMessage('Phone number is required'),
    body('address.houseNo').notEmpty().withMessage('House number is required'),
    body('address.lane').notEmpty().withMessage('Lane name is required'),
    body('address.city').notEmpty().withMessage('City is required')
], authController.register);

// Login route
router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
], authController.login);

module.exports = router;
