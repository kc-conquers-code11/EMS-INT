// services/admin/examApprovalService.js
class ExamApprovalService {
    constructor(db) {
        this.db = db;
    }

    // Get pending registrations (for admin dashboard)
    async getPendingRegistrations(filters = {}, page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        let whereClause = `WHERE er.reg_status IN ('pending', 'payment_pending')`;
        const replacements = {};

        if (filters.reg_type) {
            whereClause += ` AND er.reg_type = :regType`;
            replacements.regType = filters.reg_type;
        }

        if (filters.search) {
            whereClause += ` AND (spd.name LIKE :search OR spd.email LIKE :search OR spd.contact LIKE :search)`;
            replacements.search = `%${filters.search}%`;
        }

        // Get total count
        const [countResult] = await this.db.sequelize.query(
            `SELECT COUNT(*) as total FROM exam_registration er
       INNER JOIN students s ON s.sid = er.sid
       INNER JOIN student_personaldetails spd ON spd.personal_id = s.personal_details_id
       ${whereClause}`,
            {
                replacements,
                type: this.db.Sequelize.QueryTypes.SELECT,
            }
        );

        // Get paginated results
        const registrations = await this.db.sequelize.query(
            `SELECT 
        er.exam_reg_id,
        er.sid,
        er.event_id,
        er.reg_type,
        er.reg_status,
        er.fee_amount,
        er.payment_status,
        er.registered_at,
        spd.name as student_name,
        spd.email as student_email,
        spd.contact,
        ee.event_name,
        ee.exam_type,
        ee.reg_start,
        ee.reg_end,
        ee.late_reg_allowed,
        ee.late_reg_deadline,
        p.program_name,
        b.branch_name,
        s.semester_number,
        s.term_type as term,
        (SELECT COUNT(*) FROM registration_subject rs WHERE rs.exam_reg_id = er.exam_reg_id) as subject_count
      FROM exam_registration er
      INNER JOIN students s ON s.sid = er.sid
      INNER JOIN student_personaldetails spd ON spd.personal_id = s.personal_details_id
      INNER JOIN exam_event ee ON ee.event_id = er.event_id
      INNER JOIN programm p ON p.programm_id = s.program_id
      INNER JOIN branch b ON b.branch_id = s.branch_id
      ${whereClause}
      ORDER BY er.registered_at ASC
      LIMIT :limit OFFSET :offset`,
            {
                replacements: { ...replacements, limit, offset },
                type: this.db.Sequelize.QueryTypes.SELECT,
            }
        );

        return {
            data: registrations,
            pagination: {
                page,
                limit,
                total: parseInt(countResult.total),
                totalPages: Math.ceil(countResult.total / limit),
            },
        };
    }

    // Get complete registration details for admin review
    async getRegistrationForReview(examRegId) {
        const [registration] = await this.db.sequelize.query(
            `SELECT 
        er.*,
        spd.name as student_name,
        spd.email as student_email,
        spd.contact,
        spd.dob,
        spd.first_name,
        spd.last_name,
        spd.gender_id,
        spd.aadhar_number,
        p.program_name,
        b.branch_name,
        s.semester_number,
        s.term_type as term,
        s.academic_year,
        ee.event_name,
        ee.exam_type,
        ee.reg_start,
        ee.reg_end,
        ee.fee_regular,
        ee.fee_backlog,
        ee.late_reg_allowed,
        ee.late_reg_deadline,
        ee.late_reg_fee
      FROM exam_registration er
      INNER JOIN students s ON s.sid = er.sid
      INNER JOIN student_personaldetails spd ON spd.personal_id = s.personal_details_id
      INNER JOIN exam_event ee ON ee.event_id = er.event_id
      INNER JOIN programm p ON p.programm_id = s.program_id
      INNER JOIN branch b ON b.branch_id = s.branch_id
      WHERE er.exam_reg_id = :examRegId`,
            {
                replacements: { examRegId },
                type: this.db.Sequelize.QueryTypes.SELECT,
            }
        );

        if (!registration) {
            throw new Error('Registration not found');
        }

        // Get registered subjects
        const subjects = await this.db.sequelize.query(
            `SELECT 
        rs.reg_subj_id,
        rs.subject_type,
        rs.eligibility_status,
        sub.subject_code,
        sub.subject_name,
        sub.credits,
        sub.subject_type as subject_category
      FROM registration_subject rs
      INNER JOIN semester_subject_mapping ssm ON ssm.mapping_id = rs.mapping_id
      INNER JOIN subject sub ON sub.subject_id = ssm.subject_id
      WHERE rs.exam_reg_id = :examRegId`,
            {
                replacements: { examRegId },
                type: this.db.Sequelize.QueryTypes.SELECT,
            }
        );

        // Get previous registrations for this student
        const previousRegistrations = await this.db.sequelize.query(
            `SELECT 
        exam_reg_id,
        reg_type,
        reg_status,
        fee_amount,
        registered_at,
        event_name
      FROM exam_registration er
      INNER JOIN exam_event ee ON ee.event_id = er.event_id
      WHERE er.sid = :studentId AND er.exam_reg_id != :examRegId
      ORDER BY er.registered_at DESC
      LIMIT 5`,
            {
                replacements: { studentId: registration.sid, examRegId },
                type: this.db.Sequelize.QueryTypes.SELECT,
            }
        );

        return {
            registration,
            subjects,
            previous_registrations: previousRegistrations,
        };
    }

