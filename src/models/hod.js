const Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'hod',
    {
      hod_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      depart_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      institution_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      employee_id: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      personal_email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Personal email for recovery',
      },
      gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: true,
      },
      qualification: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      specialization: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      designation: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      experience_years: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      joining_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      profile_photo: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        comment: 'Base64 or file path for profile photo',
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Linked users.uid',
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      restored_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'hod',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'hod_id' }],
        },
        {
          name: 'idx_hod_depart',
          using: 'BTREE',
          fields: [{ name: 'depart_id' }],
        },
        {
          name: 'idx_hod_institution',
          using: 'BTREE',
          fields: [{ name: 'institution_id' }],
        },
        {
          name: 'idx_hod_email',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'email' }],
        },
      ],
    }
  );
};
