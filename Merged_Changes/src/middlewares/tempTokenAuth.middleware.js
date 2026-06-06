// middlewares/tempTokenAuth.middleware.js
const jwt = require('jsonwebtoken');

const tempTokenAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No temporary token provided',
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify the temporary token
        const decoded = jwt.verify(token, process.env.JWT_TEMP_SECRET || 'temp_secret_key_change_this');

        // Check token purpose
        if (decoded.purpose !== 'registration') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token purpose',
            });
        }

        // Check if token is expired
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
            return res.status(401).json({
                success: false,
                message: 'Temporary token has expired. Please request OTP again.',
            });
        }

        // Attach temp token data to request
        req.tempTokenData = {
            email: decoded.email,
            otp_verified: decoded.otp_verified,
            purpose: decoded.purpose,
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid temporary token',
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Temporary token has expired. Please request OTP again.',
            });
        }

        console.error('Temp token auth error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Generate temporary token after OTP verification
const generateTempToken = (email) => {
    const token = jwt.sign(
        {
            email: email,
            otp_verified: true,
            purpose: 'registration',
        },
        process.env.JWT_TEMP_SECRET || 'temp_secret_key_change_this',
        { expiresIn: '200m' } 
    );

    return token;
};

module.exports = {
    tempTokenAuth,
    generateTempToken,
};