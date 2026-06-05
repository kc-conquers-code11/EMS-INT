const { v4: uuidv4 } = require('uuid');
const db = require('./src/config/db.js');
const initModels = require('./src/models/init-models');

async function seedHODs() {
  try {
    const models = initModels(db);
    console.log('Syncing database...');
    // We assume tables already exist and synced.

    // 1. Create User Type for Faculty if not exists
    let facultyUserType = await models.user_types.findOne({ where: { base: 'Faculty' } });
    if (!facultyUserType) {
      facultyUserType = await models.user_types.create({ utid: 2, base: 'Faculty' });
    }

    // 2. Create Faculty Type if not exists
    let fType = await models.faculty_type.findOne({ where: { type_name: 'Professor' } });
    if (!fType) {
      fType = await models.faculty_type.create({ type_name: 'Professor' });
    }

    // 3. Let's create an Institution first, since department needs it
    let institution = await models.institution.findOne({ where: { institution_code: 'INST_HOD_1' } });
    if (!institution) {
      institution = await models.institution.create({
        name: 'HOD Test Institution',
        institution_code: 'INST_HOD_1',
        establishment_year: 1990,
        address: 'HOD Seed Address',
        contact: '1122334455',
        email: 'inst_hod@example.com'
      });
    }

    // We'll create two departments and two HODs
    const departments = [
      { name: 'Computer Science HOD Seed', code: 'CS_SEED' },
      { name: 'Information Tech HOD Seed', code: 'IT_SEED' }
    ];

    for (let i = 0; i < departments.length; i++) {
      const deptData = departments[i];
      let dept = await models.department.findOne({ where: { depart_code: deptData.code } });
      
      if (!dept) {
        dept = await models.department.create({
          institution_id: institution.institution_id,
          depart_name: deptData.name,
          depart_code: deptData.code,
          total_faculties: 10 + i,
          total_students: 100 + (i * 50)
        });
      }

      // 4. Create User for HOD
      const email = `hod_${deptData.code.toLowerCase()}@example.com`;
      let user = await models.users.findOne({ where: { email } });
      if (!user) {
        user = await models.users.create({
          email,
          user_type: facultyUserType.utid,
          password: 'hashed_password_placeholder',
          is_active: true
        });
      }

      // 5. Create Faculty for HOD
      let faculty = await models.faculty.findOne({ where: { email } });
      if (!faculty) {
        // Need a branch id, we'll use department id as branch id or just create a dummy one if required
        let branch = await models.programme.findOne({ where: { programme_code: 'DUMMY_PROG' } });
        if (!branch) {
          branch = await models.programme.create({
            institution_id: institution.institution_id,
            depart_id: dept.depart_id,
            programme_name: 'Dummy Prog',
            programme_code: 'DUMMY_PROG',
            degree_type: 'UG',
            duration_years: 4,
            total_semesters: 8
          });
        }

        faculty = await models.faculty.create({
          uid: user.uid,
          faculty_clg_id: `FC_HOD_${i}`,
          name: `HOD Name ${i}`,
          contact: `909090909${i}`,
          ftype_id: fType.ftype_id,
          role: 'HOD',
          depart_id: dept.depart_id,
          gender: 'Male',
          email,
          branch_id: branch.programm_id
        });
        
        // link user to faculty
        await user.update({ faculty_id: faculty.faculty_id });
      }

      // 6. Set HOD in department
      await dept.update({ hod_faculty_id: faculty.faculty_id });
      console.log(`Seeded HOD ${faculty.name} for department ${dept.depart_name}`);
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seedHODs();
