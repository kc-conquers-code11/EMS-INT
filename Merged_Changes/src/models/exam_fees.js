const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'exam_fees',
    {
      fee_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      event_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      fee_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'Regular',
      },
      programme_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      semester_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      late_fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'exam_fees',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'fee_id' }],
        },
        {
          name: 'uk_programme_semester_fee_type',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'programme_id' }, { name: 'semester_id' }, { name: 'fee_type' }],
        },
      ],
    }
  );
};
