// services/student/registrationService.js
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

class RegistrationService {
    constructor(db) {
        this.db = db;
    }

    async validateForeignKeys(program_id, cat_id, seat_type_id, branch_id, gender_id) {
        const validationErrors = [];

        // Check if programme exists
        if (program_id) {
            const [programme] = await this.db.sequelize.query(
                `SELECT programm_id FROM programme WHERE programm_id = :program_id LIMIT 1`,
                {
                    replacements: { program_id: program_id },
                    type: this.db.Sequelize.QueryTypes.SELECT,
                }
            );
            if (!programme) {
                validationErrors.push(`Invalid program_id: ${program_id}`);
            }
        }

        // Check if category exists
        if (cat_id) {
            const [category] = await this.db.sequelize.query(
                `SELECT cat_id FROM category_master WHERE cat_id = :cat_id LIMIT 1`,
                {
                    replacements: { cat_id: cat_id },
                    type: this.db.Sequelize.QueryTypes.SELECT,
                }
            );
            if (!category) {
                validationErrors.push(`Invalid cat_id: ${cat_id}`);
            }
        }

        // Check if seat type exists
        if (seat_type_id) {
            const [seatType] = await this.db.sequelize.query(
                `SELECT seat_type_id FROM seat_type_master WHERE seat_type_id = :seat_type_id LIMIT 1`,
                {
                    replacements: { seat_type_id: seat_type_id },
                    type: this.db.Sequelize.QueryTypes.SELECT,
                }
            );
            if (!seatType) {
                validationErrors.push(`Invalid seat_type_id: ${seat_type_id}`);
            }
        }

        // Check if branch exists
        if (branch_id) {
            const [branch] = await this.db.sequelize.query(
                `SELECT branch_id FROM branch WHERE branch_id = :branch_id LIMIT 1`,
                {
                    replacements: { branch_id: branch_id },
                    type: this.db.Sequelize.QueryTypes.SELECT,
                }
            );
            if (!branch) {
                validationErrors.push(`Invalid branch_id: ${branch_id}`);
            }
        }

        // Check if gender exists
        if (gender_id) {
            const [gender] = await this.db.sequelize.query(
                `SELECT gender_id FROM gender_master WHERE gender_id = :gender_id LIMIT 1`,
                {
                    replacements: { gender_id: gender_id },
                    type: this.db.Sequelize.QueryTypes.SELECT,
                }
            );
            if (!gender) {
                validationErrors.push(`Invalid gender_id: ${gender_id}`);
            }
        }

        if (validationErrors.length > 0) {
            const error = new Error('Validation Error');
            error.status = 400;
            error.message = validationErrors.join(', ');
            throw error;
        }

        return true;
    }

