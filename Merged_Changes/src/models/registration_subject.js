const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'registration_subject',
    {
      reg_subj_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      exam_reg_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      mapping_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      subject_type: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: 'regular',
      },
      eligibility_status: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: 'eligible',
      },
    },
    {
      sequelize,
      tableName: 'registration_subject',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'reg_subj_id' }],
        },
      ],
    }
  );
};
