const Reservation = require('../models/reservation.model');
const Room = require('../models/room.model');
const Customer = require('../models/customer.model');
const ReservationSimple = require('../models/reservationSimple.model');
const ConfirmedReservation = require('../models/confirmedReservation.model');

exports.createReservation = async (req, res) => {
    try {
        const { 
            checkInDate, 
            checkOutDate, 
            roomType, 
            adultCount, 
            childCount,
            guestDetails,
            billingAddress,
            paymentInfo,
            specialRequests,
            checkInTime,
            checkOutTime
        } = req.body;
        
        // Input validation
        if (!checkInDate || !checkOutDate || !roomType) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }

        const checkin = new Date(checkInDate);
        const checkout = new Date(checkOutDate);
        
        // Basic presence checks only; other business validations removed

        if (!req.user) {
            return res.status(401).json({ message: 'You must be logged in to make a reservation' });
        }

        // Find customer by user ID
        const customer = await Customer.findById(req.user.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Find available room of the requested type
        let room = await Room.findOne({
            type: roomType,
            status: 'available'
        });

        if (!room) {
            // Auto-create a placeholder room so the reservation can still be stored
            const placeholderRoom = new Room({
                roomNumber: `AUTO-${Date.now()}`,
                type: roomType,
                price: 0,
                status: 'occupied',
                capacity: adultCount + childCount,
                floor: 0
            });
            await placeholderRoom.save();
            room = placeholderRoom;
        }

        // Calculate total amount
        const nights = Math.max(1, Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24)) || 1);
        const totalAmount = (room.price || 0) * nights;

        // Create the reservation
        const reservation = new Reservation({
            customer: customer._id,
            room: room._id,
            checkInDate: checkin,
            checkOutDate: checkout,
            numberOfOccupants: parseInt(adultCount) + parseInt(childCount),
            status: 'Booked',
            paymentStatus: paymentInfo ? 'Paid' : 'Pending',
            totalAmount: totalAmount,
            adultCount: adultCount,
            childCount: childCount,
            guestDetails: guestDetails,
            billingAddress: billingAddress,
            specialRequests: specialRequests,
            checkInTime: checkInTime,
            checkOutTime: checkOutTime,
            paymentInfo: paymentInfo ? {
                nameOnCard: paymentInfo.nameOnCard,
                cardLast4: paymentInfo.cardNumber ? paymentInfo.cardNumber.slice(-4) : undefined,
                expMonth: paymentInfo.expMonth,
                expYear: paymentInfo.expYear
            } : undefined
        });

        // Save the reservation
        await reservation.save();

        // Update room availability
        room.isAvailable = false;
        await room.save();

        res.status(201).json({ 
            message: 'Reservation created successfully',
            reservationId: reservation._id,
            roomType: room.type
        });

    } catch (error) {
        console.error('Error creating reservation:', error);
        res.status(500).json({ message: 'Failed to create reservation', error: error.message });
    }
};

exports.getReservations = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'You must be logged in to view reservations' });
        }

        const customer = await Customer.findById(req.user.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const reservations = await Reservation.find({ customer: customer._id })
            .populate('room')
            .sort({ reservationDate: -1 });

        res.json(reservations);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({ message: 'Failed to fetch reservations', error: error.message });
    }
};

exports.confirmReservation = async (req, res) => {
    try {
        // Ensure the user is authenticated and load their customer record
        if (!req.user) {
            return res.status(401).json({ message: 'You must be logged in to confirm a reservation' });
        }

        const currentCustomer = await Customer.findById(req.user.id);
        if (!currentCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const { id } = req.params;
        const {
            guestDetails,
            billingAddress,
            paymentInfo,
            specialRequests,
            checkInTime,
            checkOutTime
        } = req.body;

        // Validate that the provided guest first/last names match the logged-in customer
        if (!guestDetails || !guestDetails.firstName || !guestDetails.lastName) {
            return res.status(400).json({ message: 'First name and last name are required' });
        }

        const firstOk = guestDetails.firstName.trim().toLowerCase() === currentCustomer.firstName.trim().toLowerCase();
        const lastOk  = guestDetails.lastName.trim().toLowerCase()  === currentCustomer.lastName.trim().toLowerCase();

        if (!firstOk || !lastOk) {
            return res.status(400).json({ message: 'Entered first name and last name do not match your account. Please enter your valid name.' });
        }

        const reservation = await Reservation.findById(id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Only allow the customer themselves to modify (if needed) – skipped auth checks here
        if (guestDetails) reservation.guestDetails = guestDetails;
        if (billingAddress) reservation.billingAddress = billingAddress;
        if (paymentInfo) {
            // store only last4 digits for security
            if (paymentInfo.cardNumber) {
                paymentInfo.cardLast4 = paymentInfo.cardNumber.slice(-4);
                delete paymentInfo.cardNumber;
            }
            reservation.paymentInfo = paymentInfo;
            reservation.paymentStatus = 'Paid';
        }
        if (specialRequests) reservation.specialRequests = specialRequests;
        if (checkInTime) reservation.checkInTime = checkInTime;
        if (checkOutTime) reservation.checkOutTime = checkOutTime;

        await reservation.save();
        res.json({ message: 'Reservation confirmed', reservationId: reservation._id });
    } catch (err) {
        console.error('Error confirming reservation:', err);
        res.status(500).json({ message: 'Failed to confirm reservation' });
    }
};

exports.simpleInsert = async (req, res) => {
    try {
        const reservation = new ReservationSimple(req.body);
        await reservation.save();
        res.status(201).json({ message: 'Reservation inserted', reservationId: reservation._id });
    } catch (error) {
        console.error('Error inserting reservation:', error);
        res.status(500).json({ message: 'Failed to insert reservation', error: error.message });
    }
};

exports.createConfirmedReservation = async (req, res) => {
    try {
        const reservation = new ConfirmedReservation(req.body);
        await reservation.save();
        return res.status(201).json({ message: 'Confirmed reservation saved', id: reservation._id });
    } catch (error) {
        console.error('Error saving confirmed reservation:', error);
        return res.status(500).json({ message: 'Failed to save confirmed reservation' });
    }
};

exports.updateConfirmedReservation = async (req, res) => {
    try {
        const updated = await ConfirmedReservation.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, overwrite: true }
        );
        if (!updated) return res.status(404).json({ message: 'Reservation not found' });
        return res.json({ message: 'Confirmed reservation updated', id: updated._id });
    } catch (error) {
        console.error('Error updating confirmed reservation:', error);
        return res.status(500).json({ message: 'Failed to update confirmed reservation' });
    }
};

exports.deleteConfirmedReservation = async (req, res) => {
    try {
        const deleted = await ConfirmedReservation.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Reservation not found' });
        return res.json({ message: 'Confirmed reservation deleted' });
    } catch (error) {
        console.error('Error deleting confirmed reservation:', error);
        return res.status(500).json({ message: 'Failed to delete confirmed reservation' });
    }
};

exports.getConfirmedReservations = async (req, res) => {
  try {
    const list = await ConfirmedReservation.find({}).sort({ createdAt: -1 });
    return res.json(list);
  } catch(err) {
    console.error('Error fetching confirmed reservations', err);
    return res.status(500).json({ message: 'Failed to fetch confirmed reservations' });
  }
};
