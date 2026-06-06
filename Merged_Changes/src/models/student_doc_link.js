const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'student_doc_link',
    {
      doc_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      photo: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      signature: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      cap_allotment_letter: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      fc_center_verification: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      ssc_marksheet: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      hsc_marksheet: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      lc: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      mht_cet_score_card: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      caste_certificate: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      caste_validation: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      domicile: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      aadhar_card: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      ration_card: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      back_passbook: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      income_certificate: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      fee_receipt: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      college_admission_letter: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      jee_score_card: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      nonCreamy: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      ews_pro: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      parentSignature: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      antiragging_form: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      gap_cert: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      dep_marksheet: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'student_doc_link',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'doc_id' }],
        },
      ],
    }
  );
};
