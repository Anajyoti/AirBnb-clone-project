const express = require('express');

const{ Op } = require('sequelize');
const router = express.Router();
const { Spot,bookings, reviewImages,reviews,User,sequelize} = require('../../db/models');

//GET/spots - Fetch all the spots
router.get('/',async(req, res) => {
  try {
    const spots = await Spot.findAll();
    res.status(200).json(spots);

  }catch(error){
    console.error(error);
    res.status(500).json({message: "An error occurred while fetching spots."})
  }
  
});

//POST/spots - Create a new spot
router.post('/', async(req, res) => {
  const { ownerId, address, city, state, country, lat, lng, name, description, price } = req.body;

  //Input validation
  if(!ownerId || !address || !city || !state || !country || lat === undefined || lng === undefined){
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try{
    const newSpot = await Spot.create({
      ownerId, address, city, state, country, lat, lng, name, description, price
    });
    res.status(200).json(newSpot);
  }catch(error){
    console.error(error);
    res.status(500).json({message: "An error occurred while creating the spot."});
  }

});


module.exports = router;
