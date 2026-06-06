const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('permissions', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    module: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "e.g., 'Grades', 'Library', 'Users', 'Admissions'",
    },
    action: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "e.g., 'create', 'read', 'update', 'delete', 'publish'",
    },
    code: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "e.g., 'grades:update' (Module + Action for easy checking)",
    }
  }, {
    tableName: 'permissions',
    timestamps: false,
    indexes: [
      {
        name: 'uk_permissions_code',
        unique: true,
        fields: ['code']
      }
    ]
  });
};
