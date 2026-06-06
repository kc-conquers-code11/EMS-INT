const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'subject',
    {
      subject_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,  // Auto-generate UUID
      },
      scheme_id: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'scheme_id', // Explicit mapping (optional but good practice)
      },
      subject_code: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'subject_code',
      },
      subject_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'subject_name',
      },
      subject_type: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'subject_type',
      },
      credits: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'credits',
      },
      max_theory: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        field: 'max_theory',
      },
      max_practical: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        field: 'max_practical',
      },
      max_oral: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        field: 'max_oral',
      },
      max_tw: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        field: 'max_tw',
      },
      min_pass_theory: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        field: 'min_pass_theory',
      },
      min_pass_practical: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        field: 'min_pass_practical',
      },
      exam_duration_min: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'exam_duration_min',
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 1,
        field: 'status',
      },
      branch_id: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'branch_id',
      },
      institution_id: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'institution_id',
      },
      depart_id: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'depart_id',
      },
      academic_id: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'academic_id',
      },
      sem: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'sem',
      },
      acad_year: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'acad_year',
      },
      // Timestamp fields - explicitly map to database columns
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
        field: 'createdAt', // or 'created_at' if your DB uses snake_case
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
        field: 'updatedAt', // or 'updated_at' if your DB uses snake_case
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'deletedAt', // or 'deleted_at' if your DB uses snake_case
      },
    },
    {
      sequelize,
      tableName: 'subject',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'subject_id' }],
        },
        {
          name: 'idx_subject_scheme_id',
          using: 'BTREE',
          fields: [{ name: 'scheme_id' }],
        },
        {
          name: 'idx_subject_branch_id',
          using: 'BTREE',
          fields: [{ name: 'branch_id' }],
        },
        {
          name: 'idx_subject_institution_id',
          using: 'BTREE',
          fields: [{ name: 'institution_id' }],
        },
        {
          name: 'idx_subject_depart_id',
          using: 'BTREE',
          fields: [{ name: 'depart_id' }],
        },
        {
          name: 'idx_subject_academic_id',
          using: 'BTREE',
          fields: [{ name: 'academic_id' }],
        },
      ],
    }
  );
};