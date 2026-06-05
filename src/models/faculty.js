const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'faculty',
    {
      faculty_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      uid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      faculty_clg_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      contact: {
        type: DataTypes.STRING(11),
        allowNull: true,
      },
      ftype_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      depart_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      college_email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: false,
        comment: 'Official college email',
      },
      personal_email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Personal email for recovery',
      },
      specialization: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Subject specialization (e.g., AI, DBMS, Networks)',
      },
      designation: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Professor/Assistant Professor/Lecturer',
      },
      experience_years: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Years of experience',
      },
      subjects_assigned: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Comma-separated or free-text subjects assigned',
      },
      profile_photo: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        comment: 'Base64 or file path for profile photo',
      },
      privilege: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      joining_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      shift_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: true,
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      qualification: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      pan_no: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      aadhar_card: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      blood_group: {
        type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
        allowNull: true,
      },
      permanent_address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      current_address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      alternate_mobile: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      experience_details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      photo: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      signature: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cv: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      branch_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 1,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Soft delete flag',
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Timestamp when faculty was soft deleted',
      },
      restored_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Timestamp when faculty was restored',
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'User ID who created this faculty record',
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'User ID who last updated this faculty record',
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'faculty',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'faculty_id' }],
        },
        {
          name: 'idx_faculty_faculty_clg_id',
          using: 'BTREE',
          fields: [{ name: 'faculty_clg_id' }],
        },
        {
          name: 'idx_faculty_name',
          using: 'BTREE',
          fields: [{ name: 'name' }],
        },
        {
          name: 'idx_faculty_contact',
          using: 'BTREE',
          unique: true,
          fields: [{ name: 'contact', length: 11 }],
        },
        {
          name: 'idx_faculty_email',
          using: 'BTREE',
          unique: true,
          fields: [{ name: 'email' }],
        },
      ],
    }
  );
};
