const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'exam_pattern',
    {
      pattern_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      programm_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      pattern_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      grading_type: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: 'absolute',
      },
      grace_marks_allowed: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      grace_marks_max: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      atkt_rule: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      rounding_rule: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      passing_criteria: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      detention_criteria: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: 'exam_pattern',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'pattern_id' }],
        },
      ],
    }
  );
};