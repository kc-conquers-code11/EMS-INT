const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'scheme',
    {
      scheme_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      programm_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      scheme_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      scheme_year: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'draft'),
        allowNull: false,
        defaultValue: 'active',
      },


      /** Maps to form field: schemeCode */
      scheme_code: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
 
      /** Maps to form field: schemeType (e.g. "Credit based") */
      scheme_type: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
 
      /** Maps to form field: regulation (e.g. "R-2020") */
      regulation: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
 
      /**
       * Maps to form field: applicableFromYear
       * Stored as STRING to support both "2024" and "2024-25" formats.
       */
      applicable_from_year: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
 
      /** Maps to form field: totalSemesters */
      total_semesters: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
 
      /** Maps to form field: creditSystemType (e.g. "CBSC") */
      credit_system_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
 
      /** Maps to form field: totalCredits */
      total_credits: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
 
      /** Maps to form field: gradingSystem (e.g. "Percentage") */
      grading_system: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
 
      /**
       * Maps to form field: branches
       * Stored as JSON to support multiple branch UUIDs.
       */
      branches: {
        type: DataTypes.JSON,
        allowNull: true,
      },

    },
    {
      sequelize,
      tableName: 'scheme',
      timestamps: true,
      paranoid: true,
      createdAt: 'created_at',
      updatedAt: 'updatedAt',
      deletedAt: 'deletedAt',
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'scheme_id' }],
        },
      ],
    }
  );
};
