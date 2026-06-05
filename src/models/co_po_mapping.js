const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'co_po_mapping',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      co_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      po_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      correlation_level: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'co_po_mapping',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id' }],
        },
        {
          name: 'uq_co_po',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'co_id' }, { name: 'po_id' }],
        },
      ],
    }
  );
};
