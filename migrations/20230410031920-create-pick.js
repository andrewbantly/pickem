'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('picks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      league: {
        type: Sequelize.INTEGER
      },
      game: {
        type: Sequelize.INTEGER
      },
      selTeam: {
        type: Sequelize.INTEGER
      },
      selTeamName: {
        type: Sequelize.STRING
      },
      againstTeamName: {
        type: Sequelize.STRING
      },
      gameOdds: {
        type: Sequelize.STRING
      },
      selTeamLogo: {
        type: Sequelize.STRING
      },
      gameDate: {
        type: Sequelize.DATE
      },
      shortName: {
        type: Sequelize.STRING
      },
      correctPick: {
        type: Sequelize.BOOLEAN
      },
      gameStatus: {
        type: Sequelize.INTEGER
      },
      pickActive: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('picks');
  }
};