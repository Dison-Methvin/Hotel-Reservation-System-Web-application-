const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    reservation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation',
        required: true
    },
    billDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    },
    charges: {
        roomCharges: {
            type: Number,
            required: true,
            min: 0
        },
        roomService: {
            type: Number,
            default: 0,
            min: 0
        },
        laundry: {
            type: Number,
            default: 0,
            min: 0
        },
        telephone: {
            type: Number,
            default: 0,
            min: 0
        },
        restaurantCharges: {
            type: Number,
            default: 0,
            min: 0
        },
        clubFacilities: {
            type: Number,
            default: 0,
            min: 0
        },
        taxes: {
            type: Number,
            required: true,
            min: 0
        },
        discounts: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    payments: [{
        date: {
            type: Date,
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        method: {
            type: String,
            required: true,
            enum: ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Online Payment']
        },
        transactionId: String,
        status: {
            type: String,
            required: true,
            enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
            default: 'Pending'
        }
    }],
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Partially Paid', 'Paid', 'Overdue', 'Cancelled'],
        default: 'Pending'
    },
    notes: String
}, {
    timestamps: true
});

// Calculate total amount before saving
billSchema.pre('save', function(next) {
    const charges = this.charges;
    this.totalAmount = 
        charges.roomCharges +
        charges.roomService +
        charges.laundry +
        charges.telephone +
        charges.restaurantCharges +
        charges.clubFacilities +
        charges.taxes -
        charges.discounts;
    next();
});

// Indexes for faster queries
billSchema.index({ reservation: 1, status: 1 });
billSchema.index({ billDate: 1, status: 1 });

const Bill = mongoose.model('Bill', billSchema);
module.exports = Bill;
