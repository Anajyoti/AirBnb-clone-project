const express = require('express');
const{ Op } = require('sequelize');
const { requireAuth } = require('../../utils/auth');

const { Spots,SpotImages,bookings,reviewImages,reviews,User,sequelize} = require('../../db/models');


const { validateSpot, validateReview, validateBooking, analyzeErrors } = require('../api/validators.js');

const router = express.Router();

// DELETE /api/spot-images/:imageId - Delete a Spot Image
router.delete('/:imageId', requireAuth, async (req, res) => {
  const { imageId } = req.params;
  const userId = req.user.id; // Current authenticated user's ID

  try {
    // Check if the Spot Image exists
    const spotImages = await SpotImages.findByPk(imageId);
    if (!spotImages) {
      return res.status(404).json({ message: "Spot Image couldn't be found" });
    }

    // Get the Spot associated with the image
    const spot = await Spots.findByPk(spotImages.spotId);

    // Ensure the spot belongs to the current user
    if (spot.ownerId !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this image" });
    }

    // Delete the Spot Image
    await spotImages.destroy();

    // Send success response
    return res.status(200).json({ message: "Successfully deleted" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while deleting the image" });
  }
});
module.exports = router;