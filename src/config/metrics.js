import { formatBytes, formatNumber, formatPercent } from '../renderer/src/utils/formatters';

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
    smsp__warp_issue_stalled_long_scoreboard_per_warp_active: {
        display_name: 'Long Scoreboard',
        hint: 'Warp stalled due long scoreboard dependency',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation of the long scoreboard stall'
    },
    smsp__warp_issue_stalled_lg_throttle_per_warp_active: {
        display_name: 'LG Throttle',
        hint: 'Warp stalled due full L1 instruction queue for global memory operations',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation of the lg throttle stall'
    },
    smsp__warps_active: {
        display_name: 'Total stalls',
        hint: 'Total number of stalls encountered in this kernel',
        format_function: formatNumber,
        help_text: 'This is a detailed explanation of stalls'
    },
    atom_global_count: {
        display_name: 'Global atomics',
        hint: 'The total number of global atomics used',
        format_function: formatNumber,
        help_text: 'This is a detailed explanation of global atomics'
    },
    atom_shared_count: {
        display_name: 'Shared atomics',
        hint: 'The total number of shared atomics used',
        format_function: formatNumber,
        help_text: 'This is a detailed explanation of shared atomics'
    },
    sm__warps_active: {
        display_name: 'Occupancy',
        hint: 'Occupancy achieved',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation of occupancy'
    },
    smsp__sass_inst_executed_op_global: {
        display_name: 'Global Memory Instructions',
        hint: 'Number of instructions due to global memory accesses',
        format_function: formatNumber,
        help_text: 'This is a detailed explanation of global memory'
    },
    smsp__warp_issue_stalled_imc_miss_per_warp_active: {
        display_name: 'IMC Miss',
        hint: 'Warp stalled waiting for immediate constant cache miss',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation of imc miss'
    },
    global_data_per_instruction: {
        display_name: 'GMEM Data / Inst.',
        hint: 'Data processed by global memory per instruction',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation of global memory'
    },
    sm__sass_inst_executed_op_global_ld: {
        display_name: 'Global load instructions',
        hint: 'Total number of global load instructions',
        format_function: formatNumber,
        help_text: 'This is a detailed explanation of global loads'
    },
    smsp__sass_inst_executed: {
        display_name: 'Instructions executed',
        hint: 'Total number of instructions executed',
        format_function: formatNumber,
        help_text: 'This is a detailed explanation something'
    },
    global_load_count: {
        display_name: 'Non-vectorized Loads',
        hint: 'Total number of Non-vectorized load inst.',
        format_function: formatNumber,
        help_text: 'This is a detailed explanation something'
    },
    'memory_flow/local_to_l1_cache_miss_perc': {
        display_name: 'LMEM L1 Cache misses',
        hint: 'Percentage of L1 cache misses due to local memory',
        format_function: formatPercent,
        help_text: 'Something'
    }
};
