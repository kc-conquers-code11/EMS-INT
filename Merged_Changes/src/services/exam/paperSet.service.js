const crypto = require('crypto');
const fs = require('fs');
const {
  PAPER_STATUS,
  PAPER_AUDIT_ACTIONS,
} = require('../../constants/paperSet.constants.js');
const {
  buildPublicFileUrl,
  deleteFileIfExists,
  resolveDownloadPath,
} = require('../../helpers/paperSetUpload.helper.js');

class PaperSetService {
  constructor(db) {
    this.db = db;
  }

  async logAudit(setId, moderatorId, action, remarks, transaction = null) {
    const approvalId = crypto.randomUUID();
    await this.db.sequelize.query(
      `INSERT INTO paper_set_approval (approval_id, set_id, moderator_id, action, remarks, actioned_at)
       VALUES (:approvalId, :setId, :moderatorId, :action, :remarks, NOW())`,
      {
        replacements: {
          approvalId,
          setId,
          moderatorId,
          action,
          remarks: remarks || null,
        },
        type: this.db.Sequelize.QueryTypes.INSERT,
        transaction,
      }
    );
  }

  async fetchPaperRow(setId, transaction = null) {
    const [paper] = await this.db.sequelize.query(
      `SELECT * FROM paper_set WHERE set_id = :setId`,
      {
        replacements: { setId },
        type: this.db.Sequelize.QueryTypes.SELECT,
        transaction,
      }
    );
    return paper || null;
  }

  async requestPaperSet(payload, createdByUid) {
    const {
      event_id: eventId,
      subject_id: subjectId,
      faculty_id: facultyId,
      academic_id: academicId,
      semester_id: semesterId,
      exam_type: examType,
      set_name: setName,
      instructions,
      submission_deadline: submissionDeadline,
    } = payload;

    const [examEvent] = await this.db.sequelize.query(
      `SELECT event_id, event_name, exam_type, academic_id, semester_id
       FROM exam_event WHERE event_id = :eventId AND deletedAt IS NULL`,
      {
        replacements: { eventId },
        type: this.db.Sequelize.QueryTypes.SELECT,
      }
    );
    if (!examEvent) throw new Error('Exam event not found');

    const [subject] = await this.db.sequelize.query(
      `SELECT subject_id, subject_name FROM subject
       WHERE subject_id = :subjectId AND deletedAt IS NULL`,
      {
        replacements: { subjectId },
        type: this.db.Sequelize.QueryTypes.SELECT,
      }
    );
    if (!subject) throw new Error('Subject not found');

    const [faculty] = await this.db.sequelize.query(
      `SELECT f.faculty_id FROM faculty f
       WHERE f.faculty_id = :facultyId
         AND (f.is_deleted = 0 OR f.is_deleted IS NULL)
         AND f.deletedAt IS NULL`,
      {
        replacements: { facultyId },
        type: this.db.Sequelize.QueryTypes.SELECT,
      }
    );
    if (!faculty) throw new Error('Faculty not found');

    const [existing] = await this.db.sequelize.query(
      `SELECT set_id FROM paper_set
       WHERE event_id = :eventId AND subject_id = :subjectId
       AND paper_status <> :finalLocked`,
      {
        replacements: {
          eventId,
          subjectId,
          finalLocked: PAPER_STATUS.FINAL_LOCKED,
        },
        type: this.db.Sequelize.QueryTypes.SELECT,
      }
    );
    if (existing) {
      throw new Error(
        'An active question paper request already exists for this exam and subject'
      );
    }

    const setId = crypto.randomUUID();
    const resolvedAcademicId = academicId || examEvent.academic_id || null;
    const resolvedSemesterId = semesterId || examEvent.semester_id || null;
    const resolvedExamType = examType || examEvent.exam_type || null;

    await this.db.sequelize.query(
      `INSERT INTO paper_set (
        set_id, event_id, subject_id, academic_id, semester_id, exam_type,
        set_name, instructions, submission_deadline, paper_status, paper_setter_id,
        created_by, createdAt, updatedAt
      ) VALUES (
        :setId, :eventId, :subjectId, :academicId, :semesterId, :examType,
        :setName, :instructions, :submissionDeadline, :status, :facultyId,
        :createdBy, NOW(), NOW()
      )`,
      {
        replacements: {
          setId,
          eventId,
          subjectId,
          academicId: resolvedAcademicId,
          semesterId: resolvedSemesterId,
          examType: resolvedExamType,
          setName,
          instructions: instructions || null,
          submissionDeadline: submissionDeadline || null,
          status: PAPER_STATUS.REQUESTED,
          facultyId,
          createdBy: createdByUid || null,
        },
        type: this.db.Sequelize.QueryTypes.INSERT,
      }
    );

    if (createdByUid) {
      await this.logAudit(
        setId,
        createdByUid,
        PAPER_AUDIT_ACTIONS.REQUEST_CREATED,
        'Question paper request created by COE'
      );
    }

    return this.getPaperSetById(setId, null, 'COE');
  }

