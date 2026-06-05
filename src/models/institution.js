const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'institution',
    {
      institution_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      institution_code: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      establishment_year: {
        type: DataTypes.STRING(4),
        allowNull: true,
      },
      institution_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      road: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      pincode: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      logo: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      affiliated_university: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      contact: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      phone_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      alternate_phone_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      official_email: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      website_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      accreditation: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      courses: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      tableName: 'institution',
      timestamps: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'institution_id' }],
        },
      ],
    }
  );
};
