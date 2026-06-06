import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PrivateRoute } from './routes/PrivateRoute';
import { PublicRoute } from './routes/PublicRoute';
import { StudentRoute } from './routes/StudentRoute';
import { FacultyRoute } from './routes/FacultyRoute';
import { CopyCaseProcess } from './pages/COE/CopyCaseProcess';
import { CoeRevalAssignment } from './pages/COE/CoeRevalAssignment';

// Student Pages
import { StudentRevalApplication } from './pages/Student/StudentRevalApplication';

import RegistrationLayout from './components/layout/registration_layout';
import { HodRoute } from './routes/HodRoute';
import { AdminLayout } from './components/layout/admin_layout';
import { COELayout } from './components/layout/coe_layout';
import StudentLayout from './components/layout/student_layout';
import FacultyLayout from './components/layout/faculty_layout';
import HodLayout from './components/layout/hod_layout';
import { UnderConstruction } from './components/common/UnderConstruction';

// Auth
import { StudentLoginPage } from './pages/Auth/StudentLoginPage';
import { StudentSignUpPage } from './pages/Auth/StudentSignUpPage';
import { FacultyLoginPage } from './pages/Auth/FacultyLoginPage';
import { FacultySignUpPage } from './pages/Auth/FacultySignUpPage';

// Admin
import { InstitutionListPage } from './pages/Institution/InstitutionListPage';
import { AddInstitutionPage } from './pages/Institution/AddInstitutionPage';

// COE
import { BranchManagementPage } from './pages/COE/Branch/BranchManagementPage';
import { SemesterManagementPage } from './pages/COE/Semester/SemesterManagementPage';
import Subject from './pages/COE/Subject/SubjectManagementPage';
import AcademicYear from './pages/COE/AcademicYear/AcademicYearManagementPage';
import ProgrammeDetails from './pages/COE/Programme/ProgrammeManagementPage';
import { SchemePage } from './pages/COE/Scheme/SchemePage';
import { DepartmentPage } from './pages/COE/Department/DepartmentPage';
import { StudentMgmtPage } from './pages/COE/StudentManagement/StudentMgmtPage';
import { BlockwiseAllocationPage as COEBlockwiseAllocationPage } from './pages/COE/BlockwiseAllocation/BlockwiseAllocationPage';
import { ExamFeesPage } from './pages/COE/ExamFees/ExamFeesPage';
import { InventoryManagementPage } from './pages/COE/InventoryManagement/InventoryManagementPage';
import { ExamEventSchedulerPage } from './pages/COE/Exam/ExamEventSchedulerPage';
import { TimetablePage } from './pages/COE/Timetable/TimetablePage';
import { CoPoMappingPage } from './pages/COE/CoPoMapping/CoPoMappingPage';
import { OnExamMonitoringPage } from './pages/COE/OnExamMonitoring/OnExamMonitoringPage';
import { COEHallTicketPage } from './pages/COE/HallTicket/COEHallTicketPage';
import { EmergencyHandlingPage } from './pages/COE/EmergencyHandling/EmergencyHandlingPage';
import ExamPatternPage from './pages/COE/ExamPattern/ExamPatternPage';
import { UserFinalizationDashboard } from './pages/COE/UserFinalization/UserFinalizationDashboard';
import { AddUserFinalization } from './pages/COE/UserFinalization/AddUserFinalization';
import { EditUserFinalization } from './pages/COE/UserFinalization/EditUserFinalization';
import { ResultProcessingPage } from './pages/COE/ResultProcessing/ResultProcessingPage';
import PublishResultPage from './pages/COE/PublishResult/PublishResultPage';
import UnlockMarksheetPage from './pages/COE/UnlockMarksheet/UnlockMarksheetPage';
import PaperRequestTrigger from './pages/COE/PaperRequestTrigger';
import { ReviewQP } from './pages/COE/ReviewQP';
import { PrintQP } from './pages/COE/PrintQP';

// Student
import { ViewResultPage } from './pages/Student/Result/ViewResultPage';
import { HallTicketPage } from './pages/Student/HallTicket/HallTicketPage';
import { FeesManagementPage } from './pages/Student/Fees/FeesManagementPage';
import BacklogRegistrationPage from './pages/Student/BacklogRegistration/BacklogRegistrationPage';
import ExamRegistrationPage from './pages/Student/ExamRegistration/ExamRegistrationPage';

