const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'faculty_subject_mapping',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      faculty_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      subject_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      semester_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      faculty_role: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'faculty_subject_mapping',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
