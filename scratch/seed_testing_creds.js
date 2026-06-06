const db = require('../models');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

async function seed() {
  try {
    await db.sequelize.authenticate();
    console.log('Database connected.');

    // 1. Ensure user types exist
    const userTypesToEnsure = [
      { utid: 1, base: 'Student' },
      { utid: 2, base: 'Faculty' },
      { utid: 3, base: 'COE' },
      { utid: 4, base: 'HOD' },
    ];

    for (const ut of userTypesToEnsure) {
      await db.user_types.findOrCreate({
        where: { base: ut.base },
        defaults: { utid: ut.utid, base: ut.base }
      });
    }

    const studentType = await db.user_types.findOne({ where: { base: 'Student' } });
    const facultyType = await db.user_types.findOne({ where: { base: 'Faculty' } });
    const hodType = await db.user_types.findOne({ where: { base: 'HOD' } });

    // 2. Hash default password
    const plainPassword = 'password123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // 3. Create/Find Student
    const studentPrn = 'TEST_PRN_001';
    const [student] = await db.students.findOrCreate({
      where: { stud_clg_id: studentPrn },
      defaults: {
        sid: crypto.randomUUID(),
        stud_clg_id: studentPrn,
        uid: crypto.randomUUID(),
        program_id: crypto.randomUUID(),
        branch_id: crypto.randomUUID(),
        personal_details_id: '1',
        father_id: '1',
        mother_id: '1',
        guardian_id: '1',
        doc_ids: '1',
        dd_id: '1',
        neft_id: '1'
      }
    });

    const [studentUser] = await db.users.findOrCreate({
      where: { email: 'student@test.com' },
      defaults: {
        uid: crypto.randomUUID(),
        email: 'student@test.com',
        user_type: studentType.utid,
        password: hashedPassword,
        student_id: student.sid,
        is_active: 1
      }
    });
    // Ensure password is correct and link is correct
    await studentUser.update({ password: hashedPassword, student_id: student.sid, user_type: studentType.utid });

    // 4. Create/Find Faculty
    const [faculty] = await db.faculty.findOrCreate({
      where: { email: 'faculty@test.com' },
      defaults: {
        faculty_id: crypto.randomUUID(),
        uid: crypto.randomUUID(),
        faculty_clg_id: 'FAC_001',
        name: 'Test Faculty',
        email: 'faculty@test.com',
        contact: '1234567890',
        status: 1
      }
    });

    const [facultyUser] = await db.users.findOrCreate({
      where: { email: 'faculty@test.com' },
      defaults: {
        uid: crypto.randomUUID(),
        email: 'faculty@test.com',
        user_type: facultyType.utid,
        password: hashedPassword,
        faculty_id: faculty.faculty_id,
        is_active: 1
      }
    });
    await facultyUser.update({ password: hashedPassword, faculty_id: faculty.faculty_id, user_type: facultyType.utid });

    // 5. Create/Find HOD
    const [hod] = await db.hod.findOrCreate({
      where: { email: 'hod@test.com' },
      defaults: {
        hod_id: crypto.randomUUID(),
        name: 'Test HOD',
        email: 'hod@test.com',
        employee_id: 'HOD_001',
        phone_number: '0987654321',
        depart_id: crypto.randomUUID(),
        institution_id: crypto.randomUUID(),
        status: 1
      }
    });

    const [hodUser] = await db.users.findOrCreate({
      where: { email: 'hod@test.com' },
      defaults: {
        uid: crypto.randomUUID(),
        email: 'hod@test.com',
        user_type: hodType.utid,
        password: hashedPassword,
        hod_id: hod.hod_id,
        is_active: 1
      }
    });
    await hodUser.update({ password: hashedPassword, hod_id: hod.hod_id, user_type: hodType.utid });

    console.log('--- SEEDING COMPLETE ---');
    console.log('You can now log in with the following credentials:');
    console.log('Password for all users:', plainPassword);
    console.log('Student: student@test.com');
    console.log('Faculty: faculty@test.com');
    console.log('HOD: hod@test.com');
    process.exit(0);

  } catch (err) {
    console.error('Error seeding:', err);
    process.exit(1);
  }
}

seed();