    // Approve a registration
    async approveRegistration(examRegId, adminId, notes = null, customFee = null) {
        const transaction = await this.db.sequelize.transaction();

        try {
            const [registration] = await this.db.sequelize.query(
                `SELECT reg_status, fee_amount FROM exam_registration WHERE exam_reg_id = :examRegId`,
                {
                    replacements: { examRegId },
                    type: this.db.Sequelize.QueryTypes.SELECT,
                    transaction,
                }
            );

            if (!registration) {
                throw new Error('Registration not found');
            }

            if (registration.reg_status === 'approved') {
                throw new Error('Registration already approved');
            }

            const updates = {
                reg_status: 'approved',
                approved_at: new Date(),
                approved_by: adminId,
                approval_notes: notes,
            };

            if (customFee) {
                updates.fee_amount = customFee;
            }

            await this.db.sequelize.query(
                `UPDATE exam_registration 
         SET 
          reg_status = :regStatus,
          approved_at = :approvedAt,
          approved_by = :approvedBy,
          approval_notes = :approvalNotes,
          fee_amount = :feeAmount
         WHERE exam_reg_id = :examRegId`,
                {
                    replacements: {
                        examRegId,
                        regStatus: updates.reg_status,
                        approvedAt: updates.approved_at,
                        approvedBy: updates.approved_by,
                        approvalNotes: updates.approval_notes,
                        feeAmount: updates.fee_amount || registration.fee_amount,
                    },
                    type: this.db.Sequelize.QueryTypes.UPDATE,
                    transaction,
                }
            );

            await transaction.commit();

            return {
                exam_reg_id: examRegId,
                status: 'approved',
                message: 'Registration approved successfully',
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    // Reject a registration
    async rejectRegistration(examRegId, adminId, reason) {
        const transaction = await this.db.sequelize.transaction();

        try {
            const [registration] = await this.db.sequelize.query(
                `SELECT reg_status FROM exam_registration WHERE exam_reg_id = :examRegId`,
                {
                    replacements: { examRegId },
                    type: this.db.Sequelize.QueryTypes.SELECT,
                    transaction,
                }
            );

            if (!registration) {
                throw new Error('Registration not found');
            }

            if (registration.reg_status === 'approved') {
                throw new Error('Cannot reject an already approved registration');
            }

            await this.db.sequelize.query(
                `UPDATE exam_registration 
         SET 
          reg_status = 'rejected',
          rejected_at = :rejectedAt,
          rejected_by = :rejectedBy,
          rejection_reason = :reason
         WHERE exam_reg_id = :examRegId`,
                {
                    replacements: {
                        examRegId,
                        rejectedAt: new Date(),
                        rejectedBy: adminId,
                        reason,
                    },
                    type: this.db.Sequelize.QueryTypes.UPDATE,
                    transaction,
                }
            );

            await transaction.commit();

            return {
                exam_reg_id: examRegId,
                status: 'rejected',
                message: 'Registration rejected',
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    // Bulk approve registrations
    async bulkApprove(examRegIds, adminId, notes = null) {
        const results = [];
        const errors = [];

        for (const examRegId of examRegIds) {
            try {
                const result = await this.approveRegistration(examRegId, adminId, notes);
                results.push(result);
            } catch (error) {
                errors.push({ exam_reg_id: examRegId, error: error.message });
            }
        }

        return {
            success_count: results.length,
            failure_count: errors.length,
            results,
            errors,
        };
    }

    // Bulk reject registrations
    async bulkReject(examRegIds, adminId, reason) {
        const results = [];
        const errors = [];

        for (const examRegId of examRegIds) {
            try {
                const result = await this.rejectRegistration(examRegId, adminId, reason);
                results.push(result);
            } catch (error) {
                errors.push({ exam_reg_id: examRegId, error: error.message });
            }
        }

        return {
            success_count: results.length,
            failure_count: errors.length,
            results,
            errors,
        };
    }

    // Update registration fee
    async updateFee(examRegId, adminId, newFee) {
        await this.db.sequelize.query(
            `UPDATE exam_registration 
       SET fee_amount = :newFee, approval_notes = CONCAT(IFNULL(approval_notes, ''), '\\nFee updated by admin on ', NOW())
       WHERE exam_reg_id = :examRegId`,
            {
                replacements: { examRegId, newFee },
                type: this.db.Sequelize.QueryTypes.UPDATE,
            }
        );

        return {
            exam_reg_id: examRegId,
            fee_amount: newFee,
            message: 'Fee updated successfully',
        };
    }

    // Get statistics for dashboard
    async getDashboardStats() {
        const [stats] = await this.db.sequelize.query(
            `SELECT 
        SUM(CASE WHEN reg_status = 'pending' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN reg_status = 'payment_pending' THEN 1 ELSE 0 END) as payment_pending_count,
        SUM(CASE WHEN reg_status = 'approved' THEN 1 ELSE 0 END) as approved_count,
        SUM(CASE WHEN reg_status = 'rejected' THEN 1 ELSE 0 END) as rejected_count,
        SUM(CASE WHEN reg_type = 'regular' THEN 1 ELSE 0 END) as regular_count,
        SUM(CASE WHEN reg_type = 'backlog' THEN 1 ELSE 0 END) as backlog_count,
        SUM(CASE WHEN reg_type = 'late' THEN 1 ELSE 0 END) as late_count,
        SUM(CASE WHEN DATE(registered_at) = CURDATE() THEN 1 ELSE 0 END) as today_registrations,
        SUM(CASE WHEN payment_status = 'completed' THEN fee_amount ELSE 0 END) as total_fee_collected
      FROM exam_registration
      WHERE reg_status IN ('pending', 'payment_pending', 'approved', 'rejected')`,
            {
                type: this.db.Sequelize.QueryTypes.SELECT,
            }
        );

        return stats;
    }
}

module.exports = ExamApprovalService;