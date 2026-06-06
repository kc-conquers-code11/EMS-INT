const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'department',
    {
      depart_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      institution_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      depart_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      depart_code: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      hod_id: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'References hod.hod_id (logical link, no DB FK)',
      },
      total_faculties: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      total_students: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 1,
      },
      workflow_status: {
        type: DataTypes.ENUM('DRAFT', 'ACTIVE'),
        allowNull: false,
        defaultValue: 'ACTIVE',
        comment: 'DRAFT during wizard; ACTIVE after submit',
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Soft delete flag for department',
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      courses_offered: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {
          undergraduate: false,
          postgraduate: false,
          phd: false,
          diploma: false,
        }
      }
    },
    {
      sequelize,
      tableName: 'department',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'depart_id' }],
        },
        {
          name: 'idx_department_institution',
          using: 'BTREE',
          fields: [{ name: 'institution_id' }],
        },
        {
          name: 'idx_department_hod',
          using: 'BTREE',
          fields: [{ name: 'hod_id' }],
        }
      ],
    }
  );
};
