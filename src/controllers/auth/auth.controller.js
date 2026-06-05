const { loginSchema } = require('../../validations/auth/auth.validations.js');
const {
  loginService,
  logoutService,
} = require('../../services/auth/auth.service.js');
const { ZodError } = require('zod');

const login = async (req, res) => {
  try {
    const validated = loginSchema.parse(req.body);

    console.log('Validated login data:', validated);
    const result = await loginService(validated);

    res.cookie('access_token', result.token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: result.expires_at,
      path: '/',
    });

    return res.status(200).json({
      success: true,
      data: result,
      message: 'Login successful',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.issues || error.errors,
      });
    }

    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Error in login controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.token;

    await logoutService(token);

    return res.clearCookie('access_token').status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Error in logout controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const validateUser = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
      message: 'User is valid',
    });
  } catch (error) {
    console.error('Error in validateUser controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = { login, logout, validateUser };
