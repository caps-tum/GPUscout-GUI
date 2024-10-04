import { METRICS } from '../../../config/metrics';

/**
 * @param {Number} value
 * @returns {String} The value formatted as a percent value
 */
export function formatPercent(value, stalls) {
    let percent_rounded = Math.round(value * 100) / 100;
    if (stalls) {
        stalls = Math.round((stalls * value) / 100);
        return `${Math.round(stalls).toLocaleString()} (${percent_rounded.toLocaleString()}%)`;
    }
    return `${percent_rounded.toLocaleString()}%`;
}

/**
 * @param {Number} value
 * @returns {String} The value formatted as a bytes value
 */
export function formatBytes(value) {
    return `${Math.round(value).toLocaleString()}B`;
}

/**
 * @param {Number} value
 * @returns {String} The value formatted as a number with delimiters
 */
export function formatNumber(value) {
    return Math.round(value).toLocaleString();
}

/**
 * @param {String} metricName
 * @returns {{display_name: String, format_function: Function, help_text: String, hint: String}}
 */
export function getMetricsData(metricName) {
    if (METRICS[metricName]) {
        return METRICS[metricName];
    } else {
        return {
            display_name: metricName,
            format_function: (v) => v
        };
    }
}
