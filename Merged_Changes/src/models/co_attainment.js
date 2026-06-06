const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'co_attainment',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      result_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      co_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      attainment_value: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      computed_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      sequelize,
      tableName: 'co_attainment',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
