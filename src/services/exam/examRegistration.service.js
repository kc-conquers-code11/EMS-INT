// services/student/examRegistrationService.js
const { v4: uuidv4 } = require('uuid');

class ExamRegistrationService {
    constructor(db) {
        this.db = db;
    }

    // Step 1: Get available exam events for a student
    async getAvailableExamEvents(studentId, filters = {}) {
        let query = `
      SELECT 
        ee.event_id,
        ee.event_name,
        ee.exam_type,
        ee.reg_start,
        ee.reg_end,
        ee.fee_regular,
        ee.fee_backlog,
        ee.late_reg_allowed,
        ee.late_reg_deadline,
        ee.late_reg_fee,
        ee.late_reg_max_days,
        ee.status,
        s.semester_number,
        s.term_type as term,
        p.programm_id,
        p.programme_name,
        b.branch_name
      FROM exam_event ee
      INNER JOIN semester s ON s.semester_id = ee.semester_id
      INNER JOIN programme p ON p.programm_id = s.programm_id
      INNER JOIN students stu ON stu.program_id = p.programm_id
      INNER JOIN branch b ON b.branch_id = stu.branch_id
      WHERE stu.sid = :studentId
        AND ee.status = 'published'
        AND ee.is_published = 1
        AND CURDATE() <= ee.late_reg_deadline
    `;

        const replacements = { studentId };

        if (filters.semester_id) {
            query += ` AND ee.semester_id = :semesterId`;
            replacements.semesterId = filters.semester_id;
        }

        if (filters.exam_type) {
            query += ` AND ee.exam_type = :examType`;
            replacements.examType = filters.exam_type;
        }

        query += ` ORDER BY ee.reg_end ASC`;

        const events = await this.db.sequelize.query(query, {
            replacements,
            type: this.db.Sequelize.QueryTypes.SELECT,
        });

        // Check if student already registered for each event
        for (let event of events) {
            const [existingReg] = await this.db.sequelize.query(
                `SELECT exam_reg_id, reg_status, reg_type, payment_status 
         FROM exam_registration 
         WHERE sid = :studentId AND event_id = :eventId`,
                {
                    replacements: { studentId, eventId: event.event_id },
                    type: this.db.Sequelize.QueryTypes.SELECT,
                }
            );
            event.already_registered = !!existingReg;
            event.existing_registration = existingReg || null;
        }

        return events;
    }

    // Step 2: Get eligible subjects for exam registration
    async getEligibleSubjects(studentId, eventId, regType) {
        // First get student's program and semester details
        const [student] = await this.db.sequelize.query(
            `SELECT 
        s.sid,
        s.program_id,
        s.branch_id,
        spd.name
      FROM students s
      LEFT JOIN student_personaldetails spd ON spd.personal_id = s.personal_details_id
      WHERE s.sid = :studentId`,
            {
                replacements: { studentId },
                type: this.db.Sequelize.QueryTypes.SELECT,
            }
        );

        if (!student) {
            throw new Error('Student not found');
        }

        // Get event details
        const [event] = await this.db.sequelize.query(
            `SELECT * FROM exam_event WHERE event_id = :eventId`,
            {
                replacements: { eventId },
                type: this.db.Sequelize.QueryTypes.SELECT,
            }
        );

        if (!event) {
            throw new Error('Exam event not found');
        }

        // Get subjects based on registration type
        let subjectsQuery = `
      SELECT 
        ssm.mapping_id,
        sub.subject_id,
        sub.subject_code,
        sub.subject_name,
        sub.subject_type,
        sub.credits,
        CASE 
          WHEN :regType = 'backlog' THEN 'backlog'
          WHEN :regType = 'improvement' THEN 'improvement'
          ELSE 'regular'
        END as eligible_type
      FROM semester_subject_mapping ssm
      INNER JOIN subject sub ON sub.subject_id = ssm.subject_id
      WHERE ssm.semester_id = :semesterId
        AND (ssm.branch_id = :branchId OR ssm.branch_id IS NULL)
        AND ssm.is_active = 1
    `;

        // Fetch fee from exam_fees table
        const [examFeeRecord] = await this.db.sequelize.query(
            `SELECT amount, late_fee FROM exam_fees WHERE programme_id = :programmeId AND semester_id = :semesterId AND deletedAt IS NULL`,
            {
                replacements: { programmeId: student.program_id, semesterId: event.semester_id },
                type: this.db.Sequelize.QueryTypes.SELECT,
            }
        );

        const feeRegular = examFeeRecord ? examFeeRecord.amount : event.fee_regular;
        const lateFee = examFeeRecord && examFeeRecord.late_fee ? examFeeRecord.late_fee : (event.late_reg_fee || feeRegular);

        const replacements = {
            regType,
            semesterId: event.semester_id,
            branchId: student.branch_id,
        };

        // For backlog, only include subjects where student has failed
        if (regType === 'backlog') {
            subjectsQuery = `
        SELECT 
          ssm.mapping_id,
          sub.subject_id,
          sub.subject_code,
          sub.subject_name,
          sub.subject_type,
          sub.credits,
          'backlog' as eligible_type
        FROM semester_subject_mapping ssm
        INNER JOIN subject sub ON sub.subject_id = ssm.subject_id
        WHERE ssm.semester_id = :semesterId
          AND (ssm.branch_id = :branchId OR ssm.branch_id IS NULL)
          AND ssm.is_active = 1
          AND sub.subject_id IN (
            -- Subquery to get subjects where student failed
            SELECT DISTINCT subject_id FROM result WHERE sid = :studentId AND result_status = 'FAIL'
          )
      `;
        }

        const subjects = await this.db.sequelize.query(subjectsQuery, {
            replacements,
            type: this.db.Sequelize.QueryTypes.SELECT,
        });

        return {
            student,
            event,
            subjects,
            exam_fee_record: examFeeRecord || null,
            base_fee: feeRegular,
            total_fee: feeRegular,
        };
    }

