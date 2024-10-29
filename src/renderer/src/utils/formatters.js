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
    return `${formatNumber(value)} Inst.`;
}

/**
 * @param {String} metricName
 * @returns {{display_name: String, format_function: Function, help_text: String, hint: String}}
 */
export function getMetricsData(metricName) {
    if (METRICS[metricName]) {
        return METRICS[metricName];
    } else if (metricName.startsWith('smsp__pcsamp')) {
        const issued = !metricName.endsWith('_not_issued');
        const stallName = issued ? metricName : metricName.substring(0, metricName.length - 11);
        const result = STALLS[stallName];
        if (!issued) {
            result['display_name'] += ' (not issued)';
        }
        return result;
    } else {
        return {
            display_name: metricName,
            format_function: (v, a) => {
                if (!a) return v;
                let vString = formatNumber(v),
                    aString = formatNumber(a);
                if (!Number.isInteger(v)) vString = formatPercent(v);
                if (!Number.isInteger(a)) aString = formatPercent(a);
                return `${vString} (${aString})`;
            }
        };
    }
}

/**
 * @param {String} stall
 */
export function formatStall(absolute, relative) {
    return `${formatNumber(absolute)} (${formatPercent(relative)})`;
}
