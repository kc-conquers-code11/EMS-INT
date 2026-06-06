/**
 * Normalize JSON_ARRAYAGG exam_schedule for hall ticket view + PDF.
 * @param {object} row - query row with exam_schedule, event_name, exam_date, exam_time
 * @returns {Array<{ subject_code: string, subject_name: string, exam_date: string, exam_time: string }>}
 */
const normalizeExamSchedule = (row) => {
  let raw = row?.exam_schedule;
  if (typeof raw === 'string') {
    try {
      raw = JSON.parse(raw);
    } catch {
      raw = [];
    }
  }
  if (!Array.isArray(raw)) raw = [];

  const mapped = raw
    .filter((item) => item && typeof item === 'object' && (item.subject_code || item.subject_name))
    .map((item) => ({
      subject_code: item.subject_code || item.course_code || '-',
      subject_name: item.subject_name || item.course_name || '-',
      exam_date: item.exam_date || item.date
        ? String(item.exam_date || item.date).slice(0, 10)
        : '-',
      exam_time: item.exam_time || item.time
        ? String(item.exam_time || item.time)
        : '-',
    }));

  if (mapped.length > 0) return mapped;

  return [
    {
      subject_code: '-',
      subject_name: row?.event_name || 'Exam',
      exam_date: row?.exam_date ? String(row.exam_date).slice(0, 10) : '-',
      exam_time: row?.exam_time ? String(row.exam_time) : '-',
    },
  ];
};

/**
 * @param {Array<{ subject_code: string, subject_name: string, exam_date: string, exam_time: string }>} schedule
 */
const scheduleToSubjectRows = (schedule) =>
  schedule.map((item, index) => ({
    sr_no: index + 1,
    course_code: item.subject_code,
    course_name: item.subject_name,
    date: item.exam_date,
    time: item.exam_time,
  }));

module.exports = {
  normalizeExamSchedule,
  scheduleToSubjectRows,
};
