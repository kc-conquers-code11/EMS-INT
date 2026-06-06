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
  getAllProgrammes,
  getProgrammeById,
  createProgramme,
  updateProgramme,
  deleteProgramme,
  getDeletedProgramme,
  restoreProgramme,
} = require('../../controllers/programme/programme.controller');

describe('Programme Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      db: {
        models: {
          programme: {
            findAll: jest.fn(),
            findByPk: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
          },
          department: {
            findByPk: jest.fn(),
          },
          institution: {
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

  describe('getAllProgrammes', () => {
    it('should retrieve all programmes successfully', async () => {
      // Mock the nested response that sequelize.query would generate
      const mockProgrammes = [
        {
          programm_id: '1',
          programme_name: 'B.Tech',
          depart_id: 'dept1',
          institution_id: 'inst1',
          depart_name: 'Computer Science',
          institution_name: 'Engineering College',
        },
      ];
      req.db.sequelize.query.mockResolvedValue(mockProgrammes);

      await getAllProgrammes(req, res);

      expect(req.db.sequelize.query).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.arrayContaining([
            expect.objectContaining({
              programm_id: '1',
              depart_name: 'Computer Science', // Verifies flattening worked
              institution_name: 'Engineering College',
            }),
          ]),
        })
      );
    });
  });

  describe('getProgrammeById', () => {
    it('should retrieve a programme by ID successfully', async () => {
      req.params.programm_id = '123e4567-e89b-12d3-a456-426614174000';

      // Mock the response from sequelize.query
      const mockProgramme = {
        programm_id: req.params.programm_id,
        programme_name: 'B.Tech',
        depart_id: 'dept1',
        institution_id: 'inst1',
        depart_name: 'CS',
        institution_name: 'Inst',
      };

      req.db.sequelize.query.mockResolvedValue([mockProgramme]);

      await getProgrammeById(req, res);

      expect(req.db.sequelize.query).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            programm_id: req.params.programm_id,
            depart_name: 'CS',
            institution_name: 'Inst',
          }),
        })
      );
    });

    it('should return 404 if programme not found', async () => {
      req.params.programm_id = '123e4567-e89b-12d3-a456-426614174000';
      req.db.sequelize.query.mockResolvedValue([]);

      await getProgrammeById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Programme not found',
        })
      );
    });
  });

  describe('createProgramme', () => {
    it('should create a programme successfully', async () => {
      req.body = {
        institution_id: '123e4567-e89b-12d3-a456-426614174001',
        depart_id: '123e4567-e89b-12d3-a456-426614174002',
        programme_name: 'B.Tech CSE',
      };

      req.db.models.institution.findByPk.mockResolvedValue({ name: 'Inst' });
      req.db.models.department.findByPk.mockResolvedValue({
        depart_name: 'CS',
      });
      req.db.models.programme.findOne.mockResolvedValue(null); // No duplicate

      const mockCreated = {
        toJSON: () => ({ programm_id: '1', ...req.body }),
        ...req.body,
      };
      req.db.models.programme.create.mockResolvedValue(mockCreated);

      await createProgramme(req, res);

      expect(req.db.models.programme.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Programme created successfully',
        })
      );
    });
  });

  describe('getDeletedProgramme', () => {
    it('should retrieve all deleted programmes successfully', async () => {
      req.db.sequelize.query.mockResolvedValue([
        { programm_id: '1', programme_name: 'Deleted B.Tech' },
      ]);

      await getDeletedProgramme(req, res);

      expect(req.db.sequelize.query).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.any(Array),
          message: 'Deleted programmes retrieved successfully',
        })
      );
    });
  });

  describe('updateProgramme', () => {
    // POSITIVE TEST
    it('should update a programme successfully', async () => {
      req.params.programm_id = '00000000-0000-0000-0000-000000000000';
      req.body = { programme_name: 'B.Tech Updated' };

      const mockProgramme = {
        programm_id: req.params.programm_id,
        programme_name: 'B.Tech',
        depart_id: 'dept1',
        institution_id: 'inst1',
        update: jest.fn().mockResolvedValue(true),
        toJSON: () => ({ programm_id: req.params.programm_id, ...req.body }),
      };

      req.db.models.programme.findByPk.mockResolvedValue(mockProgramme);
      // Mocking the foreign key checks (assuming valid IDs are passed)
      req.db.models.institution.findByPk.mockResolvedValue({ name: 'Inst' });
      req.db.models.department.findByPk.mockResolvedValue({
        depart_name: 'CS',
      });
      req.db.models.programme.findOne.mockResolvedValue(null); // No name collision

      await updateProgramme(req, res);

      expect(req.db.models.programme.findByPk).toHaveBeenCalledWith(
        req.params.programm_id
      );
      expect(mockProgramme.update).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Programme updated successfully',
        })
      );
    });

    // NEGATIVE TEST
    it('should return 404 if trying to update a non-existent programme', async () => {
      req.params.programm_id = '00000000-0000-0000-0000-000000000000'; //invalid Programme Id
      req.body = { programme_name: 'Ghost Programme' };

      req.db.models.programme.findByPk.mockResolvedValue(null);

      await updateProgramme(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Programme not found',
        })
      );
    });
  });

  describe('deleteProgramme (Soft Delete)', () => {
    // POSITIVE TEST
    it('should soft delete a programme successfully', async () => {
      req.params.programm_id = '123e4567-e89b-12d3-a456-426614174000';

      const mockProgramme = {
        programm_id: req.params.programm_id,
        destroy: jest.fn().mockResolvedValue(true),
      };

      req.db.models.programme.findByPk.mockResolvedValue(mockProgramme);

      await deleteProgramme(req, res);

      expect(req.db.models.programme.findByPk).toHaveBeenCalledWith(
        req.params.programm_id
      );
      expect(mockProgramme.destroy).toHaveBeenCalled(); // Asserts destroy was called
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Programme deleted successfully',
        })
      );
    });

    // NEGATIVE TEST
    it('should return 404 if trying to delete a non-existent programme', async () => {
      req.params.programm_id = '123e4567-e89b-12d3-a456-426614174000'; //invalid Programme Id

      req.db.models.programme.findByPk.mockResolvedValue(null);

      await deleteProgramme(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Programme not found',
        })
      );
    });
  });

  describe('restoreProgramme', () => {
    it('should restore a soft-deleted programme successfully', async () => {
      req.params.programm_id = '00000000-0000-0000-0000-000000000000';

      const mockProgramme = {
        programm_id: req.params.programm_id,
        deletedAt: new Date(),
        restore: jest.fn().mockResolvedValue(true),
      };

      req.db.models.programme.findByPk.mockResolvedValue(mockProgramme);

      await restoreProgramme(req, res);

      expect(req.db.models.programme.findByPk).toHaveBeenCalledWith(
        req.params.programm_id,
        { paranoid: false }
      );
      expect(mockProgramme.restore).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Programme restored successfully',
        })
      );
    });

    it('should return 404 if programme not found', async () => {
      req.params.programm_id = '123e4567-e89b-12d3-a456-426614174000';
      req.db.models.programme.findByPk.mockResolvedValue(null);

      await restoreProgramme(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Programme not found',
        })
      );
    });

    it('should return 400 if programme is not deleted', async () => {
      req.params.programm_id = '123e4567-e89b-12d3-a456-426614174000';

      const mockProgramme = {
        programm_id: req.params.programm_id,
        deletedAt: null, // Not deleted
        restore: jest.fn(),
      };

      req.db.models.programme.findByPk.mockResolvedValue(mockProgramme);

      await restoreProgramme(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Programme is not deleted',
        })
      );
      expect(mockProgramme.restore).not.toHaveBeenCalled();
    });
  });
});
