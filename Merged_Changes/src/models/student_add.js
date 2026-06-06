const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'student_add',
    {
      sadd_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      address: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      domicile_number: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      street_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      building_number: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      landmark: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      pincode: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'student_add',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'sadd_id' }],
        },
      ],
    }
  );
};
