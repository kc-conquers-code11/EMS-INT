const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('role_permissions', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    utid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    permission_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    tableName: 'role_permissions',
    timestamps: false,
    indexes: [
      { unique: true, fields: ['utid', 'permission_id'] }
    ]
  });
};
