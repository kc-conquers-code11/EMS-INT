const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'audit_log',
    {
      audit_id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      uid: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      action: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      entity_type: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      entity_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      before_json: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      after_json: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'audit_log',
      timestamps: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'audit_id' }],
        },
      ],
    }
  );
};
