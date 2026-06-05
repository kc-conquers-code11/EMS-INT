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
jest.mock('../../controllers/programme/subjectType.controller', () => ({
  getAllSubjectTypes: jest.fn(),
  getSubjectTypesDropdown: jest.fn(),
  getSubjectTypeByValue: jest.fn(),
  createSubjectType: jest.fn(),
  updateSubjectType: jest.fn(),
  deleteSubjectType: jest.fn(),
  getSubjectTypeUsageStats: jest.fn(),
  getSubjectsByType: jest.fn(),
  bulkUpdateSubjectTypes: jest.fn(),
}));

const {
  getAllSubjectTypes,
  getSubjectTypesDropdown,
  getSubjectTypeByValue,
  createSubjectType,
  updateSubjectType,
  deleteSubjectType,
  getSubjectTypeUsageStats,
  getSubjectsByType,
  bulkUpdateSubjectTypes,
} = require('../../controllers/programme/subjectType.controller');

describe('Subject Type Controller', () => {
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

    jest.clearAllMocks();
  });

  describe('getAllSubjectTypes', () => {
    it('should retrieve all subject types successfully', async () => {
      req.query = { page: 1, limit: 10, search: '' };

      const mockResponse = {
        success: true,
        total: 2,
        page: 1,
        totalPages: 1,
        data: [
          { value: 'Theory', label: 'Theory', subject_count: 5, is_used: true },
          {
            value: 'Practical',
            label: 'Practical',
            subject_count: 3,
            is_used: true,
          },
        ],
        message: 'Subject types retrieved successfully',
      };

      getAllSubjectTypes.mockResolvedValue(mockResponse);
      await getAllSubjectTypes(req, res);

      expect(getAllSubjectTypes).toHaveBeenCalledWith(req, res);
    });
  });

  describe('getSubjectTypesDropdown', () => {
    it('should retrieve subject types dropdown successfully', async () => {
      req.query = { include_used_only: 'false' };

      const mockResponse = {
        success: true,
        data: [
          { value: 'Theory', label: 'Theory', subject_count: 5 },
          { value: 'Practical', label: 'Practical', subject_count: 3 },
        ],
        message: 'Subject types dropdown retrieved successfully',
      };

      getSubjectTypesDropdown.mockResolvedValue(mockResponse);
      await getSubjectTypesDropdown(req, res);

      expect(getSubjectTypesDropdown).toHaveBeenCalledWith(req, res);
    });

    it('should return only used subject types when include_used_only is true', async () => {
      req.query = { include_used_only: 'true' };

      const mockResponse = {
        success: true,
        data: [{ value: 'Theory', label: 'Theory', subject_count: 5 }],
        message: 'Subject types dropdown retrieved successfully',
      };

      getSubjectTypesDropdown.mockResolvedValue(mockResponse);
      await getSubjectTypesDropdown(req, res);

      expect(getSubjectTypesDropdown).toHaveBeenCalledWith(req, res);
    });
  });

  describe('getSubjectTypeByValue', () => {
    it('should retrieve subject type by value successfully', async () => {
      req.params = { value: 'Theory' };

      const mockResponse = {
        success: true,
        data: {
          value: 'Theory',
          label: 'Theory',
          total_subjects: 5,
          active_subjects: 4,
          deleted_subjects: 1,
          sample_subjects: [
            {
              subject_id: 'sub1',
              subject_name: 'Math',
              subject_code: 'MATH101',
              status: true,
              is_deleted: false,
            },
          ],
        },
        message: 'Subject type retrieved successfully',
      };

      getSubjectTypeByValue.mockResolvedValue(mockResponse);
      await getSubjectTypeByValue(req, res);

      expect(getSubjectTypeByValue).toHaveBeenCalledWith(req, res);
    });

    it('should return 404 if subject type not found', async () => {
      req.params = { value: 'NonExistent' };

      const mockResponse = {
        success: false,
        message: "Subject type 'NonExistent' not found",
      };

      getSubjectTypeByValue.mockResolvedValue(mockResponse);
      await getSubjectTypeByValue(req, res);

      expect(getSubjectTypeByValue).toHaveBeenCalledWith(req, res);
    });

    it('should return 400 for empty value parameter', async () => {
      req.params = { value: '' };

      const mockResponse = {
        success: false,
        message: 'Subject type value is required',
      };

      getSubjectTypeByValue.mockResolvedValue(mockResponse);
      await getSubjectTypeByValue(req, res);

      expect(getSubjectTypeByValue).toHaveBeenCalledWith(req, res);
    });
  });

  describe('createSubjectType', () => {
    it('should create a new subject type successfully', async () => {
      req.body = { value: 'Online' };

      const mockResponse = {
        success: true,
        data: {
          value: 'Online',
          label: 'Online',
          message:
            "Subject type 'Online' is available. It will be created when you add the first subject with this type.",
        },
        message: 'Subject type is available for use',
      };

      createSubjectType.mockResolvedValue(mockResponse);
      await createSubjectType(req, res);

      expect(createSubjectType).toHaveBeenCalledWith(req, res);
    });

    it('should return 400 if value is empty', async () => {
      req.body = { value: '' };

      const mockResponse = {
        success: false,
        message: 'Subject type value is required',
      };

      createSubjectType.mockResolvedValue(mockResponse);
      await createSubjectType(req, res);

      expect(createSubjectType).toHaveBeenCalledWith(req, res);
    });

    it('should return 400 if subject type already exists', async () => {
      req.body = { value: 'Theory' };

      const mockResponse = {
        success: false,
        message: "Subject type 'Theory' already exists",
        existing_type: { value: 'Theory', can_be_used: true },
      };

      createSubjectType.mockResolvedValue(mockResponse);
      await createSubjectType(req, res);

      expect(createSubjectType).toHaveBeenCalledWith(req, res);
    });

    it('should return 400 for invalid format', async () => {
      req.body = { value: '@Invalid!' };

      const mockResponse = {
        success: false,
        message:
          'Subject type can only contain letters, numbers, spaces, hyphens, underscores, and plus sign',
      };

      createSubjectType.mockResolvedValue(mockResponse);
      await createSubjectType(req, res);

      expect(createSubjectType).toHaveBeenCalledWith(req, res);
    });
  });

  describe('updateSubjectType', () => {
    it('should update/rename subject type successfully', async () => {
      req.params = { value: 'Theory' };
      req.body = { new_value: 'Theoretical' };

      const mockResponse = {
        success: true,
        data: {
          old_value: 'Theory',
          new_value: 'Theoretical',
          subjects_updated: 5,
        },
        message:
          "Successfully renamed subject type from 'Theory' to 'Theoretical' (5 subjects updated)",
      };

      updateSubjectType.mockResolvedValue(mockResponse);
      await updateSubjectType(req, res);

      expect(updateSubjectType).toHaveBeenCalledWith(req, res);
    });

    it('should return 404 if old type not found', async () => {
      req.params = { value: 'NonExistent' };
      req.body = { new_value: 'NewName' };

      const mockResponse = {
        success: false,
        message: "Subject type 'NonExistent' not found",
      };

      updateSubjectType.mockResolvedValue(mockResponse);
      await updateSubjectType(req, res);

      expect(updateSubjectType).toHaveBeenCalledWith(req, res);
    });

    it('should return 400 if new value already exists', async () => {
      req.params = { value: 'Theory' };
      req.body = { new_value: 'Practical' };

      const mockResponse = {
        success: false,
        message:
          "Subject type 'Practical' already exists. Cannot rename to an existing type.",
      };

      updateSubjectType.mockResolvedValue(mockResponse);
      await updateSubjectType(req, res);

      expect(updateSubjectType).toHaveBeenCalledWith(req, res);
    });

    it('should return 400 if new value is same as old value', async () => {
      req.params = { value: 'Theory' };
      req.body = { new_value: 'Theory' };

      const mockResponse = {
        success: false,
        message: 'New value must be different from current value',
      };

      updateSubjectType.mockResolvedValue(mockResponse);
      await updateSubjectType(req, res);

      expect(updateSubjectType).toHaveBeenCalledWith(req, res);
    });
  });

  describe('deleteSubjectType', () => {
    it('should delete subject type and set subjects to NULL', async () => {
      req.params = { value: 'OldType' };
      req.body = {};

      const mockResponse = {
        success: true,
        data: {
          deleted_type: 'OldType',
          subjects_affected: 3,
          subjects_updated: 3,
          action: 'set to NULL',
        },
        message: "Successfully removed subject type 'OldType' from 3 subjects",
      };

      deleteSubjectType.mockResolvedValue(mockResponse);
      await deleteSubjectType(req, res);

      expect(deleteSubjectType).toHaveBeenCalledWith(req, res);
    });

    it('should delete and reassign subjects to another type', async () => {
      req.params = { value: 'OldType' };
      req.body = { reassign_to: 'Theory' };

      const mockResponse = {
        success: true,
        data: {
          deleted_type: 'OldType',
          subjects_affected: 3,
          subjects_updated: 3,
          action: "reassigned to 'Theory'",
        },
        message:
          "Successfully reassigned 3 subjects from 'OldType' to 'Theory'",
      };

      deleteSubjectType.mockResolvedValue(mockResponse);
      await deleteSubjectType(req, res);

      expect(deleteSubjectType).toHaveBeenCalledWith(req, res);
    });

    it('should return 404 if subject type not found', async () => {
      req.params = { value: 'NonExistent' };

      const mockResponse = {
        success: false,
        message: "Subject type 'NonExistent' not found",
      };

      deleteSubjectType.mockResolvedValue(mockResponse);
      await deleteSubjectType(req, res);

      expect(deleteSubjectType).toHaveBeenCalledWith(req, res);
    });
  });

  describe('getSubjectTypeUsageStats', () => {
    it('should retrieve usage statistics successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          summary: {
            total_subjects: 100,
            subjects_with_type: 85,
            subjects_without_type: 15,
            unique_subject_types: 5,
          },
          breakdown: [
            {
              subject_type: 'Theory',
              total_subjects: 40,
              active_subjects: 35,
              deleted_subjects: 5,
            },
            {
              subject_type: 'Practical',
              total_subjects: 25,
              active_subjects: 20,
              deleted_subjects: 5,
            },
          ],
        },
        message: 'Subject type usage statistics retrieved successfully',
      };

      getSubjectTypeUsageStats.mockResolvedValue(mockResponse);
      await getSubjectTypeUsageStats(req, res);

      expect(getSubjectTypeUsageStats).toHaveBeenCalledWith(req, res);
    });
  });

  describe('getSubjectsByType', () => {
    it('should retrieve subjects by type successfully', async () => {
      req.params = { value: 'Theory' };
      req.query = { page: 1, limit: 20, include_deleted: 'false' };

      const mockResponse = {
        success: true,
        total: 5,
        page: 1,
        totalPages: 1,
        subject_type: 'Theory',
        data: [
          {
            subject_id: 'sub1',
            subject_name: 'Mathematics',
            subject_code: 'MATH101',
            status: true,
          },
        ],
        message: 'Subjects retrieved successfully',
      };

      getSubjectsByType.mockResolvedValue(mockResponse);
      await getSubjectsByType(req, res);

      expect(getSubjectsByType).toHaveBeenCalledWith(req, res);
    });

    it('should return 404 if subject type not found', async () => {
      req.params = { value: 'NonExistent' };
      req.query = { page: 1, limit: 20 };

      const mockResponse = {
        success: false,
        message: "Subject type 'NonExistent' not found",
      };

      getSubjectsByType.mockResolvedValue(mockResponse);
      await getSubjectsByType(req, res);

      expect(getSubjectsByType).toHaveBeenCalledWith(req, res);
    });
  });

  describe('bulkUpdateSubjectTypes', () => {
    it('should bulk update multiple subjects successfully', async () => {
      req.body = {
        updates: [
          { subject_id: 'sub1', subject_type: 'Theory' },
          { subject_id: 'sub2', subject_type: 'Practical' },
        ],
      };

      const mockResponse = {
        success: true,
        data: {
          success: [
            {
              subject_id: 'sub1',
              subject_name: 'Math',
              old_type: null,
              new_type: 'Theory',
            },
            {
              subject_id: 'sub2',
              subject_name: 'Physics',
              old_type: null,
              new_type: 'Practical',
            },
          ],
          failed: [],
        },
        message: 'Updated 2 subjects, 0 failed',
      };

      bulkUpdateSubjectTypes.mockResolvedValue(mockResponse);
      await bulkUpdateSubjectTypes(req, res);

      expect(bulkUpdateSubjectTypes).toHaveBeenCalledWith(req, res);
    });

    it('should return 400 if updates array is empty', async () => {
      req.body = { updates: [] };

      const mockResponse = {
        success: false,
        message: 'Updates array is required and cannot be empty',
      };

      bulkUpdateSubjectTypes.mockResolvedValue(mockResponse);
      await bulkUpdateSubjectTypes(req, res);

      expect(bulkUpdateSubjectTypes).toHaveBeenCalledWith(req, res);
    });

    it('should handle partial failures', async () => {
      req.body = {
        updates: [
          { subject_id: 'sub1', subject_type: 'Theory' },
          { subject_id: 'invalid-id', subject_type: 'Practical' },
        ],
      };

      const mockResponse = {
        success: true,
        data: {
          success: [
            {
              subject_id: 'sub1',
              subject_name: 'Math',
              old_type: null,
              new_type: 'Theory',
            },
          ],
          failed: [{ subject_id: 'invalid-id', error: 'Subject not found' }],
        },
        message: 'Updated 1 subjects, 1 failed',
      };

      bulkUpdateSubjectTypes.mockResolvedValue(mockResponse);
      await bulkUpdateSubjectTypes(req, res);

      expect(bulkUpdateSubjectTypes).toHaveBeenCalledWith(req, res);
    });
  });
});
