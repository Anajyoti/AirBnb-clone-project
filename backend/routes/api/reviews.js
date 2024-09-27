// routes/api/reviews.js
const express = require('express');
const { requireAuth } = require('../../utils/auth'); 
const{ Op } = require('sequelize');
const router = express.Router();
const { Spots,bookings, reviewImages,reviews,User,sequelize} = require('../../db/models');

// GET reviews of the current user
router.get('/current', async (req, res) => {
  try {
    const userId = req.user.id;

    const review = await reviews.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: 'User', // Use the correct alias here
          attributes: ['id', 'username', 'firstName', 'lastName']
        }
      ]
    });

    res.status(200).json(review);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'An error occurred while fetching the review.' });
  }
});
//POST/reviews/:reviewId/images -- Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async(req, res) => {
  const { reviewId } = req.params;
  const { url } = req.body;
  const userId = req.user.id;// get current user from req.user

  try{
    //check if the review exist
    const review = await reviews.findByPk(reviewId);
    if(!review) return res.status(404).json({ message: "Review couldn't be found."});

    //review must belong to current user
    if(review.userId !== userId) return res.status(403).json({message: "You are not authorized to add an image to this review"});

    const imageCount = await reviewImages.count({where: { reviewId }});

    //Error: Maximun number of imgaes reaches 10
    if(imageCount >= 10) {
      return res.status(403).json({
        message:" Maximum number of images for this resource was reached"
      });
    };

    //create the new review image
    const newImage = await reviewImages.create({
      reviewId,
      url
    });
    return res.status(200).json(newImage);

  }catch(error){
    console.error(error);
    return res.status(500).json({message: "An error occurred while adding review image"})
  }

})

//PUT/reviews/:reviewId -- Edit a Review
router.put('/:reviewId', async (req, res) => {
  const { reviewId } = req.params;
  const {userId, review, stars} = req.body;

  try{
    //check if singleReview exist
    const singleReview = await reviews.findByPk(reviewId);
    if(!singleReview) return res.status(404).json({message:"Review couldn't be found"});

    //validation input field
    const errors = {}
    if(!review) errors.review = " Review text is required";
    if(stars === undefined  ||stars < 1  ||stars > 5) errors.stars = "Stars must be an integer from 1 to 5";

    // If there are validation errors, return 400 error
    if(Object.keys(errors).length){
      return res.status(400).json({message:"Bad Request", errors});
    }

    //update old value with new value , spot.name = "New Spot Name" || "Old Spot Name"; 
    singleReview.userId = userId || singleReview.userId;
    singleReview.review = review || singleReview.review;
    singleReview.stars = stars || singleReview.stars;
    // Save the updated single review to the database
    await singleReview.save();

    return res.status(200).json(singleReview);
  }catch(error){
    console.error(error);
    return res.status(500).json({message: "An error occurred while updating the review"})
  }
})
  
 //DELETE/reviews/:reviewId - Delete a specific review by ID
router.delete('/:reviewId', async (req, res) => {
  const { reviewId } = req.params;

  try{

    const review = await reviews.findOne({
      where:{spotId: reviewId},
    });

    if(!review){
      return res.status(404).json({message: 'Review not found.'});
    }

    await review.destroy();
    res.status(200).json({message: "Successfully deleted"});

  } catch(error){
    console.error(error);
    res.status(500).json({message: 'An error occured while deleting the review.'})
  }
})


  




module.exports = router;
