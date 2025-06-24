const mongoose = require('mongoose');

// A very flexible schema – allows any fields that come from the front-end.
// We still enable timestamps for basic audit purposes.
const reservationSimpleSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

// Use the existing "reservations" collection so everything ends up in the same place.
module.exports = mongoose.model('ReservationSimple', reservationSimpleSchema, 'reservations'); 