/**
 * @module
 * @author Tobias Stuckenberger
 * @description This module contains the definitions for all predefined metrics that are included in the GPUscout result file and are used in the UI
 */
import {
    formatBoolean,
    formatBytes,
    formatInstructions,
    formatNumber,
    formatPercent,
    formatStall
} from '../renderer/src/utils/formatters';
import { HELP_TEXTS } from './help_texts';

/**
 * Contains the definition of a single metric
 * @typedef {Object} MetricDefinition
 * @property {String} name The name of the metric in the GPUscout result file
 * @property {String} display_name The name of the metric as is should be displayed in the UI
 * @property {String} [hint] A hint to display under the display name of the metric
 * @property {Function} format_function A function that takes the value of the metric and returns a formatted string
 * @property {String} help_text A detailed description of the metric that is displayed in a popup when users wlick the help icon of the metric. Allows for html formatting
 * @property {Boolean} lower_better If a lower value should be considered better when comparing two GPUscout results
 */

/**
 * This list contains the definition of all metrics and their related information.
 * Sources for help texts:
 * - https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html#hardware-model
 * @type {Object.<String, MetricDefinition>}
 */
export const METRICS = {
    stalls_total: {
        name: 'misc/smsp__warps_active',
        display_name: 'Stalls',
        hint: 'Total number of stalls recorded',
        format_function: formatNumber,
        help_text: HELP_TEXTS.stall,
        lower_better: true
    },
    stalls_tex_throttle_perc: {
        name: 'misc/smsp__warp_issue_stalled_tex_throttle_per_warp_active',
        display_name: 'Tex Throttle Stalls',
        hint: 'Warp stalled due to full TEX pipeline',
        format_function: formatStall,
        help_text: HELP_TEXTS.stall_tex_throttle,
        lower_better: true
    },
    stalls_mio_throttle_perc: {
        name: 'misc/smsp__warp_issue_stalled_mio_throttle_per_warp_active',
        display_name: 'MIO Throttle Stalls',
        hint: 'Warp stalled due to full memory I/O pipeline',
        format_function: formatStall,
        help_text: HELP_TEXTS.stall_mio_throttle,
        lower_better: true
    },
    stalls_short_scoreboard_perc: {
        name: 'misc/smsp__warp_issue_stalled_short_scoreboard_per_warp_active',
        display_name: 'Short Scoreboard Stalls',
        hint: 'Warp stalled due short scoreboard dependency',
        format_function: formatStall,
        help_text: HELP_TEXTS.stall_short_scoreboard,
        lower_better: true
    },
    stalls_long_scoreboard_perc: {
        name: 'misc/smsp__warp_issue_stalled_long_scoreboard_per_warp_active',
        display_name: 'Long Scoreboard Stalls',
        hint: 'Warp stalled due long scoreboard dependency',
        format_function: formatStall,
        help_text: HELP_TEXTS.stall_long_scoreboard,
        lower_better: true
    },
    stalls_lg_throttle_perc: {
        name: 'misc/smsp__warp_issue_stalled_lg_throttle_per_warp_active',
        display_name: 'LG Throttle Stalls',
        hint: 'Warp stalled due full L1 instruction queue for GMEM operations',
        format_function: formatStall,
        help_text: HELP_TEXTS.stall_lg_throttle,
        lower_better: true
    },
    stalls_imc_miss_perc: {
        name: 'misc/smsp__warp_issue_stalled_imc_miss_per_warp_active',
        display_name: 'IMC Miss Stalls',
        hint: 'Warp stalled waiting for immediate constant cache miss',
        format_function: formatStall,
        help_text: HELP_TEXTS.stall_imc_miss,
        lower_better: true
    },
    occupancy: {
        name: 'misc/sm__warps_active',
        display_name: 'Occupancy',
        hint: 'Ratio of active to max. supported warps',
        format_function: formatPercent,
        help_text: HELP_TEXTS.occupancy,
        lower_better: false
    },
    global_atomics_count: {
        name: 'misc/atom_global_count',
        display_name: 'Global atomics',
        hint: 'Number of global atomics used',
        format_function: formatNumber,
        help_text: HELP_TEXTS.global_atomics,
        lower_better: true
    },
    shared_atomics_count: {
        name: 'misc/atom_shared_count',
        display_name: 'Shared atomics',
        hint: 'Number of shared atomics used',
        format_function: formatNumber,
        help_text: HELP_TEXTS.shared_atomics,
        lower_better: false
    },
    instructions_global_loads_non_vectorized: {
        name: 'misc/global_load_count',
        display_name: 'Non-vectorized Loads',
        hint: 'Number of non-vectorized load inst.',
        format_function: formatNumber,
        help_text: HELP_TEXTS.load_store_vec_non_vec,
        lower_better: true
    },
    branch_divergence_perc: {
        name: 'branch_divergence_perc',
        display_name: 'Branch divergence',
        hint: 'Fraction of branches that diverge',
        format_function: formatPercent,
        help_text: HELP_TEXTS.branching,
        lower_better: true
    },
    deadlock_detected: {
        name: 'deadlock_detect_flag',
        display_name: 'Deadlock detected',
        hint: 'If a deadlock has been detected',
        format_function: formatBoolean,
        help_text: HELP_TEXTS.deadlock,
        lower_better: true
    },
    general_total_instructions: {
        name: 'general/total_instructions',
        display_name: 'Total instructions',
        hint: 'Total number of instructions executed',
        format_function: formatInstructions,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: true
    },
    general_l2_cache_hit_perc: {
        name: 'general/l2_cache_hit_perc',
        display_name: 'L2 Cache hits',
        hint: '',
        format_function: formatPercent,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: false
    },
    general_l2_queries: {
        name: 'general/l2_queries',
        display_name: 'L2 queries',
        hint: '',
        format_function: formatInstructions,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: true
    },
    general_loads_l2_cache_hit_perc: {
        name: 'general/loads_l2_cache_hit_perc',
        display_name: 'L2 loads cache hits',
        hint: '',
        format_function: formatPercent,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: false
    },
    general_loads_l2_to_dram_bytes: {
        name: 'general/loads_l2_to_dram_bytes',
        display_name: 'L2 to DRAM',
        hint: '',
        format_function: formatBytes,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: true
    },
    general_stores_l2_cache_hit_perc: {
        name: 'general/stores_l2_cache_hit_perc',
        display_name: 'L2 stores cache hits',
        hint: '',
        format_function: formatPercent,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: false
    },
    general_stores_l2_to_dram_bytes: {
        name: 'general/stores_l2_to_dram_bytes',
        display_name: 'L2 stores to DRAM',
        hint: '',
        format_function: formatBytes,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: true
    },
    global_atomic_l1_cache_hit_perc: {
        name: 'global/atomic_l1_cache_hit_perc',
        display_name: 'GA L1 cache hits',
        hint: '',
        format_function: formatPercent,
        help_text: HELP_TEXTS.global_atomics,
        lower_better: false
    },
    global_atomic_to_l1_bytes: {
        name: 'global/atomic_to_l1_bytes',
        display_name: 'GA to L1',
        hint: '',
        format_function: formatBytes,
        help_text: HELP_TEXTS.global_atomics,
        lower_better: true
    },
    global_atomics_l1_to_l2_bytes: {
        name: 'global/atomics_l1_to_l2_bytes',
        display_name: 'GA L1 to L2',
        hint: '',
        format_function: formatBytes,
        help_text: HELP_TEXTS.global_atomics,
        lower_better: true
    },
    global_atomics_l2_cache_hit_perc: {
        name: 'global/atomics_l2_cache_hit_perc',
        display_name: 'GA L2 cache hits',
        hint: '',
        format_function: formatPercent,
        help_text: HELP_TEXTS.global_atomics,
        lower_better: false
    },
    global_atomics_l2_to_dram_bytes: {
        name: 'global/atomics_l2_to_dram_bytes',
        display_name: 'GA L2 to DRAM',
        hint: '',
        format_function: formatBytes,
        help_text: HELP_TEXTS.global_atomics,
        lower_better: true
    },
    global_bytes_per_instruction: {
        name: 'global/bytes_per_instruction',
        display_name: 'GMEM Bytes per Instr.',
        hint: '',
        format_function: formatBytes,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: false
    },
    global_instructions: {
        name: 'global/instructions',
        display_name: 'Global Instructions',
        hint: 'Total number of global load/store instructions',
        format_function: formatInstructions,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: true
    },
    global_loads_instructions: {
        name: 'global/loads_instructions',
        display_name: 'Global Loads',
        hint: 'Total number of global load instructions',
        format_function: formatInstructions,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: true
    },
    global_loads_l1_cache_hit_perc: {
        name: 'global/loads_l1_cache_hit_perc',
        display_name: 'GMEM L1 cache hits',
        hint: '',
        format_function: formatPercent,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: false
    },
    global_loads_l1_to_l2_bytes: {
        name: 'global/loads_l1_to_l2_bytes',
        display_name: 'GMEM L1 to L2',
        hint: '',
        format_function: formatBytes,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: true
    },
    global_loads_to_l1_bytes: {
        name: 'global/loads_to_l1_bytes',
        display_name: 'GMEM to L1',
        hint: '',
        format_function: formatBytes,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: true
    },
    global_stores_instructions: {
        name: 'global/stores_instructions',
        display_name: 'Global Stores',
        hint: '',
        format_function: formatInstructions,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: true
    },
    global_stores_l1_cache_hit_perc: {
        name: 'global/stores_l1_cache_hit_perc',
        display_name: 'Global store L1 cache hits',
        hint: '',
        format_function: formatPercent,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: false
    },
    global_stores_l1_to_l2_bytes: {
        name: 'global/stores_l1_to_l2_bytes',
        display_name: 'Global store L1 to L2',
        hint: '',
        format_function: formatBytes,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: true
    },
    global_stores_to_l1_bytes: {
        name: 'global/stores_to_l1_bytes',
        display_name: 'Global store to L1',
        hint: '',
        format_function: formatBytes,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: true
    },
    local_instructions: {
        name: 'local/instructions',
        display_name: 'LMEM instructions',
        hint: '',
        format_function: formatInstructions,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: true
    },
    local_l2_queries_perc: {
        name: 'local/l2_queries_perc',
        display_name: 'L2 Queries due to LMEM',
        hint: '',
        format_function: formatPercent,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: true
    },
    local_loads_instructions: {
        name: 'local/loads_instructions',
        display_name: 'Local Loads',
        hint: '',
        format_function: formatInstructions,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: true
    },
    local_loads_l1_cache_hit_perc: {
        name: 'local/loads_l1_cache_hit_perc',
        display_name: 'Local load L1 cache hits',
        hint: 'Percentage of L1 cache hits of local load instructions',
        format_function: formatPercent,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: false
    },
    local_loads_l1_to_l2_bytes: {
        name: 'local/loads_l1_to_l2_bytes',
        display_name: 'Local load L1 to L2',
        hint: '',
        format_function: formatBytes,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: true
    },
    local_loads_to_l1_bytes: {
        name: 'local/loads_to_l1_bytes',
        display_name: 'Local load to L1',
        hint: '',
        format_function: formatBytes,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: true
    },
    local_stores_instructions: {
        name: 'local/stores_instructions',
        display_name: 'Local Stores',
        hint: '',
        format_function: formatInstructions,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: true
    },
    local_stores_l1_cache_hit_perc: {
        name: 'local/stores_l1_cache_hit_perc',
        display_name: 'Local store L1 cache hits',
        hint: '',
        format_function: formatPercent,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: false
    },
    local_stores_l1_to_l2_bytes: {
        name: 'local/stores_l1_to_l2_bytes',
        display_name: 'Local store L1 to L2',
        hint: '',
        format_function: formatBytes,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: true
    },
    local_stores_to_l1_bytes: {
        name: 'local/stores_to_l1_bytes',
        display_name: 'Local store to L1',
        hint: '',
        format_function: formatBytes,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: true
    },
    shared_instructions: {
        name: 'shared/instructions',
        display_name: 'Shared instructions',
        hint: '',
        format_function: formatInstructions,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: true
    },
    shared_ldgsts_instructions: {
        name: 'shared/ldgsts_instructions',
        display_name: 'shared ldgsts_instructions',
        hint: '',
        format_function: formatInstructions,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: true
    },
    shared_loads_bank_conflict: {
        name: 'shared/loads_bank_conflict',
        display_name: 'Bank conflict',
        hint: 'Number of way bank conflicts',
        format_function: formatInstructions,
        help_text: HELP_TEXTS.shared_memory,
        lower_better: true
    },
    shared_loads_efficiency_perc: {
        name: 'shared/loads_efficiency_perc',
        display_name: 'Shared Loads efficiency',
        hint: 'Ratio of shared memory in loads',
        format_function: formatPercent,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: false
    },
    shared_loads_instructions: {
        name: 'shared/loads_instructions',
        display_name: 'Shared Loads',
        hint: 'Number of shared load instructions',
        format_function: formatInstructions,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: true
    },
    shared_stores_instructions: {
        name: 'shared/stores_instructions',
        display_name: 'shared stores_instructions',
        hint: '',
        format_function: formatInstructions,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: true
    },
    texture_instructions: {
        name: 'texture/instructions',
        display_name: 'Texture instructions',
        hint: '',
        format_function: formatInstructions,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: true
    },
    texture_loads_l1_cache_hit_perc: {
        name: 'texture/loads_l1_cache_hit_perc',
        display_name: 'TEX L1 cache hits',
        hint: '',
        format_function: formatPercent,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: false
    },
    texture_loads_l1_to_l2_bytes: {
        name: 'texture/loads_l1_to_l2_bytes',
        display_name: 'TEX L1 to L2',
        hint: '',
        format_function: formatBytes,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: true
    },
    texture_loads_l2_to_dram_bytes: {
        name: 'texture/loads_l2_to_dram_bytes',
        display_name: 'TEX L2 to DRAM',
        hint: '',
        format_function: formatBytes,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: true
    },
    texture_loads_to_l1_bytes: {
        name: 'texture/loads_to_l1_bytes',
        display_name: 'TEX to L1',
        hint: '',
        format_function: formatBytes,
        help_text: HELP_TEXTS.show_memory_graph,
        lower_better: true
    }
};
