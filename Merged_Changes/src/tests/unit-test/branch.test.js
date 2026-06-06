jest.mock('../../../models', () => ({
  sequelize: {
    query: jest.fn(),
  },
  Sequelize: {
    QueryTypes: { SELECT: 'SELECT' },
  },
}));

const db = require('../../../models');

const {
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
  getDeletedBranch,
  restoreBranch,
} = require('../../controllers/programme/branch.controller');

describe('Branch Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      db: {
        models: {
          branch: {
            findAll: jest.fn(),
            findByPk: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
          },
          programme: {
            findByPk: jest.fn(),
          },
          department: {
            findByPk: jest.fn(),
          },
        },
        sequelize: {
          query: db.sequelize.query,
        },
        Sequelize: {
          Op: { ne: Symbol('ne') },
          QueryTypes: { SELECT: 'SELECT' },
        },
      },
      params: {},
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllBranches', () => {
    it('should retrieve all branches successfully', async () => {
      // Mock the nested response that sequelize.query would generate
      const mockBranches = [
        {
          branch_id: '1',
          branch_name: 'CSE',
          depart_id: 'dept1',
          programm_id: 'prog1',
          programme_name: 'B.Tech',
          depart_name: 'Computer Science',
        },
      ];
      req.db.sequelize.query.mockResolvedValue(mockBranches);

      await getAllBranches(req, res);

      expect(req.db.sequelize.query).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.arrayContaining([
            expect.objectContaining({
              branch_id: '1',
              programme_name: 'B.Tech',
              depart_name: 'Computer Science',
            }),
          ]),
        })
      );
    });
  });

  describe('getBranchById', () => {
    it('should retrieve a branch by ID successfully', async () => {
      req.params.branch_id = '123e4567-e89b-12d3-a456-426614174000';

      // Mock the response from sequelize.query
      const mockBranch = {
        branch_id: req.params.branch_id,
        branch_name: 'CSE',
        depart_id: 'dept1',
        programm_id: 'prog1',
        programme_name: 'B.Tech',
        depart_name: 'CS',
      };

      req.db.sequelize.query.mockResolvedValue([mockBranch]);

      await getBranchById(req, res);

      expect(req.db.sequelize.query).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            branch_id: req.params.branch_id,
            programme_name: 'B.Tech',
            depart_name: 'CS',
          }),
        })
      );
    });

    it('should return 404 if branch not found', async () => {
      req.params.branch_id = '123e4567-e89b-12d3-a456-426614174000';
      req.db.sequelize.query.mockResolvedValue([]);

      await getBranchById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Branch not found',
        })
      );
    });
  });
  describe('createBranch', () => {
    it('should create a branch successfully', async () => {
      req.body = {
        programm_id: '123e4567-e89b-12d3-a456-426614174001',
        depart_id: '123e4567-e89b-12d3-a456-426614174002',
        branch_name: 'CSE Core',
      };

      req.db.models.programme.findByPk.mockResolvedValue({
        programme_name: 'B.Tech',
      });
      req.db.models.department.findByPk.mockResolvedValue({
        depart_name: 'CS',
      });
      req.db.models.branch.findOne.mockResolvedValue(null); // No duplicate

      const mockCreated = {
        toJSON: () => ({ branch_id: '1', ...req.body }),
        ...req.body,
      };
      req.db.models.branch.create.mockResolvedValue(mockCreated);

      await createBranch(req, res);

      expect(req.db.models.branch.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Branch created successfully',
        })
      );
    });
  });

  describe('updateBranch', () => {
    it('should update a branch successfully', async () => {
      // Use a valid UUID format so Zod doesn't throw a 400
      req.params.branch_id = '123e4567-e89b-12d3-a456-426614174000';
      req.body = { branch_name: 'CSE Updated' };

      const mockBranch = {
        branch_id: req.params.branch_id,
        branch_name: 'CSE',
        depart_id: 'dept1',
        programm_id: 'prog1',
        update: jest.fn().mockResolvedValue(true),
        toJSON: () => ({ branch_id: req.params.branch_id, ...req.body }),
      };

      req.db.models.branch.findByPk.mockResolvedValue(mockBranch);
      // Mock unique name check to return null (no collision)
      req.db.models.branch.findOne.mockResolvedValue(null);
      // Mock foreign key lookups for the final response formatting
      req.db.models.programme.findByPk.mockResolvedValue({
        programme_name: 'B.Tech',
      });
      req.db.models.department.findByPk.mockResolvedValue({
        depart_name: 'CS',
      });

      await updateBranch(req, res);

      expect(req.db.models.branch.findByPk).toHaveBeenCalledWith(
        req.params.branch_id
      );
      expect(mockBranch.update).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Branch updated successfully',
        })
      );
    });

    it('should return 404 if trying to update a non-existent branch', async () => {
      // Valid UUID format, but the DB will return null
      req.params.branch_id = '00000000-0000-0000-0000-000000000000';
      req.body = { branch_name: 'Ghost Branch' };

      req.db.models.branch.findByPk.mockResolvedValue(null);

      await updateBranch(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Branch not found',
        })
      );
    });
  });

  describe('deleteBranch (Soft Delete)', () => {
    it('should soft delete a branch successfully', async () => {
      req.params.branch_id = '123e4567-e89b-12d3-a456-426614174000';

      const mockBranch = {
        branch_id: req.params.branch_id,
        destroy: jest.fn().mockResolvedValue(true),
      };

      req.db.models.branch.findByPk.mockResolvedValue(mockBranch);

      await deleteBranch(req, res);

      expect(req.db.models.branch.findByPk).toHaveBeenCalledWith(
        req.params.branch_id
      );
      expect(mockBranch.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Branch deleted successfully',
        })
      );
    });

    it('should return 404 if trying to delete a non-existent branch', async () => {
      // Valid UUID format, but the DB will return null
      req.params.branch_id = '00000000-0000-0000-0000-000000000000';

      req.db.models.branch.findByPk.mockResolvedValue(null);

      await deleteBranch(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Branch not found',
        })
      );
    });
  });

  describe('getDeletedBranch', () => {
    it('should retrieve all deleted branches successfully', async () => {
      req.db.sequelize.query.mockResolvedValue([
        { branch_id: '1', branch_name: 'Deleted CSE' },
      ]);

      await getDeletedBranch(req, res);

      expect(req.db.sequelize.query).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.any(Array),
          message: 'Deleted branches retrieved successfully',
        })
      );
    });
  });

  describe('restoreBranch', () => {
    it('should restore a soft-deleted branch successfully', async () => {
      req.params.branch_id = '123e4567-e89b-12d3-a456-426614174000';

      const mockBranch = {
        branch_id: req.params.branch_id,
        deletedAt: new Date(),
        restore: jest.fn().mockResolvedValue(true),
      };

      req.db.models.branch.findByPk.mockResolvedValue(mockBranch);

      await restoreBranch(req, res);

      expect(req.db.models.branch.findByPk).toHaveBeenCalledWith(
        req.params.branch_id,
        { paranoid: false }
      );
      expect(mockBranch.restore).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Branch restored successfully',
        })
      );
    });

    it('should return 404 if branch not found', async () => {
      req.params.branch_id = '123e4567-e89b-12d3-a456-426614174000';
      req.db.models.branch.findByPk.mockResolvedValue(null);

      await restoreBranch(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Branch not found in records',
        })
      );
    });

    it('should return 400 if branch is not deleted', async () => {
      req.params.branch_id = '123e4567-e89b-12d3-a456-426614174000';

      const mockBranch = {
        branch_id: req.params.branch_id,
        deletedAt: null, // Not deleted
        restore: jest.fn(),
      };

      req.db.models.branch.findByPk.mockResolvedValue(mockBranch);

      await restoreBranch(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Branch is already Active',
        })
      );
      expect(mockBranch.restore).not.toHaveBeenCalled();
    });
  });
});
