import { METRICS } from '../../../config/metrics';

export function formatPercent(value) {
    value = Math.round(value * 100) / 100;
    return `${value}%`;
}

export function formatBytes(value) {
    return `${Math.round(value)}B`;
}

/**
 * @param {String} metricName
 * @param {String|Number} metricValue
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
