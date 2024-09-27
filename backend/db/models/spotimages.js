'use strict';
const {
  Model,
  DATE
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotImages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SpotImages.belongsTo(models.Spots, {foreignKey: "spotId"})
    }
  }
  SpotImages.init({
    spotId: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    url:{
      type:DataTypes.STRING,
      allowNull:false
    },
    preview:{
      type:DataTypes.BOOLEAN
    }
  }, {
    sequelize,
    modelName: 'SpotImages',
  });
  return SpotImages;
};
