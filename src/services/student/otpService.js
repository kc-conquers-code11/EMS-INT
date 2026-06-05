// services/student/otpService.js
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

class OTPService {
    constructor(db) {
        this.db = db;
    }

    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async hashOTP(otp) {
        return await bcrypt.hash(otp, 10);
    }

    async verifyOTP(plainOTP, hashedOTP) {
        return await bcrypt.compare(plainOTP, hashedOTP);
    }

    async storeOTP({ email, purpose, otp, uid = null }) {
        const hashedOTP = await this.hashOTP(otp);
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);

        // Invalidate any previous unused OTPs for this email and purpose
        await this.db.sequelize.query(
            `UPDATE otp_log 
       SET is_used = true 
       WHERE email = :email 
         AND purpose = :purpose 
         AND is_used = false 
         AND expires_at > NOW()`,
            {
                replacements: { email, purpose },
                type: this.db.Sequelize.QueryTypes.UPDATE,
            }
        );

        // Store new OTP
        const [result] = await this.db.sequelize.query(
            `INSERT INTO otp_log 
       (uid, email, purpose, otp_hash, expires_at, is_used, attempts, createdAt, updatedAt) 
       VALUES 
       (:uid, :email, :purpose, :otp_hash, :expires_at, :is_used, :attempts, NOW(), NOW())`,
            {
                replacements: {
                    uid: uid,
                    email: email,
                    purpose: purpose,
                    otp_hash: hashedOTP,
                    expires_at: expiresAt,
                    is_used: false,
                    attempts: 0,
                },
                type: this.db.Sequelize.QueryTypes.INSERT,
            }
        );

        // Fetch the created record
        const [otpRecord] = await this.db.sequelize.query(
            `SELECT * FROM otp_log WHERE email = :email AND purpose = :purpose ORDER BY createdAt DESC LIMIT 1`,
            {
                replacements: { email, purpose },
                type: this.db.Sequelize.QueryTypes.SELECT,
            }
        );

        return otpRecord;
    }

    async validateOTP({ email, purpose, otp }) {
        // Find the latest unused, non-expired OTP
        const otpRecord = await this.db.sequelize.query(
            `SELECT * FROM otp_log 
       WHERE email = :email 
         AND purpose = :purpose 
         AND is_used = false 
         AND expires_at > NOW() 
       ORDER BY createdAt DESC 
       LIMIT 1`,
            {
                replacements: { email, purpose },
                type: this.db.Sequelize.QueryTypes.SELECT,
            }
        );

        if (!otpRecord || otpRecord.length === 0) {
            return { valid: false, message: 'OTP not found or expired' };
        }

        const record = otpRecord[0];

        // Check attempts limit
        if (record.attempts >= 5) {
            return { valid: false, message: 'Maximum OTP attempts exceeded. Please request a new OTP.' };
        }

        // Verify OTP
        const isValid = await this.verifyOTP(otp, record.otp_hash);

        if (!isValid) {
            // Increment attempts
            await this.db.sequelize.query(
                `UPDATE otp_log SET attempts = attempts + 1 WHERE otp_id = :otp_id`,
                {
                    replacements: { otp_id: record.otp_id },
                    type: this.db.Sequelize.QueryTypes.UPDATE,
                }
            );

            const remainingAttempts = 5 - (record.attempts + 1);
            return {
                valid: false,
                message: `Invalid OTP. ${remainingAttempts} attempts remaining.`,
            };
        }

        return { valid: true, otpRecord: record };
    }

    async markOTPAsUsed(otpRecord) {
        await this.db.sequelize.query(
            `UPDATE otp_log SET is_used = true WHERE otp_id = :otp_id`,
            {
                replacements: { otp_id: otpRecord.otp_id },
                type: this.db.Sequelize.QueryTypes.UPDATE,
            }
        );
    }

    async checkRateLimit(email, purpose, limitMinutes = 60, maxRequests = 3) {
        const [result] = await this.db.sequelize.query(
            `SELECT COUNT(*) as count FROM otp_log 
       WHERE email = :email 
         AND purpose = :purpose 
         AND createdAt > DATE_SUB(NOW(), INTERVAL :limitMinutes MINUTE)`,
            {
                replacements: { email, purpose, limitMinutes },
                type: this.db.Sequelize.QueryTypes.SELECT,
            }
        );

        if (result.count >= maxRequests) {
            return {
                allowed: false,
                message: `Too many OTP requests. Please try again after ${limitMinutes} minutes.`,
            };
        }

        return { allowed: true };
    }
}

module.exports = OTPService;