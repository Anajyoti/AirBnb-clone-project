const express = require('express');
const { requireAuth} = require('../../utils/auth');
const{ Op } = require('sequelize');
const router = express.Router();
const { Spots,bookings, SpotImages,reviewImages,reviews,User,sequelize} = require('../../db/models');
const { up } = require('../../db/seeders/20240919040023-demo-user');

const dialect = sequelize.getDialect()
const schema = process.env.SCHEMA;
const mode = dialect === 'postgres' && schema ? `"${schema}".` : '';


//helper function 
const addAvgRatingAndPreviewImage = {
  attributes: {
    include: [
      [
        sequelize.literal(`(
          SELECT AVG("reviews"."stars")
          FROM ${mode}"reviews"
          WHERE ${mode}"reviews"."spotId" = "Spots"."id"
        )`),
        'avgRating'
      ],
      [
        sequelize.literal(`(
          SELECT "url"
          FROM ${mode}"SpotImages"
          WHERE ${mode}"SpotImages"."spotId" = "Spots"."id" AND ${mode}"SpotImages"."preview" = true
          LIMIT 1
        )`),
        'previewImage'
      ]
    ]
  },
};

// GET /api/spots - Get all Spots with Query Filters
router.get('/', requireAuth, async (req, res) => {
  // Extract query parameters with default values
  let { page = 1, size = 20, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

  // Convert query parameters to numbers if they exist
  page = parseInt(page);
  size = parseInt(size);
  minLat = minLat ? parseFloat(minLat) : null;
  maxLat = maxLat ? parseFloat(maxLat) : null;
  minLng = minLng ? parseFloat(minLng) : null;
  maxLng = maxLng ? parseFloat(maxLng) : null;
  minPrice = minPrice ? parseFloat(minPrice) : null;
  maxPrice = maxPrice ? parseFloat(maxPrice) : null;

  // Validate query parameters
  const errors = {};
  if (isNaN(page) || page < 1) errors.page = "Page must be greater than or equal to 1";
  if (isNaN(size) || size < 1 || size > 20) errors.size = "Size must be between 1 and 20";
  if (minLat !== null && isNaN(minLat)) errors.minLat = "Minimum latitude is invalid";
  if (maxLat !== null && isNaN(maxLat)) errors.maxLat = "Maximum latitude is invalid";
  if (minLng !== null && isNaN(minLng)) errors.minLng = "Minimum longitude is invalid";
  if (maxLng !== null && isNaN(maxLng)) errors.maxLng = "Maximum longitude is invalid";
  if (minPrice !== null && (isNaN(minPrice) || minPrice < 0)) errors.minPrice = "Minimum price must be greater than or equal to 0";
  if (maxPrice !== null && (isNaN(maxPrice) || maxPrice < 0)) errors.maxPrice = "Maximum price must be greater than or equal to 0";

  // If there are validation errors, return a 400 response
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Bad Request",
      errors
    });
  }

  // Create filtering conditions based on query parameters
  const filters = {};
  if (minLat !== null) filters.lat = { [Op.gte]: minLat };
  if (maxLat !== null) filters.lat = { [Op.lte]: maxLat };
  if (minLng !== null) filters.lng = { [Op.gte]: minLng };
  if (maxLng !== null) filters.lng = { [Op.lte]: maxLng };
  if (minPrice !== null) filters.price = { [Op.gte]: minPrice };
  if (maxPrice !== null) filters.price = { [Op.lte]: maxPrice };

  try {
    // Retrieve spots with pagination and filters
    const spots = await Spots.findAll({
      where: filters,
      limit: size,
      offset: (page - 1) * size,
    });

    // Send the response
    return res.status(200).json({
      Spots: spots,
      page,
      size
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      errors: { error: error.message }
    });
  }
});

//GET/spots/current - Fetch all spots owned by current user // we can change seeder file retest it

router.get('/current',requireAuth, async (req,res) =>{

  const userId = req.user.id
  const spots = await Spots.findAll({
      where:{ownerId:userId},
      ...addAvgRatingAndPreviewImage
  })

  const changed = spots.map(spot => ({
    ...spot.toJSON(),
    price: Number(spot.price)
}));

  return res.json({
      Spots:changed
  })
});
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

    return res.status(200).json({"Spots":formattedSpots});

  }catch(error){
    console.error(error);
    res.status(500).json({message: "An error occurred while fetching spots"})
  }
  
});
//GET/spots/spotId - Fetch the spot by its own ID