// Faculty
import { BlockwiseAllocationPage } from './pages/Faculty/BlockwiseAllocation/BlockwiseAllocationPage';
import { ViewExamAllocationPage } from './pages/Faculty/ViewExamAllocation/ViewExamAllocationPage';
import { AbsentReportingPage } from './pages/Faculty/AbsentReporting/AbsentReportingPage';
import { CopyCasePage } from './pages/Faculty/CopyCase/CopyCasePage';
import { QuestionPaperPage } from './pages/Faculty/QuestionPaper/QuestionPaperPage';
import { SupervisorDutyPage } from './pages/Faculty/SupervisorDuty/SupervisorDutyPage';
import { BlockwiseAttendancePage } from './pages/Faculty/Attendance/BlockwiseAttendancePage';
import { MarksEntryPage } from './pages/Faculty/MarksEntry/MarksEntryPage';
import SubjectFacultyMappingPage from './pages/HOD/SubjectFacultyMapping/SubjectFacultyMappingPage';
import ProgramOutcomes from './pages/HOD/ProgramOutcomes';
import CourseOutcomes from './pages/Faculty/CourseOutcomes';
import CoPoMapping from './pages/Faculty/CoPoMapping';
import PaperRequestsDashboard from './pages/Faculty/PaperRequestsDashboard';
import QPBuilderLayout from './pages/Faculty/QPBuilder/QPBuilderLayout';
import { MarksheetVerificationPage } from './pages/Faculty/Analytics/MarksheetVerificationPage';
import { COPOAttainmentReport } from './pages/Faculty/Analytics/COPOAttainmentReport';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<StudentLoginPage />} />
        <Route path="/signup" element={<StudentSignUpPage />} />
        <Route path="/faculty-login" element={<FacultyLoginPage />} />
        <Route path="/faculty-signup" element={<FacultySignUpPage />} />
      </Route>

      {/* Super Admin */}
      <Route element={<PrivateRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/add-institution" element={<AddInstitutionPage />} />
          <Route path="/institution-list" element={<InstitutionListPage />} />
        </Route>
      </Route>

      {/* COE */}
      <Route element={<PrivateRoute />}>
        <Route element={<COELayout />}>
          <Route path="/timetable" element={<TimetablePage />} />
          <Route path="/exam" element={<ExamEventSchedulerPage />} />
          <Route path="/allocation" element={<COEBlockwiseAllocationPage />} />
          <Route path="/programme" element={<ProgrammeDetails />} />
          <Route path="/branch-management" element={<BranchManagementPage />} />
          <Route path="/semester" element={<SemesterManagementPage />} />
          <Route path="/department" element={<DepartmentPage />} />
          <Route path="/scheme" element={<SchemePage />} />
          <Route path="/subject" element={<Subject />} />
          <Route path="/academic-year" element={<AcademicYear />} />
          <Route path="/student-management" element={<StudentMgmtPage />} />
          <Route path="/inventory-management" element={<InventoryManagementPage />} />
          <Route path="/exam-fees" element={<ExamFeesPage />} />
          <Route path="/co-po-mapping" element={<CoPoMappingPage />} />
          <Route path="/on-exam-monitoring" element={<OnExamMonitoringPage />} />
          <Route path="/hall-ticket" element={<COEHallTicketPage />} />
          <Route path="/emergency-handling" element={<EmergencyHandlingPage />} />
          <Route path="/exam-pattern" element={<ExamPatternPage />} />
          <Route path="/user-finalization" element={<UserFinalizationDashboard />} />
          <Route path="/user-finalization/add" element={<AddUserFinalization />} />
          <Route path="/user-finalization/edit/:id" element={<EditUserFinalization />} />
          <Route path="/result-management" element={<ResultProcessingPage />} />
          <Route path="/publish-result" element={<PublishResultPage />} />
          <Route path="/unlock-marksheet" element={<UnlockMarksheetPage />} />
          <Route path="/paper-request-trigger" element={<PaperRequestTrigger />} />
          <Route path="/review-qp/:set_id" element={<ReviewQP />} />
          <Route path="/print-qp/:set_id" element={<PrintQP />} />
          <Route path="/reval-assignment" element={<CoeRevalAssignment />} />
        </Route>
      </Route>

      {/* Student — Student role only, /student/* paths only */}
      <Route element={<StudentRoute />}>
        <Route element={<StudentLayout />}>
          <Route path="/student/view-result" element={<ViewResultPage />} />
          <Route path="/student/hall-ticket" element={<HallTicketPage />} />
          <Route path="/student/fees" element={<FeesManagementPage />} />
          <Route path="/student/backlog-exam" element={<BacklogRegistrationPage />} />
          <Route path="/student/exam-registration" element={<ExamRegistrationPage />} />
          <Route path="/student/revaluation-application" element={<StudentRevalApplication />} />
        </Route>
      </Route>

      {/* HOD — HOD role only, /hod/* paths only */}
      <Route element={<HodRoute />}>
        <Route element={<HodLayout />}>
          <Route path="/hod/subject-faculty-mapping" element={<SubjectFacultyMappingPage />} />
          <Route path="/hod/program-outcomes" element={<ProgramOutcomes />} />
          <Route path="/hod/settings" element={<UnderConstruction pageName="HOD Settings" />} />
        </Route>
      </Route>

      {/* Faculty — Faculty role only, /faculty/* paths only */}
      <Route element={<FacultyRoute />}>
        <Route element={<FacultyLayout />}>
          <Route path="/faculty/blockwise-allocation" element={<BlockwiseAllocationPage />} />
          <Route path="/faculty/exam-allocation" element={<ViewExamAllocationPage />} />
          <Route path="/faculty/absent-reporting" element={<AbsentReportingPage />} />
          <Route path="/faculty/copy-case" element={<CopyCasePage />} />
          <Route path="/faculty/question-paper" element={<QuestionPaperPage />} />
          <Route path="/faculty/accept-supervisor" element={<SupervisorDutyPage />} />
          <Route path="/faculty/blockwise-attendance" element={<BlockwiseAttendancePage />} />
          <Route path="/faculty/marks-entry" element={<MarksEntryPage />} />
          <Route path="/faculty/course-outcomes" element={<CourseOutcomes />} />
          <Route path="/faculty/co-po-mapping" element={<CoPoMapping />} />
          <Route path="/faculty/paper-requests" element={<PaperRequestsDashboard />} />
          <Route path="/faculty/qp-builder/:set_id" element={<QPBuilderLayout />} />
          <Route path="/faculty/marksheet-verification/:mapping_id" element={<MarksheetVerificationPage />} />
          <Route path="/faculty/copo-attainment/:mapping_id" element={<COPOAttainmentReport />} />
        </Route>
      </Route>

      <Route path="*" element={<UnderConstruction pageName="This page" />} />
    </Routes>
  );
}

export default App;
