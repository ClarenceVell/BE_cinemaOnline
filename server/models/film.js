"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Film extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Film.belongsTo(models.Category, {
        as: "category",
        foreignKey: {
          name: "categoryId",
        },
      });
      Film.hasMany(models.Transaction, {
        as: "transaction",
        foreignKey: {
          name: "filmId",
        },
      });
    }
  }
  Film.init(
    {
      title: DataTypes.STRING,
      price: DataTypes.INTEGER,
      filmUrl: DataTypes.STRING,
      description: DataTypes.STRING,
      thumbnail: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Film",
    }
  );
  return Film;
};
