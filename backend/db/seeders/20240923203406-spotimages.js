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
   await queryInterface.bulkInsert('spotImages',[
    {
      sportId:1,
      url:"/images/01.png",
      preview:false
    },
    {
      sportId:2,
      url:"/images/02.png",
      preview:false
    },
    {
      sportId:3,
      url:"/images/03.png",
      preview:false
    },
    {
      sportId:4,
      url:"/images/04.png",
      preview:false
    },
    {
      sportId:5,
      url:"/images/05.png",
      preview:false
    },
    {
      sportId:6,
      url:"/images/06.png",
      preview:false
    },
    {
      sportId:7,
      url:"/images/07.png",
      preview:false
    },
    {
      sportId:8,
      url:"/images/08.png",
      preview:false
    },
    {
      sportId:9,
      url:"/images/09.png",
      preview:false
    },
    {
      sportId:10,
      url:"/images/10.png",
      preview:false
    },
    {
      sportId:11,
      url:"/images/011.png",
      preview:false
    },
    {
      sportId:12,
      url:"/images/012.png",
      preview:false
    },
    {
      sportId:13,
      url:"/images/013.png",
      preview:false
    },
    {
      sportId:14,
      url:"/images/014.png",
      preview:false
    },
    {
      sportId:15,
      url:"/images/015.png",
      preview:false
    },
    {
      sportId:16,
      url:"/images/016.png",
      preview:false
    },
    {
      sportId:17,
      url:"/images/017.png",
      preview:false
    },
    {
      sportId:18,
      url:"/images/018.png",
      preview:false
    },
    {
      sportId:19,
      url:"/images/019.png",
      preview:false
    },
    {
      sportId:20,
      url:"/images/20.png",
      preview:false
    }
  ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('spotImages',null, {})
  }
};
