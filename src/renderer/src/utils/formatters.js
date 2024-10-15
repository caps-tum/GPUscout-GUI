import { METRICS } from '../../../config/metrics';
import { STALLS } from '../../../config/stalls';

/**
 * @param {Number} value
 * @returns {String} The value formatted as a percent value
 */
export function formatPercent(value, stalls) {
    const format = new Intl.NumberFormat('de-DE', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1
    });
    let percent_rounded = Math.round(value * 100) / 100;
    if (stalls) {
        stalls = Math.round((stalls * value) / 100);
        return `${format.format(Math.round(stalls))} (${format.format(percent_rounded)}%)`;
    }
    return `${format.format(percent_rounded)}%`;
}

/**
 * @param {Number} value
 * @returns {String} The value formatted as a bytes value
 */
export function formatBytes(value) {
    const format = new Intl.NumberFormat('de-DE', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });

    if (value < 1024) {
        return `${format.format(Math.round(value))}B`;
    } else if (value < 1024 * 1024) {
        return `${format.format(value / 1024)}kB`;
    } else if (value < 1024 * 1024 * 1024) {
        return `${format.format(value / (1024 * 1024))}MB`;
    } else if (value < 1024 * 1024 * 1024 * 1024) {
        return `${format.format(value / (1024 * 1024 * 1024))}GB`;
    }
    return value;
}

/**
 * @param {Number} value
 * @returns {String} The value formatted as a number with delimiters
 */
export function formatNumber(value) {
    return new Intl.NumberFormat('de-DE', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

/**
 * @param {Number} value
 * @returns {String} The value formatted
 */
export function formatInstructions(value) {
    return `${Math.round(value)} Inst.`;
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

/**
 * @param {String} stall
 */
export function formatStall(stall) {
    let stallName = '';
    if (stall.endsWith('_not_issued')) {
        stallName = STALLS[stall.substring(0, stall.length - 11)] + ' (not issued)';
    } else {
        stallName = STALLS[stall];
    }
    if (!stallName) {
        return stall;
    }
    return stallName;
}
