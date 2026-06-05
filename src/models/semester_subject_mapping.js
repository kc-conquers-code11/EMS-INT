const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'semester_subject_mapping',
    {
      mapping_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      semester_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      branch_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      subject_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      exam_event_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 1,
      },
      mapped_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'semester_subject_mapping',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'mapping_id' }],
        },
        {
          name: 'uq_sem_branch_subj_event',
          unique: true,
          using: 'BTREE',
          fields: [
            { name: 'semester_id' },
            { name: 'branch_id' },
            { name: 'subject_id' },
            { name: 'exam_event_id' },
          ],
        },
        {
          name: 'idx_mapping_semester',
          using: 'BTREE',
          fields: [{ name: 'semester_id' }],
        },
        {
          name: 'idx_mapping_branch',
          using: 'BTREE',
          fields: [{ name: 'branch_id' }],
        },
        {
          name: 'idx_mapping_subject',
          using: 'BTREE',
          fields: [{ name: 'subject_id' }],
        },
        {
          name: 'idx_mapping_event',
          using: 'BTREE',
          fields: [{ name: 'exam_event_id' }],
        },
      ],
    }
  );
};
