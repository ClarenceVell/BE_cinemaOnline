"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      personId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "People",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      filmId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Films",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      status: {
        type: Sequelize.STRING,
      },
      accountNumber: {
        type: Sequelize.INTEGER,
      },
      transferProof: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Transactions");
  },
};
