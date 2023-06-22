'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nama: DataTypes.STRING,
      no_telp: DataTypes.STRING,
      alamat: DataTypes.TEXT,
      jenis_k: DataTypes.STRING,
      foto: { type: DataTypes.STRING, allowNull: true },
      role: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      refresh_token: { type: DataTypes.STRING, allowNull: true },
      device_id: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};
