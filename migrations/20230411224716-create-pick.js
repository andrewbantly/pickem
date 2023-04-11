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
      shortName: {
        type: Sequelize.STRING
      },
      gameDate: {
        type: Sequelize.DATE
      },
      gameStatus: {
        type: Sequelize.INTEGER
      },
      pickActive: {
        type: Sequelize.BOOLEAN
      },
      correctPick: {
        type: Sequelize.BOOLEAN
      },
      likeCount: {
        type: Sequelize.INTEGER
      },
      pickValue: {
        type: Sequelize.INTEGER
      },
      selTeam: {
        type: Sequelize.INTEGER
      },
      selTeamName: {
        type: Sequelize.STRING
      },
      selTeamScore: {
        type: Sequelize.INTEGER
      },
      selTeamFavorite: {
        type: Sequelize.BOOLEAN
      },
      selTeamSpread: {
        type: Sequelize.STRING
      },
      selTeamOdds: {
        type: Sequelize.INTEGER
      },
      selTeamLogo: {
        type: Sequelize.STRING
      },
      againstTeam: {
        type: Sequelize.INTEGER
      },
      againstTeamName: {
        type: Sequelize.STRING
      },
      againstTeamScore: {
        type: Sequelize.INTEGER
      },
      againstTeamFavorite: {
        type: Sequelize.BOOLEAN
      },
      againstTeamSpread: {
        type: Sequelize.STRING
      },
      againstTeamOdds: {
        type: Sequelize.INTEGER
      },
      againstTeamLogo: {
        type: Sequelize.STRING
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