    async createUserAndStudent(registrationData, tempTokenData) {
        const { email } = tempTokenData;
        const {
            password,
            first_name,
            middle_name,
            last_name,
            contact,
            dob,
            gender_id,
            religion,
            community,
            minority,
            caste,
            sub_caste,
            nationality,
            place_of_birth,
            child_number,
            landline_number,
            married_status,
            guardian_relation,
            aadhar_number,
            last_college_attended,
            is_parent_have_domicile,
            mother_name,
            pan,
            blood_group,
            program_id,
            cat_id,
            seat_type_id,
            branch_id,
            academic_year,
            father,
            mother,
            guardian,
        } = registrationData;

        // Validate all foreign keys before processing
        await this.validateForeignKeys(program_id, cat_id, seat_type_id, branch_id, gender_id);

        // Start transaction
        const transaction = await this.db.sequelize.transaction();

        try {
            // Generate UUIDs
            const fatherId = uuidv4();
            const motherId = uuidv4();
            const guardianId = uuidv4();
            const personalDetailsId = uuidv4();
            const studentId = uuidv4();
            const userId = uuidv4();
            const docIds = uuidv4();
            const ddId = uuidv4();
            const neftId = uuidv4();

            // 1. Create father record
            await this.db.sequelize.query(
                `INSERT INTO student_parentdetail 
         (parent_id, fullname, contact, email, occupation, designation, income, createdAt, updatedAt) 
         VALUES 
         (:parent_id, :fullname, :contact, :email, :occupation, :designation, :income, NOW(), NOW())`,
                {
                    replacements: {
                        parent_id: fatherId,
                        fullname: father.fullname,
                        contact: father.contact,
                        email: father.email || null,
                        occupation: father.occupation || null,
                        designation: father.designation || null,
                        income: father.income || null,
                    },
                    type: this.db.Sequelize.QueryTypes.INSERT,
                    transaction,
                }
            );

            // 2. Create mother record
            await this.db.sequelize.query(
                `INSERT INTO student_parentdetail 
         (parent_id, fullname, contact, email, occupation, designation, income, createdAt, updatedAt) 
         VALUES 
         (:parent_id, :fullname, :contact, :email, :occupation, :designation, :income, NOW(), NOW())`,
                {
                    replacements: {
                        parent_id: motherId,
                        fullname: mother.fullname,
                        contact: mother.contact,
                        email: mother.email || null,
                        occupation: mother.occupation || null,
                        designation: mother.designation || null,
                        income: mother.income || null,
                    },
                    type: this.db.Sequelize.QueryTypes.INSERT,
                    transaction,
                }
            );

            // 3. Create guardian record
            await this.db.sequelize.query(
                `INSERT INTO student_parentdetail 
         (parent_id, fullname, contact, email, occupation, designation, income, createdAt, updatedAt) 
         VALUES 
         (:parent_id, :fullname, :contact, :email, :occupation, :designation, :income, NOW(), NOW())`,
                {
                    replacements: {
                        parent_id: guardianId,
                        fullname: guardian.fullname,
                        contact: guardian.contact,
                        email: guardian.email || null,
                        occupation: guardian.occupation || null,
                        designation: guardian.designation || null,
                        income: guardian.income || null,
                    },
                    type: this.db.Sequelize.QueryTypes.INSERT,
                    transaction,
                }
            );

            // 4. Create student personal details
            const fullName = `${first_name} ${middle_name ? middle_name + ' ' : ''}${last_name}`;

            await this.db.sequelize.query(
                `INSERT INTO student_personaldetails 
         (personal_id, stud_id, name, first_name, middle_name, last_name, mother_name, 
          gender_id, dob, religion, community, minority, caste, sub_caste, nationality, 
          place_of_birth, child_number, landline_number, contact, married_status, 
          guardian_relation, aadhar_number, last_college_attended, is_parent_have_domicile, 
          pan, blood_group, email, createdAt, updatedAt) 
         VALUES 
         (:personal_id, :stud_id, :name, :first_name, :middle_name, :last_name, :mother_name,
          :gender_id, :dob, :religion, :community, :minority, :caste, :sub_caste, :nationality,
          :place_of_birth, :child_number, :landline_number, :contact, :married_status,
          :guardian_relation, :aadhar_number, :last_college_attended, :is_parent_have_domicile,
          :pan, :blood_group, :email, NOW(), NOW())`,
                {
                    replacements: {
                        personal_id: personalDetailsId,
                        stud_id: studentId, // Will be updated after student creation
                        name: fullName,
                        first_name: first_name,
                        middle_name: middle_name || null,
                        last_name: last_name,
                        mother_name: mother_name || null,
                        gender_id: gender_id,
                        dob: dob,
                        religion: religion || null,
                        community: community || null,
                        minority: minority || null,
                        caste: caste || null,
                        sub_caste: sub_caste || null,
                        nationality: nationality || null,
                        place_of_birth: place_of_birth || null,
                        child_number: child_number || null,
                        landline_number: landline_number || null,
                        contact: contact,
                        married_status: married_status || null,
                        guardian_relation: guardian_relation || null,
                        aadhar_number: aadhar_number || null,
                        last_college_attended: last_college_attended || null,
                        is_parent_have_domicile: is_parent_have_domicile || null,
                        pan: pan || null,
                        blood_group: blood_group || null,
                        email: email,
                    },
                    type: this.db.Sequelize.QueryTypes.INSERT,
                    transaction,
                }
            );

            // 5. Create student record
            await this.db.sequelize.query(
                `INSERT INTO students 
         (sid, stud_clg_id, uid, program_id, cat_id, seat_type_id, branch_id, 
          personal_details_id, father_id, mother_id, guardian_id, academic_year, 
          doc_ids, dd_id, neft_id, physically_handicap, defence_status, 
          received_scholarship, details_of_prize, special_talent, final_submit, 
          RowNum, createdAt, updatedAt) 
         VALUES 
         (:sid, :stud_clg_id, :uid, :program_id, :cat_id, :seat_type_id, :branch_id,
          :personal_details_id, :father_id, :mother_id, :guardian_id, :academic_year,
          :doc_ids, :dd_id, :neft_id, :physically_handicap, :defence_status,
          :received_scholarship, :details_of_prize, :special_talent, :final_submit,
          :RowNum, NOW(), NOW())`,
                {
                    replacements: {
                        sid: studentId,
                        stud_clg_id: null, // Will be generated by institution
                        uid: userId, // Will be updated after user creation
                        program_id: program_id,
                        cat_id: cat_id || null,
                        seat_type_id: seat_type_id || null,
                        branch_id: branch_id,
                        personal_details_id: personalDetailsId,
                        father_id: fatherId,
                        mother_id: motherId,
                        guardian_id: guardianId,
                        academic_year: academic_year || null,
                        doc_ids: docIds,
                        dd_id: ddId,
                        neft_id: neftId,
                        physically_handicap: 0,
                        defence_status: 0,
                        received_scholarship: 0,
                        details_of_prize: 0,
                        special_talent: 0,
                        final_submit: 0,
                        RowNum: 0,
                    },
                    type: this.db.Sequelize.QueryTypes.INSERT,
                    transaction,
                }
            );

            // 6. Update student_personaldetails with stud_id
            await this.db.sequelize.query(
                `UPDATE student_personaldetails 
         SET stud_id = :stud_id 
         WHERE personal_id = :personal_id`,
                {
                    replacements: {
                        stud_id: studentId,
                        personal_id: personalDetailsId,
                    },
                    type: this.db.Sequelize.QueryTypes.UPDATE,
                    transaction,
                }
            );

            // 7. Hash password and create user
            const hashedPassword = await bcrypt.hash(password, 10);

            await this.db.sequelize.query(
                `INSERT INTO users 
         (uid, email, user_type, password, student_id, is_active, createdAt, updatedAt) 
         VALUES 
         (:uid, :email, :user_type, :password, :student_id, :is_active, NOW(), NOW())`,
                {
                    replacements: {
                        uid: userId,
                        email: email,
                        user_type: 3, // Student user type
                        password: hashedPassword,
                        student_id: studentId,
                        is_active: true,
                    },
                    type: this.db.Sequelize.QueryTypes.INSERT,
                    transaction,
                }
            );

            // 8. Update student with uid
            await this.db.sequelize.query(
                `UPDATE students SET uid = :uid WHERE sid = :sid`,
                {
                    replacements: {
                        uid: userId,
                        sid: studentId,
                    },
                    type: this.db.Sequelize.QueryTypes.UPDATE,
                    transaction,
                }
            );

            // Commit transaction
            await transaction.commit();

            // Return the complete student data using raw SQL
            const [studentData] = await this.db.sequelize.query(
                `SELECT 
          u.uid, 
          u.email, 
          u.user_type,
          s.sid, 
          s.stud_clg_id,
          s.program_id,
          s.cat_id,
          s.seat_type_id,
          s.branch_id,
          s.academic_year,
          spd.personal_id,
          spd.name,
          spd.first_name,
          spd.middle_name,
          spd.last_name,
          spd.mother_name,
          spd.gender_id,
          spd.dob,
          spd.contact,
          spd.email as personal_email,
          f.fullname as father_name,
          f.contact as father_contact,
          f.email as father_email,
          m.fullname as mother_name,
          m.contact as mother_contact,
          m.email as mother_email,
          g.fullname as guardian_name,
          g.contact as guardian_contact,
          g.email as guardian_email
        FROM users u
        LEFT JOIN students s ON s.uid = u.uid
        LEFT JOIN student_personaldetails spd ON spd.personal_id = s.personal_details_id
        LEFT JOIN student_parentdetail f ON f.parent_id = s.father_id
        LEFT JOIN student_parentdetail m ON m.parent_id = s.mother_id
        LEFT JOIN student_parentdetail g ON g.parent_id = s.guardian_id
        WHERE u.uid = :uid`,
                {
                    replacements: { uid: userId },
                    type: this.db.Sequelize.QueryTypes.SELECT,
                }
            );

            return {
                success: true,
                user: {
                    uid: studentData.uid,
                    email: studentData.email,
                    user_type: studentData.user_type,
                },
                student: studentData,
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async checkEmailExists(email) {
        const [user] = await this.db.sequelize.query(
            `SELECT uid, email FROM users WHERE email = :email`,
            {
                replacements: { email: email },
                type: this.db.Sequelize.QueryTypes.SELECT,
            }
        );
        return !!user;
    }
}

module.exports = RegistrationService;