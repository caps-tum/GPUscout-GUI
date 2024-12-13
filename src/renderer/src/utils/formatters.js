import { METRICS } from '../../../config/metrics';
import { STALLS } from '../../../config/stalls';

/**
 * @param {Number} value
 * @param {Number} total_value
 * @returns {String} The value formatted as a percent value
 */
export function formatPercent(value, total_value) {
    const format = new Intl.NumberFormat('de-DE', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1
    });
    let percent_rounded = Math.round(value * 100) / 100;
    if (total_value) {
        total_value = Math.round((total_value * value) / 100);
        return `${format.format(Math.round(total_value))} (${format.format(percent_rounded)}%)`;
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
    return `${formatNumber(value)} Inst.`;
}

/**
 * @param {Number} value
 * @returns {String} The value formatted
 */
export function formatBoolean(value) {
    return value ? 'True' : 'False';
}

/**
 * @param {String} metricName
 * @returns {{display_name: String, format_function: Function, help_text: String, hint: String, lower_better: Boolean}}
 */
export function getMetricsData(metricName) {
    if (Object.values(METRICS).find((m) => m.name === metricName)) {
        return Object.values(METRICS).find((m) => m.name === metricName);
    } else if (metricName.startsWith('smsp__pcsamp')) {
        return STALLS[metricName];
    } else {
        return {
            display_name: metricName,
            format_function: (value, secondary_value) => {
                if (secondary_value === undefined)
                    return Number.isInteger(value) ? formatNumber(value) : formatPercent(value);
                let absolute,
                    relative = 0;
                if (Number.isInteger(value)) {
                    absolute = formatNumber(value);
                    relative = formatPercent(secondary_value);
                } else {
                    absolute = formatNumber(secondary_value);
                    relative = formatPercent(value);
                }
                return `${absolute} (${relative})`;
            },
            lower_better: true
        };
    }
}

/**
 * @param {String} stall
 */
export function formatStall(absolute, relative) {
    return `${formatNumber(absolute)} (${formatPercent(relative)})`;
}
