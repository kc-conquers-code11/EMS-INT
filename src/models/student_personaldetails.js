const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'student_personaldetails',
    {
      personal_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      stud_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      gender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      religion: {
        type: DataTypes.STRING(400),
        allowNull: true,
      },
      community: {
        type: DataTypes.STRING(400),
        allowNull: true,
      },
      minority: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      caste: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      sub_caste: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      nationality: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      radd_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      padd_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      place_of_birth: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      child_number: {
        type: DataTypes.STRING(4),
        allowNull: true,
      },
      landline_number: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      contact: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      bank_account_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      bank_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      married_status: {
        type: DataTypes.ENUM('Single', 'Married', 'Divorced', 'Widowed'),
        allowNull: true,
      },
      guardian_relation: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      aadhar_number: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      last_college_attended: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      is_parent_have_domicile: {
        type: DataTypes.ENUM('Yes', 'No'),
        allowNull: true,
      },
      first_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      middle_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      last_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      mother_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      pan: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      blood_group: {
        type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
        allowNull: true,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'student_personaldetails',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'personal_id' }],
        },
        {
          name: 'idx_student_personaldetails_name',
          using: 'BTREE',
          fields: [{ name: 'name' }],
        },
        {
          name: 'idx_student_personaldetails_contact',
          using: 'BTREE',
          unique: true,
          fields: [{ name: 'contact' }],
        },
      ],
    }
  );
};
