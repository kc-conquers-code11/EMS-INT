
// Helper to convert 'YYYY-MM-DD' or ISO datetime to 'DD-MM-YYYY'
const formatDate = (dateString) => {
  if (dateString == null || dateString === '') return '-';
  const str = String(dateString).trim();
  if (!str || str === '-' || str.includes('undefined') || str === 'Invalid Date') {
    return '-';
  }
  if (str.includes('T')) {
    const d = new Date(str);
    if (!Number.isNaN(d.getTime())) {
      const day = String(d.getUTCDate()).padStart(2, '0');
      const month = String(d.getUTCMonth() + 1).padStart(2, '0');
      const year = d.getUTCFullYear();
      return `${day}-${month}-${year}`;
    }
  }
  const parts = str.slice(0, 10).split('-');
  if (parts.length !== 3 || parts.some((p) => !p || p === 'undefined')) return '-';
  const [year, month, day] = parts;
  return `${day}-${month}-${year}`;
};

// Helper to convert '14:30:00.000000' to '2:30 PM' safely
const formatTime = (timeString) => {
  // 1. Ensure it exists and is a string
  if (!timeString || typeof timeString !== 'string') return '-';
  
  // 2. If it doesn't contain a colon, just return it as-is (handles "TBD", etc.)
  if (!timeString.includes(':')) return timeString;
  
  // 3. Extract parts safely
  const parts = timeString.split(':');
  const hourStr = parts[0];
  const minuteStr = parts[1] || '00'; // Fallback to '00' if minutes are missing
  
  let hour = parseInt(hourStr, 10);
  
  // 4. If parsing the hour fails, return the original string
  if (isNaN(hour)) return timeString;
  
  // Determine AM/PM and convert to 12-hour format
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12; 
  
  // Ensure the minute is padded correctly
  const minutes = minuteStr.padStart(2, '0');
  
  return `${hour}:${minutes} ${ampm}`;
};



const generateHallTicketHtml = (data) => {
  const institutionName = process.env.INSTITUTION_NAME || 'Institution';
  
  const scheduleRows = data.exam_schedule
    .map(
      (item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${item.subject_code || '-'}</td>
      <td>${item.subject_name || '-'}</td>
      <td>${formatDate(item.exam_date) || '-'}</td>
      <td>${formatTime(item.exam_time) || '-'}</td>
    </tr>
  `
    )
    .join('');

  const photoHtml = data.photo_url
    ? `<img src="${data.photo_url}" alt="Student Photo" class="student-photo" />`
    : `<div class="student-photo-placeholder">Photo</div>`;

  let principalSignatureBlock = '<div style="text-align: right;">Principal signature</div>';
  if (data.include_principal_signature) {
    if (data.principal_signature_src) {
      const mediaHtml = `<img src="${data.principal_signature_src}" alt="Principal Signature" class="principal-signature-img" />`;
      principalSignatureBlock = `
        <div class="principal-signature-col">
          ${mediaHtml}
          <div class="principal-signature-label">Principal signature</div>
        </div>`;
    } else {
      principalSignatureBlock = `
        <div class="principal-signature-col">
          <div class="principal-signature-missing">${data.principal_signature_message || 'No signature was found'}</div>
          <div class="principal-signature-label">Principal signature</div>
        </div>`;
    }
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Hall Ticket</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
          position: relative;
        }
        .watermark {
          position: fixed;
          top: 40%;
          left: 10%;
          font-size: 96px;
          opacity: 0.06;
          transform: rotate(-45deg);
          color: #000;
          z-index: 0;
          pointer-events: none;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          text-transform: uppercase;
        }
        .header h2 {
          margin: 5px 0 0 0;
          font-size: 18px;
          color: #555;
        }
        .content-wrapper {
          position: relative;
          z-index: 1;
        }
        .student-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .info-details table {
          width: 100%;
          border-collapse: collapse;
        }
        .info-details td {
          padding: 5px 10px 5px 0;
          font-size: 14px;
        }
        .info-details td:first-child {
          font-weight: bold;
          width: 150px;
        }
        .photo-container {
          width: 120px;
          height: 150px;
          flex-shrink: 0;
          margin-left: 20px;
        }
        .student-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border: 2px solid #ccc;
        }
        .student-photo-placeholder {
          width: 100%;
          height: 100%;
          border: 2px solid #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          font-size: 14px;
        }
        .schedule-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .schedule-table th, .schedule-table td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
          font-size: 14px;
        }
        .schedule-table th {
          background-color: #f5f5f5;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #777;
          margin-top: 40px;
          border-top: 1px solid #ddd;
          padding-top: 10px;
        }
        .signatures-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: 80px;
          padding: 0 10px;
          font-size: 14px;
        }
        .principal-signature-col {
          text-align: right;
          min-width: 160px;
        }
        .principal-signature-img {
          display: block;
          margin-left: auto;
          margin-bottom: 6px;
          max-height: 56px;
          max-width: 140px;
          width: auto;
          height: auto;
          object-fit: contain;
          background: #ffffff;
        }
        .principal-signature-label {
          font-size: 14px;
        }
        .principal-signature-missing {
          font-size: 11px;
          color: #888;
          margin-bottom: 6px;
          font-style: italic;
        }
      </style>
    </head>
    <body>
      
      <div class="content-wrapper">
        <div class="header">
          <h1>${institutionName}</h1>
          <h2>HALL TICKET</h2>
        </div>

        <div class="student-info">
          <div class="info-details">
            <table>
              <tr>
                <td>Student ID:</td>
                <td>${data.stud_clg_id || '-'}</td>
              </tr>
              <tr>
                <td>Student Name:</td>
                <td>${data.student_name || '-'}</td>
              </tr>
              <tr>
                <td>Program:</td>
                <td>${data.programme_name || '-'}</td>
              </tr>
              <tr>
                <td>Branch:</td>
                <td>${data.branch_name || '-'}</td>
              </tr>
              <tr>
                <td>Academic Year:</td>
                <td>${data.academic_year || '-'}</td>
              </tr>
              <tr>
                <td>Exam Event:</td>
                <td>${data.event_name || '-'}</td>
              </tr>
              <tr>
                <td>Seat Number:</td>
                <td>${data.seat_no || '-'}</td>
              </tr>
            </table>
          </div>
          <div class="photo-container">
            ${photoHtml}
          </div>
        </div>

        <table class="schedule-table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Subject Code</th>
              <th>Subject Name</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            ${scheduleRows}
          </tbody>
        </table>

        <div class="footer">
          ${data.instructions && Array.isArray(data.instructions) && data.instructions.length > 0 ? `<div style="text-align: left; margin-bottom: 20px;"><strong>Instructions:</strong><ul>${data.instructions.map(inst => `<li>${inst}</li>`).join('')}</ul></div>` : ''}
        </div>

        <div class="signatures-row">
            <div style="text-align: left;">Student Signature</div>
            <div style="text-align: center;">Department stamp</div>
            ${principalSignatureBlock}
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  generateHallTicketHtml,
};