  async acceptPaperSet(setId, facultyId) {
    const paper = await this.fetchPaperRow(setId);
    if (!paper || paper.paper_setter_id !== facultyId) {
      throw new Error('Question paper request not found or not assigned to you');
    }
    if (paper.paper_status !== PAPER_STATUS.REQUESTED) {
      throw new Error(
        `Cannot accept request in status: ${paper.paper_status}. Only REQUESTED requests can be accepted.`
      );
    }

    await this.db.sequelize.query(
      `UPDATE paper_set
       SET paper_status = :status, accepted_at = NOW(), updatedAt = NOW()
       WHERE set_id = :setId`,
      {
        replacements: { setId, status: PAPER_STATUS.ACCEPTED },
        type: this.db.Sequelize.QueryTypes.UPDATE,
      }
    );

    const [facultyUser] = await this.db.sequelize.query(
      `SELECT uid FROM users WHERE faculty_id = :facultyId AND deletedAt IS NULL LIMIT 1`,
      {
        replacements: { facultyId },
        type: this.db.Sequelize.QueryTypes.SELECT,
      }
    );

    await this.logAudit(
      setId,
      facultyUser?.uid || facultyId,
      PAPER_AUDIT_ACTIONS.ACCEPTED,
      'Faculty accepted the question paper request'
    );

    return {
      set_id: setId,
      paper_status: PAPER_STATUS.ACCEPTED,
      message:
        'Request accepted. Prepare the question paper offline and upload the Word document.',
    };
  }

  async saveDraftPayload(setId, facultyId, payload) {
    const paper = await this.fetchPaperRow(setId);
    if (!paper || paper.paper_setter_id !== facultyId) {
      throw new Error('Question paper request not found or not assigned to you');
    }

    if (paper.paper_status !== PAPER_STATUS.REQUESTED && paper.paper_status !== PAPER_STATUS.ACCEPTED && paper.paper_status !== PAPER_STATUS.DRAFT) {
       throw new Error(`Cannot save draft when status is ${paper.paper_status}.`);
    }

    if (paper.faculty_locked_at) {
      throw new Error('Question paper is locked. You cannot modify the draft payload.');
    }

    await this.db.sequelize.query(
      `UPDATE paper_set SET
        draft_payload = :payload,
        paper_status = :status,
        updatedAt = NOW()
       WHERE set_id = :setId`,
      {
        replacements: {
          setId,
          payload: JSON.stringify(payload),
          status: PAPER_STATUS.DRAFT,
        },
        type: this.db.Sequelize.QueryTypes.UPDATE,
      }
    );

    const [facultyUser] = await this.db.sequelize.query(
      `SELECT uid FROM users WHERE faculty_id = :facultyId AND deletedAt IS NULL LIMIT 1`,
      {
        replacements: { facultyId },
        type: this.db.Sequelize.QueryTypes.SELECT,
      }
    );

    await this.logAudit(
      setId,
      facultyUser?.uid || facultyId,
      PAPER_AUDIT_ACTIONS.FILE_UPLOADED, // using this or a new constant for draft saved
      'Faculty saved question paper draft payload'
    );

    return this.getPaperSetById(setId, facultyId, 'Faculty');
  }

