"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Person extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Person.hasMany(models.Transaction, {
        as: "transaction",
        foreignKey: {
          name: "personId",
        },
      });
    }
  }
  Person.init(
    {
      fullName: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      password: DataTypes.STRING,
      avatar: DataTypes.STRING,
      is_admin: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Person",
    }
  );
  return Person;
};
