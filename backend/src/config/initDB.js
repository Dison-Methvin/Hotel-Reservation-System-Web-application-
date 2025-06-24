const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const Room = require('../models/room.model');
const Customer = require('../models/customer.model');
const Staff = require('../models/staff.model');

// Sample data
const sampleRooms = [
    {
        roomNumber: "101",
        type: "single",
        price: 100,
        status: "available",
        amenities: ["TV", "AC", "WiFi"],
        capacity: 1,
        floor: 1,
        description: "Cozy single room with city view"
    },
    {
        roomNumber: "201",
        type: "double",
        price: 180,
        status: "available",
        amenities: ["TV", "AC", "WiFi", "Mini Bar"],
        capacity: 2,
        floor: 2,
        description: "Spacious double room with mountain view"
    },
    {
        roomNumber: "301",
        type: "suite",
        price: 300,
        status: "available",
        amenities: ["TV", "AC", "WiFi", "Mini Bar", "Jacuzzi"],
        capacity: 4,
        floor: 3,
        description: "Luxury suite with panoramic view"
    }
];

const createAdminUser = async () => {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    return {
        username: "admin",
        password: hashedPassword,
        firstName: "Admin",
        lastName: "User",
        role: "admin",
        email: "admin@hotel.com",
        phone: "1234567890",
        employeeId: "EMP001",
        active: true
    };
};

// Function to initialize database
const initializeDB = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel_reservation_system', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB for initialization');

        // Create admin user data
        const adminUser = await createAdminUser();

        // Clear existing data
        await Promise.all([
            Room.deleteMany({}),
            Customer.deleteMany({}),
            Staff.deleteMany({})
        ]);

        console.log('Cleared existing data');

        // Insert sample data
        await Promise.all([
            Room.insertMany(sampleRooms),
            Staff.create(adminUser)
        ]);

        console.log('Sample data inserted successfully');
        console.log('Database initialized successfully');
        
        // Don't disconnect here as the main app will use the connection
    } catch (error) {
        console.error('Database initialization failed:', error);
        throw error; // Let the server.js handle the error
    }
};

module.exports = initializeDB;