router.get('/:spotId', async (req, res) => {
  const spotId = req.params.spotId;

  try {
      const spot = await Spots.findOne({
          where: { id: spotId },
          attributes: {
              include: [
                  [
                      sequelize.literal(`(
                          SELECT COUNT("reviews"."id")
                          FROM ${mode}"reviews"
                          WHERE ${mode}"reviews"."spotId" = "Spots"."id"
                      )`),
                      'numReviews'
                  ],
                  [
                      sequelize.literal(`(
                          SELECT AVG("reviews"."stars")
                          FROM ${mode}"reviews"
                          WHERE ${mode}"reviews"."spotId" = "Spots"."id"
                      )`),
                      'avgStarRating'
                  ]
              ]
          },
          include: [
              {
                  model: SpotImages,
                  attributes: ['id', 'url', 'preview']
              },
              {
                  model: User,
                  as: 'Owner',
                  attributes: ['id', 'firstName', 'lastName']
              }
          ]
      });

      if (!spot) {
          return res.status(404).json({ message: "Spot couldn't be found" });
      }

      res.json(spot);
  } catch (error) {
      return res.status(404).json({ message: "Spot couldn't be found" });
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
    return res.status(201).json({
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
      price: parseFloat(newSpot.price),
      createdAt: newSpot.createdAt,
      updatedAt: newSpot.updatedAt
    });
   
  } catch (error) {
    console.error("Error occurred during spot creation: ", error); // Log detailed error
    return res.status(500).json({ message: "An error occurred while creating the spot." });
  }
});

//POST/spots/:spotId/images -- add an image to a spot
router.post('/:spotId/images',requireAuth,  async(req, res) => {
  const { spotId } = req.params;
  const {url, preview} = req.body;
  const { user } = req;// Assuming `requireAuth` middleware attaches the current user to `req.user`
  try {
    //check if the spot exists
    const spot = await Spots.findByPk(spotId);
    if(!spot){
      return res.status(404).json({message: "Spot couldn't be found"})
    }

    //check if the current user is the owner of the spot
    if(spot.ownerId !== user.id){
      return res.status(403).json({message:"Forbidden: You are not the owner of this spot" });
    }

    //create the new SpotImage
    const newImage = await SpotImages.create({
      spotId, 
      url,
      preview
    })
    return res.status(201).json(newImage);

  }catch(error){
    console.error(error);
    res.status(500).json({message:"An error occurred while adding an image to the spot."})
  }
});
//PUT/spots/:spotId -- Edit a spot
router.put('/:spotId', requireAuth, async(req, res) => {
  const { spotId } = req.params;
  const { name, address, city, state, country, lat, lng, description, price } = req.body;
  const { user } = req;

  try{
    const spot = await Spots.findByPk(spotId);

    //check if the spot exist
    if(!spot) {
      return res.status(404).json({message: "Spot couldn't be found"})
    }

    //check if the user is the owen
    if(user.id !== spot.ownerId){
      return res.status(403).json({message: "Forbidden: You are not the owner of this spot"})
    }

    // Validate input fields
    const errors = {};
    if (!address) errors.address = "Street address is required";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    if (!country) errors.country = "Country is required";
    if (lat === undefined || lat < -90 || lat > 90) errors.lat = "Latitude must be within -90 and 90";
    if (lng === undefined || lng < -180 || lng > 180) errors.lng = "Longitude must be within -180 and 180";
    if (!name || name.length > 50) errors.name = "Name must be less than 50 characters";
    if (!description) errors.description = "Description is required";
    if (!price || price <= 0) errors.price = "Price per day must be a positive number";

    // If there are validation errors, return 400 error
    if (Object.keys(errors).length) {
      return res.status(400).json({ message: "Bad Request", errors });
    }

    // Update the spot with new values ,spot.name = "New Spot Name" || "Old Spot Name"; 
    spot.address = address || spot.address;
    spot.city = city || spot.city;
    spot.state = state || spot.state;
    spot.country = country || spot.country;
    spot.lat = lat || spot.lat;
    spot.lng = lng || spot.lng;
    spot.name = name || spot.name;
    spot.description = description || spot.description;
    spot.price = price || spot.price;

    // Save the updated spot to the database
    await spot.save();

    // Return the updated spot
    return res.status(200).json({
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
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt
    });

  }catch(error){
    console.error(error);
    return res.status(500).json({ message: "An error occurred while updating the spot." });
  }
});

