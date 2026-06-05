const {
  rescheduleExamEvent,
} = require('../../controllers/exam/examEvents.controller.js');
const examEventsService = require('../../services/exam/examEvents.service.js');

jest.mock('../../services/exam/examEvents.service.js');

describe('Exam Events Controller Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('rescheduleExamEvent', () => {
    it('should reschedule an exam event successfully', async () => {
      // Must pass valid UUID for params.event_id and schema-compliant body
      const validUUID = crypto.randomUUID();

      req.params = { event_id: validUUID };
      req.body = {
        reschedule_reason:
          'This is a valid reschedule reason longer than 10 chars',
        updated_dates: ['2026-05-24T12:00:00Z'],
      };

      const mockResult = {
        event_id: req.params.event_id,
        ...req.body,
      };
      examEventsService.rescheduleExamEvent.mockResolvedValue(mockResult);

      await rescheduleExamEvent(req, res);

      expect(examEventsService.rescheduleExamEvent).toHaveBeenCalledWith(
        req.params.event_id,
        req.body
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
        message: 'Exam event rescheduled successfully',
      });
    });

    it('should return 400 validation error if body is invalid', async () => {
      // Must pass valid UUID for params.event_id and schema-compliant body
      const validUUID = crypto.randomUUID();
      req.params = { event_id: validUUID };
      req.body = {
        reschedule_reason: 'short', // Too short (min 10)
        updated_dates: [], // Min 1
      };

      await rescheduleExamEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          errors: expect.any(Array),
        })
      );
      expect(examEventsService.rescheduleExamEvent).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      // Must pass valid UUID for params.event_id and schema-compliant body
      req.params = { event_id: crypto.randomUUID() };
      req.body = {
        reschedule_reason:
          'This is a valid reschedule reason longer than 10 chars',
        updated_dates: ['2026-05-24T12:00:00Z'],
      };
      examEventsService.rescheduleExamEvent.mockRejectedValue({
        status: 404,
        message: 'Exam event not found',
      });

      await rescheduleExamEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        errors: [{ message: 'Exam event not found' }],
      });
    });
  });
});
