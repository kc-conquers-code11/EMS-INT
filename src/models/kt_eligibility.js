const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'kt_eligibility',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      student_prn: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      original_exam_event_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      subject_mapping_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      failed_component: {
        type: DataTypes.ENUM('THEORY', 'PRACTICAL', 'IA'),
        allowNull: false,
      },
      attempt_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
      },
      status: {
        type: DataTypes.ENUM('PENDING_REG', 'REGISTERED', 'CLEARED', 'EXHAUSTED'),
        allowNull: true,
        defaultValue: 'PENDING_REG',
      },
    },
    {
      sequelize,
      tableName: 'kt_eligibility',
      timestamps: true,
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
