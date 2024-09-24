const express = require('express');
const{ Op } = require('sequelize');


const { Spot,bookings,reviewImages,reviews,User,sequelize} = require('../../db/models');
const router = express.Router();

// delete an review image
router.delete('/:imageId',async(req, res) => {
  if(!req.reviews || req.review.userId === req.User.id){
    await req.reviewImages.destroy();
    res.status(200).json({"message": "Successfully deleted"})
  }else{
    res.status(404).json({
      "message": "Review Image couldn't be found",
      "statusCode": 404})
  }
})
module.exports = router;