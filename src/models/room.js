const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'room',
    {
      room_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      building_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      room_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      floor: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      room_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      tableName: 'room',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'room_id' }],
        },
      ],
    }
  );
};