  async uploadPaperFile(setId, facultyId, file) {
    const paper = await this.fetchPaperRow(setId);
    if (!paper || paper.paper_setter_id !== facultyId) {
      throw new Error('Question paper request not found or not assigned to you');
    }

    if (
      ![PAPER_STATUS.ACCEPTED, PAPER_STATUS.DRAFT].includes(paper.paper_status)
    ) {
      throw new Error(
        `Cannot upload file when status is ${paper.paper_status}. Upload is allowed only after acceptance and before faculty lock.`
      );
    }

    if (paper.faculty_locked_at) {
      throw new Error(
        'Question paper is locked. You cannot replace the uploaded file after lock & submit.'
      );
    }

    if (!file?.path) throw new Error('No file received');

    const fileUrl = buildPublicFileUrl(file.path);
    const fileSizeKb = Math.ceil((file.size || 0) / 1024);

    if (paper.file_path && paper.file_path !== file.path) {
      deleteFileIfExists(paper.file_path);
    }

    await this.db.sequelize.query(
      `UPDATE paper_set SET
        paper_status = :status,
        file_name = :fileName,
        file_path = :filePath,
        file_url = :fileUrl,
        file_mime_type = :mimeType,
        file_size_kb = :fileSizeKb,
        uploaded_by = :uploadedBy,
        uploaded_at = NOW(),
        updatedAt = NOW()
       WHERE set_id = :setId`,
      {
        replacements: {
          setId,
          status: PAPER_STATUS.DRAFT,
          fileName: file.originalname,
          filePath: file.path,
          fileUrl,
          mimeType: file.mimetype,
          fileSizeKb,
          uploadedBy: facultyId,
        },
        type: this.db.Sequelize.QueryTypes.UPDATE,
      }
    );

    const [facultyUser] = await this.db.sequelize.query(
      `SELECT uid FROM users WHERE faculty_id = :facultyId AND deletedAt IS NULL LIMIT 1`,
      {
        replacements: { facultyId },
        type: this.db.Sequelize.QueryTypes.SELECT,
      }
    );

    await this.logAudit(
      setId,
      facultyUser?.uid || facultyId,
      PAPER_AUDIT_ACTIONS.FILE_UPLOADED,
      `Uploaded file: ${file.originalname}`
    );

    return this.getPaperSetById(setId, facultyId, 'Faculty');
  }

  async lockAndSubmit(setId, facultyId) {
    const paper = await this.fetchPaperRow(setId);
    if (!paper || paper.paper_setter_id !== facultyId) {
      throw new Error('Question paper request not found or not assigned to you');
    }
    if (paper.paper_status !== PAPER_STATUS.DRAFT) {
      throw new Error(
        `Lock & submit is only allowed in DRAFT status (after uploading a file). Current status: ${paper.paper_status}`
      );
    }
    if (!paper.file_path && !paper.draft_payload) {
      throw new Error('Upload a document or save a draft before lock & submit');
    }

    await this.db.sequelize.query(
      `UPDATE paper_set SET
        paper_status = :status,
        faculty_locked_at = NOW(),
        faculty_locked_by = :facultyId,
        updatedAt = NOW()
       WHERE set_id = :setId`,
      {
        replacements: {
          setId,
          status: PAPER_STATUS.SUBMITTED_TO_COE,
          facultyId,
        },
        type: this.db.Sequelize.QueryTypes.UPDATE,
      }
    );

    const [facultyUser] = await this.db.sequelize.query(
      `SELECT uid FROM users WHERE faculty_id = :facultyId AND deletedAt IS NULL LIMIT 1`,
      {
        replacements: { facultyId },
        type: this.db.Sequelize.QueryTypes.SELECT,
      }
    );

    await this.logAudit(
      setId,
      facultyUser?.uid || facultyId,
      PAPER_AUDIT_ACTIONS.FACULTY_LOCKED,
      'Faculty locked and submitted question paper to COE'
    );

    return {
      set_id: setId,
      paper_status: PAPER_STATUS.SUBMITTED_TO_COE,
      message:
        'Question paper locked and submitted to COE. You can no longer modify the uploaded file.',
    };
  }

