process.env.DB_NAME = 'ems';

const request = require('supertest');
const app = require('../../index.js');
const sequelize = require('../../config/db.js');

describe('Semester API Integration Tests', () => {
  let authToken;
  let validProgrammId;
  let validAcademicId;
  let createdSemesterId;

  beforeAll(async () => {
    // Ensure DB connection is established
    try {
      await sequelize.authenticate();
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Unable to connect to database:', error.message);
    }

    // Authenticate to get token
    try {
      const authRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'admin@ems.com', password: 'Password@123' });

      if (authRes.body.data && authRes.body.data.token) {
        authToken = authRes.body.data.token;
        console.log('✅ Authenticated successfully');
      } else {
        console.error('❌ Authentication failed:', authRes.body);
      }
    } catch (error) {
      console.error('Error during authentication:', error.message);
    }

    // Get a valid programme ID from the database
    try {
      const [programmes] = await sequelize.query(
        'SELECT programm_id FROM programme WHERE deletedAt IS NULL LIMIT 1'
      );
      if (programmes && programmes.length > 0) {
        validProgrammId = programmes[0].programm_id;
        console.log('✅ Found programme:', validProgrammId);
      } else {
        console.log('⚠️ No programmes found in database');
      }
    } catch (error) {
      console.error('Error fetching programme:', error.message);
    }

    // Get a valid academic year ID
    try {
      const [academicYears] = await sequelize.query(
        'SELECT academic_id FROM academic_year WHERE deletedAt IS NULL LIMIT 1'
      );
      if (academicYears && academicYears.length > 0) {
        validAcademicId = academicYears[0].academic_id;
        console.log('✅ Found academic year:', validAcademicId);
      } else {
        console.log('⚠️ No academic years found in database');
      }
    } catch (error) {
      console.error('Error fetching academic year:', error.message);
    }
  });

  afterAll(async () => {
    // Clean up any test data created
    if (createdSemesterId) {
      try {
        await sequelize.query('DELETE FROM semester WHERE semester_id = ?', {
          replacements: [createdSemesterId],
          type: sequelize.QueryTypes.DELETE,
        });
        console.log('✅ Cleaned up test semester');
      } catch (error) {
        console.error('Cleanup error:', error.message);
      }
    }
    await sequelize.close();
  });

  describe('Positive Testing (The Happy Path)', () => {
    it('should create a new semester', async () => {
      if (!validProgrammId || !validAcademicId) {
        console.log(
          '⚠️ Skipping test - no valid programme or academic year found'
        );
        return;
      }

      const requestBody = {
        programm_id: validProgrammId,
        academic_id: validAcademicId,
        semester_number: 12,
        term: 'odd',
        start_date: '2024-08-01',
        end_date: '2024-12-20',
        is_active: true,
      };

      console.log('📤 Creating semester with:', requestBody);

      const response = await request(app)
        .post('/api/v1/semesters')
        .set('Cookie', `access_token=${authToken}`)
        .send(requestBody);

      console.log('📥 Response status:', response.status);
      console.log('📥 Response body:', response.body);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.semester_id).toBeDefined();
      createdSemesterId = response.body.data.semester_id;
      console.log('✅ Created semester:', createdSemesterId);
    });

    it('should get all semesters', async () => {
      const response = await request(app)
        .get('/api/v1/semesters?page=1&limit=10')
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.total).toBeDefined();
    });

    it('should get a semester by ID', async () => {
      if (!createdSemesterId) {
        console.log('⚠️ Skipping test - no semester created');
        return;
      }

      const response = await request(app)
        .get(`/api/v1/semesters/${createdSemesterId}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.semester_id).toBe(createdSemesterId);
      expect(response.body.data.programme).toBeDefined();
      expect(response.body.data.academic_year).toBeDefined();
    });

    it('should update the semester', async () => {
      if (!createdSemesterId) {
        console.log('⚠️ Skipping test - no semester created');
        return;
      }

      const response = await request(app)
        .put(`/api/v1/semesters/${createdSemesterId}`)
        .set('Cookie', `access_token=${authToken}`)
        .send({
          term: 'even',
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.term).toBe('even');
    });

    it('should update semester status (deactivate)', async () => {
      if (!createdSemesterId) {
        console.log('⚠️ Skipping test - no semester created');
        return;
      }

      const response = await request(app)
        .patch(`/api/v1/semesters/${createdSemesterId}/status`)
        .set('Cookie', `access_token=${authToken}`)
        .send({ is_active: false })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Semester deactivated successfully');
    });

    it('should update semester status (activate)', async () => {
      if (!createdSemesterId) {
        console.log('⚠️ Skipping test - no semester created');
        return;
      }

      const response = await request(app)
        .patch(`/api/v1/semesters/${createdSemesterId}/status`)
        .set('Cookie', `access_token=${authToken}`)
        .send({ is_active: true })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Semester activated successfully');
    });

    it('should soft delete the semester', async () => {
      if (!createdSemesterId) {
        console.log('⚠️ Skipping test - no semester created');
        return;
      }

      const response = await request(app)
        .delete(`/api/v1/semesters/${createdSemesterId}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Semester deleted successfully');
    });

    it('should restore the soft deleted semester', async () => {
      if (!createdSemesterId) {
        console.log('⚠️ Skipping test - no semester created');
        return;
      }

      const response = await request(app)
        .put(`/api/v1/semesters/${createdSemesterId}/restore`)
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Semester restored successfully');
    });

    it('should get deleted semesters', async () => {
      const response = await request(app)
        .get('/api/v1/semesters/deleted?page=1&limit=10')
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should permanently delete the semester', async () => {
      if (!createdSemesterId) {
        console.log('⚠️ Skipping test - no semester created');
        return;
      }

      const response = await request(app)
        .delete(`/api/v1/semesters/${createdSemesterId}/permanent`)
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(
        'Semester permanently deleted successfully'
      );

      // Verify it's actually gone
      await request(app)
        .get(`/api/v1/semesters/${createdSemesterId}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(404);

      createdSemesterId = null;
    });
  });

  describe('GET Endpoints', () => {
    it('should fetch dropdown list of semesters', async () => {
      const response = await request(app)
        .get('/api/v1/semesters/dropdown')
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.groupedByProgramme).toBeDefined();
    });

    it('should fetch semesters by programme ID if programme exists', async () => {
      if (!validProgrammId) {
        console.log('⚠️ Skipping test - no valid programme found');
        return;
      }

      const response = await request(app)
        .get(`/api/v1/semesters/programme/${validProgrammId}?page=1&limit=10`)
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.programme_name).toBeDefined();
    });

    it('should fetch semesters by academic year if academic year exists', async () => {
      if (!validAcademicId) {
        console.log('⚠️ Skipping test - no valid academic year found');
        return;
      }

      const response = await request(app)
        .get(
          `/api/v1/semesters/academic-year/${validAcademicId}?page=1&limit=10`
        )
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.academic_name).toBeDefined();
    });
  });

  describe('Negative Testing (Edge Cases)', () => {
    const invalidUuid = 'not-a-valid-uuid';
    const nonExistentUuid = '00000000-0000-0000-0000-000000000000';

    it('should return 400 when GET with invalid UUID', async () => {
      await request(app)
        .get(`/api/v1/semesters/${invalidUuid}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(400);
    });

    it('should return 400 when UPDATE with invalid UUID', async () => {
      await request(app)
        .put(`/api/v1/semesters/${invalidUuid}`)
        .set('Cookie', `access_token=${authToken}`)
        .send({ semester_number: 2 })
        .expect(400);
    });

    it('should return 400 when DELETE with invalid UUID', async () => {
      await request(app)
        .delete(`/api/v1/semesters/${invalidUuid}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(400);
    });

    it('should return 404 when GET non-existent UUID', async () => {
      await request(app)
        .get(`/api/v1/semesters/${nonExistentUuid}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(404);
    });

    it('should return 404 when UPDATE non-existent UUID', async () => {
      await request(app)
        .put(`/api/v1/semesters/${nonExistentUuid}`)
        .set('Cookie', `access_token=${authToken}`)
        .send({ semester_number: 2 })
        .expect(404);
    });

    it('should return 404 when DELETE non-existent UUID', async () => {
      await request(app)
        .delete(`/api/v1/semesters/${nonExistentUuid}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect(404);
    });

    it('should return 400 when creating semester with invalid term', async () => {
      if (!validProgrammId || !validAcademicId) {
        console.log('⚠️ Skipping test - no valid data found');
        return;
      }

      await request(app)
        .post('/api/v1/semesters')
        .set('Cookie', `access_token=${authToken}`)
        .send({
          programm_id: validProgrammId,
          academic_id: validAcademicId,
          semester_number: 1,
          term: 'invalid-term',
        })
        .expect(400);
    });

    it('should return 400 when end date is before start date', async () => {
      if (!validProgrammId || !validAcademicId) {
        console.log('⚠️ Skipping test - no valid data found');
        return;
      }

      await request(app)
        .post('/api/v1/semesters')
        .set('Cookie', `access_token=${authToken}`)
        .send({
          programm_id: validProgrammId,
          academic_id: validAcademicId,
          semester_number: 1,
          term: 'odd',
          start_date: '2024-12-20',
          end_date: '2024-08-01',
        })
        .expect(400);
    });

    it('should return 404 when creating semester with non-existent programme', async () => {
      if (!validAcademicId) {
        console.log('⚠️ Skipping test - no valid academic year found');
        return;
      }

      await request(app)
        .post('/api/v1/semesters')
        .set('Cookie', `access_token=${authToken}`)
        .send({
          programm_id: nonExistentUuid,
          academic_id: validAcademicId,
          semester_number: 1,
          term: 'odd',
        })
        .expect(404);
    });

    it('should return 404 when creating semester with non-existent academic year', async () => {
      if (!validProgrammId) {
        console.log('⚠️ Skipping test - no valid programme found');
        return;
      }

      await request(app)
        .post('/api/v1/semesters')
        .set('Cookie', `access_token=${authToken}`)
        .send({
          programm_id: validProgrammId,
          academic_id: nonExistentUuid,
          semester_number: 1,
          term: 'odd',
        })
        .expect(404);
    });

    it('should return 400 when semester number exceeds maximum (12)', async () => {
      if (!validProgrammId || !validAcademicId) {
        console.log('⚠️ Skipping test - no valid data found');
        return;
      }

      await request(app)
        .post('/api/v1/semesters')
        .set('Cookie', `access_token=${authToken}`)
        .send({
          programm_id: validProgrammId,
          academic_id: validAcademicId,
          semester_number: 13,
          term: 'odd',
        })
        .expect(400);
    });

    it('should return 400 when semester number is negative', async () => {
      if (!validProgrammId || !validAcademicId) {
        console.log('⚠️ Skipping test - no valid data found');
        return;
      }

      await request(app)
        .post('/api/v1/semesters')
        .set('Cookie', `access_token=${authToken}`)
        .send({
          programm_id: validProgrammId,
          academic_id: validAcademicId,
          semester_number: -1,
          term: 'odd',
        })
        .expect(400);
    });
  });

  describe('Pagination', () => {
    it('should handle pagination correctly', async () => {
      const page1 = await request(app)
        .get('/api/v1/semesters?page=1&limit=5')
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);

      const page2 = await request(app)
        .get('/api/v1/semesters?page=2&limit=5')
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);

      expect(page1.body.success).toBe(true);
      expect(page2.body.success).toBe(true);
      expect(page1.body.page).toBe(1);
      expect(page2.body.page).toBe(2);
    });

    it('should handle invalid pagination parameters gracefully', async () => {
      const response = await request(app)
        .get('/api/v1/semesters?page=-1&limit=10')
        .set('Cookie', `access_token=${authToken}`)
        .expect(400);

      expect(response.body.message || response.body.errors).toBeDefined();
    });

    it('should handle large limit parameter', async () => {
      const response = await request(app)
        .get('/api/v1/semesters?page=1&limit=200')
        .set('Cookie', `access_token=${authToken}`)
        .expect(400);

      expect(response.body.message || response.body.errors).toBeDefined();
    });

    it('should handle pagination with default values', async () => {
      const response = await request(app)
        .get('/api/v1/semesters')
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.page).toBe(1);
    });
  });

  describe('Duplicate Prevention', () => {
    it('should return 400 when creating duplicate semester', async () => {
      if (!validProgrammId || !validAcademicId) {
        console.log('⚠️ Skipping test - no valid data found');
        return;
      }

      const tempSemesterNumber = 11;

      const createResponse = await request(app)
        .post('/api/v1/semesters')
        .set('Cookie', `access_token=${authToken}`)
        .send({
          programm_id: validProgrammId,
          academic_id: validAcademicId,
          semester_number: tempSemesterNumber,
          term: 'odd',
          start_date: '2024-08-01',
          end_date: '2024-12-20',
          is_active: false,
        });

      if (createResponse.status === 201) {
        const tempSemesterId = createResponse.body.data.semester_id;

        // Try to create duplicate
        await request(app)
          .post('/api/v1/semesters')
          .set('Cookie', `access_token=${authToken}`)
          .send({
            programm_id: validProgrammId,
            academic_id: validAcademicId,
            semester_number: tempSemesterNumber,
            term: 'odd',
          })
          .expect(400);

        // Clean up
        await request(app)
          .delete(`/api/v1/semesters/${tempSemesterId}/permanent`)
          .set('Cookie', `access_token=${authToken}`);
      }
    });
  });
});