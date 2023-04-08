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
    selectedTeam: DataTypes.INTEGER,
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