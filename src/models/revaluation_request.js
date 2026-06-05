const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'revaluation_request',
    {
      rev_id: {
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
      assigned_evaluator: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      revised_marks: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: true,
      },
      rev_status: {
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
      tableName: 'revaluation_request',
      timestamps: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'rev_id' }],
        },
      ],
    }
  );
};
