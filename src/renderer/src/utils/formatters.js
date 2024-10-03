export function formatPercent(value) {
    value = Math.round(value * 100) / 100;
    return `${value}%`;
}

export function formatBytes(value) {
    return `${Math.round(value)}B`;
}
