const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'semester_result',
    {
      sem_result_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      sid: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      semester_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      event_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      aggregate_marks: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true,
      },
      percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      sgpa: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: true,
      },
      cgpa: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: true,
      },
      overall_status: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      is_published: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0,
      },
      published_at: {
        type: DataTypes.DATE,
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
      tableName: 'semester_result',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'sem_result_id' }],
        },
      ],
    }
  );
};
