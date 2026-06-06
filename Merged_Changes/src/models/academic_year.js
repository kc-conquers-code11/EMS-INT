const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'academic_year',
    {
      academic_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      academic_name: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      is_admission: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      current_ay: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: 'academic_year',
      timestamps: true,
      paranoid: true,
      createdAt: 'created_at',
      updatedAt: 'updatedAt',
      deletedAt: 'deletedAt',
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'academic_id' }],
        },
      ],
    }
  );
};
