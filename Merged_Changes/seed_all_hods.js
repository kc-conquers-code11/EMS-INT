const { v4: uuidv4 } = require('uuid');
const db = require('./src/config/db.js');
const initModels = require('./src/models/init-models');

async function seedAllHODs() {
  try {
    const models = initModels(db);
    console.log('Syncing database...');

    let facultyUserType = await models.user_types.findOne({ where: { base: 'Faculty' } });
    if (!facultyUserType) {
      facultyUserType = await models.user_types.create({ utid: 2, base: 'Faculty' });
    }

    let fType = await models.faculty_type.findOne({ where: { type_name: 'Professor' } });
    if (!fType) {
      fType = await models.faculty_type.create({ type_name: 'Professor' });
    }

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

    // Find all departments
    const departments = await models.department.findAll();

    for (let i = 0; i < departments.length; i++) {
      let dept = departments[i];
      let updated = false;

      if (!dept.total_faculties || !dept.total_students) {
        await dept.update({
          total_faculties: Math.floor(Math.random() * 20) + 5,
          total_students: Math.floor(Math.random() * 500) + 100
        });
        updated = true;
      }

      if (!dept.hod_faculty_id) {
        let code = dept.depart_code || `DEPT_${i}`;
        const email = `hod_${code.toLowerCase()}@example.com`;
        
        let user = await models.users.findOne({ where: { email } });
        if (!user) {
          user = await models.users.create({
            email,
            user_type: facultyUserType.utid,
            password: 'hashed_password_placeholder',
            is_active: true
          });
        }

        let faculty = await models.faculty.findOne({ where: { email } });
        if (!faculty) {
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

          const randomContact = `9${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`;
          faculty = await models.faculty.create({
            uid: user.uid,
            faculty_clg_id: `FC_HOD_ALL_${i}_${Date.now()}`,
            name: `HOD of ${dept.depart_name}`,
            contact: randomContact,
            ftype_id: fType.ftype_id,
            role: 'HOD',
            depart_id: dept.depart_id,
            gender: 'Male',
            email,
            branch_id: branch.programm_id
          });
          
          await user.update({ faculty_id: faculty.faculty_id });
        }

        await dept.update({ hod_faculty_id: faculty.faculty_id });
        console.log(`Seeded HOD ${faculty.name} for department ${dept.depart_name}`);
        updated = true;
      }
    }

    console.log('Seeding of all missing HODs completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seedAllHODs();
