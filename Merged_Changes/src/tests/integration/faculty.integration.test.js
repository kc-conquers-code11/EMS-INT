const request = require('supertest');
const app = require('../../index.js');
const sequelize = require('../../config/db.js');

describe('Faculty API Integration Tests', () => {
  let authToken;
  let validDepartId;
  let validBranchId;
  let validFacultyTypeId;
  let createdFacultyId;

  beforeAll(async () => {
    await sequelize.authenticate();

    // Authenticate to get token
    const authRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@ems.com', password: 'Password@123' });

    if (authRes.body.data && authRes.body.data.token) {
      authToken = authRes.body.data.token;
    }

    // Fetch prerequisite data for creating Faculty
    const branchRes = await request(app)
      .get('/api/v1/branch')
      .set('Cookie', `access_token=${authToken}`);
    if (branchRes.body.data && branchRes.body.data.length > 0) {
      validBranchId = branchRes.body.data[0].branch_id;
      validDepartId = branchRes.body.data[0].depart_id;
    }

    // We need a faculty_type_id (Assuming there's an endpoint or we fetch via raw query for test purposes)
    const [facultyTypes] = await sequelize.query(
      'SELECT ftype_id FROM faculty_type LIMIT 1'
    );
    if (facultyTypes.length > 0) {
      validFacultyTypeId = facultyTypes[0].ftype_id;
    }
  });

  afterAll(async () => {
    await sequelize.close();
  });

  const req = () => request(app);

  describe('Positive Testing (The Happy Path)', () => {
    const testEmail = `faculty.test.${Date.now()}@ems.com`;

    it('should create a new faculty member', async () => {
      const response = await req()
        .post('/api/v1/admin/faculty')
        .set('Cookie', `access_token=${authToken}`)
        .send({
          name: 'Integration Test Professor',
          email: testEmail,
          contact: '9876543210',
          faculty_type_id: validFacultyTypeId,
          department_id: validDepartId,
          branch_id: validBranchId,
        })
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.faculty_id).toBeDefined();
      expect(response.body.data.must_reset_password).toBe(true);
      createdFacultyId = response.body.data.faculty_id;
    });

    it('should get all faculty members', async () => {
      const response = await req()
        .get('/api/v1/admin/faculty')
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should get a faculty member by ID', async () => {
      const response = await req()
        .get(`/api/v1/admin/faculty/${createdFacultyId}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.faculty_id).toBe(createdFacultyId);
      expect(response.body.data.name).toBe('Integration Test Professor');
    });

    it('should update the faculty member', async () => {
      const response = await req()
        .put(`/api/v1/admin/faculty/${createdFacultyId}`)
        .set('Cookie', `access_token=${authToken}`)
        .send({
          name: 'Updated Professor Name',
          contact: '1112223334',
        })
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify update
      const verify = await req()
        .get(`/api/v1/admin/faculty/${createdFacultyId}`)
        .set('Cookie', `access_token=${authToken}`);
      expect(verify.body.data.name).toBe('Updated Professor Name');
      expect(verify.body.data.contact).toBe('1112223334');
    });

    it('should check faculty dependencies before deletion', async () => {
      const response = await req()
        .get(`/api/v1/admin/faculty/${createdFacultyId}/check`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.hasDependencies).toBeDefined();
    });

    it('should soft delete the faculty member', async () => {
      const response = await req()
        .delete(`/api/v1/admin/faculty/${createdFacultyId}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should fetch from the trash bin (get deleted)', async () => {
      const response = await req()
        .get('/api/v1/admin/faculty/deleted')
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      const isDeletedPresent = response.body.data.some(
        (f) => f.faculty_id === createdFacultyId
      );
      expect(isDeletedPresent).toBe(true);
    });

    it('should restore the soft deleted faculty', async () => {
      const response = await req()
        .put(`/api/v1/admin/faculty/${createdFacultyId}/restore`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should permanently delete the faculty member', async () => {
      const response = await req()
        .delete(`/api/v1/admin/faculty/${createdFacultyId}/permanent`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify it's actually gone
      await req()
        .get(`/api/v1/admin/faculty/${createdFacultyId}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(404);
    });
  });

  describe('Negative Testing (Edge Cases)', () => {
    const nonExistentUuid = '123e4567-e89b-12d3-a456-426614174000';

    it('should return 400 when creating a faculty with a duplicate email', async () => {
      await req()
        .post('/api/v1/admin/faculty')
        .set('Cookie', `access_token=${authToken}`)
        .send({
          name: 'Duplicate Faculty',
          email: 'admin@ems.com', // Admin email already exists
          contact: '1234567890',
          faculty_type_id: validFacultyTypeId,
          department_id: validDepartId,
          branch_id: validBranchId,
        })
        .expect(400);
    });

    it('should return 404 when UPDATE non-existent UUID', async () => {
      await req()
        .put(`/api/v1/admin/faculty/${nonExistentUuid}`)
        .set('Cookie', `access_token=${authToken}`)
        .send({ name: 'Test' })
        .expect(404);
    });

    it('should return 404 when restoring a record that has not been deleted or does not exist', async () => {
      await req()
        .put(`/api/v1/admin/faculty/${nonExistentUuid}/restore`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(404);
    });
  });
});
