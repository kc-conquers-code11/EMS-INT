const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'result_record',
    {
      result_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      reg_subj_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      ia_total: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: true,
      },
      ese_total: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: true,
      },
      total_marks: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: true,
      },
      percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      grade: {
        type: DataTypes.STRING(5),
        allowNull: true,
      },
      result_status: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      grace_applied: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0,
      },
      computed_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      sequelize,
      tableName: 'result_record',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'result_id' }],
        },
      ],
    }
  );
};
