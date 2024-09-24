'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert("reviewImages",[
      {
        reviewId:1,
        url: "image-for-review-1"
      },
      {
        reviewId:2,
        url: "image-for-review-2"
      },
      {
        reviewId:3,
        url: "image-for-review-3"
      },
      {
        reviewId:4,
        url: "image-for-review-4"
      },
      {
        reviewId:5,
        url: "image-for-review-5"
      },
      {
        reviewId:6,
        url: "image-for-review-6"
      }
    ],{})

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("reviewImages",null,{})
  }
};
