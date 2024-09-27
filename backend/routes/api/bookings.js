const express = require('express');
const { requireAuth } = require('../../utils/auth');
const{ Op } = require('sequelize');
const router = express.Router();
const { Spots,bookings, reviewImages,reviews,User,sequelize} = require('../../db/models');


//GET/bookings/current -- Get all of the Current User's Bookings
router.get('/current', requireAuth,async (req, res) => {
  const userId = req.user.id;// get the current user

  try {
    const currentBookings = await bookings.findAll({
      where:{ userId},
      include: [
        {
          model: Spots,
          attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
        }
      ]
    });
    //if the user has no bookings
    if(!currentBookings.length){
      return res.status(404).json({message: "No bookings found for the current user"})
    }

    res.status(200).json({bookings: currentBookings});
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while fetching the bookings' });
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
//PUT/bookings/:bookingId -- Edit a Booking
router.put('/:bookingId', requireAuth, async (req, res) => {
  const { bookingId } = req.params;
  const { startDate, endDate } = req.body;
  const userId = req.user.id; // Get the current user's ID from the authentication middleware

  try {
    // Check if the booking exists
    const booking = await bookings.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking couldn't be found" });
    }

    // Ensure the booking belongs to the current user
    if (booking.userId !== userId) {
      return res.status(403).json({ message: "You are not authorized to modify this booking" });
    }

    // Ensure the booking's end date hasn't passed
    const today = new Date().toISOString().split('T')[0];
    if (new Date(booking.endDate) < new Date(today)) {
      return res.status(403).json({ message: "Past bookings can't be modified" });
    }

    // Validate the startDate and endDate
    if (new Date(startDate) < new Date(today)) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          startDate: "startDate cannot be in the past"
        }
      });
    }
    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          endDate: "endDate cannot be on or before startDate"
        }
      });
    }

    // Check for booking conflicts
    const conflictingBookings = await bookings.findOne({
      where: {
        spotId: booking.spotId,
        id: { [Op.ne]: bookingId }, // Exclude the current booking
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [startDate, endDate]
            }
          },
          {
            endDate: {
              [Op.between]: [startDate, endDate]
            }
          },
          {
            startDate: {
              [Op.lte]: startDate
            },
            endDate: {
              [Op.gte]: endDate
            }
          }
        ]
      }
    });

    if (conflictingBookings) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking"
        }
      });
    }

    // Update the booking
    booking.startDate = startDate;
    booking.endDate = endDate;
    await booking.save();

    // Send success response
    return res.status(200).json(booking);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while updating the booking" });
  }
});
// DELETE /api/bookings/:bookingId - Delete an existing booking
router.delete('/:bookingId', requireAuth, async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user.id; // Current authenticated user's ID

  try {
    // Check if the booking exists
    const booking = await bookings.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking couldn't be found" });
    }

    // Get the spot associated with the booking
    const spot = await Spots.findByPk(booking.spotId);

    // Ensure the booking belongs to the current user or the spot belongs to the current user
    if (booking.userId !== userId && spot.ownerId !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this booking" });
    }

    // Check if the booking has already started (can't delete a started booking)
    const today = new Date().toISOString().split('T')[0];
    if (new Date(booking.startDate) <= new Date(today)) {
      return res.status(403).json({ message: "Bookings that have been started can't be deleted" });
    }

    // Delete the booking
    await booking.destroy();

    // Send success response
    return res.status(200).json({ message: "Successfully deleted" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while deleting the booking" });
  }
});
module.exports = router;