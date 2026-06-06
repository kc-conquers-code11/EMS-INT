const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'faculty_availability',
    {
      avail_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      faculty_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      unavail_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      reason: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'faculty_availability',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'avail_id' }],
        },
      ],
    }
  );
};
