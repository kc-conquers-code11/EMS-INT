process.env.DB_NAME = 'ems';

const request = require('supertest');
const app = require('../../index.js');
const sequelize = require('../../config/db.js');

describe('Subject Type API Integration Tests', () => {
  let authToken;
  let validSchemeId;
  let createdSubjectId;
  let existingSubjectTypes = [];
  let testSubjectType = 'TestType'; // Use shorter type name

  beforeAll(async () => {
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

    // Get a valid scheme ID
    try {
      const [schemes] = await sequelize.query(
        'SELECT scheme_id FROM scheme WHERE deletedAt IS NULL LIMIT 1'
      );
      if (schemes && schemes.length > 0) {
        validSchemeId = schemes[0].scheme_id;
        console.log('✅ Found scheme:', validSchemeId);
      } else {
        console.log('⚠️ No scheme found, skipping tests that need scheme');
      }
    } catch (error) {
      console.error('Error fetching scheme:', error.message);
    }

    // Get existing subject types
    try {
      const [types] = await sequelize.query(
        'SELECT DISTINCT subject_type FROM subject WHERE subject_type IS NOT NULL AND subject_type != "" LIMIT 5'
      );
      existingSubjectTypes = types.map((t) => t.subject_type);
      console.log('✅ Found subject types:', existingSubjectTypes);

      // If no types exist, create one for testing
      if (existingSubjectTypes.length === 0 && validSchemeId) {
        await sequelize.query(
          `INSERT INTO subject (subject_id, scheme_id, subject_name, subject_type, credits, sem, status) 
           VALUES (UUID(), ?, 'Test Subject', 'Theory', 3, 1, 1)`,
          {
            replacements: [validSchemeId],
            type: sequelize.QueryTypes.INSERT,
          }
        );
        existingSubjectTypes = ['Theory'];
        console.log('✅ Created test subject type: Theory');
      }
    } catch (error) {
      console.error('Error fetching subject types:', error.message);
    }
  });

  afterAll(async () => {
    // Clean up test subjects
    if (createdSubjectId) {
      try {
        await sequelize.query('DELETE FROM subject WHERE subject_id = ?', {
          replacements: [createdSubjectId],
          type: sequelize.QueryTypes.DELETE,
        });
      } catch (error) {
        console.error('Cleanup error:', error.message);
      }
    }

    // Clean up any test types created
    try {
      await sequelize.query('DELETE FROM subject WHERE subject_type LIKE ?', {
        replacements: ['%_Test_%'],
        type: sequelize.QueryTypes.DELETE,
      });
    } catch (error) {
      console.error('Cleanup error:', error.message);
    }

    await sequelize.close();
  });

  describe('GET Endpoints', () => {
    it('should get all subject types with pagination', async () => {
      const response = await request(app)
        .get('/api/v1/subject-types?page=1&limit=10')
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.total).toBeDefined();
      expect(response.body.page).toBe(1);
    });

    it('should get subject types dropdown', async () => {
      const response = await request(app)
        .get('/api/v1/subject-types/dropdown')
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      if (response.body.data.length > 0) {
        expect(response.body.data[0]).toHaveProperty('value');
        expect(response.body.data[0]).toHaveProperty('label');
        expect(response.body.data[0]).toHaveProperty('subject_count');
      }
    });

    it('should get usage statistics', async () => {
      const response = await request(app)
        .get('/api/v1/subject-types/stats/usage')
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.summary).toBeDefined();
      expect(response.body.data.summary.total_subjects).toBeDefined();
      expect(response.body.data.summary.unique_subject_types).toBeDefined();
      expect(Array.isArray(response.body.data.breakdown)).toBe(true);
    });
  });

  describe('POST Endpoints', () => {
    it('should create a new custom subject type', async () => {
      // Keep within 20 character limit
      const newType = 'Custom_' + Date.now().toString().slice(-8);

      const response = await request(app)
        .post('/api/v1/subject-types')
        .set('Cookie', `access_token=${authToken}`)
        .send({ value: newType })
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.value).toBe(newType);

      // Store for cleanup
      testSubjectType = newType;
    });

    it('should return 400 when creating duplicate subject type', async () => {
      if (existingSubjectTypes.length === 0) {
        console.log('⚠️ Skipping test - no subject types found');
        return;
      }

      await request(app)
        .post('/api/v1/subject-types')
        .set('Cookie', `access_token=${authToken}`)
        .send({ value: existingSubjectTypes[0] })
        .expect(400);
    });

    it('should return 400 when creating subject type with invalid format', async () => {
      await request(app)
        .post('/api/v1/subject-types')
        .set('Cookie', `access_token=${authToken}`)
        .send({ value: '@Invalid!' })
        .expect(400);
    });
  });

  describe('GET by Value Endpoints', () => {
    it('should get subject type by value', async () => {
      if (existingSubjectTypes.length === 0) {
        console.log('⚠️ Skipping test - no subject types found');
        return;
      }

      const typeValue = existingSubjectTypes[0];
      const response = await request(app)
        .get(`/api/v1/subject-types/${encodeURIComponent(typeValue)}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.value).toBe(typeValue);
      expect(response.body.data.total_subjects).toBeDefined();
    });

    it('should return 404 for non-existent subject type', async () => {
      await request(app)
        .get('/api/v1/subject-types/NonExistentType123')
        .set('Cookie', `access_token=${authToken}`)
        .expect(404);
    });

    it('should get subjects by subject type', async () => {
      if (existingSubjectTypes.length === 0) {
        console.log('⚠️ Skipping test - no subject types found');
        return;
      }

      const typeValue = existingSubjectTypes[0];
      const response = await request(app)
        .get(
          `/api/v1/subject-types/${encodeURIComponent(typeValue)}/subjects?page=1&limit=10`
        )
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.subject_type).toBe(typeValue);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.total).toBeDefined();
    });
  });

  describe('PUT Update Endpoints', () => {
    it('should rename a subject type (keeping within 20 char limit)', async () => {
      if (existingSubjectTypes.length === 0) {
        console.log('⚠️ Skipping test - no subject types found');
        return;
      }

      const oldType = existingSubjectTypes[0];
      // Ensure new name is within 20 characters
      const newType = oldType.slice(0, 10) + '_Ren';

      // Skip if newType would be too long
      if (newType.length > 20) {
        console.log('⚠️ Skipping rename - new name would exceed 20 chars');
        return;
      }

      const response = await request(app)
        .put(`/api/v1/subject-types/${encodeURIComponent(oldType)}`)
        .set('Cookie', `access_token=${authToken}`)
        .send({ new_value: newType })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.old_value).toBe(oldType);
      expect(response.body.data.new_value).toBe(newType);

      // Rename back to original (only if original also within limit)
      if (oldType.length <= 20) {
        await request(app)
          .put(`/api/v1/subject-types/${encodeURIComponent(newType)}`)
          .set('Cookie', `access_token=${authToken}`)
          .send({ new_value: oldType });
      }
    });

    it('should return 400 when renaming to existing type', async () => {
      if (existingSubjectTypes.length < 2) {
        console.log('⚠️ Skipping test - need at least 2 subject types');
        return;
      }

      const type1 = existingSubjectTypes[0];
      const type2 = existingSubjectTypes[1];

      await request(app)
        .put(`/api/v1/subject-types/${encodeURIComponent(type1)}`)
        .set('Cookie', `access_token=${authToken}`)
        .send({ new_value: type2 })
        .expect(400);
    });
  });

  describe('PATCH Bulk Update Endpoints', () => {
    beforeAll(async () => {
      // Create a test subject for bulk update
      if (validSchemeId) {
        try {
          // First check if subject already exists
          const [existing] = await sequelize.query(
            `SELECT subject_id FROM subject WHERE subject_name = 'Bulk Test Subject' LIMIT 1`
          );

          if (existing && existing.length > 0) {
            createdSubjectId = existing[0].subject_id;
          } else {
            const [result] = await sequelize.query(
              `INSERT INTO subject (subject_id, scheme_id, subject_name, subject_type, credits, sem, status) 
               VALUES (UUID(), ?, 'Bulk Test Subject', 'Initial', 3, 1, 1)`,
              {
                replacements: [validSchemeId],
                type: sequelize.QueryTypes.INSERT,
              }
            );

            const [created] = await sequelize.query(
              `SELECT subject_id FROM subject WHERE subject_name = 'Bulk Test Subject' ORDER BY createdAt DESC LIMIT 1`
            );
            if (created && created.length > 0) {
              createdSubjectId = created[0].subject_id;
            }
          }
          console.log('✅ Created test subject for bulk update');
        } catch (error) {
          console.error('Error creating test subject:', error.message);
        }
      }
    });

    it('should bulk update subject types', async () => {
      if (!createdSubjectId) {
        console.log('⚠️ Skipping test - no test subject created');
        return;
      }

      const response = await request(app)
        .patch('/api/v1/subject-types/bulk-update')
        .set('Cookie', `access_token=${authToken}`)
        .send({
          updates: [{ subject_id: createdSubjectId, subject_type: 'BulkType' }],
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.success).toBeDefined();
      expect(response.body.data.failed).toBeDefined();
    });

    it('should return 400 for empty updates array', async () => {
      await request(app)
        .patch('/api/v1/subject-types/bulk-update')
        .set('Cookie', `access_token=${authToken}`)
        .send({ updates: [] })
        .expect(400);
    });
  });

  describe('DELETE Endpoints', () => {
    it('should delete a subject type', async () => {
      // Keep within 20 character limit
      const deleteType = 'Del_' + Date.now().toString().slice(-8);

      // Ensure type name is within 20 chars
      if (deleteType.length > 20) {
        console.log('⚠️ Delete type name too long, skipping');
        return;
      }

      // Create a subject with this type
      if (validSchemeId) {
        try {
          await sequelize.query(
            `INSERT INTO subject (subject_id, scheme_id, subject_name, subject_type, credits, sem, status) 
             VALUES (UUID(), ?, 'Temp Subject', ?, 2, 1, 1)`,
            {
              replacements: [validSchemeId, deleteType],
              type: sequelize.QueryTypes.INSERT,
            }
          );
          console.log('✅ Created test subject for deletion');
        } catch (error) {
          console.error('Error creating test subject:', error.message);
          return;
        }
      } else {
        console.log('⚠️ No scheme found, skipping delete test');
        return;
      }

      const response = await request(app)
        .delete(`/api/v1/subject-types/${encodeURIComponent(deleteType)}`)
        .set('Cookie', `access_token=${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.deleted_type).toBe(deleteType);

      // Clean up
      await sequelize.query('DELETE FROM subject WHERE subject_type = ?', {
        replacements: [deleteType],
        type: sequelize.QueryTypes.DELETE,
      });
    });

    it('should return 404 when deleting non-existent type', async () => {
      await request(app)
        .delete('/api/v1/subject-types/NonExistentType123')
        .set('Cookie', `access_token=${authToken}`)
        .expect(404);
    });
  });

  describe('Negative Testing (Edge Cases)', () => {
    it('should return 400 for invalid pagination parameters', async () => {
      await request(app)
        .get('/api/v1/subject-types?page=-1&limit=10')
        .set('Cookie', `access_token=${authToken}`)
        .expect(400);
    });

    it('should return 400 for limit exceeding maximum', async () => {
      await request(app)
        .get('/api/v1/subject-types?page=1&limit=200')
        .set('Cookie', `access_token=${authToken}`)
        .expect(400);
    });

    it('should handle search with no results', async () => {
      const response = await request(app)
        .get('/api/v1/subject-types?search=NonExistentSearchTermXYZ')
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.total).toBe(0);
      expect(response.body.data).toEqual([]);
    });
  });
});
