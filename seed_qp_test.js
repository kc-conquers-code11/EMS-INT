const bcrypt = require('bcrypt');
const models = require('./models');

async function seedQPTest() {
  try {
    console.log('Syncing database...');
    await models.sequelize.authenticate();

    // The known bcrypt hash for 'password123'
    const passwordHash = await bcrypt.hash('password123', 10);

    // 1. Create User Types
    let facultyType = await models.user_types.findOne({ where: { base: 'Faculty' } });
    if (!facultyType) {
      facultyType = await models.user_types.create({ utid: 2, base: 'Faculty' });
    }

    let coeType = await models.user_types.findOne({ where: { base: 'COE' } });
    if (!coeType) {
      coeType = await models.user_types.create({ utid: 3, base: 'COE' });
    }

    // 2. Create Institution & Department
    let institution = await models.institution.findOne({ where: { institution_code: 'TEST_INST' } });
    if (!institution) {
      institution = await models.institution.create({
        name: 'Test University',
        institution_code: 'TEST_INST',
        establishment_year: 2000,
        address: 'Test City',
        contact: '1234567890',
        email: 'info@test.edu'
      });
    }

    let dept = await models.department.findOne({ where: { depart_code: 'CS_TEST' } });
    if (!dept) {
      dept = await models.department.create({
        institution_id: institution.institution_id,
        depart_name: 'Computer Science',
        depart_code: 'CS_TEST',
        total_faculties: 50,
        total_students: 500
      });
    }

    // 3. Create COE Profile & User
    let coeProfile = await models.coe.findOne({ where: { email: 'coe@test.com' } });
    if (!coeProfile) {
      coeProfile = await models.coe.create({
        institution_id: institution.institution_id,
        name: 'Chief Controller',
        phone_number: '9999999999',
        employee_id: 'COE001',
        email: 'coe@test.com',
        status: 1
      });
    }

    let coeUser = await models.users.findOne({ where: { email: 'coe@test.com' } });
    if (!coeUser) {
      coeUser = await models.users.create({
        email: 'coe@test.com',
        password: passwordHash,
        user_type: coeType.utid,
        coe_id: coeProfile.coe_id,
        is_active: true
      });
    }

    // 4. Create Academic Programme (Branch)
    let branch = await models.programme.findOne({ where: { programme_code: 'BTECH_CS' } });
    if (!branch) {
      branch = await models.programme.create({
        institution_id: institution.institution_id,
        depart_id: dept.depart_id,
        programme_name: 'B.Tech Computer Science',
        programme_code: 'BTECH_CS',
        degree_type: 'UG',
        duration_years: 4,
        total_semesters: 8
      });
    }

    // 5. Create Faculty Profile & User
    let fType = await models.faculty_type.findOne({ where: { type_name: 'Professor' } });
    if (!fType) {
      fType = await models.faculty_type.create({ type_name: 'Professor' });
    }

    let facultyUser = await models.users.findOne({ where: { email: 'faculty@test.com' } });
    if (!facultyUser) {
      facultyUser = await models.users.create({
        email: 'faculty@test.com',
        password: passwordHash,
        user_type: facultyType.utid,
        is_active: true
      });
    }

    let facultyProfile = await models.faculty.findOne({ where: { email: 'faculty@test.com' } });
    if (!facultyProfile) {
      facultyProfile = await models.faculty.create({
        uid: facultyUser.uid,
        faculty_clg_id: 'FAC001',
        name: 'Dr. Faculty Member',
        contact: '8888888888',
        ftype_id: fType.ftype_id,
        role: 'Faculty',
        depart_id: dept.depart_id,
        branch_id: branch.programm_id,
        gender: 'Male',
        email: 'faculty@test.com'
      });
      await facultyUser.update({ faculty_id: facultyProfile.faculty_id });
    }

    // 5. Create Academic Data (Scheme, Programme, Subject)
    let scheme = await models.scheme.findOne({ where: { scheme_name: '2024-25 Scheme' } });
    if (!scheme) {
      scheme = await models.scheme.create({ 
        scheme_name: '2024-25 Scheme',
        programm_id: branch.programm_id
      });
    }

    let subject = await models.subject.findOne({ where: { subject_code: 'CS301' } });
    if (!subject) {
      subject = await models.subject.create({
        scheme_id: scheme.scheme_id,
        subject_name: 'Data Structures',
        subject_code: 'CS301',
        subject_type: 'TH',
        sem: 3,
        status: 1
      });
    }

    let examEvent = await models.exam_event.findOne({ where: { event_name: 'Winter 2026' } });
    if (!examEvent) {
      examEvent = await models.exam_event.create({
        event_name: 'Winter 2026',
        event_code: 'W26',
        status: 'Active'
      });
    }

    console.log('\n======================================================');
    console.log('✅ TEST DATA SUCCESSFULLY SEEDED!');
    console.log('======================================================');
    console.log('You can now log in with the following accounts:\n');
    console.log('COE ACCOUNT (For assigning/reviewing papers):');
    console.log('   Email: coe@test.com');
    console.log('   Password: password123\n');
    console.log('FACULTY ACCOUNT (For drafting Question Papers):');
    console.log('   Email: faculty@test.com');
    console.log('   Password: password123\n');
    console.log('SUBJECT CREATED: Data Structures (CS301)');
    console.log('EXAM EVENT CREATED: Winter 2026 (W26)');
    console.log('======================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seedQPTest();
