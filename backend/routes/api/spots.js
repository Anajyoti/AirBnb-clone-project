const express = require('express');
const { requireAuth } = require('../../utils/auth');
const{ Op } = require('sequelize');
const router = express.Router();
const { Spots,bookings, SpotImages, reviewImages,reviews,User,sequelize} = require('../../db/models');

//GET/spots - Fetch all the spots
router.get('/',async(req, res) => {
  try {
    const spots = await Spots.findAll({
      include: [
        {
          model:reviews,
          attributes:['stars']
        },
        {
          model: SpotImages,
          attributes: ['url']
        }
      ],
      attributes: {
        include: [
          [sequelize.fn('AVG', sequelize.col('reviews.stars')), 'avgRating']
        ]
      },
      group: ['Spots.id', 'SpotImages.url']
    });


    // Format the response
    const formattedSpots = spots.map(spot => ({
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: parseFloat(spot.price),// make sure the price returned as float
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      avgRating: spot.reviews.stars ? parseFloat(spot.reviews.stars) : null,
      previewImage: spot.SpotImages.length > 0 ? spot.SpotImages[0].url : null // Get first preview image
    }));

    res.status(200).json({"Spots":formattedSpots});

  }catch(error){
    console.error(error);
    res.status(500).json({message: "An error occurred while fetching spots"})
  }

});
//GET/spots/spotId - Fetch the spots by its own ID
router.get('/:spotId',async(req, res) => {
  const { spotId } = req.params; // Get spotId from the request parameter
  try {
    const spot = await Spots.findOne({
      where:{ id: spotId },// Use the correct id field for querying
      include: [// Optionally include associated models
        {model: reviews, as: 'reviews'},
        {model: bookings, as: 'bookings'},
        {model: SpotImages, as: 'SpotImages'},
        {model: User, as: 'User', attributes: ['id', 'firstName','lastName']}
      ]
    });
    res.status(200).json(spot);

    // if the spot does not exist 
    if(!spot){
      return res.status(404).json({message: 'There is no such a Spot.'})
    }

  }catch(error){
    console.error(error);
    res.status(500).json({message: "An error occurred while fetching the spot."})
  }
})
router.get('/:ownerId', async(req, res) => {
  // Assuming you have a way to get the logged-in user's ID from the request.
 // For example, you might be using a session or JWT authentication, where the user ID is stored in req.user.id.
 const { user } = req;// Assuming user information is available in req.user (from middleware)

 try{
   const spots = await Spots.findAll({
     where: {ownerId:user.id}, // Filter spots by the logged-in user's ID
     // include: [
     //   {model: reviews, as: 'reviews'},
     //   {model: bookings, as: 'bookings'},
     //   {model: SpotImages, as: 'SpotImages'}
     // ]
   })
   res.status(200).json(spots); 
 }catch(error){
   console.error(error);
   res.status(500).json({message:"An error occurred while fetching the spot."})
 }
})

