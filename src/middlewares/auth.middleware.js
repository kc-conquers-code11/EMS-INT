// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../../models');
const {
  resolveUserScope,
  attachScopeToUser,
} = require('../helpers/scope.helper.js');

const verifyToken = async (req, res, next) => {
  try {
    let token;

    // From Authorization header
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // From cookie
    else if (req.cookies.access_token) {
      token = req.cookies.access_token;
    }

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'No token provided' });
    }

    req.token = token;

    // 1. Verify JWT signature
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error('JWT verification error:', err);
      return res
        .status(401)
        .json({ success: false, message: 'Invalid or expired token' });
    }

    // 2. Hash token for database lookup
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // 3. Single Raw Query to avoid sequential lookup waterfalls
    const [sessionData] = await db.sequelize.query(
      `SELECT uat.uid, u.is_active, u.user_type as utid, ut.base as role_name,
              u.student_id, u.faculty_id, u.coe_id, u.hod_id,
              c.institution_id,
              i.name AS institution_name,
              COALESCE(
                (SELECT JSON_ARRAYAGG(p.code) 
                 FROM role_permissions rp 
                 JOIN permissions p ON rp.permission_id = p.id 
                 WHERE rp.utid = u.user_type), 
                JSON_ARRAY()
              ) as permissions
       FROM user_auth_token uat
       JOIN users u ON uat.uid = u.uid
       JOIN user_types ut ON u.user_type = ut.utid
       LEFT JOIN coe c ON c.coe_id = u.coe_id AND c.status = 1
       LEFT JOIN institution i ON i.institution_id = c.institution_id
       WHERE uat.token_hash = :tokenHash 
       AND uat.expires_at > NOW()
       AND u.deletedAt IS NULL
       LIMIT 1`,
      {
        replacements: { tokenHash },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!sessionData) {
      return res
        .status(401)
        .json({ success: false, message: 'Session expired or invalid' });
    }

    if (!sessionData.is_active) {
      return res
        .status(401)
        .json({ success: false, message: 'User account is inactive' });
    }

    const baseUser = {
      uid: sessionData.uid,
      utid: sessionData.utid,
      role: sessionData.role_name,
      student_id: sessionData.student_id || null,
      faculty_id: sessionData.faculty_id || null,
      coe_id: sessionData.coe_id || null,
      hod_id: sessionData.hod_id || null,
      permissions:
        typeof sessionData.permissions === 'string'
          ? JSON.parse(sessionData.permissions)
          : sessionData.permissions || [],
    };

    const scope = await resolveUserScope(baseUser);
    req.user = attachScopeToUser(baseUser, scope);

    next();
  } catch (error) {
    console.error('Error in verifyToken middleware:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

const authorizePermissions = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const userPermissions = req.user.permissions || [];
    
    // Check if user has ALL required permissions
    const hasPermission = requiredPermissions.every(p => userPermissions.includes(p));

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: `Access denied: insufficient permissions to access this resource`,
      });
    }
    
    next();
  };
};

module.exports = { verifyToken, authorizePermissions };