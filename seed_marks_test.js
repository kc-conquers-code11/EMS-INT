const db = require('./models');

async function seedMarksTest() {
  try {
    await db.sequelize.authenticate();
    console.log('Syncing database for Marks Entry seed...');

    const facultyUser = await db.users.findOne({ where: { email: 'faculty@test.com' } });
    if (!facultyUser) throw new Error("Faculty user not found");
    const faculty = await db.faculty.findOne({ where: { email: 'faculty@test.com' } });
    
    const subject = await db.subject.findOne({ where: { subject_code: 'CS301' } });
    const dept = await db.department.findOne({ where: { depart_code: 'CS_TEST' } });

    // Ensure semester exists
    let semester = await db.semester.findOne({ where: { semester_number: 3 } });
    if (!semester) {
      semester = await db.semester.create({
        depart_id: dept.depart_id,
        programme_id: faculty.branch_id,
        academic_id: 1, // Mock
        term_type: 'Odd',
        semester_number: 3,
        status: 'Active'
      });
    }

    // Update subject to link to semester
    await subject.update({ semester_id: semester.semester_id, max_theory: 100, max_practical: 50, max_tw: 25, max_oral: 25 });

    // Create semester_subject_mapping
    let ssm = await db.semester_subject_mapping.findOne({ where: { subject_id: subject.subject_id, semester_id: semester.semester_id } });
    if (!ssm) {
      ssm = await db.semester_subject_mapping.create({
        subject_id: subject.subject_id,
        semester_id: semester.semester_id,
        branch_id: faculty.branch_id,
        status: 1
      });
    }

    // Create faculty_subject_mapping
    let fsm = await db.faculty_subject_mapping.findOne({ where: { faculty_id: facultyUser.uid, subject_id: subject.subject_id } });
    if (!fsm) {
      fsm = await db.faculty_subject_mapping.create({
        faculty_id: facultyUser.uid,
        subject_id: subject.subject_id,
        semester_id: semester.semester_id,
        mapping_id: ssm.mapping_id,
        allocation_date: new Date()
      });
    }

    // Create a student to test
    let student = await db.students.findOne({ where: { stud_clg_id: 'PRN12345' } });
    if (!student) {
      student = await db.students.create({
        uid: 9999, // dummy
        stud_clg_id: 'PRN12345',
        depart_id: dept.depart_id,
        branch_id: faculty.branch_id,
        program_id: faculty.branch_id,
        personal_details_id: 1,
        father_id: 1,
        mother_id: 1,
        guardian_id: 1,
        doc_ids: 1,
        dd_id: 1,
        neft_id: 1,
        current_semester: 3
      });
      await db.student_personaldetails.create({
        stud_id: student.sid,
        name: 'Test Student One',
        email: 'student1@test.com'
      });
    }

    // Exam Event
    let examEvent = await db.exam_event.findOne({ where: { event_name: 'Winter 2026' } });
    
    // Create Exam Registration
    let examReg = await db.exam_registration.findOne({ where: { sid: student.sid, event_id: examEvent.event_id } });
    if (!examReg) {
      examReg = await db.exam_registration.create({
        sid: student.sid,
        event_id: examEvent.event_id,
        registration_date: new Date(),
        status: 'Approved'
      });
    }

    // Register Student for Subject
    let regSubj = await db.registration_subject.findOne({ where: { exam_reg_id: examReg.exam_reg_id, mapping_id: ssm.mapping_id } });
    if (!regSubj) {
      regSubj = await db.registration_subject.create({
        exam_reg_id: examReg.exam_reg_id,
        mapping_id: ssm.mapping_id,
        subject_id: subject.subject_id,
        status: 'Active'
      });
    }

    console.log('✅ Mapping & Student Data successfully seeded for faculty@test.com!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding marks data:', error);
    process.exit(1);
  }
}

seedMarksTest();
