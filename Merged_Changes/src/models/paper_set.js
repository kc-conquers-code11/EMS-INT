const Sequelize = require('sequelize');

/**
 * Question paper request (upload workflow). UUID refs only — no DB foreign keys; JOIN in service.
 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'paper_set',
    {
      set_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      event_id: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'exam_event.event_id',
      },
      subject_id: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'subject.subject_id',
      },
      academic_id: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'academic_year.academic_id',
      },
      semester_id: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'semester.semester_id',
      },
      exam_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      set_name: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      instructions: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      submission_deadline: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      paper_status: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: 'REQUESTED',
      },
      paper_setter_id: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'faculty.faculty_id',
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'users.uid — COE who created request',
      },
      accepted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      file_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      file_path: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      file_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      file_mime_type: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      file_size_kb: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      uploaded_by: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'faculty.faculty_id',
      },
      uploaded_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      faculty_locked_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      faculty_locked_by: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'faculty.faculty_id',
      },
      coe_final_locked_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      coe_final_locked_by: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'users.uid — COE',
      },
      draft_payload: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'JSON payload storing the complex drafted question paper structure',
      },
      rejection_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'paper_set',
      timestamps: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'set_id' }],
        },
        {
          name: 'idx_paper_set_event_subject',
          using: 'BTREE',
          fields: [{ name: 'event_id' }, { name: 'subject_id' }],
        },
        {
          name: 'idx_paper_set_setter',
          using: 'BTREE',
          fields: [{ name: 'paper_setter_id' }],
        },
        {
          name: 'idx_paper_set_status',
          using: 'BTREE',
          fields: [{ name: 'paper_status' }],
        },
      ],
    }
  );
};
