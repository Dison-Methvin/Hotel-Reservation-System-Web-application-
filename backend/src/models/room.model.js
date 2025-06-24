const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },    type: {
        type: String,
        required: true,
        enum: ['single', 'double', 'suite']
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        required: true,
        enum: ['available', 'occupied', 'maintenance'],
        default: 'available'
    },
    amenities: [{
        type: String
    }],
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    description: {
        type: String
    },
    images: [{
        type: String
    }],
    floor: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
