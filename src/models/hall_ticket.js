  const Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'hall_tickets',
    {
      ticket_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      student_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      exam_reg_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      file_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      file_path: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      pdf_url: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      is_blocked: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0,
      },
      block_reason: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      generated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'hall_tickets',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'ticket_id' }],
        },
        {
          name: 'idx_ht_student_id',
          using: 'BTREE',
          fields: [{ name: 'student_id' }, { name: 'deletedAt' }],
        },
      ],
    }
  );
};
