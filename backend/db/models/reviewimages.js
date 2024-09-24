'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reviewImages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      reviewImages.belongsTo(models.reviews, {foreignKey:'reviewId'})
    }
  }
  reviewImages.init({
    reviewId: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    url: {
      type: DataTypes.STRING,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'reviewImages',
  });
  return reviewImages;
};
