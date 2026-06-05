const Sequelize = require('sequelize');

/** Question repository; subject_id / faculty_id are logical UUID refs (no FK). */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'question_bank',
    {
      q_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      subject_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      faculty_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      chapter: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      topic: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      question_type: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      difficulty: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      marks: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      question_text: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      options_json: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      correct_answer: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: 'question_bank',
      timestamps: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'q_id' }],
        },
        {
          name: 'idx_question_bank_subject',
          using: 'BTREE',
          fields: [{ name: 'subject_id' }],
        },
      ],
    }
  );
};
