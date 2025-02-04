/**
 * @module
 * @author Tobias Stuckenberger
 * @description This module contains the definitions for all stalls, which are a result of the PC sampling
 */
import { formatStall } from '../renderer/src/utils/formatters';
import { HELP_TEXTS } from './help_texts';

/**
 * Contains the definition of a single stall
 * @typedef {Object} StallDefinition
 * @property {String} display_name The name of the stall as is should be displayed in the UI
 * @property {Function} format_function A function that takes the value of the stall, as well as the percentage of the total stalls as inputs and returns a formatted string
 * @property {String} help_text A detailed description of the stall that is displayed in a popup when users wlick the help icon of the stall. Allows for html formatting
 * @property {Boolean} lower_better If a lower value should be considered better when comparing two GPUscout results
 */

/**
 * This list contains the definition of all stalls and their related information.
 * The key of this object has to correspond to the exact name of the stall as it is called in the GPUscout result.
 * Help texts are (with modifications) taken from https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html
 * @type {Object.<String, StallDefinition>}
 */
export const STALLS = {
    smsp__pcsamp_warps_issue_stalled_imc_miss: {
        display_name: 'IMC Miss Stalls',
        format_function: formatStall,
        help_text: HELP_TEXTS.stall_imc_miss,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_long_scoreboard: {
        display_name: 'Long Scoreboard Stalls',
        format_function: formatStall,
        help_text: HELP_TEXTS.stall_long_scoreboard,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_short_scoreboard: {
        display_name: 'Short Scoreboard Stalls',
        format_function: formatStall,
        help_text: HELP_TEXTS.stall_short_scoreboard,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_no_instructions: {
        display_name: 'No Instructions Stalls',
        format_function: formatStall,
        help_text: HELP_TEXTS.stall_no_instructions,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_wait: {
        display_name: 'Wait Stalls',
        format_function: formatStall,
        help_text: HELP_TEXTS.stall_wait,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_lg_throttle: {
        display_name: 'LG Throttle Stalls',
        format_function: formatStall,
        help_text: HELP_TEXTS.stall_lg_throttle,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_selected: {
        display_name: 'Selected Stalls',
        format_function: formatStall,
        help_text: HELP_TEXTS.stall_selected,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_not_selected: {
        display_name: 'Not Selected Stalls',
        format_function: formatStall,
        help_text: HELP_TEXTS.stall_not_selected,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_math_pipe_throttle: {
        display_name: 'Math Pipe Throttle Stalls',
        format_function: formatStall,
        help_text: HELP_TEXTS.stall_math_pipe_throttle,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_dispatch_stall: {
        display_name: 'Dispatch Stalls',
        format_function: formatStall,
        help_text: HELP_TEXTS.stall_dispatch,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_mio_throttle: {
        display_name: 'MIO Throttle Stalls',
        format_function: formatStall,
        help_text: HELP_TEXTS.stall_mio_throttle,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_tex_throttle: {
        display_name: 'TEX Throttle Stalls',
        format_function: formatStall,
        help_text: HELP_TEXTS.stall_tex_throttle,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_drain: {
        display_name: 'Drain Stalls',
        format_function: formatStall,
        help_text: HELP_TEXTS.stall_drain,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_branch_resolving: {
        display_name: 'Branch Resolving Stalls',
        format_function: formatStall,
        help_text: HELP_TEXTS.stall_branch_resolving,
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_misc: {
        display_name: 'Misc Stalls',
        format_function: formatStall,
        help_text: '',
        lower_better: true
    },
    smsp__pcsamp_warps_issue_stalled_barrier: {
        display_name: 'Barrier Stalls',
        format_function: formatStall,
        help_text: HELP_TEXTS.stall_barrier,
        lower_better: true
    },
    undefined: { display_name: 'Undefined', format_function: formatStall, help_text: '', lower_better: true }
};
