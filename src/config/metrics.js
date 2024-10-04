import { formatNumber, formatPercent } from '../renderer/src/utils/formatters';

export const METRICS = {
    smsp__warp_issue_stalled_tex_throttle_per_warp_active: {
        display_name: 'Tex Throttle',
        hint: 'Warp stalled due to full TEX pipeline',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation of the TEX Throttle'
    },
    smsp__warp_issue_stalled_mio_throttle_per_warp_active: {
        display_name: 'MIO Throttle',
        hint: 'Warp stalled due to full memory I/O pipeline',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation of the MIO Throttle'
    },
    smsp__warp_issue_stalled_short_scoreboard_per_warp_active: {
        display_name: 'Short Scoreboard',
        hint: 'Warp stalled due short scoreboard dependency',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation of the short scoreboard stall'
    },
    smsp__warps_active: {
        display_name: 'Total stalls',
        hint: 'Total number of stalls encountered in this kernel',
        format_function: formatNumber,
        help_text: 'This is a detailed explanation of stalls'
    }
};
