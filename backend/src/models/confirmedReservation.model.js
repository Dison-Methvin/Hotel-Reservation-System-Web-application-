const mongoose = require('mongoose');

const confirmedReservationSchema = new mongoose.Schema({}, {
  strict: false,
  timestamps: true
});

module.exports = mongoose.model('ConfirmedReservation', confirmedReservationSchema, 'confirmed_reservations'); 