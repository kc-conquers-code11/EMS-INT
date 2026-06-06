const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'copy_case',
    {
      case_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      seating_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      sid: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      timetable_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      room_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      seat_no: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      incident_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      evidence_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      declaration_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      supervisor_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      case_status: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: 'new',
      },
      coe_remark: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      punishment_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      punishment_from: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      punishment_to: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'copy_case',
      timestamps: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'case_id' }],
        },
      ],
    }
  );
};
