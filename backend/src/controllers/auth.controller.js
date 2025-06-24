const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Customer = require('../models/customer.model');
const Staff = require('../models/staff.model');

// Register new customer
exports.register = async (req, res) => {
    try {
        console.log('Registration request received:', req.body);

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        // Check if user already exists
        const existingUser = await Customer.findOne({ 
            $or: [
                { email: req.body.email },
                { username: req.body.username }
            ]
        });

        if (existingUser) {
            console.log('User already exists:', req.body.email, req.body.username);
            return res.status(400).json({ 
                message: 'User already exists with this email or username'
            });
        }

        // Create new customer
        const customer = new Customer({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phoneNumber,
            address: {
                houseNumber: req.body.address.houseNo,
                laneName: req.body.address.lane,
                cityName: req.body.address.city
            }
        });

        console.log('Attempting to save customer:', {
            username: customer.username,
            email: customer.email,
            firstName: customer.firstName,
            lastName: customer.lastName
        });

        // Save customer
        await customer.save();
        console.log('Customer saved successfully');

        // Generate JWT token
        const token = jwt.sign(
            { id: customer._id, username: customer.username },
            process.env.JWT_SECRET || 'your_jwt_secret_key_here',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: customer._id,
                username: customer.username,
                email: customer.email,
                firstName: customer.firstName,
                lastName: customer.lastName
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};

// Login user (customer or staff)
exports.login = async (req, res) => {
    try {
        console.log('Login request received:', { username: req.body.username });
        const { username, password } = req.body;

        // Try to find user in both Customer and Staff collections
        let user = await Customer.findOne({ username });
        let isStaff = false;

        if (!user) {
            user = await Staff.findOne({ username });
            isStaff = true;
        }

        if (!user) {
            console.log('User not found:', username);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('Invalid password for user:', username);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id, username: user.username, isStaff },
            process.env.JWT_SECRET || 'your_jwt_secret_key_here',
            { expiresIn: '24h' }
        );

        console.log('Login successful:', username);

        // Send response
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isStaff
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

// Get current user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await Customer.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};
