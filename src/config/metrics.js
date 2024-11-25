import { formatBytes, formatInstructions, formatNumber, formatPercent } from '../renderer/src/utils/formatters';
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
        name: 'smsp__warps_active',
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
        name: 'smsp__warp_issue_stalled_tex_throttle_per_warp_active',
        display_name: 'Tex Throttle Stalls',
        hint: 'Warp stalled due to full TEX pipeline',
        format_function: formatPercent,
        help_text: STALLS.smsp__pcsamp_warps_issue_stalled_tex_throttle.help_text,
        lower_better: true
    },
    stalls_mio_throttle_perc: {
        name: 'smsp__warp_issue_stalled_mio_throttle_per_warp_active',
        display_name: 'MIO Throttle Stalls',
        hint: 'Warp stalled due to full memory I/O pipeline',
        format_function: formatPercent,
        help_text: STALLS.smsp__pcsamp_warps_issue_stalled_mio_throttle.help_text,
        lower_better: true
    },
    stalls_short_scoreboard_perc: {
        name: 'smsp__warp_issue_stalled_short_scoreboard_per_warp_active',
        display_name: 'Short Scoreboard Stalls',
        hint: 'Warp stalled due short scoreboard dependency',
        format_function: formatPercent,
        help_text: STALLS.smsp__pcsamp_warps_issue_stalled_short_scoreboard.help_text,
        lower_better: true
    },
    stalls_long_scoreboard_perc: {
        name: 'smsp__warp_issue_stalled_long_scoreboard_per_warp_active',
        display_name: 'Long Scoreboard Stalls',
        hint: 'Warp stalled due long scoreboard dependency',
        format_function: formatPercent,
        help_text: STALLS.smsp__pcsamp_warps_issue_stalled_long_scoreboard.help_text,
        lower_better: true
    },
    stalls_lg_throttle_perc: {
        name: 'smsp__warp_issue_stalled_lg_throttle_per_warp_active',
        display_name: 'LG Throttle Stalls',
        hint: 'Warp stalled due full L1 instruction queue for global memory operations',
        format_function: formatPercent,
        help_text: STALLS.smsp__pcsamp_warps_issue_stalled_lg_throttle.help_text,
        lower_better: true
    },
    stalls_imc_miss_perc: {
        name: 'smsp__warp_issue_stalled_imc_miss_per_warp_active',
        display_name: 'IMC Miss Stalls',
        hint: 'Warp stalled waiting for immediate constant cache miss',
        format_function: formatPercent,
        help_text: STALLS.smsp__pcsamp_warps_issue_stalled_imc_miss.help_text,
        lower_better: true
    },
    global_atomics_count: {
        name: 'atom_global_count',
        display_name: 'Global atomics',
        hint: 'The total number of global atomics used',
        format_function: formatNumber,
        help_text: 'This is a detailed explanation of global atomics',
        lower_better: true
    },
    shared_atomics_count: {
        name: 'atom_shared_count',
        display_name: 'Shared atomics',
        hint: 'The total number of shared atomics used',
        format_function: formatNumber,
        help_text: 'This is a detailed explanation of shared atomics',
        lower_better: true
    },
    occupancy: {
        name: 'sm__warps_active',
        display_name: 'Occupancy',
        hint: 'Occupancy achieved',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation of occupancy',
        lower_better: false
    },
    instructions_total: {
        name: 'smsp__sass_inst_executed',
        display_name: 'Instructions executed',
        hint: 'Total number of instructions executed',
        format_function: formatInstructions,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    instructions_global: {
        name: 'smsp__sass_inst_executed_op_global',
        display_name: 'Global Memory Instructions',
        hint: 'Number of instructions due to global memory accesses',
        format_function: formatNumber,
        help_text: 'This is a detailed explanation of global memory',
        lower_better: true
    },
    global_data_per_instruction: {
        name: 'global_data_per_instruction',
        display_name: 'GMEM Data / Inst.',
        hint: 'Data processed by global memory per instruction',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation of global memory',
        lower_better: true
    },
    instructions_global_loads: {
        name: 'sm__sass_inst_executed_op_global_ld',
        display_name: 'Global load instructions',
        hint: 'Total number of global load instructions',
        format_function: formatInstructions,
        help_text: 'This is a detailed explanation of global loads',
        lower_better: true
    },
    instructions_local_loads: {
        name: 'smsp__inst_executed_op_local_ld',
        display_name: 'Local loads count',
        hint: 'Number of local loads',
        format_function: formatInstructions,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    instructions_local_stores: {
        name: 'smsp__inst_executed_op_local_st',
        display_name: 'Local stores count',
        hint: 'Number of local stores',
        format_function: formatInstructions,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    instructions_global_loads_non_vectorized: {
        name: 'global_load_count',
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
        format_function: formatPercent,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    queries_l2: {
        name: 'l2_queries/total_l2_queries',
        display_name: 'L2 queries',
        hint: 'Number of queries to the L2 cache',
        format_function: formatNumber,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    queries_l2_due_to_local: {
        name: 'l2_queries/l2_queries_due_to_mem_perc',
        display_name: 'L2 queries due to LMEM',
        hint: 'Number of queries to the L2 cache due to local memory',
        format_function: formatNumber,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    load_data_kernel_to_shared_bytes: {
        name: 'load_data_memory_flow/kernel_to_shared_bytes',
        display_name: 'Kernel to Shared Mem',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    load_data_local_to_l1_bytes: {
        name: 'load_data_memory_flow/local_to_l1_byte',
        display_name: 'LMEM to L1',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    load_data_global_to_l1_bytes: {
        name: 'load_data_memory_flow/global_to_l1_bytes',
        display_name: 'GMEM to L1',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    load_data_local_to_l1_cache_hit_perc: {
        name: 'load_data_memory_flow/local_to_l1_cache_hit_perc',
        display_name: 'LMEM L1 Cache hit rate',
        hint: 'Percentage of L1 cache hits due to local memory',
        format_function: formatPercent,
        help_text: 'Something',
        lower_better: false
    },
    load_data_global_to_l1_cache_hit_perc: {
        name: 'load_data_memory_flow/global_to_l1_cache_hit_perc',
        display_name: 'GMEM L1 Cache hit rate',
        hint: '',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation something',
        lower_better: false
    },
    load_data_local_l1_to_l2_bytes: {
        name: 'load_data_memory_flow/local_l1_to_l2_bytes',
        display_name: 'LMEM L1 to L2',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    load_data_global_l1_to_l2_bytes: {
        name: 'load_data_memory_flow/global_l1_to_l2_bytes',
        display_name: 'GMEM L1 to L2',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    load_data_l1_to_l2_cache_hit_perc: {
        name: 'load_data_memory_flow/l1_to_l2_cache_hits_perc',
        display_name: 'L1 to L2 Cache hit rate',
        hint: '',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation something',
        lower_better: false
    },
    load_data_l2_to_dram_bytes: {
        name: 'load_data_memory_flow/l2_to_dram_bytes',
        display_name: 'L2 to DRAM',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    instructions_shared_loads: {
        name: 'shared_data_memory_flow/shared_mem_load_operations',
        display_name: 'Load operations',
        hint: 'Number of load instructions to shared memory',
        format_function: formatNumber,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    shared_load_efficiency_perc: {
        name: 'shared_memory_bank_conflict/shared_mem_load_efficiency_perc',
        display_name: 'Load efficiency',
        hint: 'Shared memory load efficiency',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation something',
        lower_better: false
    },
    shared_bank_conflict: {
        name: 'shared_memory_bank_conflict/bank_conflict',
        display_name: 'Bank conflicts',
        hint: 'Memory transactions per load access',
        format_function: formatNumber,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    texture_data_kernel_to_tex_instr: {
        name: 'texture_data_memory_flow/kernel_to_tex_instr',
        display_name: 'Kernel to Tex',
        hint: '',
        format_function: formatInstructions,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    texture_data_tex_to_l1_bytes: {
        name: 'texture_data_memory_flow/tex_to_l1_bytes',
        display_name: 'Tex to L1',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    texture_data_tex_to_l1_cache_hit_perc: {
        name: 'texture_data_memory_flow/tex_to_l1_cache_hit_perc',
        display_name: 'Tex to L1 cache hit rate',
        hint: '',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation something',
        lower_better: false
    },
    texture_data_l1_to_l2_cache_hit_perc: {
        name: 'texture_data_memory_flow/l1_to_l2_cache_hit_perc',
        display_name: 'L1 to L2 cache hit rate',
        hint: '',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation something',
        lower_better: false
    },
    texture_data_l1_to_l2_bytes: {
        name: 'texture_data_memory_flow/l1_to_l2_bytes',
        display_name: 'L1 to L2',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    texture_data_l2_to_dram_bytes: {
        name: 'texture_data_memory_flow/l2_to_dram_bytes',
        display_name: 'L2 to DRAM',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    atomic_data_kernel_to_shared_bytes: {
        name: 'atomic_data_memory_flow/kernel_to_shared_bytes',
        display_name: 'Kernel to Shared Mem',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    atomic_data_global_to_l1_red_atom_bytes: {
        name: 'atomic_data_memory_flow/global_to_l1_red_atom_bytes',
        display_name: 'Global to L1',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    atomic_data_global_to_l1_cache_hit_perc: {
        name: 'atomic_data_memory_flow/global_to_l1_cache_hit_perc',
        display_name: 'Global to L1 Cache hit rate',
        hint: '',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation something',
        lower_better: false
    },
    atomic_data_l1_to_l2_bytes: {
        name: 'atomic_data_memory_flow/l1_to_l2_bytes',
        display_name: 'L1 to L2',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    },
    atomic_data_l1_to_l2_cache_hit_perc: {
        name: 'atomic_data_memory_flow/l1_to_l2_cache_hit_perc',
        display_name: 'L1 to L2 Cache hit rate',
        hint: '',
        format_function: formatPercent,
        help_text: 'This is a detailed explanation something',
        lower_better: false
    },
    atomic_data_l2_to_dram_bytes: {
        name: 'atomic_data_memory_flow/l2_to_dram_bytes',
        display_name: 'L2 to DRAM',
        hint: '',
        format_function: formatBytes,
        help_text: 'This is a detailed explanation something',
        lower_better: true
    }
};
