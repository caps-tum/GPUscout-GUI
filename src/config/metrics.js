import {
    formatBoolean,
    formatBytes,
    formatInstructions,
    formatNumber,
    formatPercent
} from '../renderer/src/utils/formatters';
import { STALLS } from './stalls';

/**
 * This list contains the definition of all metrics and their related information
 * - display_name: The title of the metric in the GUI
 * - format_function: The function used to format values of this metric
 * - hint: The hint displayed in the metric buttons
 * - help_text: The help text displayed in the help popup
 * - lower_better: If lower values are considered better (for comparisons)
 * Sources for help texts:
 * - https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html#hardware-model
 */
export const METRICS = {
    stalls_total: {
        name: 'misc/smsp__warps_active',
        display_name: 'Stalls',
        hint: 'Total number of stalls encountered in this kernel',
        format_function: formatNumber,
        help_text: `<b>Warps and the GPU Thread Hierarchy</b>
In NVIDIA GPUs, threads are organized in groups of multiple levels. The main processing unit of the GPU are so-calles Streaming Multiprocessors (SMs), which are then partitioned into four processing blocks, called SM sub-partitions. These are the primary processing elements on each SM and contain (among others) the following units:
- A warp scheduler
- A register file
- Several Execution units, pipelines and cores (for example memory load/store units)
Lastly, threads are organized in groups of 32 into so-called warps. Warps are fundamental units of scheduling in NVIDIA's CUDA architecture, as the GPU scheduler dispatches instructions to these 32-thread warps rather than to individual threads. A SM sub-partition manages a pool of these warps (pool size depends on architecture), with the warp scheduler issuing instructions to process.
<b>Warp stalls</b>
Warps can be in several different states, for example in the eligible state, if it is ready to issue an instruction. Warp stalls happen when a warp cannot proceed with the next instruction due to some delay. This delay can be one of:
- An instruction fetch
- A memory dependency (the result of a memory instruction)
- An execution dependency (the ressult of a previous instruction)
- A synchronization barrier
When stalls occur, they are recorded and classified into one of several warp stall reasons, allowing fine-grained analysis and insight into the kernel execution. Although impossible to avoid completely, warp stalls should be held as low as possible.

More information is available at <a href="https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html#hardware-model">https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html#hardware-model</a>`,
        lower_better: true
    },
    stalls_tex_throttle_perc: {
        name: 'misc/smsp__warp_issue_stalled_tex_throttle_per_warp_active',
        display_name: 'Tex Throttle Stalls',
        hint: 'Warp stalled due to full TEX pipeline',
        format_function: formatPercent,
        help_text: STALLS.smsp__pcsamp_warps_issue_stalled_tex_throttle.help_text,
        lower_better: true
    },
    stalls_mio_throttle_perc: {
        name: 'misc/smsp__warp_issue_stalled_mio_throttle_per_warp_active',
        display_name: 'MIO Throttle Stalls',
        hint: 'Warp stalled due to full memory I/O pipeline',
        format_function: formatPercent,
        help_text: STALLS.smsp__pcsamp_warps_issue_stalled_mio_throttle.help_text,
        lower_better: true
    },
    stalls_short_scoreboard_perc: {
        name: 'misc/smsp__warp_issue_stalled_short_scoreboard_per_warp_active',
        display_name: 'Short Scoreboard Stalls',
        hint: 'Warp stalled due short scoreboard dependency',
        format_function: formatPercent,
        help_text: STALLS.smsp__pcsamp_warps_issue_stalled_short_scoreboard.help_text,
        lower_better: true
    },
    stalls_long_scoreboard_perc: {
        name: 'misc/smsp__warp_issue_stalled_long_scoreboard_per_warp_active',
        display_name: 'Long Scoreboard Stalls',
        hint: 'Warp stalled due long scoreboard dependency',
        format_function: formatPercent,
        help_text: STALLS.smsp__pcsamp_warps_issue_stalled_long_scoreboard.help_text,
        lower_better: true
    },
    stalls_lg_throttle_perc: {
        name: 'misc/smsp__warp_issue_stalled_lg_throttle_per_warp_active',
        display_name: 'LG Throttle Stalls',
        hint: 'Warp stalled due full L1 instruction queue for global memory operations',
        format_function: formatPercent,
        help_text: STALLS.smsp__pcsamp_warps_issue_stalled_lg_throttle.help_text,
        lower_better: true
    },
    stalls_imc_miss_perc: {
        name: 'misc/smsp__warp_issue_stalled_imc_miss_per_warp_active',
        display_name: 'IMC Miss Stalls',
        hint: 'Warp stalled waiting for immediate constant cache miss',
        format_function: formatPercent,
        help_text: STALLS.smsp__pcsamp_warps_issue_stalled_imc_miss.help_text,
        lower_better: true
    },
    occupancy: {
        name: 'misc/sm__warps_active',
        display_name: 'Occupancy',
        hint: 'Occupancy achieved',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation of occupancy',
        lower_better: false
    },
    global_atomics_count: {
        name: 'misc/atom_global_count',
        display_name: 'Global atomics',
        hint: 'The total number of global atomics used',
        format_function: formatNumber,
        help_text: 'This is a detailed explanation of global atomics',
        lower_better: true
    },
    shared_atomics_count: {
        name: 'misc/atom_shared_count',
        display_name: 'Shared atomics',
        hint: 'The total number of shared atomics used',
        format_function: formatNumber,
        help_text: 'This is a detailed explanation of shared atomics',
        lower_better: true
    },
    instructions_global_loads_non_vectorized: {
        name: 'misc/global_load_count',
        display_name: 'Non-vectorized Loads',
        hint: 'Total number of Non-vectorized load inst.',
        format_function: formatNumber,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    branch_divergence_perc: {
        name: 'branch_divergence_perc',
        display_name: 'Branch divergence',
        hint: 'Fraction of branches that diverge',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    deadlock_detected: {
        name: 'deadlock_detect_flag',
        display_name: 'Deadlock detected',
        hint: 'If a deadlock has been detected in the kernel',
        format_function: formatBoolean,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    general_total_instructions: {
        name: 'general/total_instructions',
        display_name: 'Total instructions',
        hint: 'Total number of instructions executed',
        format_function: formatInstructions,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    general_l2_cache_hit_perc: {
        name: 'general/l2_cache_hit_perc',
        display_name: 'L2 Cache hits',
        hint: '',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    general_l2_queries: {
        name: 'general/l2_queries',
        display_name: 'L2 queries',
        hint: '',
        format_function: formatInstructions,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    general_loads_l2_cache_hit_perc: {
        name: 'general/loads_l2_cache_hit_perc',
        display_name: 'L2 loads cache hits',
        hint: '',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    general_loads_l2_to_dram_bytes: {
        name: 'general/loads_l2_to_dram_bytes',
        display_name: 'L2 loads to DRAM',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    general_stores_l2_cache_hit_perc: {
        name: 'general/stores_l2_cache_hit_perc',
        display_name: 'L2 stores cache hits',
        hint: '',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    general_stores_l2_to_dram_bytes: {
        name: 'general/stores_l2_to_dram_bytes',
        display_name: 'L2 stores to DRAM',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    global_atomic_l1_cache_hit_perc: {
        name: 'global/atomic_l1_cache_hit_perc',
        display_name: 'GA L1 cache hits',
        hint: '',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    global_atomic_to_l1_bytes: {
        name: 'global/atomic_to_l1_bytes',
        display_name: 'GA to L1',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    global_atomics_l1_to_l2_bytes: {
        name: 'global/atomics_l1_to_l2_bytes',
        display_name: 'GA L1 to L2',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    global_atomics_l2_cache_hit_perc: {
        name: 'global/atomics_l2_cache_hit_perc',
        display_name: 'GA L2 cache hits',
        hint: '',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    global_atomics_l2_to_dram_bytes: {
        name: 'global/atomics_l2_to_dram_bytes',
        display_name: 'GA L2 to DRAM',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    global_bytes_per_instruction: {
        name: 'global/bytes_per_instruction',
        display_name: 'GMEM Bytes per Instr.',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    global_instructions: {
        name: 'global/instructions',
        display_name: 'Global Instructions',
        hint: 'Total number of global load/store instructions',
        format_function: formatInstructions,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    global_loads_instructions: {
        name: 'global/loads_instructions',
        display_name: 'Global Loads',
        hint: 'Total number of global load instructions',
        format_function: formatInstructions,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    global_loads_l1_cache_hit_perc: {
        name: 'global/loads_l1_cache_hit_perc',
        display_name: 'Global load L1 cache hits',
        hint: '',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    global_loads_l1_to_l2_bytes: {
        name: 'global/loads_l1_to_l2_bytes',
        display_name: 'Global load L1 to L2',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    global_loads_to_l1_bytes: {
        name: 'global/loads_to_l1_bytes',
        display_name: 'Global load to L1',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    global_stores_instructions: {
        name: 'global/stores_instructions',
        display_name: 'Global Stores',
        hint: '',
        format_function: formatInstructions,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    global_stores_l1_cache_hit_perc: {
        name: 'global/stores_l1_cache_hit_perc',
        display_name: 'Global store L1 cache hits',
        hint: '',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    global_stores_l1_to_l2_bytes: {
        name: 'global/stores_l1_to_l2_bytes',
        display_name: 'Global store L1 to L2',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    global_stores_to_l1_bytes: {
        name: 'global/stores_to_l1_bytes',
        display_name: 'Global store to L1',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    local_instructions: {
        name: 'local/instructions',
        display_name: 'LMEM instructions',
        hint: '',
        format_function: formatInstructions,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    local_l2_queries_perc: {
        name: 'local/l2_queries_perc',
        display_name: 'L2 Queries due to LMEM',
        hint: '',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    local_loads_instructions: {
        name: 'local/loads_instructions',
        display_name: 'Local Loads',
        hint: '',
        format_function: formatInstructions,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    local_loads_l1_cache_hit_perc: {
        name: 'local/loads_l1_cache_hit_perc',
        display_name: 'Local load L1 cache hits',
        hint: '',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    local_loads_l1_to_l2_bytes: {
        name: 'local/loads_l1_to_l2_bytes',
        display_name: 'Local load L1 to L2',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    local_loads_to_l1_bytes: {
        name: 'local/loads_to_l1_bytes',
        display_name: 'Local load to L1',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    local_stores_instructions: {
        name: 'local/stores_instructions',
        display_name: 'Local Stores',
        hint: '',
        format_function: formatInstructions,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    local_stores_l1_cache_hit_perc: {
        name: 'local/stores_l1_cache_hit_perc',
        display_name: 'Local store L1 cache hits',
        hint: '',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    local_stores_l1_to_l2_bytes: {
        name: 'local/stores_l1_to_l2_bytes',
        display_name: 'Local store L1 to L2',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    local_stores_to_l1_bytes: {
        name: 'local/stores_to_l1_bytes',
        display_name: 'Local store to L1',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    shared_instructions: {
        name: 'shared/instructions',
        display_name: 'Shared instructions',
        hint: '',
        format_function: formatInstructions,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    shared_ldgsts_instructions: {
        name: 'shared/ldgsts_instructions',
        display_name: 'shared ldgsts_instructions',
        hint: '',
        format_function: formatInstructions,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    shared_loads_bank_conflict: {
        name: 'shared/loads_bank_conflict',
        display_name: 'Bank conflict',
        hint: 'If a bank conflict is present',
        format_function: formatInstructions,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    shared_loads_efficiency_perc: {
        name: 'shared/loads_efficiency_perc',
        display_name: 'Shared Loads efficiency',
        hint: 'Hint please',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    shared_loads_instructions: {
        name: 'shared/loads_instructions',
        display_name: 'Shared Loads',
        hint: 'Number of shared load instructions',
        format_function: formatInstructions,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    shared_stores_instructions: {
        name: 'shared/stores_instructions',
        display_name: 'shared stores_instructions',
        hint: '',
        format_function: formatInstructions,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    surface_instructions: {
        name: 'surface/instructions',
        display_name: 'surface instructions',
        hint: '',
        format_function: formatInstructions,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    surface_loads_instructions: {
        name: 'surface/loads_instructions',
        display_name: 'surface loads_instructions',
        hint: '',
        format_function: formatInstructions,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    surface_loads_l1_cache_hit_perc: {
        name: 'surface/loads_l1_cache_hit_perc',
        display_name: 'surface loads_l1_cache_hit_perc',
        hint: '',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    surface_loads_l1_to_l2_bytes: {
        name: 'surface/loads_l1_to_l2_bytes',
        display_name: 'surface loads_l1_to_l2_bytes',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    surface_loads_to_l1_bytes: {
        name: 'surface/loads_to_l1_bytes',
        display_name: 'surface loads_to_l1_bytes',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    surface_stores_instructions: {
        name: 'surface/stores_instructions',
        display_name: 'surface stores_instructions',
        hint: '',
        format_function: formatInstructions,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    surface_stores_l1_cache_hit_perc: {
        name: 'surface/stores_l1_cache_hit_perc',
        display_name: 'surface stores_l1_cache_hit_perc',
        hint: '',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    surface_stores_l1_to_l2_bytes: {
        name: 'surface/stores_l1_to_l2_bytes',
        display_name: 'surface stores_l1_to_l2_bytes',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    surface_stores_to_l1_bytes: {
        name: 'surface/stores_to_l1_bytes',
        display_name: 'surface stores_to_l1_bytes',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    texture_instructions: {
        name: 'texture/instructions',
        display_name: 'Texture instructions',
        hint: '',
        format_function: formatInstructions,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    texture_loads_l1_cache_hit_perc: {
        name: 'texture/loads_l1_cache_hit_perc',
        display_name: 'Texture L1 cache hits',
        hint: '',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    texture_loads_l1_to_l2_bytes: {
        name: 'texture/loads_l1_to_l2_bytes',
        display_name: 'Texture L1 to L2',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    texture_loads_l2_to_dram_bytes: {
        name: 'texture/loads_l2_to_dram_bytes',
        display_name: 'Texture L2 to DRAM',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    texture_loads_to_l1_bytes: {
        name: 'texture/loads_to_l1_bytes',
        display_name: 'Texture to L1',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    }
};
