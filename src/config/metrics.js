import { formatBytes, formatInstructions, formatNumber, formatPercent } from '../renderer/src/utils/formatters';
import { STALLS } from './stalls';

/**
 * This list contains the definition of all metrics and their related information
 * - display_name: The title of the metric in the GUI
 * - format_function: The function used to format values of this metric
 * - hint: The hint displayed in the metric buttons
 * - help_text: The help text displayed in the help popup
 * - lower_better: If lower values are considered better (for comparisons)
 */
export const METRICS = {
    smsp__warp_issue_stalled_tex_throttle_per_warp_active: {
        display_name: 'Tex Throttle',
        hint: 'Warp stalled due to full TEX pipeline',
        format_function: formatPercent,
        help_text: STALLS.smsp__pcsamp_warps_issue_stalled_tex_throttle.help_text,
        lower_better: true
    },
    smsp__warp_issue_stalled_mio_throttle_per_warp_active: {
        display_name: 'MIO Throttle',
        hint: 'Warp stalled due to full memory I/O pipeline',
        format_function: formatPercent,
        help_text: STALLS.smsp__pcsamp_warps_issue_stalled_mio_throttle.help_text,
        lower_better: true
    },
    smsp__warp_issue_stalled_short_scoreboard_per_warp_active: {
        display_name: 'Short Scoreboard',
        hint: 'Warp stalled due short scoreboard dependency',
        format_function: formatPercent,
        help_text: STALLS.smsp__pcsamp_warps_issue_stalled_short_scoreboard.help_text,
        lower_better: true
    },
    smsp__warp_issue_stalled_long_scoreboard_per_warp_active: {
        display_name: 'Long Scoreboard',
        hint: 'Warp stalled due long scoreboard dependency',
        format_function: formatPercent,
        help_text: STALLS.smsp__pcsamp_warps_issue_stalled_long_scoreboard.help_text,
        lower_better: true
    },
    smsp__warp_issue_stalled_lg_throttle_per_warp_active: {
        display_name: 'LG Throttle',
        hint: 'Warp stalled due full L1 instruction queue for global memory operations',
        format_function: formatPercent,
        help_text: STALLS.smsp__pcsamp_warps_issue_stalled_lg_throttle.help_text,
        lower_better: true
    },
    smsp__warps_active: {
        display_name: 'Total stalls',
        hint: 'Total number of stalls encountered in this kernel',
        format_function: formatNumber,
        help_text: 'This is a detailed explanation of stalls',
        lower_better: true
    },
    atom_global_count: {
        display_name: 'Global atomics',
        hint: 'The total number of global atomics used',
        format_function: formatNumber,
        help_text: 'This is a detailed explanation of global atomics',
        lower_better: true
    },
    atom_shared_count: {
        display_name: 'Shared atomics',
        hint: 'The total number of shared atomics used',
        format_function: formatNumber,
        help_text: 'This is a detailed explanation of shared atomics',
        lower_better: true
    },
    sm__warps_active: {
        display_name: 'Occupancy',
        hint: 'Occupancy achieved',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation of occupancy',
        lower_better: true
    },
    smsp__sass_inst_executed_op_global: {
        display_name: 'Global Memory Instructions',
        hint: 'Number of instructions due to global memory accesses',
        format_function: formatNumber,
        help_text: 'This is a detailed explanation of global memory',
        lower_better: true
    },
    smsp__warp_issue_stalled_imc_miss_per_warp_active: {
        display_name: 'IMC Miss',
        hint: 'Warp stalled waiting for immediate constant cache miss',
        format_function: formatPercent,
        help_text: STALLS.smsp__pcsamp_warps_issue_stalled_imc_miss.help_text,
        lower_better: true
    },
    global_data_per_instruction: {
        display_name: 'GMEM Data / Inst.',
        hint: 'Data processed by global memory per instruction',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation of global memory',
        lower_better: true
    },
    sm__sass_inst_executed_op_global_ld: {
        display_name: 'Global load instructions',
        hint: 'Total number of global load instructions',
        format_function: formatNumber,
        help_text: 'This is a detailed explanation of global loads',
        lower_better: true
    },
    smsp__sass_inst_executed: {
        display_name: 'Instructions executed',
        hint: 'Total number of instructions executed',
        format_function: formatNumber,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    global_load_count: {
        display_name: 'Non-vectorized Loads',
        hint: 'Total number of Non-vectorized load inst.',
        format_function: formatNumber,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    'memory_flow/local_to_l1_cache_miss_perc': {
        display_name: 'LMEM L1 Cache misses',
        hint: 'Percentage of L1 cache misses due to local memory',
        format_function: formatPercent,
        help_text: 'Something',
        lower_better: true
    },
    branch_divergence_perc: {
        display_name: 'Branch divergence',
        hint: 'Fraction of branches that diverge',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    'data_memory_flow/shared_mem_load_operations': {
        display_name: 'Load operations',
        hint: 'Number of load instructions to shared memory',
        format_function: formatNumber,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    'bank_conflict/shared_mem_load_efficiency_perc': {
        display_name: 'Load efficiency',
        hint: 'Shared memory load efficiency',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    'bank_conflict/bank_conflict': {
        display_name: 'Bank conflicts',
        hint: 'Memory transactions per load access',
        format_function: formatNumber,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    'memory_flow/num_loads': {
        display_name: 'Global loads count',
        hint: 'Number of global loads',
        format_function: formatInstructions,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    'memory_flow/global_to_l1_bytes': {
        display_name: 'GMEM to L1',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    'memory_flow/global_to_l1_cache_miss_perc': {
        display_name: 'GMEM L1 Cache misses',
        hint: '',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    'memory_flow/global_l1_to_l2_bytes': {
        display_name: 'GMEM L1 to L2',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    'memory_flow/local_to_l1_bytes': {
        display_name: 'LMEM to L1',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    'memory_flow/local_l1_to_l2_bytes': {
        display_name: 'LMEM L1 to L2',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    'memory_flow/l1_to_l2_cache_miss_perc': {
        display_name: 'L1 to L2 Cache misses',
        hint: '',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    'memory_flow/l2_to_dram_bytes': {
        display_name: 'L2 to DRAM',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    'texture_data_memory_flow/kernel_to_tex_instr': {
        display_name: 'Kernel to Tex',
        hint: '',
        format_function: formatInstructions,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    'texture_data_memory_flow/tex_to_l1_bytes': {
        display_name: 'Tex to L1',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    'texture_data_memory_flow/tex_to_l1_cache_miss_perc': {
        display_name: 'Tex to L1 cache misses',
        hint: '',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    'texture_data_memory_flow/l1_to_l2_cache_miss_perc': {
        display_name: 'L1 to L2 cache misses',
        hint: '',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    'texture_data_memory_flow/l1_to_l2_bytes': {
        display_name: 'L1 to L2',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    'texture_data_memory_flow/l2_to_dram_bytes': {
        display_name: 'L2 to DRAM',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    'memory_flow/global_to_l1_red_atom_bytes': {
        display_name: 'L2 to DRAM',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    'memory_flow/l1_to_l2_bytes': {
        display_name: 'L2 to DRAM',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    }
};
