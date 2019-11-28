import formatFns from 'date-fns/format';
export const dateFormat = 'yyyy-MM-dd';

/**
 * Curry function for format function from date-fns
 *
 * @param {Date} date
 * @param {string} formatStr
 * @returns {string}
 */
export function format(date, formatStr = 'yyyy-MM-dd') {
    return formatFns(date, formatStr);
}
