// routes/api/reviews.js
const express = require('express');
const { requireAuth } = require('../../utils/auth');
const{ Op } = require('sequelize');
const router = express.Router();
const { Spots,bookings, reviewImages,reviews,User,sequelize } = require('../../db/models');

const { handleValidationErrors } = require('../../utils/validation');
const dialect = sequelize.getDialect()
const schema = process.env.SCHEMA;
const mode = dialect === 'postgres' && schema ? `"${schema}".` : '';

// GET/reviews/current - Fetch all the reviews of the current user

// router.get('/current', requireAuth, async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const review = await reviews.findAll({
//       where: { userId },
//       include: [
//         {
//           model: User,
//           as: 'User', // Use the correct alias here
//           attributes: ['id', 'username', 'firstName', 'lastName']
//         },
//         {
//           model:Spots,
//           attributes: ['id','ownerId','address','city','state','country','lat','lng','name','price','previewImage']
//         },
//         {
//           model: reviewImages,
//           attributes:['id','url']
//         }
//       ]
//     });

//     res.status(200).json({review});
//   } catch (error) {
//     console.error('Error fetching reviews:', error);
//     res.status(500).json({ message: 'An error occurred while fetching the review.' });
//   }
// });

router.get('/current', requireAuth, async (req, res) => {
  const Reviews = await reviews.findAll({
      where: {
          userId: req.user.id
      },
      include: [
          { model: User, attributes: ['id', 'firstName', 'lastName']
          },
          {   model: Spots,
              attributes: {
                  include: [
                      [
                          sequelize.literal(`(
                              SELECT COALESCE((
                                  SELECT "url"
                                  FROM ${mode}"SpotImages"
                                  WHERE ${mode}"SpotImages"."spotId" = "Spot"."id" AND ${mode}"SpotImages"."preview" = true
                                  LIMIT 1
                              ), 'no preview image')
                          )`),
                          'previewImage'
                      ]
                  ],
                  exclude: ['createdAt', 'description', 'updatedAt']
              }
          },
          {
              model: reviewImages,
              as: "ReviewImages",
              attributes: ['id', 'url']
          }
      ]
  });
  return res.status(200).json({ Reviews });
});













//POST/reviews/:reviewId/images -- Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async(req, res) => {
  const { reviewId } = req.params;
  const { url } = req.body;
  const userId = req.user.id;// get current user from req.user

  try{
    //check if the review exist
    const review = await reviews.findByPk(reviewId);
    if(!review) return res.status(404).json({ message: "Review couldn't be found"});

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
    return res.status(201).json(newImage);

  }catch(error){
    console.error(error);
    return res.status(500).json({message: "An error occurred while adding review image"});
  }

})

//PUT/reviews/:reviewId -- Edit a Review
router.put('/:reviewId', requireAuth,async (req, res) => {
  const { reviewId } = req.params;
  const { review, stars} = req.body;
  const userId = req.user.id;// get the current user from req.user

  try{
    //check if singleReview exist
    const singleReview = await reviews.findByPk(reviewId);
    if(!singleReview) return res.status(404).json({message:"Review couldn't be found"});

    //check if the review belongs to the current user
    if(userId !== singleReview.userId){
      return res.status(403).json({message: "Forbidden"})
    };

    //validation input field
    const errors = {}
    if(!review) errors.review = " Review text is required";
    if(stars === undefined || stars < 1 || stars > 5) errors.stars = "Stars must be an integer from 1 to 5";

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
router.delete('/:reviewId', requireAuth,async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id;// get current user info from req.user
  
  try{
  
    const review = await reviews.findOne({
      where:{id: reviewId},
    });

    //check if the review exists
    if(!review){
      return res.status(404).json({message: "Review couldn't be found"});
    }
    //check if review belongs to current user
    if(review.userId !== userId){
      return res.status(403).json({message: "Forbidden"})
    }

    await review.destroy();
    return res.status(200).json({message: "Successfully deleted"});

  } catch(error){
    console.error(error);
    return res.status(500).json({message: 'An error occured while deleting the review'})
  }
})



module.exports = router;