const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'reassessment_request',
    {
      reas_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      result_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      sid: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      reas_status: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: 'pending',
      },
      fee_paid: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true,
      },
      requested_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      sequelize,
      tableName: 'reassessment_request',
      timestamps: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'reas_id' }],
        },
      ],
    }
  );
};
