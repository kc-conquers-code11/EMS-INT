const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'gender_master',
    {
      gender_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      gender_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'gender_master',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'gender_id' }],
        },
      ],
    }
  );
};
