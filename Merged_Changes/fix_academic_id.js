const mysql = require('mysql2/promise');
const crypto = require('crypto');

async function run() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'krrish',
    password: 'krrish',
    database: 'ems'
  });

  // Alter academic_year to drop AUTO_INCREMENT and change to CHAR(36)
  await connection.query('ALTER TABLE academic_year MODIFY academic_id CHAR(36) NOT NULL;');

  // Get all academic_year records
  const [rows] = await connection.query('SELECT academic_id FROM academic_year');
  
  for (const row of rows) {
    const oldId = row.academic_id;
    if (oldId.length === 36) continue; // already a UUID somehow
    
    const newId = crypto.randomUUID();
    
    // update academic_year
    await connection.query('UPDATE academic_year SET academic_id = ? WHERE academic_id = ?', [newId, oldId]);
    
    // update semester
    await connection.query('UPDATE semester SET academic_id = ? WHERE academic_id = ?', [newId, oldId]);
    
    // update exam_event
    await connection.query('UPDATE exam_event SET academic_id = ? WHERE academic_id = ?', [newId, oldId]);
  }
  
  console.log("Migration complete.");
  await connection.end();
}

run().catch(console.error);
