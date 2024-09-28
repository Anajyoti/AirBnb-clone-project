const express = require('express');
const{ Op } = require('sequelize');
const { Spots,SpotImages,bookings, reviewImages,reviews,User,sequelize} = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();



// DELETE /api/spot-images/:imageId - Delete a Spot Image
router.delete('/:imageId', requireAuth, async (req, res) => {
  const { imageId } = req.params;
  const userId = req.user.id; // Current authenticated user's ID

  try {
    // Check if the Spot Image exists
    const spotImage = await SpotImages.findByPk(imageId);
    if (!spotImage) {
      return res.status(404).json({ message: "Spot Image couldn't be found" });
    }

    // Get the Spot associated with the image
    const spot = await Spots.findByPk(spotImage.spotId);

    // Ensure the spot belongs to the current user
    if (spot.ownerId !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this image" });
    }

    // Delete the Spot Image
    await spotImage.destroy();

    // Send success response
    return res.status(200).json({ message: "Successfully deleted" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Successfully deleted" });
  }
});

module.exports = router;