    // Step 3: Calculate fee for selected subjects
    async calculateFee(studentId, eventId, regType, selectedSubjects) {
        const eligibleData = await this.getEligibleSubjects(studentId, eventId, regType);

        // Filter selected subjects and calculate fee
        const selectedSubjectsData = eligibleData.subjects.filter(sub =>
            selectedSubjects.some(selected => selected.mapping_id === sub.mapping_id)
        );

        const feeBreakdown = selectedSubjectsData.map(sub => ({
            mapping_id: sub.mapping_id,
            subject_name: sub.subject_name,
            subject_type: sub.subject_type,
        }));

        const totalFee = parseFloat(eligibleData.base_fee || 0);

        // Check if late registration fee applies
        const currentDate = new Date();
        const regEndDate = new Date(eligibleData.event.reg_end);
        let lateFeeApplicable = false;
        let lateFeeAmount = 0;

        if (regType === 'late' && eligibleData.event.late_reg_allowed) {
            lateFeeApplicable = true;
            if (eligibleData.exam_fee_record && eligibleData.exam_fee_record.late_fee) {
                lateFeeAmount = parseFloat(eligibleData.exam_fee_record.late_fee);
            } else {
                lateFeeAmount = parseFloat(eligibleData.event.late_reg_fee || 0);
            }
        }

        return {
            event: eligibleData.event,
            reg_type: regType,
            selected_subjects: selectedSubjectsData,
            fee_breakdown: feeBreakdown,
            subtotal: totalFee,
            late_fee_applicable: lateFeeApplicable,
            late_fee_amount: lateFeeAmount,
            total_fee: totalFee + lateFeeAmount,
            currency: 'INR',
        };
    }

