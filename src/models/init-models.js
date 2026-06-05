var DataTypes = require('sequelize').DataTypes;
var _academic_year = require('./academic_year');
var _attendance_record = require('./attendance_record');
var _audit_log = require('./audit_log');
var _block_allocation = require('./block_allocation');
var _branch = require('./branch');
var _building = require('./building');
var _category_master = require('./category_master');
var _co_attainment = require('./co_attainment');
var _co_po_mapping = require('./co_po_mapping');
var _copy_case = require('./copy_case');
var _copy_case_log = require('./copy_case_log');
var _course_outcome = require('./course_outcome');
var _department = require('./department');
var _hod = require('./hod');
var _exam_event = require('./exam_event');
var _exam_fees = require('./exam_fees');
var _exam_pattern = require('./exam_pattern');
var _exam_registration = require('./exam_registration');
var _external_examiner = require('./external_examiner');
var _faculty = require('./faculty');
var _faculty_availability = require('./faculty_availability');
var _faculty_subject_mapping = require('./faculty_subject_mapping');
var _faculty_type = require('./faculty_type');
var _fee_receipt = require('./fee_receipt');
var _fee_transaction = require('./fee_transaction');
var _gender_master = require('./gender_master');
var _hall_ticket = require('./hall_ticket');
var _institution = require('./institution');
var _marks_entry = require('./marks_entry');
var _marksheet_version = require('./marksheet_version');
var _notification_log = require('./notification_log');
var _otp_log = require('./otp_log');
var _paper_question = require('./paper_question');
var _paper_set = require('./paper_set');
var _paper_set_approval = require('./paper_set_approval');
var _photocopy_request = require('./photocopy_request');
var _programme = require('./programme');
var _programme_outcome = require('./programme_outcome');
var _question_bank = require('./question_bank');
var _question_co_link = require('./question_co_link');
var _question_co_mapping = require('./question_co_mapping');
var _reassessment_request = require('./reassessment_request');
var _registration_subject = require('./registration_subject');
var _result_record = require('./result_record');
var _revaluation_request = require('./revaluation_request');
var _rhr_student = require('./rhr_student');
var _room = require('./room');
var _scheme = require('./scheme');
var _seat_type_master = require('./seat_type_master');
var _semester = require('./semester');
var _semester_result = require('./semester_result');
var _semester_subject_mapping = require('./semester_subject_mapping');
var _shift_master = require('./shift_master');
var _student_add = require('./student_add');
var _student_doc_link = require('./student_doc_link');
var _student_parentdetail = require('./student_parentdetail');
var _student_personaldetails = require('./student_personaldetails');
var _student_seating = require('./student_seating');
var _students = require('./students');
var _subject = require('./subject');
var _supervisor_allocation = require('./supervisor_allocation');
var _time_slot = require('./time_slot');
var _timetable = require('./timetable');
var _user_auth_token = require('./user_auth_token');
var _user_types = require('./user_types');
var _users = require('./users');
var _v_payment_history = require('./v_payment_history');
var _permissions = require('./permissions');
var _role_permissions = require('./role_permissions');

