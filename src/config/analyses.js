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

export const ANALYSIS = {
    datatype_conversion: {
        name: 'datatype_conversion',
        use_sass: true,
        occurrence_constructor: (o) => new DatatypeConversionOccurrence(o),
        metrics: {
            warp_stalls_tex_throttle_percent: 'smsp__warp_issue_stalled_tex_throttle_per_warp_active',
            warp_stalls_mio_throttle_percent: 'smsp__warp_issue_stalled_mio_throttle_per_warp_active',
            warp_stalls_short_scoreboard_percent: 'smsp__warp_issue_stalled_short_scoreboard_per_warp_active'
        }
    },
    deadlock_detection: {
        name: 'deadlock_detection',
        use_sass: true,
        metrics: {}
    },
    global_atomics: {
        name: 'global_atomics',
        use_sass: false,
        occurrence_constructor: (o) => new GlobalAtomicsOccurrence(o),
        metrics: {
            warp_stalls_lg_throttle_percent: 'smsp__warp_issue_stalled_lg_throttle_per_warp_active',
            warp_stalls_mio_throttle_percent: 'smsp__warp_issue_stalled_mio_throttle_per_warp_active',
            warp_stalls_long_scoreboard_percent: 'smsp__warp_issue_stalled_long_scoreboard_per_warp_active',
            kernel_to_shared_memory_bytes: 'memory_flow/kernel_to_shared_bytes',
            global_memory_to_l1_red_atom_bytes: 'memory_flow/global_to_l1_red_atom_bytes',
            l2_to_dram_bytes: 'memory_flow/l2_to_dram_bytes',
            l1_to_l2_bytes: 'memory_flow/l1_to_l2_bytes',
            l1_to_l2_cache_miss_percent: 'memory_flow/l1_to_l2_cache_miss_perc',
            global_memory_to_l1_cache_miss_percent: 'memory_flow/global_to_l1_cache_miss_perc'
        }
    },
    register_spilling: {
        name: 'register_spilling',
        use_sass: true,
        occurrence_constructor: (o) => new RegisterSpillingOccurrence(o),
        metrics: {
            warp_stalls_lg_throttle_percent: 'smsp__warp_issue_stalled_lg_throttle_per_warp_active',
            warp_stalls_long_scoreboard_percent: 'smsp__warp_issue_stalled_long_scoreboard_per_warp_active',
            kernel_to_shared_memory_bytes: 'memory_flow/kernel_to_shared_bytes',
            l2_queries_due_to_local_memory_percent: 'l2_queries_due_to_mem_perc',
            global_loads_count: 'memory_flow/num_loads',
            global_memory_to_l1_bytes: 'memory_flow/global_to_l1_bytes',
            global_memory_to_l1_cache_miss_percent: 'memory_flow/global_to_l1_cache_miss_perc',
            global_memory_l1_to_l2_bytes: 'memory_flow/global_l1_to_l2_bytes',
            local_memory_to_l1_bytes: 'memory_flow/local_to_l1_bytes',
            local_memory_to_l1_cache_miss_percent: 'memory_flow/local_to_l1_cache_miss_perc',
            local_memory_l1_to_l2_bytes: 'memory_flow/local_l1_to_l2_bytes',
            l1_to_l2_cache_miss_percent: 'memory_flow/l1_to_l2_cache_miss_perc',
            l2_to_dram_bytes: 'memory_flow/l2_to_dram_bytes'
        }
    },
    use_restrict: {
        name: 'use_restrict',
        use_sass: true,
        occurrence_constructor: (o) => new UseRestrictOccurrence(o),
        metrics: {
            warp_stalls_imc_miss_percent: 'smsp__warp_issue_stalled_imc_miss_per_warp_active'
        }
    },
    use_shared: {
        name: 'use_shared',
        use_sass: true,
        occurrence_constructor: (o) => new UseSharedOccurrence(o),
        metrics: {
            warp_stalls_mio_throttle_percent: 'smsp__warp_issue_stalled_mio_throttle_per_warp_active',
            warp_stalls_long_scoreboard_percent: 'smsp__warp_issue_stalled_long_scoreboard_per_warp_active',
            shared_memory_load_count: 'data_memory_flow/shared_mem_load_operations',
            shared_memory_load_efficiency_percent: 'bank_conflict/shared_mem_load_efficiency_perc',
            bank_conflict: 'bank_conflict/bank_conflict'
        }
    },
    use_texture: {
        name: 'use_texture',
        use_sass: true,
        occurrence_constructor: (o) => new UseTextureOccurrence(o),
        metrics: {
            warp_stalls_tex_throttle_percent: 'smsp__warp_issue_stalled_tex_throttle_per_warp_active',
            warp_stalls_long_scoreboard_percent: 'smsp__warp_issue_stalled_long_scoreboard_per_warp_active',
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
        use_sass: true,
        occurrence_constructor: (o) => new VectorizationOccurrence(o),
        metrics: {
            warp_stalls_long_scoreboard_percent: 'smsp__warp_issue_stalled_long_scoreboard_per_warp_active'
        }
    },
    warp_divergence: {
        name: 'warp_divergence',
        use_sass: true,
        occurrence_constructor: (o) => new WarpDivergenceOccurrence(o),
        metrics: {
            branch_divergence_percent: 'branch_divergence_perc'
        }
    }
};
