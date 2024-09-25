'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('SpotImages', [
      {
        spotId: 1,
        url: "/images/01.png",
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 2,
        url: "/images/02.png",
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 3,
        url: "/images/03.png",
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 4,
        url: "/images/04.png",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 5,
        url: "/images/05.png",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 6,
        url: "/images/06.png",
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 7,
        url: "/images/07.png",
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 8,
        url: "/images/08.png",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 9,
        url: "/images/09.png",
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 10,
        url: "/images/10.png",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 11,
        url: "/images/011.png",
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 12,
        url: "/images/012.png",
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 13,
        url: "/images/013.png",
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 14,
        url: "/images/014.png",
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 15,
        url: "/images/015.png",
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 16,
        url: "/images/016.png",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 17,
        url: "/images/017.png",
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 18,
        url: "/images/018.png",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 19,
        url: "/images/019.png",
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 20,
        url: "/images/20.png",
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SpotImages', null, {});
  }
};
