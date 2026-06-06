const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'revaluation_entry',
    {
      reval_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      reg_subj_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
      },
      component: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      faculty_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
      },
      revised_marks: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: true,
      },
      is_locked: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0,
      },
      locked_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      evaluation_remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'revaluation_entry',
      timestamps: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'reval_id' }],
        },
        {
          name: 'uq_reval_regsubj_comp',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'reg_subj_id' }, { name: 'component' }],
        },
      ],
    }
  );
};
