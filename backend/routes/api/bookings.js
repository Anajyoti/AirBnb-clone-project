const express = require('express');

const{ Op } = require('sequelize');
const router = express.Router();
const { Spot,bookings, reviewImages,reviews,User,sequelize} = require('../../db/models');


router.get('/bookings', async (req, res) => {
  try {
    const allBookings = await bookings.findAll({
      include: [
        {
          model: Spot,
          attributes: ['id', 'name', 'location']
        },
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });
    res.status(200).json(allBookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings', details: err.message });
  }
});

router.post('/bookings', async (req, res) => {
  const { spotId, userId, startDate, endDate } = req.body;
  
  try {
    // Ensure the end date is after the start date
    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }
    
    const newBooking = await bookings.create({
      spotId,
      userId,
      startDate,
      endDate
    });
    
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking', details: err.message });
  }
});

router.delete('/bookings/:id', async (req, res) => {
  const bookingId = req.params.id;
  
  try {
    const booking = await bookings.findByPk(bookingId);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    await booking.destroy();
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete booking', details: err.message });
  }
});
module.exports = router;