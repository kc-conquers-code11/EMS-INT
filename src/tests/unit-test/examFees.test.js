const {
  createExamFee,
  getExamFees,
  getExamFeeById,
  updateExamFee,
  deleteExamFee,
} = require('../../controllers/exam/examFees/examFees.controller.js');
const examFeeService = require('../../services/exam/examFees/examFees.service.js');

jest.mock('../../services/exam/examFees/examFees.service.js');

describe('Exam Fees Controller Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      query: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('createExamFee', () => {
    it('should create an exam fee mapping successfully', async () => {
      req.body = {
        programme_id: '123e4567-e89b-12d3-a456-426614174000',
        semester_id: '123e4567-e89b-12d3-a456-426614174001',
        amount: 500,
        late_fee: 50,
      };
      const mockResult = { fee_id: 'fee1', ...req.body };
      examFeeService.createExamFee.mockResolvedValue(mockResult);

      await createExamFee(req, res);

      expect(examFeeService.createExamFee).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
        message: 'Exam fee mapping created successfully',
      });
    });

    it('should handle service errors', async () => {
      examFeeService.createExamFee.mockRejectedValue({
        status: 404,
        message: 'Programme not found',
      });

      await createExamFee(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        errors: [{ message: 'Programme not found' }],
      });
    });
  });

  describe('getExamFees', () => {
    it('should retrieve mappings successfully', async () => {
      req.query = { is_late: 'true' };
      const mockResult = [
        {
          fee_id: 'fee1',
          amount: '500.00',
          late_fee: '50.00',
          effective_fee: 550.0,
        },
      ];
      examFeeService.getExamFees.mockResolvedValue(mockResult);

      await getExamFees(req, res);

      expect(examFeeService.getExamFees).toHaveBeenCalledWith(req.query);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
        message: 'Exam fee mappings retrieved successfully',
      });
    });
  });

  describe('getExamFeeById', () => {
    it('should retrieve single mapping by ID', async () => {
      req.params = { fee_id: 'fee1' };
      const mockResult = { fee_id: 'fee1', amount: '500.00' };
      examFeeService.getExamFeeById.mockResolvedValue(mockResult);

      await getExamFeeById(req, res);

      expect(examFeeService.getExamFeeById).toHaveBeenCalledWith('fee1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
        message: 'Exam fee mapping retrieved successfully',
      });
    });
  });

  describe('updateExamFee', () => {
    it('should update mapping successfully', async () => {
      req.params = { fee_id: 'fee1' };
      req.body = { amount: 600 };
      const mockResult = { fee_id: 'fee1', amount: '600.00' };
      examFeeService.updateExamFee.mockResolvedValue(mockResult);

      await updateExamFee(req, res);

      expect(examFeeService.updateExamFee).toHaveBeenCalledWith(
        'fee1',
        req.body
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
        message: 'Exam fee mapping updated successfully',
      });
    });
  });

  describe('deleteExamFee', () => {
    it('should delete mapping successfully', async () => {
      req.params = { fee_id: 'fee1' };
      examFeeService.deleteExamFee.mockResolvedValue({
        message: 'Deleted successfully',
      });

      await deleteExamFee(req, res);

      expect(examFeeService.deleteExamFee).toHaveBeenCalledWith('fee1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Deleted successfully',
      });
    });
  });
});
