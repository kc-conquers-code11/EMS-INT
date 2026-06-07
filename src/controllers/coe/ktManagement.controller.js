const db = require('../../../models');
const { Op } = require('sequelize');

exports.runKTDetection = async (req, res) => {
    try {
        const { exam_event_id } = req.body;
        if (!exam_event_id) {
            return res.status(400).json({ success: false, message: 'exam_event_id is required' });
        }

        // 1. Fetch all registrations for this exam event
        const registrations = await db.exam_registration.findAll({
            where: { exam_event_id },
            include: [
                {
                    model: db.students,
                    as: 'sid_student',
                    attributes: ['PRN', 'sid']
                }
            ]
        });

        const ktEligibilityEntries = [];

        // 2. Scan marks and UFM cases for each registration
        for (const reg of registrations) {
            if (!reg.sid_student || !reg.sid_student.PRN) continue;

            const student_prn = reg.sid_student.PRN;
            const sid = reg.sid_student.sid;

            // Find all subjects for this registration
            const regSubjects = await db.registration_subject.findAll({
                where: { exam_reg_id: reg.exam_reg_id }
            });

            for (const rs of regSubjects) {
                // Get the mapping to find the subject
                const mapping = await db.semester_subject_mapping.findOne({
                    where: { mapping_id: rs.mapping_id }
                });

                if (!mapping) continue;

                const subject = await db.subject.findOne({
                    where: { subject_id: mapping.subject_id }
                });

                if (!subject) continue;

                // Check UFM (Copy Case) for this student and subject
                // copy_case is linked via timetable_id -> subject_id
                const ufmCases = await db.sequelize.query(`
                    SELECT cc.case_id 
                    FROM copy_case cc
                    JOIN timetable tt ON cc.timetable_id = tt.timetable_id
                    WHERE cc.sid = :sid AND tt.subject_id = :subject_id 
                      AND cc.case_status NOT IN ('DISMISSED', 'REJECTED')
                `, {
                    replacements: { sid, subject_id: subject.subject_id },
                    type: db.Sequelize.QueryTypes.SELECT
                });

                const hasUFM = ufmCases.length > 0;

                // Fetch locked marks entries
                const marks = await db.marks_entry.findAll({
                    where: { reg_subj_id: rs.reg_subj_id, is_locked: true }
                });

                for (const mark of marks) {
                    let isFail = false;
                    
                    if (hasUFM) {
                        isFail = true; // Auto fail due to UFM
                    } else {
                        // Compare against subject minimums
                        if (mark.component === 'THEORY' && subject.min_pass_theory && mark.marks_obtained < subject.min_pass_theory) isFail = true;
                        if (mark.component === 'PRACTICAL' && subject.min_pass_practical && mark.marks_obtained < subject.min_pass_practical) isFail = true;
                        if (mark.component === 'IA' && subject.min_pass_ia && mark.marks_obtained < subject.min_pass_ia) isFail = true;
                    }

                    if (isFail) {
                        // Check if KT eligibility already exists to avoid duplicates
                        const existing = await db.kt_eligibility.findOne({
                            where: {
                                student_prn,
                                original_exam_event_id: exam_event_id,
                                subject_mapping_id: rs.reg_subj_id,
                                failed_component: mark.component
                            }
                        });

                        if (!existing) {
                            ktEligibilityEntries.push({
                                student_prn,
                                original_exam_event_id: exam_event_id,
                                subject_mapping_id: rs.reg_subj_id,
                                failed_component: mark.component,
                                attempt_count: 1,
                                status: 'PENDING_REG'
                            });
                        }
                    }
                }
            }
        }

        if (ktEligibilityEntries.length > 0) {
            await db.kt_eligibility.bulkCreate(ktEligibilityEntries);
        }

        return res.status(200).json({ 
            success: true, 
            message: `KT Detection completed. Flagged ${ktEligibilityEntries.length} new KTs.` 
        });

    } catch (error) {
        console.error('Error running KT detection:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.getEligibilityRecords = async (req, res) => {
    try {
        const query = `
            SELECT 
                ke.id as kt_eligibility_id,
                ke.student_prn,
                ke.failed_component,
                ke.attempt_count,
                ke.status,
                s.first_name,
                s.last_name,
                sub.subject_name,
                sub.subject_code
            FROM kt_eligibility ke
            LEFT JOIN students s ON ke.student_prn = s.PRN
            LEFT JOIN registration_subject rs ON ke.subject_mapping_id = rs.reg_subj_id
            LEFT JOIN semester_subject_mapping ssm ON rs.mapping_id = ssm.mapping_id
            LEFT JOIN subject sub ON ssm.subject_id = sub.subject_id
            ORDER BY s.first_name ASC
        `;

        const records = await db.sequelize.query(query, {
            type: db.Sequelize.QueryTypes.SELECT
        });

        return res.status(200).json({ success: true, data: records });
    } catch (error) {
        console.error('Error fetching KT eligibility:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.getKTRegistrations = async (req, res) => {
    try {
        const { kt_exam_event_id } = req.query;
        let whereClause = '';
        const replacements = {};

        if (kt_exam_event_id) {
            whereClause = 'WHERE kr.kt_exam_event_id = :kt_exam_event_id';
            replacements.kt_exam_event_id = kt_exam_event_id;
        }

        const query = `
            SELECT 
                kr.id as kt_registration_id,
                kr.fee_status,
                kr.registration_status,
                ke.student_prn,
                ke.failed_component,
                s.first_name,
                s.last_name,
                sub.subject_name,
                sub.subject_code
            FROM kt_registration kr
            JOIN kt_eligibility ke ON kr.kt_eligibility_id = ke.id
            LEFT JOIN students s ON ke.student_prn = s.PRN
            LEFT JOIN registration_subject rs ON ke.subject_mapping_id = rs.reg_subj_id
            LEFT JOIN semester_subject_mapping ssm ON rs.mapping_id = ssm.mapping_id
            LEFT JOIN subject sub ON ssm.subject_id = sub.subject_id
            ${whereClause}
            ORDER BY kr.createdAt DESC
        `;

        const records = await db.sequelize.query(query, {
            replacements,
            type: db.Sequelize.QueryTypes.SELECT
        });

        return res.status(200).json({ success: true, data: records });
    } catch (error) {
        console.error('Error fetching KT registrations:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.evaluateYearDrops = async (req, res) => {
    try {
        const { academic_year } = req.body;
        if (!academic_year) {
            return res.status(400).json({ success: false, message: 'academic_year is required' });
        }

        // Count active KTs per student
        const activeKts = await db.kt_eligibility.findAll({
            where: { status: { [Op.in]: ['PENDING_REG', 'REGISTERED'] } },
            attributes: [
                'student_prn',
                [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'total_active_kts']
            ],
            group: ['student_prn']
        });

        const yearDrops = [];

        for (const kt of activeKts) {
            const count = parseInt(kt.dataValues.total_active_kts, 10);
            if (count > 5) {
                // Check if log already exists
                const existing = await db.year_drop_log.findOne({
                    where: { student_prn: kt.student_prn, academic_year }
                });

                if (!existing) {
                    yearDrops.push({
                        student_prn: kt.student_prn,
                        academic_year,
                        total_active_kts: count,
                        status: 'ACTIVE'
                    });
                } else if (existing.total_active_kts !== count) {
                    await existing.update({ total_active_kts: count });
                }
            }
        }

        if (yearDrops.length > 0) {
            await db.year_drop_log.bulkCreate(yearDrops);
        }

        return res.status(200).json({ 
            success: true, 
            message: `Year Drop evaluation complete. Identified ${yearDrops.length} new year drops.`,
            data: yearDrops 
        });

    } catch (error) {
        console.error('Error evaluating year drops:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
