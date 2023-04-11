'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pick extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.pick.belongsTo(models.user);
      models.pick.hasMany(models.comment);
    }
  }
  pick.init({
    userId: DataTypes.INTEGER,
    league: DataTypes.INTEGER,
    game: DataTypes.INTEGER,
    selTeam: DataTypes.INTEGER,
    selTeamName: DataTypes.STRING,
    selTeamScore: DataTypes.INTEGER,
    againstTeam: DataTypes.INTEGER,
    againstTeamName: DataTypes.STRING,
    againstTeamScore: DataTypes.INTEGER,
    favorite: DataTypes.BOOLEAN,
    gameSpread: DataTypes.STRING,
    gameOdds: DataTypes.INTEGER,
    selTeamLogo: DataTypes.STRING,
    gameDate: DataTypes.DATE,
    shortName: DataTypes.STRING,
    correctPick: DataTypes.BOOLEAN,
    gameStatus: DataTypes.INTEGER,
    pickActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'pick',
  });
  return pick;
};