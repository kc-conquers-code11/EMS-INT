const request = require('supertest');
const app = require('../../index.js');
const sequelize = require('../../config/db.js');

describe('Programme API Integration Tests', () => {
  let authToken;
  let validInstitutionId;
  let validDepartId;
  let createdProgrammeId;
  let programmeWithBranchesId;

  // Known seeded UUIDs for smoke testing (from ems_seed.sql)
  const seededProgrammeId = 'b8f62072-4115-4978-9de6-3272308a4f59';
  const seededInstitutionId = '4739f88f-fec7-4aa9-92b1-4636d62a828d';
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

    // Fetch an existing programme to extract valid institution and department IDs
    const response = await request(app)
      .get('/api/v1/programme')
      .set('Cookie', `access_token=${authToken}`);

    if (response.body.data && response.body.data.length > 0) {
      validInstitutionId = response.body.data[0].institution_id;
      validDepartId = response.body.data[0].depart_id;

      // We need a programme that has branches for the data integrity test
      const branchRes = await request(app)
        .get('/api/v1/branch')
        .set('Cookie', `access_token=${authToken}`);
      if (branchRes.body.data && branchRes.body.data.length > 0) {
        programmeWithBranchesId = branchRes.body.data[0].programm_id;
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
    it('should verify the pre-seeded programme exists and matches data', async () => {
      const response = await req()
        .get(`/api/v1/programme/${seededProgrammeId}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.programm_id).toBe(seededProgrammeId);
      expect(response.body.data.programme_name).toBe(
        'Bachelor of Engineering - Computer'
      );
      expect(response.body.data.institution_id).toBe(seededInstitutionId);
      expect(response.body.data.depart_id).toBe(seededDepartId);
    });
  });

  describe('Additional GET Endpoints', () => {
    it('should fetch dropdown list of programmes', async () => {
      const response = await req()
        .get('/api/v1/programme/dropdown')
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.groupedByDepartment).toBeDefined();
    });

    it('should fetch programmes by department ID', async () => {
      const response = await req()
        .get(`/api/v1/programme/department/${seededDepartId}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].depart_id).toBe(seededDepartId);
    });

    it('should fetch programmes by institution ID', async () => {
      const response = await req()
        .get(`/api/v1/programme/institution/${seededInstitutionId}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].institution_id).toBe(seededInstitutionId);
    });

    it('should check department programmes (deletion warning check)', async () => {
      const response = await req()
        .get(`/api/v1/programme/department/${seededDepartId}/check`)
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.hasProgrammes).toBeDefined();
    });
  });

  describe('Positive Testing (The Happy Path)', () => {
    it('should create a new programme', async () => {
      const response = await req()
        .post('/api/v1/programme')
        .set('Cookie', `access_token=${authToken}`)
        .send({
          institution_id: validInstitutionId,
          depart_id: validDepartId,
          programme_name: 'Test Integration Programme',
          programme_code: 'TEST-PROG',
          degree_type: 'UG',
          duration_years: 4,
          total_semesters: 8,
        })
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.programm_id).toBeDefined();
      createdProgrammeId = response.body.data.programm_id;
    });

    it('should get all programmes', async () => {
      const response = await req()
        .get('/api/v1/programme')
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should get a programme by ID', async () => {
      const response = await req()
        .get(`/api/v1/programme/${createdProgrammeId}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.programm_id).toBe(createdProgrammeId);
    });

    it('should update the programme', async () => {
      const response = await req()
        .put(`/api/v1/programme/${createdProgrammeId}`)
        .set('Cookie', `access_token=${authToken}`)
        .send({
          programme_name: 'Updated Test Programme',
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.programme_name).toBe('Updated Test Programme');
    });

    it('should soft delete the programme', async () => {
      const response = await req()
        .delete(`/api/v1/programme/${createdProgrammeId}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should fetch from the trash bin (get deleted)', async () => {
      const response = await req()
        .get('/api/v1/programme/deleted')
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      const isDeletedPresent = response.body.data.some(
        (prog) => prog.programm_id === createdProgrammeId
      );
      expect(isDeletedPresent).toBe(true);
    });

    it('should restore the soft deleted programme', async () => {
      const response = await req()
        .put(`/api/v1/programme/${createdProgrammeId}/restore`)
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should permanently delete the programme', async () => {
      const response = await req()
        .delete(`/api/v1/programme/${createdProgrammeId}/permanent`)
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify it's actually gone
      await req()
        .get(`/api/v1/programme/${createdProgrammeId}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(404);
    });
  });

  describe('Negative Testing (Edge Cases)', () => {
    const invalidUuid = 'not-a-valid-uuid';
    const nonExistentUuid = '123e4567-e89b-12d3-a456-426614174000';

    it('should return 400 when GET with invalid UUID', async () => {
      await req()
        .get(`/api/v1/programme/${invalidUuid}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(400);
    });

    it('should return 400 when UPDATE with invalid UUID', async () => {
      await req()
        .put(`/api/v1/programme/${invalidUuid}`)
        .set('Cookie', `access_token=${authToken}`)
        .send({ programme_name: 'Test' })
        .expect(400);
    });

    it('should return 400 when DELETE with invalid UUID', async () => {
      await req()
        .delete(`/api/v1/programme/${invalidUuid}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(400);
    });

    it('should return 404 when GET non-existent UUID', async () => {
      await req()
        .get(`/api/v1/programme/${nonExistentUuid}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(404);
    });

    it('should return 404 when UPDATE non-existent UUID', async () => {
      await req()
        .put(`/api/v1/programme/${nonExistentUuid}`)
        .set('Cookie', `access_token=${authToken}`)
        .send({ programme_name: 'Test' })
        .expect(404);
    });

    it('should return 404 when DELETE non-existent UUID', async () => {
      await req()
        .delete(`/api/v1/programme/${nonExistentUuid}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(404);
    });

    it('should return 400 when trying to create a duplicate programme in the same department', async () => {
      // Create first
      const firstRes = await req()
        .post('/api/v1/programme')
        .set('Cookie', `access_token=${authToken}`)
        .send({
          institution_id: validInstitutionId,
          depart_id: validDepartId,
          programme_name: 'Duplicate Test Programme',
        });

      const newProgId = firstRes.body.data
        ? firstRes.body.data.programm_id
        : null;
      if (newProgId) {
        // Try duplicate
        await req()
          .post('/api/v1/programme')
          .set('Cookie', `access_token=${authToken}`)
          .send({
            institution_id: validInstitutionId,
            depart_id: validDepartId,
            programme_name: 'Duplicate Test Programme',
          })
          .expect(400);

        // Cleanup
        await req()
          .delete(`/api/v1/programme/${newProgId}/permanent`)
          .set('Cookie', `access_token=${authToken}`);
      }
    });

    it('should return 400 when restoring a record that has not been deleted', async () => {
      // First create an active record
      const activeRes = await req()
        .post('/api/v1/programme')
        .set('Cookie', `access_token=${authToken}`)
        .send({
          institution_id: validInstitutionId,
          depart_id: validDepartId,
          programme_name: 'Active Programme to Restore',
        });

      const activeId = activeRes.body.data
        ? activeRes.body.data.programm_id
        : null;
      if (activeId) {
        // Try to restore it (it's not deleted)
        await req()
          .put(`/api/v1/programme/${activeId}/restore`)
          .set('Cookie', `access_token=${authToken}`)
          .expect(400);

        // Cleanup
        await req()
          .delete(`/api/v1/programme/${activeId}/permanent`)
          .set('Cookie', `access_token=${authToken}`);
      }
    });
  });

  describe('Data Integrity Testing (CRITICAL)', () => {
    it('should prevent permanent deletion of a programme with attached branches', async () => {
      if (programmeWithBranchesId) {
        const response = await req()
          .delete(`/api/v1/programme/${programmeWithBranchesId}/permanent`)
          .set('Cookie', `access_token=${authToken}`)
          .expect('Content-Type', /json/)
          .expect(400);

        expect(response.body.success).toBe(false);
      } else {
        console.warn(
          'Skipping data integrity test: No existing programme with branches found.'
        );
      }
    });
  });
});
