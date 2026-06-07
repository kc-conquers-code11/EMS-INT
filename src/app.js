// app.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const institutionRoutes = require('./routes/masterRoutes/institution.routes.js');
const coeRoutes = require('./routes/masterRoutes/coe.routes.js');
const departmentRoutes = require('./routes/masterRoutes/department.routes.js');
const academic_yearRoutes = require('./routes/masterRoutes/academic_year.routes.js');
const schemesRoutes = require('./routes/masterRoutes/schemes.routes.js');
const programmeRoutes = require('./routes/programme/programme.route.js');
const branchRoutes = require('./routes/programme/branch.route.js');
const authRoutes = require('./routes/auth/auth.route.js');
const userPermissionsRoutes = require('./routes/auth/user_permissions.route.js');
const adminStudentRoutes = require('./routes/admin/student.route.js');
const { verifyToken } = require('./middlewares/auth.middleware.js');
const subjectRoutes = require('./routes/programme/subject.routes.js');
const semesterRoutes = require('./routes/semester/semester.route.js');
const subjectTypeRoutes = require('./routes/programme/subjectType.routes.js');
const examPatternRoutes = require('./routes/exam/examPattern.route.js');
const examEventsRoutes = require('./routes/exam/examEvents.route.js');
const examFeesRoutes = require('./routes/exam/examFees/examFees.route.js');
const paymentRoutes = require('./routes/payment/payment.route.js');
const registration_routes = require('./routes/student/registration.route.js');
const examRegistrationRoutes = require('./routes/exam/examRegistration.route.js');
const examApprovalRoutes = require('./routes/admin/examApproval.route.js');
const timetableRoutes = require('./routes/timeTable/timetable.routes.js');
const timeSlotRoutes = require('./routes/timeTable/timeSlot.routes.js');
const subjectMappingRoutes = require('./routes/programme/subjectMapping.routes.js');
const facultySubjectMappingRoutes = require('./routes/programme/facultySubjectMapping.routes.js');

const hallTicketRoutes = require('./routes/hall_ticket/hallTicket.route.js');

const allocationRoutes = require('./routes/allocation/allocation.route');
const examExecutionRoutes = require('./routes/faculty/examExecution.route.js');
const marksEntryRoutes = require('./routes/faculty/marksEntry.route.js');
const revaluationRoutes = require('./routes/faculty/revaluation.route.js');
const analyticsRoutes = require('./routes/faculty/analytics.route.js');
const hodApprovalRoutes = require('./routes/hod/hodApproval.route.js');
const copyCaseProcessRoutes = require('./routes/coe/copyCaseProcess.route.js');

const studentRevalRoutes = require('./routes/student/reval.route.js');
const postExamRoutes = require('./routes/student/postExam.route.js');
const coeRevalAssignmentRoutes = require('./routes/coe/revalAssignment.route.js');
const paperSetRoutes = require('./routes/exam/paperSet.route.js');
const ktManagementRoutes = require('./routes/coe/ktManagement.route.js');

const programmeOutcomeRoutes = require('./routes/masterRoutes/programmeOutcome.routes.js');
const courseOutcomeRoutes = require('./routes/programme/courseOutcome.routes.js');
const coPoMappingRoutes = require('./routes/programme/coPoMapping.routes.js');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(cookieParser());
// Department setup may include base64 profile photos for HOD + faculty
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ===========================================================================
// OPEN ROUTES ===============================================================
// ===========================================================================

app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});

app.use('/api/v1/registration', registration_routes);
app.use('/api/v1/exam-registration', examRegistrationRoutes);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user-permissions', userPermissionsRoutes);
app.use('/api/v1/exam/paper-set', paperSetRoutes);
app.use('/api/v1/user-permissions', userPermissionsRoutes);

// ===========================================================================
// RESTRICTED ROUTES ==================== ADMIN + ROLES ======================
// ===========================================================================

app.use(verifyToken);
app.use('/api/v1/institutions', institutionRoutes);
app.use('/api/v1/coe', coeRoutes);
app.use('/api/v1/academic-years', academic_yearRoutes);


app.use('/api/v1/departments', departmentRoutes);
app.use('/api/v1/schemes', schemesRoutes);
app.use('/api/v1/programme', programmeRoutes);
app.use('/api/v1/subjects', subjectRoutes);

app.use('/api/v1/branch', branchRoutes);
app.use('/api/v1/semesters', semesterRoutes);
app.use('/api/v1/subject-types', subjectTypeRoutes);
app.use('/api/v1/exam-fees', examFeesRoutes);
app.use('/api/v1/exam-events', examEventsRoutes);
app.use('/api/v1/admin/students', adminStudentRoutes);
app.use('/api/v1/exam-patterns', examPatternRoutes);
app.use('/api/v1/examApproval', examApprovalRoutes);
app.use('/api/v1/payments', paymentRoutes);

app.use('/api/v1/subject-mappings', subjectMappingRoutes);
app.use('/api/v1/faculty-subject-mappings', facultySubjectMappingRoutes);
app.use('/api/v1/time-slots', timeSlotRoutes);
app.use('/api/v1/timetable', timetableRoutes);

app.use('/api/v1/programme-outcomes', programmeOutcomeRoutes);
app.use('/api/v1/course-outcomes', courseOutcomeRoutes);
app.use('/api/v1/co-po-mappings', coPoMappingRoutes);

app.use('/api/v1/hall-ticket', hallTicketRoutes);

app.use('/api/v1/allocate', allocationRoutes);
app.use('/api/v1/faculty/exam-execution', examExecutionRoutes);
app.use('/api/v1/faculty/marks-entry', marksEntryRoutes);
app.use('/api/v1/faculty/revaluation', revaluationRoutes);
app.use('/api/v1/faculty/analytics', analyticsRoutes);
app.use('/api/v1/hod/approval', hodApprovalRoutes);
app.use('/api/v1/coe/copy-case', copyCaseProcessRoutes);
app.use('/api/v1/student/revaluation', studentRevalRoutes);
app.use('/api/v1/student/post-exam', postExamRoutes);
app.use('/api/v1/coe/reval-assignment', coeRevalAssignmentRoutes);
app.use('/api/v1/coe/kt', ktManagementRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(`[Error] ${err.message}`, err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

module.exports = app;
