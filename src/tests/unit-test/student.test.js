const studentController = require('../../controllers/admin/student.controller.js');
const studentService = require('../../services/admin/student.service.js');

jest.mock('../../services/admin/student.service.js');

describe('Student Controller', () => {
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

  describe('createStudent', () => {
    it('should return 201 on success', async () => {
      req.body = {
        student: {
          gr_number: '123',
          branch_id: '811440d9-b69c-4613-8418-5a4846067b66',
          programm_id: '811440d9-b69c-4613-8418-5a4846067b66',
          academic_year: '2024',
        },
        personal: {
          first_name: 'John',
          last_name: 'Doe',
          dob: '2000-01-01',
          gender: 'Male',
          email: 'john@test.com',
          contact: '1234567890',
        },
        permanent_address: {
          street: 'Main St',
          city: 'City',
          state: 'State',
          pincode: '123456',
        },
        residential_address: {
          street: 'Main St',
          city: 'City',
          state: 'State',
          pincode: '123456',
        },
        parent: { father_name: 'Bob', father_contact: '0987654321' },
      };
      studentService.createStudent.mockResolvedValue({ sid: 'new-sid' });

      await studentController.createStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { sid: 'new-sid' },
        message: 'Student created successfully',
      });
    });
  });
});
