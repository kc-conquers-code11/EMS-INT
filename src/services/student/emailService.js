const nodemailer = require('nodemailer'); // You'll need to install this

// Configure your email transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendOTPEmail = async (email, otp, purpose = 'student_registration') => {
    const subject = 'OTP for Student Registration';
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .otp { font-size: 32px; font-weight: bold; color: #2c3e50; padding: 20px; text-align: center; background: #f8f9fa; border-radius: 5px; letter-spacing: 5px; }
        .warning { color: #e74c3c; font-size: 14px; margin-top: 20px; }
        .footer { margin-top: 30px; font-size: 12px; color: #7f8c8d; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Student Registration OTP</h2>
        <p>Dear Student,</p>
        <p>Your OTP for ${purpose.replace('_', ' ')} is:</p>
        <div class="otp">${otp}</div>
        <p>This OTP is valid for <strong>10 minutes</strong>.</p>
        <div class="warning">
          <strong>⚠️ Security Alert:</strong> Never share this OTP with anyone, including anyone claiming to be from the institution.
        </div>
        <div class="footer">
          <p>If you didn't request this OTP, please ignore this email.</p>
          <p>© ${new Date().getFullYear()} Your Institution Name. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    const text = `Your OTP for ${purpose.replace('_', ' ')} is: ${otp}\nValid for 10 minutes.\nNever share this OTP with anyone.`;

    try {
        
        const info = await transporter.sendMail({
            from: `"Institution Name" <${process.env.EMAIL_FROM || 'noreply@institution.com'}>`,
            to: email,
            subject: subject,
            text: text,
            html: html,
        });
        console.log(info);
        console.log('Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send OTP email');
    }
};

const sendRegistrationConfirmation = async (email, name, uid) => {
    const subject = 'Student Registration Successful';
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .success { color: #27ae60; font-size: 24px; font-weight: bold; text-align: center; }
        .details { background: #ecf0f1; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { margin-top: 30px; font-size: 12px; color: #7f8c8d; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="success">✓ Registration Successful!</div>
        <h2>Welcome to Our Institution, ${name}!</h2>
        <p>Your student registration has been completed successfully.</p>
        <div class="details">
          <p><strong>Your Details:</strong></p>
          <p><strong>Student UID:</strong> ${uid}</p>
          <p><strong>Email:</strong> ${email}</p>
        </div>
        <p>You can now login to your student portal using your email and the password you set during registration.</p>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Your Institution Name. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    try {
        const info = await transporter.sendMail({
            from: `"Institution Name" <${process.env.EMAIL_FROM || 'noreply@institution.com'}>`,
            to: email,
            subject: subject,
            html: html,
        });
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        // Don't throw error for confirmation email - registration is already complete
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendOTPEmail,
    sendRegistrationConfirmation,
};