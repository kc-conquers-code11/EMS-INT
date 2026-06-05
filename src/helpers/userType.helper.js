const db = require('../../models');

/**
 * Resolve or create a user_types row by base name (same pattern as COE controller).
 */
const getUserTypeId = async (userTypeBase, transaction = null) => {
  const queryOpts = (extra = {}) => ({
    ...extra,
    ...(transaction ? { transaction } : {}),
  });

  const [result] = await db.sequelize.query(
    'SELECT utid FROM user_types WHERE base = :userType LIMIT 1',
    queryOpts({
      replacements: { userType: userTypeBase },
      type: db.sequelize.QueryTypes.SELECT,
    })
  );
  if (result) return result.utid;

  const [maxResult] = await db.sequelize.query(
    'SELECT MAX(utid) as max_utid FROM user_types',
    queryOpts({ type: db.sequelize.QueryTypes.SELECT })
  );
  const newUtid = (maxResult?.max_utid ?? 5) + 1;

  await db.sequelize.query(
    'INSERT IGNORE INTO user_types (utid, base, createdAt, updatedAt) VALUES (:utid, :base, NOW(), NOW())',
    queryOpts({
      replacements: { utid: newUtid, base: userTypeBase },
      type: db.sequelize.QueryTypes.INSERT,
    })
  );

  return newUtid;
};

module.exports = { getUserTypeId };
