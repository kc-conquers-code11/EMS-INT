const db = require('../models');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

async function seed() {
  let t;
  try {
    await db.sequelize.authenticate();
    t = await db.sequelize.transaction();

    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // 1. Get COE User (create if not exist)
    let coeType = await db.user_types.findOne({ where: { base: 'COE' } });
    if (!coeType) {
        await db.user_types.create({ utid: 3, base: 'COE' }, { transaction: t });
        coeType = { utid: 3 };
    }
    
    let coe_id = crypto.randomUUID();
    let [coe] = await db.sequelize.query('SELECT * FROM coe WHERE email="coe@test.com"', { type: db.Sequelize.QueryTypes.SELECT, transaction: t });
    if (!coe) {
        await db.sequelize.query(`
            INSERT INTO coe (coe_id, institution_id, name, email, phone_number, status, createdAt, updatedAt)
            VALUES (:coe_id, :institution_id, 'Test COE', 'coe@test.com', '1112223334', 1, NOW(), NOW())
        `, { replacements: { coe_id, institution_id: crypto.randomUUID() }, transaction: t });
    } else {
        coe_id = coe.coe_id;
    }

    let [coeUser] = await db.sequelize.query('SELECT * FROM users WHERE email="coe@test.com"', { type: db.Sequelize.QueryTypes.SELECT, transaction: t });
    if (!coeUser) {
        await db.sequelize.query(`
            INSERT INTO users (uid, email, user_type, password, coe_id, is_active, createdAt, updatedAt)
            VALUES (:uid, 'coe@test.com', :utid, :pwd, :coe_id, 1, NOW(), NOW())
        `, { replacements: { uid: crypto.randomUUID(), utid: coeType.utid, pwd: hashedPassword, coe_id }, transaction: t });
    } else {
        await db.sequelize.query('UPDATE users SET password = :pwd WHERE email="coe@test.com"', { replacements: { pwd: hashedPassword }, transaction: t });
    }

    // 2. Get Student and Faculty
    const [studentUser] = await db.sequelize.query('SELECT * FROM users WHERE email="student@test.com"', { type: db.Sequelize.QueryTypes.SELECT, transaction: t });
    const [facultyUser] = await db.sequelize.query('SELECT * FROM users WHERE email="faculty@test.com"', { type: db.Sequelize.QueryTypes.SELECT, transaction: t });
    
    if (!studentUser || !facultyUser) throw new Error("Run seed_testing_creds.js first to create student and faculty!");

    // 3. Exam Event
    const event_id = crypto.randomUUID();
    await db.sequelize.query(`
      INSERT INTO exam_event (event_id, institution_id, semester_id, event_name, exam_type, status, createdAt, updatedAt)
      VALUES (:event_id, :institution_id, :sem_id, 'Summer 2026 Test Event', 'Regular', 'Active', NOW(), NOW())
    `, {
      replacements: { event_id, institution_id: crypto.randomUUID(), sem_id: crypto.randomUUID() },
      transaction: t
    });

    // 4. Subject
    const subject_id = crypto.randomUUID();
    await db.sequelize.query(`
      INSERT INTO subject (subject_id, scheme_id, subject_code, subject_name, subject_type, max_theory, status, branch_id, depart_id, institution_id, academic_id, sem, credits, createdAt, updatedAt)
      VALUES (:subject_id, :scheme_id, 'REV101', 'Reval Engineering', 'theory', 100, 1, :branch_id, :depart_id, :institution_id, :academic_id, 1, 4, NOW(), NOW())
    `, {
      replacements: { 
        subject_id, 
        scheme_id: crypto.randomUUID(),
        branch_id: crypto.randomUUID(), 
        depart_id: crypto.randomUUID(),
        institution_id: crypto.randomUUID(),
        academic_id: crypto.randomUUID()
      },
      transaction: t
    });

    // 5. Semester Subject Mapping
    const mapping_id = crypto.randomUUID();
    await db.sequelize.query(`
      INSERT INTO semester_subject_mapping (mapping_id, semester_id, branch_id, subject_id, exam_event_id, is_active, createdAt, updatedAt)
      VALUES (:mapping_id, :sem_id, :branch_id, :subject_id, :event_id, 1, NOW(), NOW())
    `, {
      replacements: { mapping_id, sem_id: crypto.randomUUID(), branch_id: crypto.randomUUID(), subject_id, event_id },
      transaction: t
    });

    // 6. Exam Registration
    const exam_reg_id = crypto.randomUUID();
    await db.sequelize.query(`
      INSERT INTO exam_registration (exam_reg_id, sid, event_id, reg_type, reg_status, payment_status, createdAt, updatedAt)
      VALUES (:exam_reg_id, :sid, :event_id, 'regular', 'approved', 'paid', NOW(), NOW())
    `, {
      replacements: { exam_reg_id, sid: studentUser.student_id, event_id },
      transaction: t
    });

    // 7. Registration Subject
    const reg_subj_id = crypto.randomUUID();
    await db.sequelize.query(`
      INSERT INTO registration_subject (reg_subj_id, exam_reg_id, mapping_id, subject_type, eligibility_status)
      VALUES (:reg_subj_id, :exam_reg_id, :mapping_id, 'regular', 'eligible')
    `, {
      replacements: { reg_subj_id, exam_reg_id, mapping_id },
      transaction: t
    });

    // 8. Marks Entry (Locked!)
    await db.sequelize.query(`
      INSERT INTO marks_entry (reg_subj_id, faculty_id, component, marks_obtained, max_marks, is_locked, createdAt, updatedAt)
      VALUES (:reg_subj_id, :faculty_id, 'Theory', 35, 100, 1, NOW(), NOW())
    `, {
      replacements: { reg_subj_id, faculty_id: facultyUser.faculty_id },
      transaction: t
    });

    await t.commit();
    console.log("Full Reval test flow data seeded successfully!");
    console.log("Credentials:");
    console.log("Password for all users: password123");
    console.log("Student: student@test.com");
    console.log("Faculty: faculty@test.com");
    console.log("COE: coe@test.com");
    console.log("HOD: hod@test.com");

  } catch (error) {
    if (t) await t.rollback();
    console.error("Error:", error);
  } finally {
    process.exit(0);
  }
}
seed();
