const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'reval_application',
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
        type: DataTypes.CHAR(36),
        allowNull: false,
      },
      component: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      fee_status: {
        type: DataTypes.ENUM('PENDING', 'PAID'),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      status: {
        type: DataTypes.ENUM('APPLIED', 'ASSIGNED', 'EVALUATED'),
        allowNull: false,
        defaultValue: 'APPLIED',
      },
    },
    {
      sequelize,
      tableName: 'reval_application',
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
