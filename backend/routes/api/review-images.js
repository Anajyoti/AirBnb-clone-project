const express = require('express');
const{ Op } = require('sequelize');
const { requireAuth } = require('../../utils/auth');

const { Spots,SpotImages, bookings,reviewImages,reviews,User,sequelize} = require('../../db/models');
const router = express.Router();

// DELETE /api/review-images/:imageId - Delete a Review Image
router.delete('/:imageId', requireAuth, async (req, res) => {
  const { imageId } = req.params;
  const userId = req.user.id; // Current authenticated user's ID

  try {
    // Check if the Review Image exists
    const reviewImage = await reviewImages.findByPk(imageId);
    if (!reviewImage) {
      return res.status(404).json({ message: "Review Image couldn't be found" });
    }

    // Get the Review associated with the image
    const review = await reviews.findByPk(reviewImage.reviewId);

    // Ensure the review belongs to the current user
    if (review.userId !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this image" });
    }

    // Delete the Review Image
    await reviewImage.destroy();

    // Send success response
    return res.status(200).json({ message: "Successfully deleted" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while deleting the review image" });
  }
});
module.exports = router;