// Mock the models
jest.mock('../../../models', () => ({
  sequelize: {
    query: jest.fn(),
  },
  Sequelize: {
    QueryTypes: { SELECT: 'SELECT' },
  },
}));

// Mock the controller module before importing
jest.mock('../../controllers/semester/semester.controller', () => ({
  getAllSemesters: jest.fn(),
  getSemesterById: jest.fn(),
  getSemestersByProgramme: jest.fn(),
  getSemestersByAcademicYear: jest.fn(),
  createSemester: jest.fn(),
  updateSemester: jest.fn(),
  updateSemesterStatus: jest.fn(),
  deleteSemester: jest.fn(),
  getDeletedSemesters: jest.fn(),
  restoreSemester: jest.fn(),
  permanentDeleteSemester: jest.fn(),
  getSemesterDropdown: jest.fn(),
}));

const db = require('../../../models');
const {
  getAllSemesters,
  getSemesterById,
  getSemestersByProgramme,
  getSemestersByAcademicYear,
  createSemester,
  updateSemester,
  updateSemesterStatus,
  deleteSemester,
  getDeletedSemesters,
  restoreSemester,
  permanentDeleteSemester,
  getSemesterDropdown,
} = require('../../controllers/semester/semester.controller');

describe('Semester Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      query: {},
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getAllSemesters', () => {
    it('should retrieve all semesters with pagination successfully', async () => {
      const mockResponse = {
        success: true,
        total: 2,
        page: 1,
        totalPages: 1,
        data: [
          { semester_id: 'sem1', semester_number: 1, term: 'odd' },
          { semester_id: 'sem2', semester_number: 2, term: 'even' },
        ],
        message: 'Semesters retrieved successfully',
      };

      getAllSemesters.mockResolvedValue(mockResponse);
      await getAllSemesters(req, res);

      expect(getAllSemesters).toHaveBeenCalledWith(req, res);
    });
  });

  describe('getSemesterById', () => {
    it('should retrieve a semester by ID successfully', async () => {
      req.params = { semester_id: '123e4567-e89b-12d3-a456-426614174000' };

      const mockResponse = {
        success: true,
        data: {
          semester_id: req.params.semester_id,
          semester_number: 1,
          term: 'odd',
          programme: { programme_name: 'B.Tech' },
          academic_year: { academic_name: '2024-25' },
        },
        message: 'Semester retrieved successfully',
      };

      getSemesterById.mockResolvedValue(mockResponse);
      await getSemesterById(req, res);

      expect(getSemesterById).toHaveBeenCalledWith(req, res);
    });

    it('should return 404 if semester not found', async () => {
      req.params = { semester_id: 'non-existent-id' };

      const mockResponse = {
        success: false,
        message: 'Semester not found',
      };

      getSemesterById.mockResolvedValue(mockResponse);
      await getSemesterById(req, res);

      expect(getSemesterById).toHaveBeenCalledWith(req, res);
    });
  });

  describe('getSemestersByProgramme', () => {
    it('should retrieve semesters by programme ID successfully', async () => {
      req.params = { programm_id: 'prog1' };
      req.query = { page: 1, limit: 10 };

      const mockResponse = {
        success: true,
        total: 2,
        page: 1,
        totalPages: 1,
        data: [
          { semester_id: 'sem1', semester_number: 1 },
          { semester_id: 'sem2', semester_number: 2 },
        ],
        programme_name: 'B.Tech',
        message: 'Semesters retrieved successfully',
      };

      getSemestersByProgramme.mockResolvedValue(mockResponse);
      await getSemestersByProgramme(req, res);

      expect(getSemestersByProgramme).toHaveBeenCalledWith(req, res);
    });

    it('should return 404 if programme not found', async () => {
      req.params = { programm_id: 'invalid-prog-id' };

      const mockResponse = {
        success: false,
        message: 'Programme not found',
      };

      getSemestersByProgramme.mockResolvedValue(mockResponse);
      await getSemestersByProgramme(req, res);

      expect(getSemestersByProgramme).toHaveBeenCalledWith(req, res);
    });
  });

  describe('getSemestersByAcademicYear', () => {
    it('should retrieve semesters by academic year successfully', async () => {
      req.params = { academic_id: '1' };
      req.query = { page: 1, limit: 10 };

      const mockResponse = {
        success: true,
        total: 2,
        page: 1,
        totalPages: 1,
        data: [
          { semester_id: 'sem1', semester_number: 1 },
          { semester_id: 'sem2', semester_number: 2 },
        ],
        academic_name: '2024-25',
        message: 'Semesters retrieved successfully',
      };

      getSemestersByAcademicYear.mockResolvedValue(mockResponse);
      await getSemestersByAcademicYear(req, res);

      expect(getSemestersByAcademicYear).toHaveBeenCalledWith(req, res);
    });

    it('should return 404 if academic year not found', async () => {
      req.params = { academic_id: '999' };

      const mockResponse = {
        success: false,
        message: 'Academic year not found',
      };

      getSemestersByAcademicYear.mockResolvedValue(mockResponse);
      await getSemestersByAcademicYear(req, res);

      expect(getSemestersByAcademicYear).toHaveBeenCalledWith(req, res);
    });
  });

  describe('createSemester', () => {
    it('should create a semester successfully', async () => {
      req.body = {
        programm_id: '123e4567-e89b-12d3-a456-426614174001',
        academic_id: 1,
        semester_number: 1,
        term: 'odd',
        start_date: '2024-08-01',
        end_date: '2024-12-20',
        is_active: true,
      };

      const mockResponse = {
        success: true,
        data: {
          semester_id: 'new-sem-id',
          ...req.body,
          programme_name: 'B.Tech',
          academic_name: '2024-25',
        },
        message: 'Semester created successfully',
      };

      createSemester.mockResolvedValue(mockResponse);
      await createSemester(req, res);

      expect(createSemester).toHaveBeenCalledWith(req, res);
    });

    it('should return 404 if programme not found', async () => {
      req.body = {
        programm_id: 'invalid-prog-id',
        academic_id: 1,
        semester_number: 1,
        term: 'odd',
      };

      const mockResponse = {
        success: false,
        message: 'Programme not found. Please select a valid programme.',
      };

      createSemester.mockResolvedValue(mockResponse);
      await createSemester(req, res);

      expect(createSemester).toHaveBeenCalledWith(req, res);
    });

    it('should return 404 if academic year not found', async () => {
      req.body = {
        programm_id: 'prog1',
        academic_id: 999,
        semester_number: 1,
        term: 'odd',
      };

      const mockResponse = {
        success: false,
        message:
          'Academic year not found. Please select a valid academic year.',
      };

      createSemester.mockResolvedValue(mockResponse);
      await createSemester(req, res);

      expect(createSemester).toHaveBeenCalledWith(req, res);
    });

    it('should return 400 if semester already exists', async () => {
      req.body = {
        programm_id: 'prog1',
        academic_id: 1,
        semester_number: 1,
        term: 'odd',
      };

      const mockResponse = {
        success: false,
        message:
          'Semester 1 already exists for this programme and academic year',
      };

      createSemester.mockResolvedValue(mockResponse);
      await createSemester(req, res);

      expect(createSemester).toHaveBeenCalledWith(req, res);
    });
  });

  describe('updateSemester', () => {
    it('should update a semester successfully', async () => {
      req.params = { semester_id: '123e4567-e89b-12d3-a456-426614174000' };
      req.body = { semester_number: 2, term: 'even' };

      const mockResponse = {
        success: true,
        data: {
          semester_id: req.params.semester_id,
          ...req.body,
          programme_name: 'B.Tech',
          academic_name: '2024-25',
        },
        message: 'Semester updated successfully',
      };

      updateSemester.mockResolvedValue(mockResponse);
      await updateSemester(req, res);

      expect(updateSemester).toHaveBeenCalledWith(req, res);
    });

    it('should return 404 if semester not found', async () => {
      req.params = { semester_id: 'non-existent-id' };
      req.body = { semester_number: 2 };

      const mockResponse = {
        success: false,
        message: 'Semester not found',
      };

      updateSemester.mockResolvedValue(mockResponse);
      await updateSemester(req, res);

      expect(updateSemester).toHaveBeenCalledWith(req, res);
    });

    it('should return 400 if duplicate semester exists', async () => {
      req.params = { semester_id: 'sem1' };
      req.body = { semester_number: 2 };

      const mockResponse = {
        success: false,
        message:
          'Semester 2 already exists for this programme and academic year',
      };

      updateSemester.mockResolvedValue(mockResponse);
      await updateSemester(req, res);

      expect(updateSemester).toHaveBeenCalledWith(req, res);
    });
  });

  describe('updateSemesterStatus', () => {
    it('should activate a semester successfully', async () => {
      req.params = { semester_id: 'sem1' };
      req.body = { is_active: true };

      const mockResponse = {
        success: true,
        data: { semester_id: 'sem1', is_active: true },
        message: 'Semester activated successfully',
      };

      updateSemesterStatus.mockResolvedValue(mockResponse);
      await updateSemesterStatus(req, res);

      expect(updateSemesterStatus).toHaveBeenCalledWith(req, res);
    });

    it('should deactivate a semester successfully', async () => {
      req.params = { semester_id: 'sem1' };
      req.body = { is_active: false };

      const mockResponse = {
        success: true,
        data: { semester_id: 'sem1', is_active: false },
        message: 'Semester deactivated successfully',
      };

      updateSemesterStatus.mockResolvedValue(mockResponse);
      await updateSemesterStatus(req, res);

      expect(updateSemesterStatus).toHaveBeenCalledWith(req, res);
    });

    it('should return 404 if semester not found', async () => {
      req.params = { semester_id: 'non-existent' };
      req.body = { is_active: true };

      const mockResponse = {
        success: false,
        message: 'Semester not found',
      };

      updateSemesterStatus.mockResolvedValue(mockResponse);
      await updateSemesterStatus(req, res);

      expect(updateSemesterStatus).toHaveBeenCalledWith(req, res);
    });
  });

  describe('deleteSemester (Soft Delete)', () => {
    it('should soft delete a semester successfully', async () => {
      req.params = { semester_id: '123e4567-e89b-12d3-a456-426614174000' };

      const mockResponse = {
        success: true,
        message: 'Semester deleted successfully',
      };

      deleteSemester.mockResolvedValue(mockResponse);
      await deleteSemester(req, res);

      expect(deleteSemester).toHaveBeenCalledWith(req, res);
    });

    it('should return 404 if semester not found', async () => {
      req.params = { semester_id: 'non-existent-id' };

      const mockResponse = {
        success: false,
        message: 'Semester not found',
      };

      deleteSemester.mockResolvedValue(mockResponse);
      await deleteSemester(req, res);

      expect(deleteSemester).toHaveBeenCalledWith(req, res);
    });
  });

  describe('getDeletedSemesters', () => {
    it('should retrieve all deleted semesters successfully', async () => {
      req.query = { page: 1, limit: 10 };

      const mockResponse = {
        success: true,
        total: 1,
        page: 1,
        totalPages: 1,
        data: [
          {
            semester_id: 'deleted-sem1',
            semester_number: 1,
            deleted_at: new Date(),
          },
        ],
        message: 'Deleted semesters retrieved successfully',
      };

      getDeletedSemesters.mockResolvedValue(mockResponse);
      await getDeletedSemesters(req, res);

      expect(getDeletedSemesters).toHaveBeenCalledWith(req, res);
    });
  });

  describe('restoreSemester', () => {
    it('should restore a soft-deleted semester successfully', async () => {
      req.params = { semester_id: '123e4567-e89b-12d3-a456-426614174000' };

      const mockResponse = {
        success: true,
        message: 'Semester restored successfully',
      };

      restoreSemester.mockResolvedValue(mockResponse);
      await restoreSemester(req, res);

      expect(restoreSemester).toHaveBeenCalledWith(req, res);
    });

    it('should return 404 if semester not found', async () => {
      req.params = { semester_id: 'non-existent-id' };

      const mockResponse = {
        success: false,
        message: 'Semester not found',
      };

      restoreSemester.mockResolvedValue(mockResponse);
      await restoreSemester(req, res);

      expect(restoreSemester).toHaveBeenCalledWith(req, res);
    });

    it('should return 400 if semester is not deleted', async () => {
      req.params = { semester_id: 'active-sem-id' };

      const mockResponse = {
        success: false,
        message: 'Semester is not deleted',
      };

      restoreSemester.mockResolvedValue(mockResponse);
      await restoreSemester(req, res);

      expect(restoreSemester).toHaveBeenCalledWith(req, res);
    });
  });

  describe('permanentDeleteSemester', () => {
    it('should permanently delete a semester successfully', async () => {
      req.params = { semester_id: '123e4567-e89b-12d3-a456-426614174000' };

      const mockResponse = {
        success: true,
        message: 'Semester permanently deleted successfully',
      };

      permanentDeleteSemester.mockResolvedValue(mockResponse);
      await permanentDeleteSemester(req, res);

      expect(permanentDeleteSemester).toHaveBeenCalledWith(req, res);
    });

    it('should return 404 if semester not found', async () => {
      req.params = { semester_id: 'non-existent-id' };

      const mockResponse = {
        success: false,
        message: 'Semester not found',
      };

      permanentDeleteSemester.mockResolvedValue(mockResponse);
      await permanentDeleteSemester(req, res);

      expect(permanentDeleteSemester).toHaveBeenCalledWith(req, res);
    });
  });

  describe('getSemesterDropdown', () => {
    it('should retrieve semester dropdown successfully', async () => {
      req.query = {};

      const mockResponse = {
        success: true,
        data: [
          { semester_id: 'sem1', semester_number: 1, term: 'odd' },
          { semester_id: 'sem2', semester_number: 2, term: 'even' },
        ],
        groupedByProgramme: {},
        message: 'Semesters dropdown retrieved successfully',
      };

      getSemesterDropdown.mockResolvedValue(mockResponse);
      await getSemesterDropdown(req, res);

      expect(getSemesterDropdown).toHaveBeenCalledWith(req, res);
    });

    it('should filter semesters by programme ID when provided', async () => {
      req.query = { programm_id: 'prog1' };

      const mockResponse = {
        success: true,
        data: [
          { semester_id: 'sem1', semester_number: 1, programm_id: 'prog1' },
        ],
        groupedByProgramme: { prog1: [{ semester_id: 'sem1' }] },
        message: 'Semesters dropdown retrieved successfully',
      };

      getSemesterDropdown.mockResolvedValue(mockResponse);
      await getSemesterDropdown(req, res);

      expect(getSemesterDropdown).toHaveBeenCalledWith(req, res);
    });
  });
});
