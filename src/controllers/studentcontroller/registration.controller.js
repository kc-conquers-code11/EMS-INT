// controllers/studentcontroller/registrationController.js
const { ZodError } = require('zod');
const { v4: uuidv4 } = require('uuid');
const db = require('../../../models');
const OTPService = require('../../services/student/otpService.js');
const RegistrationService = require('../../services/student/registrationService.js');
const { sendOTPEmail, sendRegistrationConfirmation } = require('../../services/student/emailService.js');
const { generateTempToken } = require('../../middlewares/tempTokenAuth.middleware.js');
const {
    requestOTPSchema,
    verifyOTPSchema,
    registerStudentSchema,
    confirmRegistrationSchema,
} = require('../../validations/Student/studentRegistration.validation.js');
const registrationService = new RegistrationService(db);
// Step 1: Request OTP
const requestOTP = async (req, res) => {
    try {
        const { email } = requestOTPSchema.parse(req.body);

        // Initialize services
        const otpService = new OTPService(db);
        const registrationService = new RegistrationService(db);

        // Check if email already exists
        const emailExists = await registrationService.checkEmailExists(email);
        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: 'Email is already registered. Please use a different email or login.',
            });
        }

        // Check rate limiting
        const rateLimitCheck = await otpService.checkRateLimit(
            email,
            'student_registration',
            60, // 60 minutes
            3   // 3 requests per hour
        );

        if (!rateLimitCheck.allowed) {
            return res.status(429).json({
                success: false,
                message: rateLimitCheck.message,
            });
        }

        // Generate OTP
        const otp = otpService.generateOTP();
        console.log(`OTP for ${email}: ${otp}`); // For testing - remove in production

        // Store OTP in database
        await otpService.storeOTP({
            email: email,
            purpose: 'student_registration',
            otp: otp,
            uid: null,
        });

        // Send OTP via email
        await sendOTPEmail(email, otp, 'student_registration');

        // Mask email for response
        const emailMasked = email.replace(/(.{2})(.*)(?=@)/, (match, p1, p2) => {
            return p1 + '*'.repeat(Math.min(p2.length, 4));
        });

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully to your email',
            email_masked: emailMasked,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors,
            });
        }

        console.error('Error in requestOTP:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Step 2: Verify OTP
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = verifyOTPSchema.parse(req.body);

        // Initialize OTP service
        const otpService = new OTPService(db);

        // Validate OTP
        const validationResult = await otpService.validateOTP({
            email: email,
            purpose: 'student_registration',
            otp: otp,
        });

        if (!validationResult.valid) {
            return res.status(400).json({
                success: false,
                message: validationResult.message,
            });
        }

        // Generate temporary token for registration
        const tempToken = generateTempToken(email);

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
            temp_token: tempToken,
            expires_in: 600, // 10 minutes in seconds
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors,
            });
        }

        console.error('Error in verifyOTP:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Step 3: Complete Registration (Create User & Student)
const register = async (req, res) => {
    try {
        // Get email from temp token (set by tempTokenAuth middleware)
        const { email } = req.tempTokenData;

        // Validate registration data
        const registrationData = registerStudentSchema.parse(req.body);

        // Verify that email in request body matches temp token email
        if (registrationData.email !== email) {
            return res.status(400).json({
                success: false,
                message: 'Email mismatch. Please use the same email that was verified.',
            });
        }

        // Initialize registration service
        const registrationService = new RegistrationService(db);

        // Check email again (in case someone else registered in between)
        const emailExists = await registrationService.checkEmailExists(email);
        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: 'Email is already registered. Please use a different email.',
            });
        }

        // Create user and student records
        const result = await registrationService.createUserAndStudent(
            registrationData,
            req.tempTokenData
        );

        // Initialize OTP service to mark OTP as used
        const otpService = new OTPService(db);

        // Find and mark OTP as used
        const [otpRecord] = await db.sequelize.query(
            `SELECT * FROM otp_log 
             WHERE email = :email 
             AND purpose = 'student_registration' 
             AND is_used = false 
             ORDER BY createdAt DESC 
             LIMIT 1`,
            {
                replacements: { email: email },
                type: db.Sequelize.QueryTypes.SELECT,
            }
        );

        if (otpRecord) {
            await otpService.markOTPAsUsed(otpRecord);
        }

        // Get student details for confirmation email
        const [studentData] = await db.sequelize.query(
            `SELECT 
                u.uid, 
                u.email,
                s.sid,
                spd.name,
                spd.first_name,
                spd.last_name
            FROM users u
            LEFT JOIN students s ON s.uid = u.uid
            LEFT JOIN student_personaldetails spd ON spd.personal_id = s.personal_details_id
            WHERE u.uid = :uid`,
            {
                replacements: { uid: result.user.uid },
                type: db.Sequelize.QueryTypes.SELECT,
            }
        );

        const studentName = studentData?.name || studentData?.first_name || 'Student';

        // Send confirmation email
        await sendRegistrationConfirmation(email, studentName, result.user.uid);

        // Generate JWT token for login
        const jwt = require('jsonwebtoken');
        const crypto = require('crypto');
        const authToken = jwt.sign(
            { uid: result.user.uid, email: result.user.email, user_type: result.user.user_type },
            process.env.JWT_SECRET || 'your_jwt_secret_key',
            { expiresIn: '7d' }
        );

        // Store token in database for session validation
        const tokenHash = crypto.createHash('sha256').update(authToken).digest('hex');
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await db.sequelize.query(
            `INSERT INTO user_auth_token (auth_id, token, token_hash, expires_at, user_type, uid, createdAt, updatedAt)
             VALUES (:auth_id, :token, :token_hash, :expires_at, :user_type, :uid, NOW(), NOW())`,
            {
                replacements: {
                    auth_id: require('uuid').v4(),
                    token: authToken,
                    token_hash: tokenHash,
                    expires_at: expiresAt,
                    user_type: result.user.user_type,
                    uid: result.user.uid,
                },
                type: db.Sequelize.QueryTypes.INSERT,
            }
        );

        res.status(201).json({
            success: true,
            message: 'Registration completed successfully',
            token: authToken,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            uid: result.user.uid,
            user: {
                uid: result.user.uid,
                email: result.user.email,
                user_type: result.user.user_type,
            },
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors,
            });
        }

        console.error('Error in register:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Step 4: Confirm Registration
const confirmRegistration = async (req, res) => {
    try {
        const { email } = req.tempTokenData;

        // Validate (empty schema, just for consistency)
        confirmRegistrationSchema.parse(req.body);

        // Initialize services
        const otpService = new OTPService(db);

        // Find the user that was just created using raw SQL
        const [user] = await db.sequelize.query(
            `SELECT uid, email, user_type FROM users WHERE email = :email`,
            {
                replacements: { email: email },
                type: db.Sequelize.QueryTypes.SELECT,
            }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found. Please complete registration first.',
            });
        }

        // Mark OTP as used
        const [otpRecord] = await db.sequelize.query(
            `SELECT * FROM otp_log 
       WHERE email = :email 
         AND purpose = 'student_registration' 
         AND is_used = false 
       ORDER BY createdAt DESC 
       LIMIT 1`,
            {
                replacements: { email: email },
                type: db.Sequelize.QueryTypes.SELECT,
            }
        );

        if (otpRecord) {
            await otpService.markOTPAsUsed(otpRecord);
        }

        // Get student details using raw SQL with joins
        const [studentData] = await db.sequelize.query(
            `SELECT 
        u.uid, 
        u.email,
        s.sid,
        spd.name,
        spd.first_name,
        spd.last_name
      FROM users u
      LEFT JOIN students s ON s.uid = u.uid
      LEFT JOIN student_personaldetails spd ON spd.personal_id = s.personal_details_id
      WHERE u.uid = :uid`,
            {
                replacements: { uid: user.uid },
                type: db.Sequelize.QueryTypes.SELECT,
            }
        );

        const studentName = studentData?.name || studentData?.first_name || 'Student';

        // Send confirmation email
        await sendRegistrationConfirmation(email, studentName, user.uid);

        // Generate JWT token for login
        const jwt = require('jsonwebtoken');
        const authToken = jwt.sign(
            { uid: user.uid, email: user.email, user_type: user.user_type },
            process.env.JWT_SECRET || 'your_jwt_secret_key',
            { expiresIn: '7d' }
        );

        res.status(200).json({
            success: true,
            message: 'Registration completed successfully',
            token: authToken,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            uid: user.uid,
            user: {
                uid: user.uid,
                email: user.email,
                user_type: user.user_type,
            },
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

// Check registration status (optional)
const getRegistrationStatus = async (req, res) => {
    try {
        const { email } = req.tempTokenData;

        // Check if user exists
        const [users] = await db.sequelize.query(
            `SELECT uid FROM users WHERE email = :email`,
            {
                replacements: { email: email },
                type: db.Sequelize.QueryTypes.SELECT,
            }
        );

        if (users) {
            return res.status(200).json({
                success: true,
                registration_status: 'completed',
                completed_steps: 4,
                message: 'Registration already completed',
            });
        }

        // Check if OTP is verified
        const [otpRecord] = await db.sequelize.query(
            `SELECT * FROM otp_log 
             WHERE email = :email 
             AND purpose = 'student_registration' 
             AND is_used = false 
             AND expires_at > NOW()`,
            {
                replacements: { email: email },
                type: db.Sequelize.QueryTypes.SELECT,
            }
        );

        if (otpRecord && !otpRecord.is_used) {
            return res.status(200).json({
                success: true,
                registration_status: 'otp_verified',
                completed_steps: 2,
                message: 'OTP verified. Ready for registration.',
            });
        }

        res.status(200).json({
            success: true,
            registration_status: 'not_started',
            completed_steps: 0,
            message: 'No registration in progress',
        });
    } catch (error) {
        console.error('Error in getRegistrationStatus:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

module.exports = {
    requestOTP,
    verifyOTP,
    register,
    confirmRegistration,
    getRegistrationStatus,
};