function initModels(sequelize) {
  var academic_year = _academic_year(sequelize, DataTypes);
  var attendance_record = _attendance_record(sequelize, DataTypes);
  var audit_log = _audit_log(sequelize, DataTypes);
  var block_allocation = _block_allocation(sequelize, DataTypes);
  var branch = _branch(sequelize, DataTypes);
  var building = _building(sequelize, DataTypes);
  var category_master = _category_master(sequelize, DataTypes);
  var co_attainment = _co_attainment(sequelize, DataTypes);
  var co_po_mapping = _co_po_mapping(sequelize, DataTypes);
  var copy_case = _copy_case(sequelize, DataTypes);
  var copy_case_log = _copy_case_log(sequelize, DataTypes);
  var course_outcome = _course_outcome(sequelize, DataTypes);
  var department = _department(sequelize, DataTypes);
  var hod = _hod(sequelize, DataTypes);
  var exam_event = _exam_event(sequelize, DataTypes);
  var exam_fees = _exam_fees(sequelize, DataTypes);
  var exam_pattern = _exam_pattern(sequelize, DataTypes);
  var exam_registration = _exam_registration(sequelize, DataTypes);
  var external_examiner = _external_examiner(sequelize, DataTypes);
  var faculty = _faculty(sequelize, DataTypes);
  var faculty_availability = _faculty_availability(sequelize, DataTypes);
  var faculty_subject_mapping = _faculty_subject_mapping(sequelize, DataTypes);
  var faculty_type = _faculty_type(sequelize, DataTypes);
  var fee_receipt = _fee_receipt(sequelize, DataTypes);
  var fee_transaction = _fee_transaction(sequelize, DataTypes);
  var gender_master = _gender_master(sequelize, DataTypes);
  var hall_ticket = _hall_ticket(sequelize, DataTypes);
  var institution = _institution(sequelize, DataTypes);
  var marks_entry = _marks_entry(sequelize, DataTypes);
  var marksheet_version = _marksheet_version(sequelize, DataTypes);
  var notification_log = _notification_log(sequelize, DataTypes);
  var otp_log = _otp_log(sequelize, DataTypes);
  var paper_question = _paper_question(sequelize, DataTypes);
  var paper_set = _paper_set(sequelize, DataTypes);
  var paper_set_approval = _paper_set_approval(sequelize, DataTypes);
  var photocopy_request = _photocopy_request(sequelize, DataTypes);
  var programme = _programme(sequelize, DataTypes);
  var programme_outcome = _programme_outcome(sequelize, DataTypes);
  var question_bank = _question_bank(sequelize, DataTypes);
  var question_co_link = _question_co_link(sequelize, DataTypes);
  var question_co_mapping = _question_co_mapping(sequelize, DataTypes);
  var reassessment_request = _reassessment_request(sequelize, DataTypes);
  var registration_subject = _registration_subject(sequelize, DataTypes);
  var result_record = _result_record(sequelize, DataTypes);
  var revaluation_request = _revaluation_request(sequelize, DataTypes);
  var rhr_student = _rhr_student(sequelize, DataTypes);
  var room = _room(sequelize, DataTypes);
  var scheme = _scheme(sequelize, DataTypes);
  var seat_type_master = _seat_type_master(sequelize, DataTypes);
  var semester = _semester(sequelize, DataTypes);
  var semester_result = _semester_result(sequelize, DataTypes);
  var semester_subject_mapping = _semester_subject_mapping(
    sequelize,
    DataTypes
  );
  var shift_master = _shift_master(sequelize, DataTypes);
  var student_add = _student_add(sequelize, DataTypes);
  var student_doc_link = _student_doc_link(sequelize, DataTypes);
  var student_parentdetail = _student_parentdetail(sequelize, DataTypes);
  var student_personaldetails = _student_personaldetails(sequelize, DataTypes);
  var student_seating = _student_seating(sequelize, DataTypes);
  var students = _students(sequelize, DataTypes);
  var subject = _subject(sequelize, DataTypes);
  var supervisor_allocation = _supervisor_allocation(sequelize, DataTypes);
  var time_slot = _time_slot(sequelize, DataTypes);
  var timetable = _timetable(sequelize, DataTypes);
  var user_auth_token = _user_auth_token(sequelize, DataTypes);
  var user_types = _user_types(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var v_payment_history = _v_payment_history(sequelize, DataTypes);
  var permissions = _permissions(sequelize, DataTypes);
  var role_permissions = _role_permissions(sequelize, DataTypes);

  return {
    academic_year,
    attendance_record,
    audit_log,
    block_allocation,
    branch,
    building,
    category_master,
    co_attainment,
    co_po_mapping,
    copy_case,
    copy_case_log,
    course_outcome,
    department,
    hod,
    exam_event,
    exam_fees,
    exam_pattern,
    exam_registration,
    external_examiner,
    faculty,
    faculty_availability,
    faculty_subject_mapping,
    faculty_type,
    fee_receipt,
    fee_transaction,
    gender_master,
    hall_ticket,
    institution,
    marks_entry,
    marksheet_version,
    notification_log,
    otp_log,
    paper_question,
    paper_set,
    paper_set_approval,
    photocopy_request,
    programme,
    programme_outcome,
    question_bank,
    question_co_link,
    question_co_mapping,
    reassessment_request,
    registration_subject,
    result_record,
    revaluation_request,
    rhr_student,
    room,
    scheme,
    seat_type_master,
    semester,
    semester_result,
    semester_subject_mapping,
    shift_master,
    student_add,
    student_doc_link,
    student_parentdetail,
    student_personaldetails,
    student_seating,
    students,
    subject,
    supervisor_allocation,
    time_slot,
    timetable,
    user_auth_token,
    user_types,
    users,
    v_payment_history,
    permissions,
    role_permissions,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
