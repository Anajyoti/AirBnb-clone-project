const express = require('express');
const{ Op } = require('sequelize');


const { Spot,bookings, reviewImages,reviews,User,sequelize} = require('../../db/models');



const { requireAuthentication, respondWith403, respondWithSuccessfulDelete } = require('../../utils/auth');

const { validateSpot, validateReview, validateBooking, analyzeErrors } = require('../api/validators.js');

const router = express.Router();

// delete an image based on its id
router.delete('/:imageId',async(req,res) => {

  if(!req.Spot || req.Spot.ownerId === req.User.id) {
    await res.SpotImages.destroy();
    res.status(200).json({"message": "Successfully deleted"
   })
  }else {
    res.status(404).json({
      "message": "Spot Image couldn't be found",
      "statusCode": 404
    });
  }

});
module.exports = router;
