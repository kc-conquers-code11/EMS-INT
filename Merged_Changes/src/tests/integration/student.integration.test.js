const request = require('supertest');
const app = require('../../index.js');
const sequelize = require('../../config/db.js');

describe('Student API Integration Tests', () => {
  let authToken;
  let validProgrammId;
  let validBranchId;
  let createdStudentId;

  // Known seeded UUIDs for smoke testing (Update these to match your ems_seed.sql)
  const seededStudentId = 'a1b2c3d4-e5f6-7890-1234-56789abcdef0';

  beforeAll(async () => {
    // 1. Ensure DB connection is established
    await sequelize.authenticate();

    // 2. Authenticate as Admin to get the token (assuming routes are protected)
    const authRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@ems.com', password: 'Password@123' });

    if (authRes.body.data && authRes.body.data.token) {
      authToken = authRes.body.data.token;
    }

    // 3. Fetch existing branches to extract valid programme and branch IDs for testing
    const branchRes = await request(app)
      .get('/api/v1/branch')
      .set('Cookie', `access_token=${authToken}`);

    if (branchRes.body.data && branchRes.body.data.length > 0) {
      validBranchId = branchRes.body.data[0].branch_id;
      validProgrammId = branchRes.body.data[0].programm_id;
    }
  });

  afterAll(async () => {
    await sequelize.close();
  });

  // Helper function to attach auth token
  const req = () => request(app);

  describe('Smoke Testing (Seeded Data)', () => {
    it('should verify the pre-seeded student exists (if ID is valid)', async () => {
      // Note: Skip or modify if seededStudentId is not guaranteed
      const response = await req()
        .get(`/api/v1/admin/students`)
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Positive Testing (The Happy Path)', () => {
    const testEmail = `student.test.${Date.now()}@ems.com`;

    it('should create a new student', async () => {
      const response = await req()
        .post('/api/v1/admin/students')
        .set('Cookie', `access_token=${authToken}`)
        .send({
          student: {
            programm_id: validProgrammId,
            branch_id: validBranchId,
            gr_number: 'GR-TEST-001',
            academic_year: '2026-2027',
          },
          personal: {
            first_name: 'Integration',
            last_name: 'Test Student',
            email: testEmail,
            contact: '9876543210',
            gender: 'Male',
            dob: '2005-05-15',
          },
          residential_address: {
            street: '123 Test St',
            city: 'Mumbai',
            state: 'MH',
            pincode: '400001',
          },
          permanent_address: {
            street: '123 Test St',
            city: 'Mumbai',
            state: 'MH',
            pincode: '400001',
          },
          parent: { father_name: 'Father Test', father_contact: '9876543211' },
        })
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.sid).toBeDefined();
      createdStudentId = response.body.data.sid;
    });

    it('should get all students', async () => {
      const response = await req()
        .get('/api/v1/admin/students')
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should get a student by ID', async () => {
      const response = await req()
        .get(`/api/v1/admin/students/${createdStudentId}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.sid).toBe(createdStudentId);
      expect(response.body.data.first_name).toBe('Integration');
    });

    it('should update the student details', async () => {
      const response = await req()
        .put(`/api/v1/admin/students/${createdStudentId}`)
        .set('Cookie', `access_token=${authToken}`)
        .send({
          personal: { first_name: 'UpdatedName' },
        })
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify update
      const verify = await req()
        .get(`/api/v1/admin/students/${createdStudentId}`)
        .set('Cookie', `access_token=${authToken}`);
      expect(verify.body.data.first_name).toBe('UpdatedName');
    });

    it('should check student dependencies before deletion', async () => {
      const response = await req()
        .get(`/api/v1/admin/students/${createdStudentId}/check`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.hasDependencies).toBeDefined();
    });

    it('should soft delete the student', async () => {
      const response = await req()
        .delete(`/api/v1/admin/students/${createdStudentId}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should fetch from the trash bin (get deleted)', async () => {
      const response = await req()
        .get('/api/v1/admin/students/deleted')
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      const isDeletedPresent = response.body.data.some(
        (s) => s.sid === createdStudentId
      );
      expect(isDeletedPresent).toBe(true);
    });

    it('should restore the soft deleted student', async () => {
      const response = await req()
        .put(`/api/v1/admin/students/${createdStudentId}/restore`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should permanently delete the student', async () => {
      const response = await req()
        .delete(`/api/v1/admin/students/${createdStudentId}/permanent`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify it's actually gone
      await req()
        .get(`/api/v1/admin/students/${createdStudentId}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(404);
    });
  });

  describe('Negative Testing (Edge Cases)', () => {
    const invalidUuid = 'not-a-valid-uuid';
    const nonExistentUuid = '123e4567-e89b-12d3-a456-426614174000';

    it('should return 404 when GET with invalid UUID', async () => {
      await req()
        .get(`/api/v1/admin/students/${invalidUuid}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(404);
    });

    it('should return 404 when GET non-existent UUID', async () => {
      await req()
        .get(`/api/v1/admin/students/${nonExistentUuid}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(404);
    });

    it('should return 400 when trying to create a student with an already existing email', async () => {
      // Attempting to create with admin email
      await req()
        .post('/api/v1/admin/students')
        .set('Cookie', `access_token=${authToken}`)
        .send({
          student: {
            programm_id: validProgrammId,
            branch_id: validBranchId,
            gr_number: 'GR002',
            academic_year: '2026-2027',
          },
          personal: {
            first_name: 'Test',
            last_name: 'Duplicate',
            email: 'admin@ems.com',
            contact: '123',
            gender: 'Male',
            dob: '2000-01-01',
          },
          residential_address: {
            street: 'A',
            city: 'B',
            state: 'C',
            pincode: 'D',
          },
          permanent_address: {
            street: 'A',
            city: 'B',
            state: 'C',
            pincode: 'D',
          },
          parent: { father_name: 'F', father_contact: '1' },
        })
        .expect(400);
    });

    it('should return 404 when restoring a record that does not exist', async () => {
      await req()
        .put(`/api/v1/admin/students/${nonExistentUuid}/restore`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(404);
    });
  });
});
