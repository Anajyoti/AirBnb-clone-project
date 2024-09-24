'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.hasMany(models.reviews, {foreignKey: 'spotId'});
      Spot.hasMany(models.SpotImages, {foreignKey:'spotId'});
      Spot.hasMany(models.bookings, {foreignKey: 'spotId'});
      Spot.belongsTo(models.User, {foreignKey: 'ownerId'});
    }
  }
  Spot.init({
    name: {
      type:DataTypes.STRING,
      allowNull:false
    },
    ownerId:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    city: {
      type:DataTypes.STRING,
      allowNull:false
    },
    state: {
      type:DataTypes.STRING,
      allowNull: false
    },
    country: {
      type:DataTypes.STRING,
      allowNull: false
    },
    lat:{
      type:DataTypes.DECIMAL,
      allowNull: false
    },
    lng:{
      type:DataTypes.DECIMAL,
      allowNull: false
    },
    description:{
      type:DataTypes.STRING,
      allowNull:false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull:false
    }

  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
