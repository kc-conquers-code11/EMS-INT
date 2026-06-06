const facultyController = require('../../controllers/admin/faculty.controller.js');
const facultyService = require('../../services/admin/faculty.service.js');

jest.mock('../../services/admin/faculty.service.js');

describe('Faculty Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
      query: {},
      db: { models: {}, Op: {} },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('getAllFaculty', () => {
    it('should return 200 on success', async () => {
      const mockData = {
        data: [{ faculty_id: '1', name: 'Dr. Smith' }],
        total: 1,
        limit: 20,
        offset: 0,
      };
      facultyService.getAllFaculty.mockResolvedValue(mockData);

      await facultyController.getAllFaculty(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Faculty members retrieved successfully',
        ...mockData,
      });
    });
  });

  describe('createFaculty', () => {
    it('should return 201 on success', async () => {
      req.body = {
        name: 'Dr. Smith',
        email: 'smith@test.com',
        contact: '1234567890',
        faculty_type_id: '550e8400-e29b-41d4-a716-446655440000',
        department_id: '550e8400-e29b-41d4-a716-446655440000',
        branch_id: '550e8400-e29b-41d4-a716-446655440000',
      };
      facultyService.createFaculty.mockResolvedValue({ faculty_id: 'new-id' });

      await facultyController.createFaculty(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { faculty_id: 'new-id' },
        message: 'Faculty created successfully',
      });
    });
  });
});
