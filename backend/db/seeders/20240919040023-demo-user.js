'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        firstName: 'Demo', 
        lastName: 'Lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser1',
        firstName: 'Jungkook',  // Corrected the typo here
        lastName: 'Jeon',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        firstName: 'Taehyung',
        lastName: 'Kim',
        hashedPassword: bcrypt.hashSync('password3')
      },

      {
        email: 'user3@user.io',
        username: 'FakeUser3',
        firstName: 'Yoongi',
        lastName: 'Min',
        hashedPassword: bcrypt.hashSync('password4')
      },

      {
        email: 'user4@user.io',
        username: 'FakeUser4',
        firstName: 'Jimin',
        lastName: 'Park',
        hashedPassword: bcrypt.hashSync('password5')
      },

      {
        email: 'user5@user.io',
        username: 'FakeUser5',
        firstName: 'Selina',
        lastName: 'Gomez',
        hashedPassword: bcrypt.hashSync('password6')
      },
      {
        email: 'user6@user.io',
        username: 'FakeUser6',
        firstName: 'Sabrina',
        lastName: 'Carpenter',
        hashedPassword: bcrypt.hashSync('password7')
      },

      {
        email: 'user7@user.io',
        username: 'FakeUser7',
        firstName: 'Emma',
        lastName: 'Watson',
        hashedPassword: bcrypt.hashSync('password8')
      },

      {
        email: 'user8@user.io',
        username: 'FakeUser8',
        firstName: 'Toph',
        lastName: 'Beifong',
        hashedPassword: bcrypt.hashSync('password9')
      },

      {
        email: 'user9@user.io',
        username: 'FakeUser9',
        firstName: 'Asami',
        lastName: 'Sato',
        hashedPassword: bcrypt.hashSync('password10')
      },
      {
        email: 'user10@user.io',
        username: 'FakeUser10',
        firstName: 'Harry',
        lastName: 'Potter',
        hashedPassword: bcrypt.hashSync('password11')
      },

      {
        email: 'user11@user.io',
        username: 'FakeUser11',
        firstName: 'Zuko',
        lastName: 'Firelord',
        hashedPassword: bcrypt.hashSync('password12')
      }

    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
