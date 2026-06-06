const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'block_allocation',
    {
      block_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      timetable_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      room_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      block_no: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      allocated_capacity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'block_allocation',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'block_id' }],
        },
        {
          name: 'idx_block_timetable_id',
          using: 'BTREE',
          fields: [{ name: 'timetable_id' }],
        },
        {
          name: 'idx_block_room_id',
          using: 'BTREE',
          fields: [{ name: 'room_id' }],
        },
        {
          name: 'idx_block_timetable_room',
          using: 'BTREE',
          fields: [{ name: 'timetable_id' }, { name: 'room_id' }],
        }
      ],
    }
  );
};
