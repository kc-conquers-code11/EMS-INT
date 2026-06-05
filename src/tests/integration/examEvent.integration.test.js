const request = require('supertest');
const app = require('../../index.js');
const sequelize = require('../../config/db.js');
const crypto = require('crypto');

describe('Exam Events Reschedule API Integration Tests', () => {
  let authToken;
  let createdEventId;

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

createdEventId = crypto.randomUUID();

    // Insert a temporary exam event for testing rescheduling
    await sequelize.query(
      "INSERT INTO exam_event (event_id, event_name, createdAt, updatedAt) VALUES (?, 'Integration Test Exam Event', NOW(), NOW())",
      { replacements: [createdEventId] }
    );
  });

  afterAll(async () => {
    // Cleanup the created exam event
    if (createdEventId) {
      await sequelize.query('DELETE FROM exam_event WHERE event_id = ?', {
        replacements: [createdEventId],
        type: sequelize.QueryTypes.DELETE,
      });
    }
    await sequelize.close();
  });

  const req = () => request(app);

  describe('Exam Events Reschedule API Endpoints', () => {
    it('should reschedule an exam event successfully', async () => {
      if (!createdEventId) return;

      const response = await req()
        .put(`/api/v1/exam-events/${createdEventId}/reschedule`)
        .set('Cookie', `access_token=${authToken}`)
        .send({
          reschedule_reason: 'Rescheduled due to administrative constraints',
          updated_dates: [
            '2026-06-15T09:00:00.000Z',
            '2026-06-16T14:30:00.000Z',
          ],
        })
        .expect(200);

        console.log(response.body);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.reschedule_reason).toBe(
        'Rescheduled due to administrative constraints'
      );
      expect(response.body.data.updated_dates).toEqual([
        '2026-06-15T09:00:00.000Z',
        '2026-06-16T14:30:00.000Z',
      ]);
    });

    it('should return 400 validation error if body parameters are invalid', async () => {
      if (!createdEventId) return;

      const response = await req()
        .put(`/api/v1/exam-events/${createdEventId}/reschedule`)
        .set('Cookie', `access_token=${authToken}`)
        .send({
          reschedule_reason: 'short', // must be min 10 chars
          updated_dates: [], // must not be empty
        })
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });

    it('should return 404 when rescheduling non-existent event', async () => {
      const nonExistentUUID = crypto.randomUUID();

      const response = await req()
        .put(`/api/v1/exam-events/${nonExistentUUID}/reschedule`)
        .set('Cookie', `access_token=${authToken}`)
        .send({
          reschedule_reason: 'Rescheduled due to administrative constraints',
          updated_dates: ['2026-06-15T09:00:00.000Z'],
        })
        .expect(404);
        console.log(response.body);

      expect(response.body.success).toBe(false);
    });
  });
});
