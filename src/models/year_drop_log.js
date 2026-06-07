const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'year_drop_log',
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
      academic_year: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      total_active_kts: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('ACTIVE', 'LIFTED'),
        allowNull: true,
        defaultValue: 'ACTIVE',
      },
    },
    {
      sequelize,
      tableName: 'year_drop_log',
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
