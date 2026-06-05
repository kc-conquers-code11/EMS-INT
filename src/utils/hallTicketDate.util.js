/**
 * UTC-safe date-only comparison helpers for hall ticket windows.
 */

/**
 * @param {string|Date} value
 * @returns {number} UTC midnight timestamp
 */
const toUtcDateOnlyMs = (value) => {
  if (!value) return NaN;
  const str = typeof value === 'string' ? value.slice(0, 10) : null;
  if (str && /^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [y, m, d] = str.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
  }
  const date = value instanceof Date ? value : new Date(value);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
};

/** @returns {number} */
const todayUtcDateOnlyMs = () => {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
};

/**
 * @param {string|Date} releaseDate
 * @param {string|Date} [referenceMs]
 * @returns {boolean}
 */
const isOnOrAfterReleaseDate = (releaseDate, referenceMs = todayUtcDateOnlyMs()) => {
  if (releaseDate == null || releaseDate === '') return true;
  const releaseMs = toUtcDateOnlyMs(releaseDate);
  if (Number.isNaN(releaseMs)) return true;
  return referenceMs >= releaseMs;
};

/**
 * @param {string|Date} downloadLastDate
 * @param {string|Date} [referenceMs]
 * @returns {boolean}
 */
const isOnOrBeforeDownloadLastDate = (downloadLastDate, referenceMs = todayUtcDateOnlyMs()) => {
  const lastMs = toUtcDateOnlyMs(downloadLastDate);
  if (Number.isNaN(lastMs)) return true;
  return referenceMs <= lastMs;
};

module.exports = {
  toUtcDateOnlyMs,
  todayUtcDateOnlyMs,
  isOnOrAfterReleaseDate,
  isOnOrBeforeDownloadLastDate,
};
