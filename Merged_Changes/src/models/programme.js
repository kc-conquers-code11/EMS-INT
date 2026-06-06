const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'programme',
    {
      programm_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      institution_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      depart_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      programme_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      programme_code: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      degree_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      duration_years: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      total_semesters: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      approved_intake: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      createdAt: {
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
      tableName: 'programme',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'programm_id' }],
        },
        {
          name: 'idx_programme_depart_id',
          using: 'BTREE',
          fields: [{ name: 'depart_id' }],
        },
        {
          name: 'idx_programme_institution_id',
          using: 'BTREE',
          fields: [{ name: 'institution_id' }],
        },
      ],
    }
  );
};
