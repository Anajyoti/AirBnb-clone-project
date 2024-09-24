// routes/api/reviews.js
const express = require('express');

const{ Op } = require('sequelize');
const router = express.Router();
const { Spot,bookings, reviewImages,reviews,User,sequelize} = require('../../db/models');

// GET /reviews/:id - Fetch a specific review by ID
router.get('/:id', async (req, res) => {
  const reviewId = req.params.id;

  try {
    const review = await reviews.findOne({
      where: { id: reviewId },
      include: [
        {
          model: reviewImage,
          as: 'reviewImages',
          required: false,
        },
        {
          model: User,
          as: 'user', // Assuming the association is defined
        },
      ],
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching the review.' });
  }
});

// POST /reviews - Create a new review
router.post('/', async (req, res) => {
  const { userId, spotId, review, stars } = req.body;

  // Validate input
  if (!userId || !spotId || !review || !stars) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Create a new review
    const newReview = await reviews.create({
      userId,
      spotId,
      review,
      stars,
    });

    res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while posting the review.' });
  }


  //DELETE/reviews/:id - Delete a specific review by ID
  router.delete('/:id', async (req, res) => {
    const reviewId = req.params.id;

    try{
      const review = await reviews.findOne({
        where:{id: reviewId},
      });

      if(!review){
        return res.status(404).json({message: 'Review not found.'});
      }

      await review.destroy();
      res.status.apply(204).send();// no content to send back

    } catch(error){
      console.error(error);
      res.status(500).json({message: 'An error occured while deleting the review.'})
    }
  })


  
});



module.exports = router;
