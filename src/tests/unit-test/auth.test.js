const { login, logout } = require('../../controllers/auth/auth.controller.js');
const {
  loginService,
  logoutService,
} = require('../../services/auth/auth.service.js');

jest.mock('../../services/auth/auth.service.js');
const mockToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJhYjE1Y2RkNy0xZGNjLTQ2NzQtOTQ1ZS04NzgxYTllZGY5M2MiLCJ1dGlkIjoiNzM2OWE3ZjAtMmEyZi00ODk0LWE4MDMtMzkzNGI0ZDlhNTk1Iiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNzQ2NjMzMDk0LCJleHAiOjE3NDY2MzY2OTR9.k5XlYq-4F_2w6J2s8R691f_p7p9Y7y4N6q9F5X1o0g0';

describe('Auth Controller Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      headers: {},
      cookies: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn(),
      clearCookie: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('POST /login', () => {
    const validPayload = {
      email: 'admin@test.com',
      password: 'Password@123', // Must pass Zod validation
    };

    it('SUCCESS: should login and set access_token cookie', async () => {
      req.body = validPayload;
      const mockResult = {
        token: mockToken,
        expires_at: new Date(Date.now() + 3600000),
        role: 'Admin',
        uid: '4739f88f-fec7-4aa9-92b1-4636d62a828d',
      };
      loginService.mockResolvedValue(mockResult);

      await login(req, res);

      expect(loginService).toHaveBeenCalledWith(validPayload);
      expect(res.cookie).toHaveBeenCalledWith(
        'access_token',
        mockToken,
        expect.any(Object)
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
        message: 'Login successful',
      });
    });

    it('FAILURE: should return 400 on Zod validation error', async () => {
      req.body = { email: 'invalid', password: '123' };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Validation error',
        })
      );
    });

    it('FAILURE: should return 401 on invalid credentials (service error)', async () => {
      req.body = validPayload;
      const error = new Error('Invalid credentials');
      error.status = 401;
      loginService.mockRejectedValue(error);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid credentials',
      });
    });

    it('FAILURE: should return 401 on inactive account', async () => {
      req.body = validPayload;
      const error = new Error('Account is suspended');
      error.status = 401;
      loginService.mockRejectedValue(error);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Account is suspended',
      });
    });

    it('FAILURE: should return 500 on unexpected database error', async () => {
      req.body = validPayload;
      loginService.mockRejectedValue(new Error('Connection failed'));

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error',
      });
    });
  });

  describe('POST /logout', () => {
    it('SUCCESS: should logout and return 200', async () => {
      req.token = mockToken;

      logoutService.mockResolvedValue();

      await logout(req, res);

      expect(logoutService).toHaveBeenCalledWith(mockToken);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Logged out successfully',
      });
    });

    it('FAILURE: should return 500 on unexpected service error', async () => {
      // FIX: Put the token in cookies here too!
      req.token = mockToken;
      logoutService.mockRejectedValue(new Error('Logout failed'));

      await logout(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error',
      });
    });
  });
});