  async finalLock(setId, moderatorUid, remarks = null) {
    const transaction = await this.db.sequelize.transaction();

    try {
      const paper = await this.fetchPaperRow(setId, transaction);
      if (!paper) throw new Error('Question paper request not found');
      if (paper.paper_status !== PAPER_STATUS.SUBMITTED_TO_COE) {
        throw new Error(
          `COE final lock requires status ${PAPER_STATUS.SUBMITTED_TO_COE}. Current: ${paper.paper_status}`
        );
      }
      if (!paper.file_path) {
        throw new Error('No uploaded file found for this request');
      }

      await this.db.sequelize.query(
        `UPDATE paper_set SET
          paper_status = :status,
          coe_final_locked_at = NOW(),
          coe_final_locked_by = :moderatorUid,
          updatedAt = NOW()
         WHERE set_id = :setId`,
        {
          replacements: {
            setId,
            status: PAPER_STATUS.FINAL_LOCKED,
            moderatorUid,
          },
          type: this.db.Sequelize.QueryTypes.UPDATE,
          transaction,
        }
      );

      await this.logAudit(
        setId,
        moderatorUid,
        PAPER_AUDIT_ACTIONS.COE_FINAL_LOCKED,
        remarks || 'COE performed final lock — question paper finalized',
        transaction
      );

      await transaction.commit();
      return {
        set_id: setId,
        paper_status: PAPER_STATUS.FINAL_LOCKED,
        message: 'Question paper finalized. No further changes are allowed.',
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async reviewPaperDraft(setId, moderatorUid, status, rejectionReason = null) {
    const paper = await this.fetchPaperRow(setId);
    if (!paper) throw new Error('Question paper request not found');

    if (paper.paper_status !== PAPER_STATUS.SUBMITTED_TO_COE) {
      throw new Error(`Review requires status ${PAPER_STATUS.SUBMITTED_TO_COE}. Current: ${paper.paper_status}`);
    }

    if (status !== 'APPROVED' && status !== 'REJECTED') {
      throw new Error('Invalid status. Must be APPROVED or REJECTED.');
    }

    // In case of rejection, unlock the paper so faculty can edit again
    const facultyLockedAt = status === 'REJECTED' ? null : paper.faculty_locked_at;
    const finalStatus = status === 'APPROVED' ? PAPER_STATUS.FINAL_LOCKED : PAPER_STATUS.DRAFT;

    await this.db.sequelize.query(
      `UPDATE paper_set SET
        paper_status = :status,
        rejection_reason = :rejectionReason,
        faculty_locked_at = :facultyLockedAt,
        updatedAt = NOW()
       WHERE set_id = :setId`,
      {
        replacements: {
          setId,
          status: finalStatus,
          rejectionReason: status === 'REJECTED' ? rejectionReason : null,
          facultyLockedAt,
        },
        type: this.db.Sequelize.QueryTypes.UPDATE,
      }
    );

    await this.logAudit(
      setId,
      moderatorUid,
      status === 'APPROVED' ? PAPER_AUDIT_ACTIONS.COE_FINAL_LOCKED : 'REJECTED',
      status === 'APPROVED' ? 'COE approved question paper' : `COE rejected: ${rejectionReason}`
    );

    return {
      set_id: setId,
      paper_status: finalStatus,
      message: status === 'APPROVED' ? 'Question paper approved and published' : 'Question paper rejected back to faculty',
    };
  }

  async getApprovalHistory(setId) {
    return this.db.sequelize.query(
      `SELECT psa.*, u.email AS actor_email
       FROM paper_set_approval psa
       LEFT JOIN users u ON psa.moderator_id = u.uid
       WHERE psa.set_id = :setId
       ORDER BY psa.actioned_at DESC`,
      {
        replacements: { setId },
        type: this.db.Sequelize.QueryTypes.SELECT,
      }
    );
  }

  async getPaperSetById(setId, userId, userRole) {
    const [paper] = await this.db.sequelize.query(
      `SELECT
        ps.*,
        ee.event_name,
        s.subject_name,
        s.subject_code,
        ay.academic_name,
        CONCAT('Sem ', sem.semester_number, ' - ', sem.term_type) AS semester_label,
        f.name AS faculty_name,
        COALESCE(f.college_email, f.email) AS faculty_email,
        COALESCE(uf.college_email, uf.email) AS uploaded_by_email
       FROM paper_set ps
       LEFT JOIN exam_event ee ON ps.event_id = ee.event_id
       LEFT JOIN subject s ON ps.subject_id = s.subject_id
       LEFT JOIN academic_year ay ON ps.academic_id = ay.academic_id
       LEFT JOIN semester sem ON ps.semester_id = sem.semester_id
       LEFT JOIN faculty f ON ps.paper_setter_id = f.faculty_id
       LEFT JOIN faculty uf ON ps.uploaded_by = uf.faculty_id
       WHERE ps.set_id = :setId`,
      {
        replacements: { setId },
        type: this.db.Sequelize.QueryTypes.SELECT,
      }
    );
    if (!paper) throw new Error('Question paper request not found');

    if (userRole === 'Faculty' && paper.paper_setter_id !== userId) {
      throw new Error('Access denied: You can only view your assigned requests');
    }

    return paper;
  }

  async listPaperSets(
    filters = {},
    page = 1,
    limit = 20,
    userId = null,
    userRole = null,
    scope = null
  ) {
    const offset = (page - 1) * limit;
    const whereClause = [];
    const replacements = {};
    const joins = [];

    if (filters.paper_status) {
      whereClause.push('ps.paper_status = :paper_status');
      replacements.paper_status = filters.paper_status;
    }
    if (filters.subject_id) {
      whereClause.push('ps.subject_id = :subject_id');
      replacements.subject_id = filters.subject_id;
    }
    if (filters.event_id) {
      whereClause.push('ps.event_id = :event_id');
      replacements.event_id = filters.event_id;
    }
    if (filters.academic_id) {
      whereClause.push('ps.academic_id = :academic_id');
      replacements.academic_id = filters.academic_id;
    }
    if (filters.semester_id) {
      whereClause.push('ps.semester_id = :semester_id');
      replacements.semester_id = filters.semester_id;
    }

    if (userRole === 'Faculty') {
      whereClause.push('ps.paper_setter_id = :facultyId');
      replacements.facultyId = userId;
    } else if (filters.faculty_id) {
      whereClause.push('ps.paper_setter_id = :faculty_id');
      replacements.faculty_id = filters.faculty_id;
    }

    if (scope && !scope.unrestricted) {
      joins.push('LEFT JOIN exam_event ee_scope ON ps.event_id = ee_scope.event_id');
      if (scope.institution_id) {
        whereClause.push('ee_scope.institution_id = :scopeInstitutionId');
        replacements.scopeInstitutionId = scope.institution_id;
      }
      if (scope.level === 'DEPARTMENT' && scope.depart_id) {
        joins.push('LEFT JOIN faculty f_scope ON ps.paper_setter_id = f_scope.faculty_id');
        whereClause.push('f_scope.depart_id = :scopeDepartId');
        replacements.scopeDepartId = scope.depart_id;
      }
    }

    const joinSQL = joins.length ? joins.join('\n       ') : '';
    const whereSQL =
      whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

    const [countResult] = await this.db.sequelize.query(
      `SELECT COUNT(*) AS total FROM paper_set ps ${joinSQL} ${whereSQL}`,
      { replacements, type: this.db.Sequelize.QueryTypes.SELECT }
    );

    const papers = await this.db.sequelize.query(
      `SELECT
        ps.set_id, ps.event_id, ps.subject_id, ps.academic_id, ps.semester_id,
        ps.exam_type, ps.set_name, ps.submission_deadline, ps.paper_status,
        ps.paper_setter_id, ps.file_name, ps.file_url, ps.uploaded_at,
        ps.faculty_locked_at, ps.coe_final_locked_at,
        ps.createdAt, ps.updatedAt,
        ee.event_name,
        s.subject_name, s.subject_code,
        ay.academic_name,
        CONCAT('Sem ', sem.semester_number, ' - ', sem.term_type) AS semester_label,
        f.name AS faculty_name
       FROM paper_set ps
       ${joinSQL}
       LEFT JOIN exam_event ee ON ps.event_id = ee.event_id
       LEFT JOIN subject s ON ps.subject_id = s.subject_id
       LEFT JOIN academic_year ay ON ps.academic_id = ay.academic_id
       LEFT JOIN semester sem ON ps.semester_id = sem.semester_id
       LEFT JOIN faculty f ON ps.paper_setter_id = f.faculty_id
       ${whereSQL}
       ORDER BY ps.createdAt DESC
       LIMIT :limit OFFSET :offset`,
      {
        replacements: { ...replacements, limit, offset },
        type: this.db.Sequelize.QueryTypes.SELECT,
      }
    );

    return {
      data: papers,
      pagination: {
        page,
        limit,
        total: parseInt(countResult.total, 10),
        totalPages: Math.ceil(parseInt(countResult.total, 10) / limit),
      },
    };
  }

  async resolveDownload(setId, userId, userRole) {
    const paper = await this.getPaperSetById(setId, userId, userRole);
    if (!paper.file_path) {
      throw new Error('No question paper file has been uploaded yet');
    }

    const absolutePath = resolveDownloadPath(paper.file_path);
    if (!absolutePath) {
      throw new Error('Uploaded file is missing from storage');
    }

    return {
      absolutePath,
      fileName: paper.file_name || 'question-paper.docx',
      mimeType:
        paper.file_mime_type ||
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
  }
}

module.exports = PaperSetService;
