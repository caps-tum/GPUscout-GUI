/**
 * @module
 * @author Tobias Stuckenberger
 * @description This module defines all available formatters for different metric or stall values
 */
import { METRICS } from '../../../config/metrics';
import { STALLS } from '../../../config/stalls';

/**
 * @param {Number} value
 * @returns {String} The value formatted as a percent value
 */
export function formatPercent(value) {
    const format = new Intl.NumberFormat('de-DE', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1
    });
    let percent_rounded = Math.round(value * 100) / 100;
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
        maximumFractionDigits: 2,
        roundingMode: 'halfCeil'
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
 * @param {Number} percent
 * @returns {String} The value formatted
 */
export function formatInstructionsPerc(value, percent) {
    if (percent) {
        return `${formatNumber(value)} Inst. (${formatPercent(percent)})`;
    } else {
        return `${formatNumber(value)} Inst.`;
    }
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
        if (Object.keys(STALLS).includes(metricName)) {
            return STALLS[metricName];
        } else {
            return {
                display_name: metricName.replace('smsp__pcsamp_warps_issue_stalled_', '') + ' Stalls (No info)',
                format_function: formatStall,
                help_text: '',
                lower_better: true
            };
        }
    } else {
        return {
            display_name: metricName,
            format_function: (value, secondary_value) => {
                // Dont format if only one value as we could destroy some custom formatting with it
                if (secondary_value === undefined) return value;
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
export function formatStall(value1, value2) {
    if (value2 === undefined) {
        return formatNumber(value1);
    }
    if (Number.isInteger(value1)) {
        return `${formatNumber(value1)} (${formatPercent(value2)})`;
    } else {
        return `${formatNumber(value2)} (${formatPercent(value1)})`;
    }
}
