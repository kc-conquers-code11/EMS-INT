// src/services/email.service.js
const nodemailer = require('nodemailer');

const getSmtpConfig = () => {
  const port = parseInt(
    process.env.SMTP_PORT || process.env.EMAIL_PORT || '587',
    10
  );
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const host =
    process.env.SMTP_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com';

  return {
    host,
    port,
    secure: port === 465 || process.env.SMTP_SECURE === 'true',
    auth: user && pass ? { user, pass } : undefined,
    user,
  };
};

const getFromAddress = () => {
  const { user } = getSmtpConfig();
  const configuredFrom =
    process.env.SMTP_FROM || process.env.EMAIL_FROM || user;
  // Gmail (and most SMTP) require the From address to match the authenticated user.
  if (user && configuredFrom && configuredFrom !== user) {
    return `"EMS - Exam Management System" <${user}>`;
  }
  return `"EMS - Exam Management System" <${configuredFrom || user}>`;
};

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const cfg = getSmtpConfig();
  if (!cfg.auth?.user || !cfg.auth?.pass) {
    throw new Error(
      'Email is not configured. Set SMTP_USER/SMTP_PASS (or EMAIL_USER/EMAIL_PASS) in EMS-Backend/.env'
    );
  }

  transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: cfg.auth,
  });

  return transporter;
};

const verifyEmailTransport = async () => {
  try {
    const t = getTransporter();
    await t.verify();
    const { user, host, port } = getSmtpConfig();
    console.log(`✅ Email (SMTP) ready — ${user} via ${host}:${port}`);
    return true;
  } catch (error) {
    console.error(
      '⚠️ Email (SMTP) not configured or verification failed:',
      error.message
    );
    console.error(
      '   Registration emails will fail until SMTP_USER/SMTP_PASS are set (use a Gmail App Password if using Gmail).'
    );
    return false;
  }
};

const loginUrl = () => process.env.CLIENT_URL || 'http://localhost:5173';

