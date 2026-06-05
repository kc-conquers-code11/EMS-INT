const Sequelize = require('sequelize');

/** Links paper_set ↔ question_bank by UUID; no DB foreign keys — JOIN in service. */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'paper_question',
    {
      pq_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      set_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      q_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      sequence_no: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      marks_allocated: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      is_compulsory: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: 'paper_question',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'pq_id' }],
        },
        {
          name: 'idx_paper_question_set_q',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'set_id' }, { name: 'q_id' }],
        },
      ],
    }
  );
};