    // Step 4: Create exam registration
    async createRegistration(studentId, userId, registrationData) {
        const { event_id, reg_type, subjects, fee_amount, payment_method } = registrationData;

        const transaction = await this.db.sequelize.transaction();

        try {
            // Check if already registered
            const [existingReg] = await this.db.sequelize.query(
                `SELECT exam_reg_id, reg_status FROM exam_registration 
         WHERE sid = :studentId AND event_id = :eventId`,
                {
                    replacements: { studentId, eventId: event_id },
                    type: this.db.Sequelize.QueryTypes.SELECT,
                    transaction,
                }
            );

            if (existingReg) {
                throw new Error('Student already registered for this exam event');
            }

            // Check if registration period is still open
            const [event] = await this.db.sequelize.query(
                `SELECT reg_end, late_reg_deadline, late_reg_allowed FROM exam_event WHERE event_id = :eventId`,
                {
                    replacements: { eventId: event_id },
                    type: this.db.Sequelize.QueryTypes.SELECT,
                    transaction,
                }
            );

            const currentDate = new Date();
            const regEndDate = new Date(event.reg_end);
            const lateDeadline = event.late_reg_deadline ? new Date(event.late_reg_deadline) : null;

            if (currentDate > regEndDate) {
                if (!event.late_reg_allowed || (lateDeadline && currentDate > lateDeadline)) {
                    throw new Error('Registration deadline has passed');
                }
            }

            // Create exam registration
            const examRegId = await this.db.sequelize.query(
                `INSERT INTO exam_registration 
         (sid, event_id, reg_type, reg_status, fee_amount, payment_status, registered_at, createdAt, updatedAt) 
         VALUES 
         (:sid, :eventId, :regType, :regStatus, :feeAmount, :paymentStatus, NOW(), NOW(), NOW())`,
                {
                    replacements: {
                        sid: studentId,
                        eventId: event_id,
                        regType: reg_type,
                        regStatus: reg_type === 'late' ? 'pending' : 'payment_pending',
                        feeAmount: fee_amount,
                        paymentStatus: payment_method === 'online' ? 'pending' : 'pending',
                    },
                    type: this.db.Sequelize.QueryTypes.INSERT,
                    transaction,
                }
            );

            const examRegIdValue = examRegId[0];

            // Insert selected subjects
            for (const subject of subjects) {
                await this.db.sequelize.query(
                    `INSERT INTO registration_subject 
           (exam_reg_id, mapping_id, subject_type, eligibility_status) 
           VALUES 
           (:examRegId, :mappingId, :subjectType, 'eligible')`,
                    {
                        replacements: {
                            examRegId: examRegIdValue,
                            mappingId: subject.mapping_id,
                            subjectType: subject.subject_type,
                        },
                        type: this.db.Sequelize.QueryTypes.INSERT,
                        transaction,
                    }
                );
            }

            await transaction.commit();

            return {
                exam_reg_id: examRegIdValue,
                registration_status: reg_type === 'late' ? 'pending_approval' : 'payment_pending',
                message: reg_type === 'late'
                    ? 'Late registration submitted for approval'
                    : 'Registration created successfully. Please complete payment.',
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    // Step 5: Generate receipt
    async generateReceipt(examRegId, studentId) {
        const [registration] = await this.db.sequelize.query(
            `SELECT 
        er.exam_reg_id,
        er.reg_type,
        er.reg_status,
        er.fee_amount,
        er.payment_status,
        er.payment_transaction_id,
        er.payment_date,
        er.registered_at,
        er.approved_at,
        ee.event_name,
        ee.exam_type,
        ee.reg_start,
        ee.reg_end,
        s.sid,
        spd.name as student_name,
        spd.contact,
        spd.email,
        p.program_name,
        b.branch_name
      FROM exam_registration er
      INNER JOIN exam_event ee ON ee.event_id = er.event_id
      INNER JOIN students s ON s.sid = er.sid
      INNER JOIN student_personaldetails spd ON spd.personal_id = s.personal_details_id
      INNER JOIN programm p ON p.programm_id = s.program_id
      INNER JOIN branch b ON b.branch_id = s.branch_id
      WHERE er.exam_reg_id = :examRegId AND er.sid = :studentId`,
            {
                replacements: { examRegId, studentId },
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
        sub.subject_code,
        sub.subject_name,
        sub.credits
      FROM registration_subject rs
      INNER JOIN semester_subject_mapping ssm ON ssm.mapping_id = rs.mapping_id
      INNER JOIN subject sub ON sub.subject_id = ssm.subject_id
      WHERE rs.exam_reg_id = :examRegId`,
            {
                replacements: { examRegId },
                type: this.db.Sequelize.QueryTypes.SELECT,
            }
        );

        // Generate receipt number
        const receiptNo = `RCPT/${new Date().getFullYear()}/${String(examRegId).padStart(6, '0')}`;

        return {
            receipt_no: receiptNo,
            registration: registration,
            subjects: subjects,
            generated_at: new Date(),
        };
    }

    // Get student's registration history
    async getRegistrationHistory(studentId, filters = {}) {
        let query = `
      SELECT 
        er.exam_reg_id,
        er.reg_type,
        er.reg_status,
        er.fee_amount,
        er.payment_status,
        er.registered_at,
        er.approved_at,
        ee.event_name,
        ee.exam_type,
        ee.reg_start,
        ee.reg_end,
        s.semester_number,
        s.term_type as term,
        COUNT(rs.reg_subj_id) as subject_count
      FROM exam_registration er
      INNER JOIN exam_event ee ON ee.event_id = er.event_id
      INNER JOIN semester s ON s.semester_id = ee.semester_id
      LEFT JOIN registration_subject rs ON rs.exam_reg_id = er.exam_reg_id
      WHERE er.sid = :studentId
    `;

        const replacements = { studentId };

        if (filters.event_id) {
            query += ` AND er.event_id = :eventId`;
            replacements.eventId = filters.event_id;
        }

        if (filters.reg_status) {
            query += ` AND er.reg_status = :regStatus`;
            replacements.regStatus = filters.reg_status;
        }

        query += ` GROUP BY er.exam_reg_id ORDER BY er.registered_at DESC`;

        const registrations = await this.db.sequelize.query(query, {
            replacements,
            type: this.db.Sequelize.QueryTypes.SELECT,
        });

        return registrations;
    }
}

module.exports = ExamRegistrationService;