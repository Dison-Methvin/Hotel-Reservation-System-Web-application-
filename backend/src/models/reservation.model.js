const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    reservationClerk: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff'
    },
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    numberOfOccupants: {
        type: Number,
        required: true,
        min: 1
    },
    reservationDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        required: true,
        enum: ['Booked', 'Checked-in', 'Checked-out', 'Cancelled', 'No-show'],
        default: 'Booked'
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['Pending', 'Partially Paid', 'Paid', 'Refunded'],
        default: 'Pending'
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    guestDetails: {
        firstName: String,
        lastName: String,
        phone: String,
        email: String
    },
    billingAddress: {
        firstName: String,
        lastName: String,
        phone: String,
        email: String,
        country: String,
        state: String,
        postalCode: String
    },
    paymentInfo: {
        nameOnCard: String,
        cardLast4: String,
        expMonth: String,
        expYear: String
    },
    specialRequests: {
        type: String
    },
    cancellation: {
        date: Date,
        reason: String,
        refundAmount: Number
    },
    checkInTime: Date,
    checkOutTime: Date,
    travelCompany: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TravelCompany'
    },
    bill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bill'
    }
}, {
    timestamps: true
});

// Indexes for faster queries
reservationSchema.index({ customer: 1, status: 1 });
reservationSchema.index({ room: 1, status: 1 });
reservationSchema.index({ checkInDate: 1, checkOutDate: 1 });
reservationSchema.index({ status: 1, paymentStatus: 1 });

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;
