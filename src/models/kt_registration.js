const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'kt_registration',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      kt_eligibility_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      kt_exam_event_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      fee_status: {
        type: DataTypes.ENUM('PENDING', 'PAID'),
        allowNull: true,
        defaultValue: 'PENDING',
      },
      registration_status: {
        type: DataTypes.ENUM('PENDING', 'CONFIRMED'),
        allowNull: true,
        defaultValue: 'PENDING',
      },
    },
    {
      sequelize,
      tableName: 'kt_registration',
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