//GET/spots/current - Fetch all spots owned by current user // we can change seeder file retest it
router.get('/current', requireAuth, async (req, res) => {
  const userId = req.user.id;

  try {
    const spots = await Spots.findAll({
      where: { ownerId: userId },
      attributes: {
        include: [
          [sequelize.fn('AVG', sequelize.col('reviews.stars')), 'avgRating']
        ]
      },
      include: [
        {
          model: SpotImages,
          attributes: ['url'],
          where: { preview: true },
          required: false
        },
        {
          model: reviews,
          attributes: []
        }
      ],
      group: ['Spots.id', 'SpotImages.url'],
      raw: true
    });

    const formattedSpots = spots.map(spot => ({
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: parseFloat(spot.price),
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      avgRating: spot.avgRating ? parseFloat(spot.avgRating).toFixed(1) : null,
      previewImage: spot['SpotImages.url'] || null
    }));

    // Add this console.log to see what formattedSpots looks like in the terminal
    console.log("Formatted Spots:", formattedSpots);

    res.status(200).json({ Spots: formattedSpots });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while fetching the spots." });
  }
});
// POST /api/spots - Create a new spot
router.post('/', requireAuth, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  // Validation checks for required fields and constraints
  const errors = {};

  if (!address) errors.address = "Street address is required";
  if (!city) errors.city = "City is required";
  if (!state) errors.state = "State is required";
  if (!country) errors.country = "Country is required";
  if (!lat || lat < -90 || lat > 90) errors.lat = "Latitude must be within -90 and 90";
  if (!lng || lng < -180 || lng > 180) errors.lng = "Longitude must be within -180 and 180";
  if (!name || name.length > 50) errors.name = "Name must be less than 50 characters";
  if (!description) errors.description = "Description is required";
  if (!price || price <= 0) errors.price = "Price per day must be a positive number";

  // If there are validation errors, return a 400 status with error details
  if (Object.keys(errors).length) {
    return res.status(400).json({
      message: "Bad Request",
      errors
    });
  }

  try {
    // Create the new spot associated with the current user
    const newSpot = await Spots.create({
      ownerId: req.user.id, // The authenticated user's id
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    });

    // Respond with the newly created spot
    res.status(201).json({
      id: newSpot.id,
      ownerId: newSpot.ownerId,
      address: newSpot.address,
      city: newSpot.city,
      state: newSpot.state,
      country: newSpot.country,
      lat: newSpot.lat,
      lng: newSpot.lng,
      name: newSpot.name,
      description: newSpot.description,
      price: newSpot.price,
      createdAt: newSpot.createdAt,
      updatedAt: newSpot.updatedAt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while creating the spot." });
  }
});
//POST/spots/:spotId/images -- add an image to a spot
router.post('/:spotId/images', async(req, res) => {
  const { spotId } = req.params;
  const {url, preview} = req.body;
  try {
    //check if the spot exists
    const spot = await Spots.findByPk(spotId);
    if(!spot){
      return res.status(404).json({message: "Spot couldn't be found"})
    }

    //create the new SpotImage
    const newImage = await SpotImages.create({
      spotId, 
      url,
      preview
    })
    res.status(200).json({message:"Image successfully added!"})

  }catch(error){
    console.error(error);
    res.status(500).json({message:"An error occurred while adding an image to the spot."})
  }
});
// Put/Spots/edit a spot
router.put('/:spotId', async (req, res) => {
  try {
    const { spotId } = req.params;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    // Find the spot by the spotId
    const spots = await Spots.findByPk(spotId);

    if (!spots) {
      return res.status(404).json({ message: 'Spot not found' });
    }

    // Update the spot
    await spots.update({ address, city, state, country, lat, lng, name, description, price });

    // Return the updated spot
    res.status(200).json(spots);
  } catch (error) {
    console.error('Error updating spot:', error);
    res.status(500).json({
      title: 'Server Error',
      message: 'An error occurred while updating the spot.',
    });
  }
});

// DELETE /spots/:spotId - Delete a spot
router.delete('/:spotId', async (req, res) => {
  try {
    const { spotId } = req.params;

    // Find the spot by the ID
    const spots = await Spots.findByPk(spotId);

    if (!spots) {
      // If the spot doesn't exist, send a 404 response
      return res.status(404).json({
        title: 'Resource Not Found',
        message: "The requested resource couldn't be found.",
        errors: { message: "The requested resource couldn't be found." }
      });
    }

    // Delete the spot
    await spots.destroy();

    return res.status(200).json({ message: 'Spot successfully deleted' });
  } catch (error) {
    console.error('Error deleting spot:', error);
    return res.status(500).json({
      title: 'Server Error',
      message: 'An error occurred while deleting the spot.',
    });
  }
});

// GET /spots/:spotId/reviews -- Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res) => {
  const { spotId } = req.params;
  try {
    // Check if the spot exists
    const spots = await Spots.findByPk(spotId); // Use 'Spot' instead of 'Spots'
    if (!spots) {
      return res.status(404).json({ message: "Spot couldn't be found." });
    }

    // Fetch all reviews for the spot
    const theReviews = await reviews.findAll({
      where: { spotId }, 
      include: [
        {
          model: User,
          attributes: ['id', 'username'],
        },
        {
          model: reviewImages,
          attributes: ['id', 'url'],
        },
      ],
    });

    return res.status(200).json(theReviews);
  } catch (error) {
    console.error('Error retrieving reviews:', error);
    return res.status(500).json({ message: "An error occurred while retrieving the reviews of this spot." });
  }
});
//POST/spots/:spotId/reviews -- Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', async(req, res) => {
  const {spotId} = req.params;
  const {userId, review, stars } = req.body;

  try{
    //check if the spot exit
    const spot = await Spots.findByPk(spotId);
    if(!spot){
      return res.status(404).json({message:"Spot couldn't be found."})
    }
    // Validate input fields
    const errors = {};

    if(!review) errors.review = "Review text is required";
    if(stars === undefined  ||stars > 5  ||stars < 1) errors.review = "Stars must be an integer from 1 to 5";

    // If there are validation errors, return 400 error
    if (Object.keys(errors).length) {
      return res.status(400).json({ message: "Bad Request", errors });
    }


    //create the review 
    const newReview = await reviews.create({
      spotId,
      userId,
      review,
      stars
    });
    return res.status(200).json(newReview);
  }catch(error){
    console.error(error);
    return res.status(500).json({message: "An error occurred while creating the review of this spot."})
  }
})
// GET all bookings for a spot based on spotId
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const userId = req.user.id; // Get the current user's ID

  try {
    // Check if the spot exists
    const spots = await Spots.findByPk(spotId);
    if (!spots) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // If the current user is the owner of the spot
    if (spots.ownerId === userId) {
      const ownerBookings = await bookings.findAll({
        where: { spotId },
        include: {
          model: User, // Include user info
          attributes: ['id', 'firstName', 'lastName'] // Return user details
        }
      });

      const ownerBookingResponse = ownerBookings.map(booking => ({
        User: booking.User,
        id: booking.id,
        spotId: booking.spotId,
        userId: booking.userId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt
      }));

      return res.status(200).json({ Bookings: ownerBookingResponse });
    }

    // If the current user is NOT the owner of the spot
    const nonOwnerBookings = await bookings.findAll({
      where: { spotId },
      attributes: ['spotId', 'startDate', 'endDate']
    });

    return res.status(200).json({ Bookings: nonOwnerBookings });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while fetching bookings" });
  }
});
//POST/spots/:spotId/bookings -- Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', async(req, res) => {
  const {spotId } = req.params;
  const userId = req.user.id; // get the current user'sID from authentication
  const {startDate, endDate } = req.body;

  try{
    //check if the spot exist
    const spot = await Spots.findByPk(spotId);
    if(!spot) return res.status(404).json({message: "Spot couldn't be found."});

    //Ensure the spot does Not belong to  the current user
    if(spot.ownerId === userId){
      return res.status(403).json({message: "You can not book your own spot"});
    };
    //validate the startDate and endDate
    const today = new Date().toISOString().split('T')[0];
    if(new Date(startDate) < new Date(today)){

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
        spotId,
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


    const newBooking = await bookings.create({
      spotId, userId, startDate, endDate });
  
    return res.status(200).json(newBooking);
  }catch(error){
    console.error(error);
    return res.status(500).json({message: "An error occurred while creating bookings data by spotId"});
  }
})



module.exports = router;
