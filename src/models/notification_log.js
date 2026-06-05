const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'notification_log',
    {
      notif_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      recipient_uid: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      channel: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      subject: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      body_preview: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      notif_status: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: 'pending',
      },
      sent_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'notification_log',
      timestamps: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'notif_id' }],
        },
      ],
    }
  );
};
