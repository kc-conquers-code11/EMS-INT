const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'photocopy_request',
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
      subject_mapping_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      component: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      fee_status: {
        type: DataTypes.ENUM('PENDING', 'PAID'),
        allowNull: true,
        defaultValue: 'PENDING',
      },
      status: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: 'APPLIED',
      },
    },
    {
      sequelize,
      tableName: 'photocopy_request',
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
