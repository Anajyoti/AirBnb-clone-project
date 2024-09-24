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
   await queryInterface.bulkInsert('reviews',[
    {
      userId: 5,
      spotId: 1,
      "review": "Great hideaway, super place to decompress and take in the nature.",
      "stars": 5.0
    },
    {
      userId: 6,
      spotId: 1,
      "review": "we will absolutely come back next season!",
      "stars": 5.0
    },
    {
      userId: 3,
      spotId: 2,
      "review": "This is super cool and awsome!",
      "stars": 5.0
    },
    {
      userId: 2,
      spotId: 11,
      "review": "beautiful house and amazing view!",
      "stars": 5.0
    },
    {
      userId: 4,
      spotId: 10,
      "review": "comforting and cozy environment",
      "stars": 5.0
    },
    {
      userId: 5,
      spotId: 8,
      "review": "Fantastic house, and dock, views and host!",
      "stars": 5.0
    },

    {
      userId: 2,
      spotId: 13,
      "review": "Great place to rent",
      "stars": 5.0
    },
    {
      userId: 6,
      spotId: 1,
      "review": "This is such a fantastic experience ever! ",
      "stars": 5.0
    },
    {
      userId: 12,
      spotId: 5,
      "review": "This is drop-dead awsome! cool activity to do around here.",
      "stars": 5.0
    },
    {
      userId: 2,
      spotId: 11,
      "review": "I can't say enough good things about this place. The hosts were communicative and clear, and made our stay easy and hassle-free. The house is massive.",
      "stars": 5.0
    },
    {
      userId: 4,
      spotId: 7,
      "review": "Beautiful place to stay. It snowed (which we weren't expecting) and it turned out to be amazing, tons of places to cozy up under a blanket and enjoy the company of friends and family. Highly recommend ",
      "stars": 5.0
    },
    {
      userId: 20,
      spotId: 6,
      "review": "Beautiful and large space, the creek running through the backyard was especially nice, hosts were very communicative.",
      "stars": 5.0
    },
    {
      userId: 3,
      spotId: 11,
      "review": "The house was unique and the river/surrounding area very pretty. There was plenty to do inside and out. Communication was excellent and lightning fast. ",
      "stars": 5.0
    },
    {
      userId: 20,
      spotId: 2,
      "review": "Great location and a fun time with all the amenities on the property!",
      "stars": 5.0
    },
   ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('reviews', null, {})
  }
};
