const Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'hall_ticket_settings',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      exam_event_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      hall_ticket_status: {
        type: DataTypes.ENUM('enabled', 'disabled'),
        allowNull: false,
        defaultValue: 'disabled',
      },
      release_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      download_last_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      late_exam_required: {
        type: DataTypes.ENUM('yes', 'no'),
        allowNull: false,
        defaultValue: 'no',
      },
      // Legacy fields kept for backward compatibility with existing download flow
      is_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0,
      },
      enabled_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      instructions: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      generated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      published_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      scheduled_publish_at: {
        type: DataTypes.DATE,
        allowNull: true,
      }
    },
    {
      sequelize,
      tableName: 'hall_ticket_settings',
      timestamps: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id' }],
        },
        {
          name: 'idx_hts_exam_event_id',
          using: 'BTREE',
          fields: [{ name: 'exam_event_id' }],
        },
      ],
    }
  );
};
