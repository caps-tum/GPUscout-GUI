import { formatStall } from '../renderer/src/utils/formatters';

/**
 * This list contains the definition of all stalls and their related information
 * - display_name: The title of the stall in the GUI
 * - format_function: The function used to format values of this stall
 * - help_text: The help text displayed in the help popup
 * - lower_better: If lower values are considered better (for comparisons)
 */
export const STALLS = {
    smsp__pcsamp_warps_issue_stalled_imc_miss: {
        display_name: 'IMC Miss',
        format_function: formatStall,
        help_text: 'Stall help',
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_long_scoreboard: {
        display_name: 'Long Scoreboard',
        format_function: formatStall,
        help_text: 'Stall help',
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_short_scoreboard: {
        display_name: 'Short Scoreboard',
        format_function: formatStall,
        help_text: 'Stall help',
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_no_instructions: {
        display_name: 'No Instructions',
        format_function: formatStall,
        help_text: 'Stall help',
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_wait: {
        display_name: 'Wait',
        format_function: formatStall,
        help_text: 'Stall help',
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_lg_throttle: {
        display_name: 'LG Throttle',
        format_function: formatStall,
        help_text: 'Stall help',
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_selected: {
        display_name: 'Selected',
        format_function: formatStall,
        help_text: 'Stall help',
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_not_selected: {
        display_name: 'Not Selected',
        format_function: formatStall,
        help_text: 'Stall help',
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_math_pipe_throttle: {
        display_name: 'Math Pipe Throttle',
        format_function: formatStall,
        help_text: 'Stall help',
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_dispatch_stall: {
        display_name: 'Dispatch',
        format_function: formatStall,
        help_text: 'Stall help',
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_mio_throttle: {
        display_name: 'MIO Throttle',
        format_function: formatStall,
        help_text: 'Stall help',
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_tex_throttle: {
        display_name: 'TEX Throttle',
        format_function: formatStall,
        help_text: 'Stall help',
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_drain: {
        display_name: 'Drain',
        format_function: formatStall,
        help_text: 'Stall help',
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_branch_resolving: {
        display_name: 'Branch Resolving',
        format_function: formatStall,
        help_text: 'Stall help',
        lower_better: true
    },
    undefined: { display_name: 'Undefined', format_function: formatStall, help_text: 'Stall help', lower_better: true }
};
