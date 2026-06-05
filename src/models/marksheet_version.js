const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'marksheet_version',
    {
      version_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      result_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      changed_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      change_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      before_json: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      after_json: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      changed_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      sequelize,
      tableName: 'marksheet_version',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'version_id' }],
        },
      ],
    }
  );
};
