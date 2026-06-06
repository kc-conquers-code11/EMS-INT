// controllers/studentcontroller/examRegistrationController.js
const { ZodError } = require('zod');
const ExamRegistrationService = require('../../services/exam/examRegistration.service.js');
const db = require('../../../models');
const {
    getExamEventsSchema,
    selectRegistrationTypeSchema,
    selectSubjectsSchema,
    validateFeeSchema,
    confirmRegistrationSchema,
    generateReceiptSchema,
    getRegistrationStatusSchema,
    getRegistrationDetailsSchema,
} = require('../../validations/exam/examRegistration.validation.js');

// Step 1: Get available exam events
const getAvailableEvents = async (req, res) => {
    try {
        const filters = getExamEventsSchema.parse(req.query);
        const studentId = req.user.student_id; // From auth middleware

        const examService = new ExamRegistrationService(db);
        const events = await examService.getAvailableExamEvents(studentId, filters);

        res.status(200).json({
            success: true,
            data: events,
            count: events.length,
            message: 'Exam events retrieved successfully',
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors,
            });
        }
        console.error('Error in getAvailableEvents:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Step 2: Select registration type and get eligible subjects
const getEligibleSubjects = async (req, res) => {
    try {
        const { event_id, reg_type } = selectRegistrationTypeSchema.parse(req.body);
        const studentId = req.user.student_id;

        const examService = new ExamRegistrationService(db);
        const eligibleData = await examService.getEligibleSubjects(studentId, event_id, reg_type);

        res.status(200).json({
            success: true,
            data: {
                student: eligibleData.student,
                event: eligibleData.event,
                subjects: eligibleData.subjects,
                total_fee: eligibleData.total_fee,
            },
            message: 'Eligible subjects retrieved successfully',
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors,
            });
        }
        console.error('Error in getEligibleSubjects:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Step 3: Select subjects and calculate fee
const calculateFee = async (req, res) => {
    try {
        console.log('calculateFee payload:', JSON.stringify(req.body, null, 2));
        const { event_id, reg_type, subjects } = validateFeeSchema.parse(req.body);
        const studentId = req.user.student_id;

        const examService = new ExamRegistrationService(db);
        const feeCalculation = await examService.calculateFee(studentId, event_id, reg_type, subjects);

        res.status(200).json({
            success: true,
            data: feeCalculation,
            message: 'Fee calculated successfully',
        });
    } catch (error) {
        if (error instanceof ZodError) {
            console.error('Validation error details:', error.issues || error.errors);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.issues || error.errors || error,
            });
        }
        console.error('Error in calculateFee:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Step 4: Confirm and create registration
const confirmRegistration = async (req, res) => {
    try {
        const registrationData = confirmRegistrationSchema.parse(req.body);
        const studentId = req.user.student_id;
        const userId = req.user.uid;

        const examService = new ExamRegistrationService(db);
        const result = await examService.createRegistration(studentId, userId, registrationData);

        res.status(201).json({
            success: true,
            data: result,
            message: result.message,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors,
            });
        }
        console.error('Error in confirmRegistration:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Step 5: Generate receipt
const generateReceipt = async (req, res) => {
    try {
        const { exam_reg_id } = generateReceiptSchema.parse(req.params);
        const studentId = req.user.student_id;

        const examService = new ExamRegistrationService(db);
        const receipt = await examService.generateReceipt(exam_reg_id, studentId);

        res.status(200).json({
            success: true,
            data: receipt,
            message: 'Receipt generated successfully',
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors,
            });
        }
        console.error('Error in generateReceipt:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Get registration history
const getRegistrationHistory = async (req, res) => {
    try {
        const filters = getRegistrationStatusSchema.parse(req.query);
        const studentId = req.user.student_id;

        const examService = new ExamRegistrationService(db);
        const history = await examService.getRegistrationHistory(studentId, filters);

        res.status(200).json({
            success: true,
            data: history,
            count: history.length,
            message: 'Registration history retrieved successfully',
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors,
            });
        }
        console.error('Error in getRegistrationHistory:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Get single registration details
const getRegistrationDetails = async (req, res) => {
    try {
        const { exam_reg_id } = getRegistrationDetailsSchema.parse(req.params);
        const studentId = req.user.student_id;

        const [registration] = await db.sequelize.query(
            `SELECT 
        er.*,
        ee.event_name,
        ee.exam_type,
        ee.reg_start,
        ee.reg_end,
        s.semester_number,
        s.term_type as term
      FROM exam_registration er
      INNER JOIN exam_event ee ON ee.event_id = er.event_id
      INNER JOIN semester s ON s.semester_id = ee.semester_id
      WHERE er.exam_reg_id = :examRegId AND er.sid = :studentId`,
            {
                replacements: { examRegId: exam_reg_id, studentId },
                type: db.Sequelize.QueryTypes.SELECT,
            }
        );

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found',
            });
        }

        // Get subjects
        const subjects = await db.sequelize.query(
            `SELECT 
        rs.reg_subj_id,
        rs.subject_type,
        rs.eligibility_status,
        sub.subject_code,
        sub.subject_name,
        sub.credits
      FROM registration_subject rs
      INNER JOIN semester_subject_mapping ssm ON ssm.mapping_id = rs.mapping_id
      INNER JOIN subject sub ON sub.subject_id = ssm.subject_id
      WHERE rs.exam_reg_id = :examRegId`,
            {
                replacements: { examRegId: exam_reg_id },
                type: db.Sequelize.QueryTypes.SELECT,
            }
        );

        res.status(200).json({
            success: true,
            data: {
                registration,
                subjects,
            },
            message: 'Registration details retrieved successfully',
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors,
            });
        }
        console.error('Error in getRegistrationDetails:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

module.exports = {
    getAvailableEvents,
    getEligibleSubjects,
    calculateFee,
    confirmRegistration,
    generateReceipt,
    getRegistrationHistory,
    getRegistrationDetails,
};