const buildAccountCreationHtml = ({
  name,
  roleTitle,
  roleDescription,
  institutionName,
  departmentName,
  employeeId,
  email,
  password,
  extraLines = [],
}) => {
  const deptBlock = departmentName
    ? `<p>Department: <strong>${departmentName}</strong></p>`
    : '';
  const extraBlock = extraLines.map((line) => `<p>${line}</p>`).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: Arial, sans-serif; background: #f4f6fb; margin: 0; padding: 0; }
        .wrapper { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
        .header { background: #0e1680; padding: 32px 40px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 22px; letter-spacing: 0.5px; }
        .body { padding: 36px 40px; }
        .body h2 { color: #0e1680; font-size: 18px; margin-top: 0; }
        .body p { color: #444; line-height: 1.6; }
        .credentials { background: #f0f2ff; border-left: 4px solid #0e1680; border-radius: 6px; padding: 16px 24px; margin: 24px 0; }
        .credentials p { margin: 6px 0; font-size: 15px; }
        .credentials strong { color: #0e1680; }
        .credentials code { background: #dde0f7; padding: 2px 8px; border-radius: 4px; font-size: 14px; font-family: monospace; letter-spacing: 0.5px; }
        .btn { display: inline-block; margin-top: 24px; padding: 12px 32px; background: #0e1680; color: #fff; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: bold; }
        .footer { background: #f4f6fb; padding: 20px 40px; text-align: center; font-size: 12px; color: #888; }
        .warning { background: #fff8e1; border-left: 4px solid #f59e0b; border-radius: 6px; padding: 12px 20px; margin-top: 20px; font-size: 13px; color: #7a5800; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1>🎓 Exam Management System</h1>
        </div>
        <div class="body">
          <h2>Welcome, ${name}!</h2>
          <p>Your <strong>${roleTitle}</strong> account has been successfully registered for <strong>${institutionName}</strong>. ${roleDescription}</p>
          ${deptBlock}
          ${extraBlock}

          <div class="credentials">
            <p><strong>Employee ID:</strong> ${employeeId}</p>
            <p><strong>Email (Login):</strong> ${email}</p>
            <p><strong>Temporary Password:</strong> <code>${password}</code></p>
          </div>

          <a href="${loginUrl()}" class="btn">Login to EMS Portal →</a>

          <div class="warning">
            ⚠️ For security, you may be prompted to change your password on first login. Please do not share your credentials with anyone.
          </div>

          <p style="margin-top: 28px;">If you did not expect this email or have any questions, please contact your system administrator.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Exam Management System. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};

const buildAccountCreationText = ({
  name,
  roleTitle,
  institutionName,
  departmentName,
  employeeId,
  email,
  password,
}) => {
  const lines = [
    `Welcome, ${name}!`,
    '',
    `Your ${roleTitle} account has been registered for ${institutionName}.`,
  ];
  if (departmentName) lines.push(`Department: ${departmentName}`);
  lines.push(
    '',
    'Login credentials:',
    `Employee ID: ${employeeId}`,
    `Email: ${email}`,
    `Temporary password: ${password}`,
    '',
    `Login: ${loginUrl()}`,
    '',
    'Please change your password after first login. If you did not expect this email, contact your administrator.'
  );
  return lines.join('\n');
};

const normalizeRecipient = (email) => {
  const trimmed = String(email || '').trim();
  if (!trimmed || !trimmed.includes('@')) {
    throw new Error(`Invalid recipient email: "${email}"`);
  }
  return trimmed;
};

const sendMailSafe = async (mailOptions) => {
  const to = normalizeRecipient(mailOptions.to);
  const transport = getTransporter();
  const { user } = getSmtpConfig();

  const info = await transport.sendMail({
    from: getFromAddress(),
    replyTo: user,
    ...mailOptions,
    to,
  });

  const result = {
    to,
    messageId: info.messageId,
    accepted: info.accepted || [],
    rejected: info.rejected || [],
    ok: !(info.rejected && info.rejected.length > 0),
  };

  if (result.ok) {
    console.log(
      `📧 Email sent to ${to} (messageId: ${result.messageId || 'n/a'})`
    );
  } else {
    console.error(`📧 Email rejected for ${to}:`, info.rejected);
  }

  return result;
};

const sendCOEAccountCreationEmail = async ({
  email,
  name,
  employeeId,
  password,
  institutionName,
}) => {
  const html = buildAccountCreationHtml({
    name,
    roleTitle: 'Controller of Examinations (COE)',
    roleDescription:
      'You can now log in to the EMS portal using the credentials below.',
    institutionName,
    departmentName: null,
    employeeId,
    email,
    password,
  });

  const text = buildAccountCreationText({
    name,
    roleTitle: 'Controller of Examinations (COE)',
    institutionName,
    departmentName: null,
    employeeId,
    email,
    password,
  });

  return sendMailSafe({
    to: email,
    subject: `Your COE Account Credentials – ${institutionName}`,
    html,
    text,
  });
};

const sendHODAccountCreationEmail = async ({
  email,
  name,
  employeeId,
  password,
  institutionName,
  departmentName,
}) => {
  const html = buildAccountCreationHtml({
    name,
    roleTitle: 'Head of Department (HOD)',
    roleDescription:
      'You can now log in to the EMS portal to manage your department using the credentials below.',
    institutionName,
    departmentName,
    employeeId,
    email,
    password,
  });

  const text = buildAccountCreationText({
    name,
    roleTitle: 'Head of Department (HOD)',
    institutionName,
    departmentName,
    employeeId,
    email,
    password,
  });

  return sendMailSafe({
    to: email,
    subject: `Your HOD Account Credentials – ${departmentName}`,
    html,
    text,
  });
};

const sendFacultyAccountCreationEmail = async ({
  email,
  name,
  employeeId,
  password,
  institutionName,
  departmentName,
  designation,
}) => {
  const extraLines = designation
    ? [`Designation: <strong>${designation}</strong>`]
    : [];

  const html = buildAccountCreationHtml({
    name,
    roleTitle: 'Faculty',
    roleDescription:
      'Your faculty account has been created. You can log in to the EMS portal using the credentials below.',
    institutionName,
    departmentName,
    employeeId: employeeId || '—',
    email,
    password,
    extraLines,
  });

  const text = buildAccountCreationText({
    name,
    roleTitle: 'Faculty',
    institutionName,
    departmentName,
    employeeId: employeeId || '—',
    email,
    password,
  });

  return sendMailSafe({
    to: email,
    subject: `Your Faculty Account Credentials – ${departmentName}`,
    html,
    text,
  });
};

/**
 * Send registration emails after department setup (HOD + faculty).
 * Returns delivery summary for API/UI (does not throw on individual failures).
 */
const sendDepartmentRegistrationEmails = async ({
  hodCredential,
  facultyCredentials = [],
  institutionName,
  departmentName,
}) => {
  const sent = [];
  const failed = [];

  const recordResult = (role, email, result, error = null) => {
    if (error) {
      failed.push({
        role,
        email: email || 'unknown',
        error: error.message || String(error),
      });
      console.error(`Error sending ${role} registration email (${email}):`, error);
      return;
    }
    if (result?.ok) {
      sent.push({ role, email: result.to, messageId: result.messageId });
    } else {
      failed.push({
        role,
        email: result?.to || email,
        error: 'Message was rejected by the mail server',
      });
    }
  };

  if (hodCredential?.email && hodCredential?.password) {
    try {
      const result = await sendHODAccountCreationEmail({
        ...hodCredential,
        institutionName,
        departmentName,
      });
      recordResult('HOD', hodCredential.email, result);
    } catch (error) {
      recordResult('HOD', hodCredential.email, null, error);
    }
  } else if (hodCredential?.email) {
    failed.push({
      role: 'HOD',
      email: hodCredential.email,
      error: 'Missing temporary password for email',
    });
  }

  for (const faculty of facultyCredentials) {
    if (!faculty?.email || !faculty?.password) {
      if (faculty?.email) {
        failed.push({
          role: 'Faculty',
          email: faculty.email,
          error: 'Missing temporary password for email',
        });
      }
      continue;
    }
    try {
      const result = await sendFacultyAccountCreationEmail({
        ...faculty,
        institutionName,
        departmentName,
      });
      recordResult('Faculty', faculty.email, result);
    } catch (error) {
      recordResult('Faculty', faculty.email, null, error);
    }
  }

  return { sent, failed };
};

module.exports = {
  sendCOEAccountCreationEmail,
  sendHODAccountCreationEmail,
  sendFacultyAccountCreationEmail,
  sendDepartmentRegistrationEmails,
  verifyEmailTransport,
  getTransporter,
};