//DELETE/spots/:spotId -- delete a spot by its own Id
router.delete('/:spotId',requireAuth,  async(req, res) => {
  const { spotId } = req.params;
  const { user } = req;

  try{
    const spot = await Spots.findByPk(spotId);
    //check if the spot exist
    if(!spot){
      return res.status(404).json({message: "Spot couldn't be found"})
    }
    //check if the user is the owner of the spot
    if(spot.ownerId !== user.id){
      return res.status(403).json({message: "Forbidden: You are not the owner of the spot"})
    }

    await spot.destroy();
    return res.status(200).json({ message: "Successfully deleted" });

  }catch(error){
    console.log(error);
    res.status(500).json({message:" An error occurred while deleting the spot."})
  }
});

//GET/spots/:spotId/reviews -- Get all Reviews by a Spot's id
router.get('/:spotId/reviews', requireAuth, async(req, res) => {
  const { spotId } = req.params;
  try{
    //check if the spot exist
  const spot = await Spots.findByPk(spotId);

    if(!spot){
      return res.status(404).json({
        "message": "Spot couldn't be found"  
      })
    }


    const theReviews = await reviews.findAll({
      where:{ spotId },
      include: [
        {
          model: User,
          attributes: ['id','firstName', 'lastName']
        },
        {
          model: reviewImages,
          as: 'ReviewImages',
          attributes: ['id', 'url']
        }
      ]
    });
    return res.status(200).json({"Reviews": theReviews});
  
  }catch(error){
    console.error(error);
    return res.status(500).json({"message": "An error occurred while retrieving the reviews of this spot."})
  }
});
//POST/spots/:spotId/reviews -- Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { review, stars } = req.body; // userId will come from authentication token
  const userId = req.user.id; // Ensure userId is taken from req.user, not req.body

  
    // Check if the spot exists
    const spot = await Spots.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Check if the user already has a review for this spot
    const existingReview = await reviews.findOne({
      where: { spotId, userId }
    });
    
    if (existingReview) {
      return res.status(500).json({ message: "User already has a review for this spot" });
    }

    // Validate input fields
    const errors = {};
    if (!review) errors.review = "Review text is required";
    if (stars === undefined || stars > 5 || stars < 1) errors.stars = "Stars must be an integer from 1 to 5";

    // If there are validation errors, return 400 error
    if (Object.keys(errors).length) {
      return res.status(400).json({ message: "Bad Request", errors });
    }

    // Create the new review
    const newReview = await reviews.create({
      spotId,
      userId,
      review,
      stars
    });

    // Return the newly created review with status 201 (Created)
    return res.status(201).json({
      id: newReview.id,
      userId: newReview.userId,
      spotId: newReview.spotId,
      review: newReview.review,
      stars: parseFloat(newReview.stars),
      createdAt: newReview.createdAt,
      updatedAt: newReview.updatedAt
    });


});
//GET/spots/:spotId/bookings -- Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings',requireAuth,  async(req, res) => {
  const { spotId } = req.params;
  //const currentUserId = req.user.id;
  
  try{
    //check if the spot exist
    const spot = await Spots.findByPk(spotId);
    if(!spot) return res.status(404).json({message: "Spot couldn't be found"});

    const allBookings = await bookings.findAll({
      where:{spotId},
      include: [
        {
          model: User,
          attributes: ['id', 'username','email']
        }
      ]
    });
    return res.status(200).json({bookings:allBookings});

  }catch(error){
    console.error(error);
    return res.status(500).json({message: "An error occurred while retrieving bookings data by spotId"});
  }

});
//POST/spots/:spotId/bookings -- Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, async(req, res) => {
  const {spotId } = req.params;
  const userId = req.user.id; // get the currenxt user'sID from authentication
  const {startDate, endDate } = req.body;

  try{
    //check if the spot exist
    const spot = await Spots.findByPk(spotId);
    if(!spot) return res.status(404).json({message: "Spot couldn't be found"});

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
});


module.exports = router;

