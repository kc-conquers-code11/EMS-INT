const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'student_seating',
    {
      seating_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      block_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      exam_reg_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      seat_no: {
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
      tableName: 'student_seating',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'seating_id' }],
        },
        {
          name: 'idx_seating_block_id',
          using: 'BTREE',
          fields: [{ name: 'block_id' }],
        },
        {
          name: 'idx_seating_exam_reg_id',
          using: 'BTREE',
          fields: [{ name: 'exam_reg_id' }],
        },
        // UNIQUE: Ensure a student registration only gets ONE seat. 
        // We include deletedAt so if they are soft-deleted, they can be re-seated.
        {
          name: 'uq_seating_exam_reg',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'exam_reg_id' }, { name: 'deletedAt' }],
        },
        // UNIQUE: Ensure no two students get the exact same seat_no in the same block.
        {
          name: 'uq_seating_block_seat',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'block_id' }, { name: 'seat_no' }, { name: 'deletedAt' }],
        }
      ],
    }
  );
};
