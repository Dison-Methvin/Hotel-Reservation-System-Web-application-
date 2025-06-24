const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const travelCompanySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    contactPerson: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email address');
            }
        }
    },
    phoneNumber: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isMobilePhone(value)) {
                throw new Error('Invalid phone number');
            }
        }
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        postalCode: String
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    discountRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    contractStartDate: {
        type: Date,
        required: true
    },
    contractEndDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Active', 'Inactive', 'Suspended'],
        default: 'Active'
    },
    reservations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation'
    }],
    paymentTerms: {
        type: String,
        enum: ['Immediate', 'Net30', 'Net60', 'Net90'],
        default: 'Net30'
    },
    creditLimit: {
        type: Number,
        required: true,
        min: 0
    },
    notes: String
}, {
    timestamps: true
});

// Hash password before saving
travelCompanySchema.pre('save', async function(next) {
    const company = this;
    if (company.isModified('password')) {
        company.password = await bcrypt.hash(company.password, 8);
    }
    next();
});

// Method to check password
travelCompanySchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Indexes for faster queries
travelCompanySchema.index({ companyName: 1, status: 1 });
travelCompanySchema.index({ email: 1, username: 1 });

const TravelCompany = mongoose.model('TravelCompany', travelCompanySchema);
module.exports = TravelCompany;
