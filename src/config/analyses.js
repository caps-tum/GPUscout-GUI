import {
    DatatypeConversionOccurrence,
    GlobalAtomicsOccurrence,
    RegisterSpillingOccurrence,
    UseRestrictOccurrence,
    UseSharedOccurrence,
    UseTextureOccurrence,
    VectorizationOccurrence,
    WarpDivergenceOccurrence
} from './analysisOccurrences';

/**
 * Main definition for all available analyses
 * If an analysis is not mentioned in here, it will not be recognized!
 * Object keys:
 * - name: (required) The name of the key of the analysis in the JSON file from GPUscout
 * - display_name: (optional) The display name of the analysis in the user interface
 * - use_sass: (required) If the analysis uses sass code (rather than PTX)
 * - display_live_registers: (required) If live register information should be displayed (only on SASS code)
 * - occurrence_constructor: (optional) A constructor for a subclass of occurrence, which parses the data of each occurrence in the json. If omitted, the default constructor will be used (renderer/src/utils/Analysis.js)
 * - metrics: (optional) Maps the json names of all provided metrics to easier to remember internal names
 * - topology_metrics: (optional) Same as metrics but for metrics that come from the optional topology file
 */
export const ANALYSIS = {
    datatype_conversion: {
        name: 'datatype_conversion',
        display_name: 'Datatype Conversion',
        use_sass: true,
        display_live_registers: false,
        occurrence_constructor: (o) => new DatatypeConversionOccurrence(o),
        metrics: {
            warp_stalls_tex_throttle_percent: 'smsp__warp_issue_stalled_tex_throttle_per_warp_active',
            warp_stalls_mio_throttle_percent: 'smsp__warp_issue_stalled_mio_throttle_per_warp_active',
            warp_stalls_short_scoreboard_percent: 'smsp__warp_issue_stalled_short_scoreboard_per_warp_active',
            warps_active: 'smsp__warps_active'
        }
    },
    deadlock_detection: {
        name: 'deadlock_detection',
        display_name: 'Deadlock Detection',
        use_sass: true,
        display_live_registers: false,
        metrics: {}
    },
    global_atomics: {
        name: 'global_atomics',
        display_name: 'Global Atomics',
        use_sass: false,
        display_live_registers: false,
        occurrence_constructor: (o) => new GlobalAtomicsOccurrence(o),
        metrics: {
            warp_stalls_lg_throttle_percent: 'smsp__warp_issue_stalled_lg_throttle_per_warp_active',
            warp_stalls_mio_throttle_percent: 'smsp__warp_issue_stalled_mio_throttle_per_warp_active',
            warp_stalls_long_scoreboard_percent: 'smsp__warp_issue_stalled_long_scoreboard_per_warp_active',
            warps_active: 'smsp__warps_active',
            atom_global_count: 'atom_global_count',
            atom_shared_count: 'atom_shared_count',
            kernel_to_shared_memory_bytes: 'atomic_data_memory_flow/kernel_to_shared_bytes',
            global_memory_to_l1_red_atom_bytes: 'atomic_data_memory_flow/global_to_l1_red_atom_bytes',
            global_memory_to_l1_cache_miss_percent: 'atomic_data_memory_flow/global_to_l1_cache_miss_perc',
            l1_to_l2_bytes: 'atomic_data_memory_flow/l1_to_l2_bytes',
            l1_to_l2_cache_miss_percent: 'atomic_data_memory_flow/l1_to_l2_cache_miss_perc',
            l2_to_dram_bytes: 'atomic_data_memory_flow/l2_to_dram_bytes'
        }
    },
    register_spilling: {
        name: 'register_spilling',
        display_name: 'Register Spilling',
        use_sass: true,
        display_live_registers: true,
        occurrence_constructor: (o) => new RegisterSpillingOccurrence(o),
        metrics: {
            warp_stalls_lg_throttle_percent: 'smsp__warp_issue_stalled_lg_throttle_per_warp_active',
            warp_stalls_long_scoreboard_percent: 'smsp__warp_issue_stalled_long_scoreboard_per_warp_active',
            instructions_executed_local_loads: 'smsp__inst_executed_op_local_ld',
            instructions_executed_local_stores: 'smsp__inst_executed_op_local_st',
            instructions_executed: 'smsp__sass_inst_executed',
            occupancy: 'sm__warps_active',
            warps_active: 'smsp__warps_active',
            total_l2_queries: 'l2_queries/total_l2_queries',
            l2_queries_due_to_local_memory_percent: 'l2_queries/l2_queries_due_to_mem_perc',
            global_loads_count: 'load_data_memory_flow/num_loads',
            local_loads_count: 'sm__sass_inst_executed_op_local_ld',
            kernel_to_shared_memory_bytes: 'load_data_memory_flow/kernel_to_shared_bytes',
            local_memory_to_l1_bytes: 'load_data_memory_flow/local_to_l1_bytes',
            global_memory_to_l1_bytes: 'load_data_memory_flow/global_to_l1_bytes',
            local_memory_to_l1_cache_miss_percent: 'load_data_memory_flow/local_to_l1_cache_miss_perc',
            global_memory_to_l1_cache_miss_percent: 'load_data_memory_flow/global_to_l1_cache_miss_perc',
            local_memory_l1_to_l2_bytes: 'load_data_memory_flow/local_l1_to_l2_bytes',
            global_memory_l1_to_l2_bytes: 'load_data_memory_flow/global_l1_to_l2_bytes',
            l1_to_l2_cache_miss_percent: 'load_data_memory_flow/l1_to_l2_cache_miss_perc',
            l2_to_dram_bytes: 'load_data_memory_flow/l2_to_dram_bytes'
        },
        topology_metrics: {
            l1_cache_size: 'l1_data_cache/size'
        }
    },
    use_restrict: {
        name: 'use_restrict',
        display_name: 'Use Restrict',
        use_sass: true,
        display_live_registers: true,
        occurrence_constructor: (o) => new UseRestrictOccurrence(o),
        metrics: {
            warp_stalls_imc_miss_percent: 'smsp__warp_issue_stalled_imc_miss_per_warp_active',
            warp_stalls_long_scoreboard_percent: 'smsp__warp_issue_stalled_long_scoreboard_per_warp_active',
            warps_active: 'smsp__warps_active',
            occupancy_percent: 'sm__warps_active',
            instructions_executed_global_operations: 'smsp__sass_inst_executed_op_global'
        }
    },
    use_shared: {
        name: 'use_shared',
        display_name: 'Use Shared',
        use_sass: true,
        display_live_registers: false,
        occurrence_constructor: (o) => new UseSharedOccurrence(o),
        metrics: {
            warp_stalls_mio_throttle_percent: 'smsp__warp_issue_stalled_mio_throttle_per_warp_active',
            warp_stalls_long_scoreboard_percent: 'smsp__warp_issue_stalled_long_scoreboard_per_warp_active',
            shared_memory_load_count: 'shared_data_memory_flow/shared_mem_load_operations',
            shared_memory_load_efficiency_percent: 'shared_memory_bank_conflict/shared_mem_load_efficiency_perc',
            bank_conflict: 'shared_memory_bank_conflict/bank_conflict',
            warps_active: 'smsp__warps_active'
        }
    },
    use_texture: {
        name: 'use_texture',
        display_name: 'Use Texture',
        use_sass: true,
        display_live_registers: false,
        occurrence_constructor: (o) => new UseTextureOccurrence(o),
        metrics: {
            warp_stalls_tex_throttle_percent: 'smsp__warp_issue_stalled_tex_throttle_per_warp_active',
            warp_stalls_long_scoreboard_percent: 'smsp__warp_issue_stalled_long_scoreboard_per_warp_active',
            warps_active: 'smsp__warps_active',
            texture_memory_used: 'texture_memory_used',
            kernel_to_texture_memory_instruction_count: 'texture_data_memory_flow/kernel_to_tex_instr',
            texture_memory_to_l1_bytes: 'texture_data_memory_flow/tex_to_l1_bytes',
            texture_memory_to_l1_cache_miss_percent: 'texture_data_memory_flow/tex_to_l1_cache_miss_perc',
            l1_to_l2_cache_miss_percent: 'texture_data_memory_flow/l1_to_l2_cache_miss_perc',
            l1_to_l2_bytes: 'texture_data_memory_flow/l1_to_l2_bytes',
            l2_to_dram_bytes: 'texture_data_memory_flow/l2_to_dram_bytes'
        }
    },
    vectorization: {
        name: 'vectorization',
        display_name: 'Vectorization',
        use_sass: true,
        display_live_registers: false,
        occurrence_constructor: (o) => new VectorizationOccurrence(o),
        metrics: {
            warp_stalls_long_scoreboard_percent: 'smsp__warp_issue_stalled_long_scoreboard_per_warp_active',
            occupancy: 'sm__warps_active',
            warps_active: 'smsp__warps_active',
            instructions_executed_global_loads: 'sm__sass_inst_executed_op_global_ld',
            instructions_executed: 'smsp__sass_inst_executed',
            global_data_per_instruction_bytes: 'global_data_per_instruction',
            non_vectorized_loads: 'global_load_count'
        }
    },
    warp_divergence: {
        name: 'warp_divergence',
        display_name: 'Warp Divergence',
        use_sass: true,
        display_live_registers: false,
        occurrence_constructor: (o) => new WarpDivergenceOccurrence(o),
        metrics: {
            branch_divergence_percent: 'branch_divergence_perc'
        }
    }
};
