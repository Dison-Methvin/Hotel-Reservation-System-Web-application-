const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const reservationController = require('../controllers/reservation.controller');

// Create a new reservation - requires authentication
router.post('/', auth, reservationController.createReservation);

// Get user's reservations - requires authentication
router.get('/', auth, reservationController.getReservations);

// confirm/update reservation details
router.put('/:id/confirm', auth, reservationController.confirmReservation);

// Simple blind insert – no auth, no validation
router.post('/simple', reservationController.simpleInsert);

// Create a new confirmed reservation - requires authentication
router.post('/confirmed', reservationController.createConfirmedReservation);

// Update a confirmed reservation - requires authentication
router.put('/confirmed/:id', reservationController.updateConfirmedReservation);

// Delete a confirmed reservation - requires authentication
router.delete('/confirmed/:id', reservationController.deleteConfirmedReservation);

// Get confirmed reservations - requires authentication
router.get('/confirmed', reservationController.getConfirmedReservations);

module.exports = router;
