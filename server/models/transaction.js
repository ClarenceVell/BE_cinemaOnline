"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.Film, {
        as: "film",
        foreignKey: {
          name: "filmId",
        },
      });
      Transaction.belongsTo(models.Person, {
        as: "person",
        foreignKey: {
          name: "personId",
        },
      });
    }
  }
  Transaction.init(
    {
      status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
      },
      accountNumber: { type: DataTypes.INTEGER },
      transferProof: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
