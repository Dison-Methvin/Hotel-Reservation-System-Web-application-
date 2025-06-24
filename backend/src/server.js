const app = require('./app');
const connectDB = require('./config/database');
const initializeDB = require('./config/initDB');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

// Connect to MongoDB and initialize database
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        
        // Initialize database with sample data
        await initializeDB();
        
        // Start the server
        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        // Handle unhandled rejections
        process.on('unhandledRejection', (err) => {
            console.error('Unhandled Rejection:', err);
            server.close(() => {
                process.exit(1);
            });
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
