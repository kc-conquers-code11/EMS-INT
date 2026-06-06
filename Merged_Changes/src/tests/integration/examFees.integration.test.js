const request = require('supertest');
const app = require('../../index.js');
const sequelize = require('../../config/db.js');

describe('Exam Fees API Integration Tests', () => {
  let authToken;
  let validProgrammId;
  let validAcademicId = 9999;
  let validSemesterId = '99994567-e89b-12d3-a456-426614174000';
  let createdFeeId;
  let insertedProgramme = false;
  let insertedAcademicYear = false;
  let insertedSemester = false;

  beforeAll(async () => {
    // Ensure DB connection is active
    await sequelize.authenticate();

    // Authenticate as Admin to get authorization token
    const authRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@ems.com', password: 'Password@123' });

    if (authRes.body.data && authRes.body.data.token) {
      authToken = authRes.body.data.token;
    }

    // Get a valid programme ID
    const [programmes] = await sequelize.query(
      'SELECT programm_id FROM programme WHERE deletedAt IS NULL LIMIT 1'
    );
    if (programmes && programmes.length > 0) {
      validProgrammId = programmes[0].programm_id;
    } else {
      // Insert a dummy programme if none exists
      validProgrammId = '999932aa-416e-42c8-b007-cc4f07e62963';
      await sequelize.query(
        "INSERT INTO programme (programm_id, institution_id, depart_id, programme_name, programme_code, degree_type, duration_years, total_semesters, status, createdAt, updatedAt) VALUES (?, '4739f88f-fec7-4aa9-92b1-4636d62a828d', 'c41ad7c3-1446-4974-9f9a-851d784eaa67', 'Test Programme', 'TEST01', 'UG', 4, 8, 1, NOW(), NOW())",
        { replacements: [validProgrammId] }
      );
      insertedProgramme = true;
    }

    // Get a valid academic year ID
    const [academicYears] = await sequelize.query(
      'SELECT academic_id FROM academic_year WHERE deletedAt IS NULL LIMIT 1'
    );
    if (academicYears && academicYears.length > 0) {
      validAcademicId = Number(academicYears[0].academic_id);
    } else {
      // Insert a temporary academic year
      validAcademicId = 9999;
      await sequelize.query(
        "INSERT IGNORE INTO academic_year (academic_id, academic_name, created_at, updatedAt) VALUES (?, '2024-2025', NOW(), NOW())",
        { replacements: [validAcademicId] }
      );
      insertedAcademicYear = true;
    }

    // Try to find a semester associated with the validProgrammId and validAcademicId
    const [semesters] = await sequelize.query(
      'SELECT semester_id FROM semester WHERE programm_id = ? AND academic_id = ? AND deleted_at IS NULL LIMIT 1',
      { replacements: [validProgrammId, validAcademicId] }
    );
    if (semesters && semesters.length > 0) {
      validSemesterId = semesters[0].semester_id;
    } else {
      // Insert a temporary semester
      validSemesterId = '99994567-e89b-12d3-a456-426614174000';
      await sequelize.query(
        "INSERT INTO semester (semester_id, programm_id, academic_id, semester_number, term, created_at, updated_at) VALUES (?, ?, ?, 1, 'odd', NOW(), NOW())",
        { replacements: [validSemesterId, validProgrammId, validAcademicId] }
      );
      insertedSemester = true;
    }
  });

  afterAll(async () => {
    // Cleanup the created exam fee mapping if any
    if (createdFeeId) {
      await sequelize.query('DELETE FROM exam_fees WHERE fee_id = ?', {
        replacements: [createdFeeId],
        type: sequelize.QueryTypes.DELETE,
      });
    }

    // Cleanup semester ONLY if we inserted it
    if (insertedSemester && validSemesterId) {
      await sequelize.query('DELETE FROM semester WHERE semester_id = ?', {
        replacements: [validSemesterId],
        type: sequelize.QueryTypes.DELETE,
      });
    }

    // Cleanup academic year ONLY if we inserted it
    if (insertedAcademicYear && validAcademicId) {
      await sequelize.query('DELETE FROM academic_year WHERE academic_id = ?', {
        replacements: [validAcademicId],
        type: sequelize.QueryTypes.DELETE,
      });
    }

    // Cleanup programme ONLY if we inserted it
    if (insertedProgramme && validProgrammId) {
      await sequelize.query('DELETE FROM programme WHERE programm_id = ?', {
        replacements: [validProgrammId],
        type: sequelize.QueryTypes.DELETE,
      });
    }
    await sequelize.close();
  });

  const req = () => request(app);

  describe('Exam Fees API Endpoints', () => {
    it('should create an exam fee mapping successfully', async () => {
      const response = await req()
        .post('/api/v1/exam-fees')
        .set('Cookie', `access_token=${authToken}`)
        .send({
          programme_id: validProgrammId,
          semester_id: validSemesterId,
          amount: 1200.5,
          late_fee: 300.0,
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.fee_id).toBeDefined();
      expect(Number(response.body.data.amount)).toBe(1200.5);
      createdFeeId = response.body.data.fee_id;
    });

    it('should fail to create a duplicate exam fee mapping (composite unique constraint)', async () => {
      const response = await req()
        .post('/api/v1/exam-fees')
        .set('Cookie', `access_token=${authToken}`)
        .send({
          programme_id: validProgrammId,
          semester_id: validSemesterId,
          amount: 1500.0,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should retrieve all exam fee mappings with pagination', async () => {
      const response = await req()
        .get('/api/v1/exam-fees?page=1&limit=5')
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.total).toBeDefined();
      expect(response.body.page).toBe(1);
      expect(response.body.totalPages).toBeDefined();
    });

    it('should filter exam fees by programme_id and semester_id', async () => {
      const response = await req()
        .get(
          `/api/v1/exam-fees?programme_id=${validProgrammId}&semester_id=${validSemesterId}`
        )
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].programme_id).toBe(validProgrammId);
      expect(response.body.data[0].semester_id).toBe(validSemesterId);
    });

    it('should dynamically calculate late fee if is_late is true', async () => {
      const response = await req()
        .get(
          `/api/v1/exam-fees?programme_id=${validProgrammId}&semester_id=${validSemesterId}&is_late=true`
        )
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      // Resolves to 1200.50 + 300.00 = 1500.50
      expect(Number(response.body.data[0].effective_fee)).toBe(1500.5);
    });

    it('should get a single exam fee mapping by ID', async () => {
      if (!createdFeeId) return;

      const response = await req()
        .get(`/api/v1/exam-fees/${createdFeeId}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.fee_id).toBe(createdFeeId);
    });

    it('should update an exam fee mapping', async () => {
      if (!createdFeeId) return;

      const response = await req()
        .put(`/api/v1/exam-fees/${createdFeeId}`)
        .set('Cookie', `access_token=${authToken}`)
        .send({
          amount: 1350.0,
          late_fee: 350.0,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Number(response.body.data.amount)).toBe(1350.0);
      expect(Number(response.body.data.late_fee)).toBe(350.0);
    });

    it('should soft delete the exam fee mapping', async () => {
      if (!createdFeeId) return;

      const response = await req()
        .delete(`/api/v1/exam-fees/${createdFeeId}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify deletion
      await req()
        .get(`/api/v1/exam-fees/${createdFeeId}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(404);
    });

    it('should retrieve deleted exam fee mappings', async () => {
      if (!createdFeeId) return;

      const response = await req()
        .get('/api/v1/exam-fees/deleted')
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      const found = response.body.data.some((f) => f.fee_id === createdFeeId);
      expect(found).toBe(true);
    });

    it('should perform dependency check on the exam fee mapping', async () => {
      if (!createdFeeId) return;

      const response = await req()
        .get(`/api/v1/exam-fees/${createdFeeId}/check`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.hasDependencies).toBe(false);
    });

    it('should restore the soft-deleted exam fee mapping', async () => {
      if (!createdFeeId) return;

      const response = await req()
        .put(`/api/v1/exam-fees/${createdFeeId}/restore`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify it is restored and readable again
      const checkRes = await req()
        .get(`/api/v1/exam-fees/${createdFeeId}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);

      expect(checkRes.body.success).toBe(true);
      expect(checkRes.body.data.fee_id).toBe(createdFeeId);
    });

    it('should permanently delete the exam fee mapping', async () => {
      if (!createdFeeId) return;

      const response = await req()
        .delete(`/api/v1/exam-fees/${createdFeeId}/permanent`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify it is completely gone
      await req()
        .get(`/api/v1/exam-fees/${createdFeeId}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(404);

      // Verify it is not in the deleted list either
      const deletedRes = await req()
        .get('/api/v1/exam-fees/deleted')
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);

      const found = deletedRes.body.data.some((f) => f.fee_id === createdFeeId);
      expect(found).toBe(false);

      createdFeeId = null; // Prevent double deletion in cleanup
    });
  });
});
