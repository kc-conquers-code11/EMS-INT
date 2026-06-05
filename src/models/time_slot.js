const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'time_slot',
    {
      slot_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      event_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      semester_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      slot_label: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      end_time: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      sequelize,
      tableName: 'time_slot',
      timestamps: false,
      paranoid: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'slot_id' }],
        },
        {
          name: 'idx_time_slot_event',
          using: 'BTREE',
          fields: [{ name: 'event_id' }],
        },
      ],
    }
  );
};
