/**
 * Display formatting aligned with hallTicketTemplate.js (student portal JSON).
 */

const formatDisplayDate = (dateString) => {
  if (dateString == null || dateString === '') return '-';
  const str = String(dateString).trim();
  if (!str || str === '-' || str.includes('undefined')) return '-';
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
  if (parts.length !== 3) return str;
  const [year, month, day] = parts;
  return `${day}-${month}-${year}`;
};

const formatDisplayTime = (timeString) => {
  if (!timeString || typeof timeString !== 'string') return '-';
  const str = timeString.trim();
  if (!str || str === '-') return '-';
  if (!str.includes(':')) return str;
  const parts = str.split(':');
  const hour = parseInt(parts[0], 10);
  if (Number.isNaN(hour)) return str;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  const minutes = (parts[1] || '00').padStart(2, '0');
  return `${hour12}:${minutes} ${ampm}`;
};

/**
 * @param {string|Date} downloadLastDate
 */
const formatDownloadWindowClosedMessage = (eventName, downloadLastDate) => {
  const label = formatDisplayDate(downloadLastDate);
  const exam = eventName || 'this exam';
  return `The download window for the hall ticket of the exam "${exam}" closed on ${label}. Contact the college authorities for the hall ticket.`;
};

module.exports = {
  formatDisplayDate,
  formatDisplayTime,
  formatDownloadWindowClosedMessage,
};
