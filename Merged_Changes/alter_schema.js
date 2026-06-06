const db = require('./models');

async function checkSchema() {
  try {
    const [results] = await db.sequelize.query("DESCRIBE supervisor_allocation");
    console.log(results);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    process.exit();
  }
}

checkSchema();
