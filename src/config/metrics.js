import { formatPercent } from '../renderer/src/utils/formatters';

export const METRICS = {
    smsp__warp_issue_stalled_tex_throttle_per_warp_active: {
        display_name: 'Tex Throttle',
        hint: 'Warp stalled due to full TEX pipeline',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation of the TEX Throttle'
    }
};
