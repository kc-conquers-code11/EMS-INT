const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'branch',
    {
      branch_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      programm_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      depart_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      branch_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      branch_code: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      total_intake: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      accreditation_status: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      established_year: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
      tableName: 'branch',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'branch_id' }],
        },
        {
          name: 'idx_branch_programm_id',
          using: 'BTREE',
          fields: [{ name: 'programm_id' }],
        },
        {
          name: 'idx_branch_depart_id',
          using: 'BTREE',
          fields: [{ name: 'depart_id' }],
        },
      ],
    }
  );
};
