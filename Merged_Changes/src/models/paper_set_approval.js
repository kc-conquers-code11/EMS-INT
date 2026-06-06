const Sequelize = require('sequelize');

/** COE approve/reject audit; set_id and moderator_id are UUID refs (JOIN only, no FK). */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'paper_set_approval',
    {
      approval_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      set_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      moderator_id: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'users.uid of COE/moderator',
      },
      action: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      actioned_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      sequelize,
      tableName: 'paper_set_approval',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'approval_id' }],
        },
        {
          name: 'idx_paper_set_approval_set_id',
          using: 'BTREE',
          fields: [{ name: 'set_id' }],
        },
      ],
    }
  );
};
