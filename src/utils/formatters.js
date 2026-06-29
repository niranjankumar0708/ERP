/**
 * Formats a number as USD currency
 * @param {number} value
 * @returns {string}
 */
export const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) {
    return '$0.00';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

/**
 * Formats an ISO date string to a readable format
 * @param {string} dateString - e.g. "2026-06-28"
 * @returns {string} - e.g. "Jun 28, 2026"
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Capitalizes the first letter of a string
 * @param {string} str
 * @returns {string}
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
