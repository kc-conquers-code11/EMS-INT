const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'marks_entry',
    {
      entry_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      reg_subj_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      faculty_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      component: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      marks_obtained: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: true,
      },
      max_marks: {
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
      locked_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      is_approved: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0,
      },
      approved_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      approved_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'marks_entry',
      timestamps: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'entry_id' }],
        },
        {
          name: 'uq_regsubj_component',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'reg_subj_id' }, { name: 'component' }],
        },
      ],
    }
  );
};
