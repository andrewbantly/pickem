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
      models.pick.hasMany(models.like);
      models.pick.hasMany(models.comment);
    }
  }
  pick.init({
    userId: DataTypes.INTEGER,
    league: DataTypes.INTEGER,
    game: DataTypes.INTEGER,
    shortName: DataTypes.STRING,
    gameDate: DataTypes.DATE,
    gameStatus: DataTypes.INTEGER,
    pickActive: DataTypes.BOOLEAN,
    correctPick: DataTypes.BOOLEAN,
    likeCount: DataTypes.INTEGER,
    pickValue: DataTypes.INTEGER,
    selTeam: DataTypes.INTEGER,
    selTeamName: DataTypes.STRING,
    selTeamScore: DataTypes.INTEGER,
    selTeamFavorite: DataTypes.BOOLEAN,
    selTeamSpread: DataTypes.STRING,
    selTeamOdds: DataTypes.INTEGER,
    selTeamLogo: DataTypes.STRING,
    againstTeam: DataTypes.INTEGER,
    againstTeamName: DataTypes.STRING,
    againstTeamScore: DataTypes.INTEGER,
    againstTeamFavorite: DataTypes.BOOLEAN,
    againstTeamSpread: DataTypes.STRING,
    againstTeamOdds: DataTypes.INTEGER,
    againstTeamLogo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'pick',
  });
  return pick;
};