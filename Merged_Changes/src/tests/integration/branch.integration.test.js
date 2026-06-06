const request = require('supertest');
const app = require('../../index.js');
const sequelize = require('../../config/db.js');

describe('Branch API Integration Tests', () => {
  let authToken;
  let validProgrammId;
  let validDepartId;
  let createdBranchId;

  // Known seeded UUIDs for smoke testing (from ems_seed.sql)
  const seededBranchId = '745df7c3-b302-4069-94f8-6edb71877422';
  const seededProgrammeId = 'b8f62072-4115-4978-9de6-3272308a4f59';
  const seededDepartId = 'c41ad7c3-1446-4974-9f9a-851d784eaa67';

  beforeAll(async () => {
    // Ensure DB connection is established
    await sequelize.authenticate();

    // Authenticate to get token
    const authRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@ems.com', password: 'Password@123' });

    if (authRes.body.data && authRes.body.data.token) {
      authToken = authRes.body.data.token;
    }

    // Fetch an existing branch to extract valid programme and department IDs
    const response = await request(app)
      .get('/api/v1/branch')
      .set('Cookie', `access_token=${authToken}`);

    if (response.body.data && response.body.data.length > 0) {
      validProgrammId = response.body.data[0].programm_id;
      validDepartId = response.body.data[0].depart_id;
    } else {
      // Fallback: If no branch exists, fetch a programme and use its IDs
      const progRes = await request(app)
        .get('/api/v1/programme')
        .set('Cookie', `access_token=${authToken}`);
      if (progRes.body.data && progRes.body.data.length > 0) {
        validProgrammId = progRes.body.data[0].programm_id;
        validDepartId = progRes.body.data[0].depart_id;
      }
    }
  });

  afterAll(async () => {
    // Close DB connection after all tests
    await sequelize.close();
  });

  // Helper: attach auth cookie to every request
  const req = () => request(app);

  describe('Smoke Testing (Seeded Data)', () => {
    it('should verify the pre-seeded branch exists and matches data', async () => {
      const response = await req()
        .get(`/api/v1/branch/${seededBranchId}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.branch_id).toBe(seededBranchId);
      expect(response.body.data.branch_name).toBe(
        'Computer Science & Engineering'
      );
      expect(response.body.data.programm_id).toBe(seededProgrammeId);
      expect(response.body.data.depart_id).toBe(seededDepartId);
    });
  });

  describe('Additional GET Endpoints', () => {
    it('should fetch dropdown list of branches', async () => {
      const response = await req()
        .get('/api/v1/branch/dropdown')
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.groupedByProgramme).toBeDefined();
    });

    it('should fetch branches by programme ID', async () => {
      const response = await req()
        .get(`/api/v1/branch/programme/${seededProgrammeId}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].programm_id).toBe(seededProgrammeId);
    });

    it('should fetch branches by department ID', async () => {
      const response = await req()
        .get(`/api/v1/branch/department/${seededDepartId}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].depart_id).toBe(seededDepartId);
    });

    it('should check programme branches (deletion warning check)', async () => {
      const response = await req()
        .get(`/api/v1/branch/programme/${seededProgrammeId}/check`)
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.hasBranches).toBeDefined();
    });
  });

  describe('Positive Testing (The Happy Path)', () => {
    it('should create a new branch', async () => {
      const response = await req()
        .post('/api/v1/branch')
        .set('Cookie', `access_token=${authToken}`)
        .send({
          programm_id: validProgrammId,
          depart_id: validDepartId,
          branch_name: 'Test Integration Branch',
          branch_code: 'TEST-BR',
          total_intake: 60,
          accreditation_status: 'Pending',
        })
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.branch_id).toBeDefined();
      createdBranchId = response.body.data.branch_id;
    });

    it('should get all branches', async () => {
      const response = await req()
        .get('/api/v1/branch')
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should get a branch by ID', async () => {
      const response = await req()
        .get(`/api/v1/branch/${createdBranchId}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.branch_id).toBe(createdBranchId);
    });

    it('should update the branch', async () => {
      const response = await req()
        .put(`/api/v1/branch/${createdBranchId}`)
        .set('Cookie', `access_token=${authToken}`)
        .send({
          branch_name: 'Updated Test Branch',
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.branch_name).toBe('Updated Test Branch');
    });

    it('should soft delete the branch', async () => {
      const response = await req()
        .delete(`/api/v1/branch/${createdBranchId}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should fetch from the trash bin (get deleted)', async () => {
      const response = await req()
        .get('/api/v1/branch/deleted')
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      const isDeletedPresent = response.body.data.some(
        (br) => br.branch_id === createdBranchId
      );
      expect(isDeletedPresent).toBe(true);
    });

    it('should restore the soft deleted branch', async () => {
      const response = await req()
        .put(`/api/v1/branch/${createdBranchId}/restore`)
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should permanently delete the branch', async () => {
      const response = await req()
        .delete(`/api/v1/branch/${createdBranchId}/permanent`)
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify it's actually gone
      await req()
        .get(`/api/v1/branch/${createdBranchId}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(404);
    });
  });

  describe('Negative Testing (Edge Cases)', () => {
    const invalidUuid = 'not-a-valid-uuid';
    const nonExistentUuid = '123e4567-e89b-12d3-a456-426614174000';

    it('should return 400 when GET with invalid UUID', async () => {
      await req()
        .get(`/api/v1/branch/${invalidUuid}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(400);
    });

    it('should return 400 when UPDATE with invalid UUID', async () => {
      await req()
        .put(`/api/v1/branch/${invalidUuid}`)
        .set('Cookie', `access_token=${authToken}`)
        .send({ branch_name: 'Test' })
        .expect(400);
    });

    it('should return 400 when DELETE with invalid UUID', async () => {
      await req()
        .delete(`/api/v1/branch/${invalidUuid}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(400);
    });

    it('should return 404 when GET non-existent UUID', async () => {
      await req()
        .get(`/api/v1/branch/${nonExistentUuid}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(404);
    });

    it('should return 404 when UPDATE non-existent UUID', async () => {
      await req()
        .put(`/api/v1/branch/${nonExistentUuid}`)
        .set('Cookie', `access_token=${authToken}`)
        .send({ branch_name: 'Test' })
        .expect(404);
    });

    it('should return 404 when DELETE non-existent UUID', async () => {
      await req()
        .delete(`/api/v1/branch/${nonExistentUuid}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(404);
    });

    it('should return 400 when trying to create a duplicate branch in the same programme', async () => {
      // Create first
      const firstRes = await req()
        .post('/api/v1/branch')
        .set('Cookie', `access_token=${authToken}`)
        .send({
          programm_id: validProgrammId,
          depart_id: validDepartId,
          branch_name: 'Duplicate Test Branch',
        });

      const newBrId = firstRes.body.data ? firstRes.body.data.branch_id : null;
      if (newBrId) {
        // Try duplicate
        await req()
          .post('/api/v1/branch')
          .set('Cookie', `access_token=${authToken}`)
          .send({
            programm_id: validProgrammId,
            depart_id: validDepartId,
            branch_name: 'Duplicate Test Branch',
          })
          .expect(400);

        // Cleanup
        await req()
          .delete(`/api/v1/branch/${newBrId}/permanent`)
          .set('Cookie', `access_token=${authToken}`);
      }
    });

    it('should return 400 when restoring a record that has not been deleted', async () => {
      // First create an active record
      const activeRes = await req()
        .post('/api/v1/branch')
        .set('Cookie', `access_token=${authToken}`)
        .send({
          programm_id: validProgrammId,
          depart_id: validDepartId,
          branch_name: 'Active Branch to Restore',
        });

      const activeId = activeRes.body.data
        ? activeRes.body.data.branch_id
        : null;
      if (activeId) {
        // Try to restore it (it's not deleted)
        await req()
          .put(`/api/v1/branch/${activeId}/restore`)
          .set('Cookie', `access_token=${authToken}`)
          .expect(400);

        // Cleanup
        await req()
          .delete(`/api/v1/branch/${activeId}/permanent`)
          .set('Cookie', `access_token=${authToken}`);
      }
    });
  });
});
