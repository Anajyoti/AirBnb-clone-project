'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bookings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      bookings.belongsTo(models.User, {foreignKey:'userId'});
      bookings.belongsTo(models.Spot, {foreignKey:'spotId'});
    }
  }
  bookings.init({
    spotId: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    userId: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    startDate:{
      type:DataTypes.DATEONLY,
      allowNull:false
    },
    endDate:{
      type:DataTypes.DATEONLY,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'bookings',
  });
  return bookings;
};
