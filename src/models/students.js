const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'students',
    {
      sid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      stud_clg_id: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      uid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      program_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      cat_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      seat_type_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      branch_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      gr_number: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      personal_details_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      father_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      mother_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      guardian_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      physically_handicap: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      defence_status: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      received_scholarship: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      details_of_prize: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      special_talent: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      doc_ids: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      academic_year: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      final_submit: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      HDegree: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      part_payment: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      dd_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      neft_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      cancelled_app: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      cancelled_app_date: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      cancelled_app_document: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      RowNum: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'students',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'sid' }],
        },
        {
          name: 'idx_students_stud_clg_id',
          using: 'BTREE',
          unique: true,
          fields: [{ name: 'stud_clg_id' }],
        },
      ],
    }
  );
};
