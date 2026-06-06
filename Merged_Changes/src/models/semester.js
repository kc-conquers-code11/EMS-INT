const Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'semester',
    {
      semester_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      programme_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      academic_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      semester_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      term_type: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      branch_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      scheme_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      total_subjects: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      total_credits: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: 'semester',
      timestamps: true,
      paranoid: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'semester_id' }],
        },
        {
          name: 'idx_semester_programme_id',
          using: 'BTREE',
          fields: [{ name: 'programme_id' }],
        },
        {
          name: 'idx_semester_academic_id',
          using: 'BTREE',
          fields: [{ name: 'academic_id' }],
        },
        {
          name: 'idx_semester_is_active',
          using: 'BTREE',
          fields: [{ name: 'is_active' }],
        },
      ],
    }
  );
};