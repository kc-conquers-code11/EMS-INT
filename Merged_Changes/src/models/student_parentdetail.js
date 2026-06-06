const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'student_parentdetail',
    {
      parent_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      fullname: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      contact: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      occupation: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      designation: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      income: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'student_parentdetail',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'parent_id' }],
        },
      ],
    }
  );
};
