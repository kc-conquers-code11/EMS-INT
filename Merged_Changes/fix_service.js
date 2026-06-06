const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/services/semester/semester.service.js');
let content = fs.readFileSync(filePath, 'utf8');

// Replace s.programm_id with s.programme_id
content = content.replace(/s\.programm_id/g, 's.programme_id');

// Replace \bprogramm_id\b with programme_id except when preceded by 'p.' or followed by " FROM programme"
// A safer way is to just replace programm_id with programme_id globally, then fix 'p.programme_id' back to 'p.programm_id'.
content = content.replace(/programm_id/g, 'programme_id');
content = content.replace(/p\.programme_id/g, 'p.programm_id');

// Replace term with term_type in field definitions and queries
// Easiest is to replace s.term with s.term_type, semester.term with semester.term_type, validatedData.term with validatedData.term_type
content = content.replace(/s\.term/g, 's.term_type');
content = content.replace(/semester\.term/g, 'semester.term_type');
content = content.replace(/validatedData\.term/g, 'validatedData.term_type');
// In the INSERT/UPDATE queries:
content = content.replace(/, term,/g, ', term_type,');
content = content.replace(/:term,/g, ':term_type,');
content = content.replace(/term = :term,/g, 'term_type = :term_type,');

fs.writeFileSync(filePath, content);
console.log('Fixed semester.service.js');
