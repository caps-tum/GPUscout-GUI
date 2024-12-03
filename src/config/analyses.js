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
import { MEMORY_GRAPH_DEFINITION } from './memory_graphs';
import { METRICS } from './metrics';
import { TEXT } from './text';

export const METRIC_SECTION_TYPE = {
    GRAPH: 'Graph',
    LIST: 'List'
};

/**
 * Main definition for all available analyses
 * If an analysis is not mentioned in here, it will not be recognized!
 * Object keys:
 * - name: (required) The name of the key of the analysis in the JSON file from GPUscout
 * - display_name: (optional) The display name of the analysis in the user interface
 * - use_sass: (required) If the analysis uses sass code (rather than PTX)
 * - display_live_registers: (required) If live register information should be displayed (only on SASS code)
 * - occurrence_constructor: (optional) A constructor for a subclass of occurrence, which parses the data of each occurrence in the json. If omitted, the default constructor will be used (renderer/src/utils/Analysis.js)
 */
export const ANALYSIS = {
    datatype_conversion: {
        name: 'datatype_conversion',
        display_name: 'Datatype Conversion',
        use_sass: true,
        display_live_registers: false,
        occurrence_constructor: (o) => new DatatypeConversionOccurrence(o),
        metrics: [
            {
                type: METRIC_SECTION_TYPE.GRAPH,
                title: TEXT.analyses.datatype_conversion.top_section.memory_graph.title,
                graph: MEMORY_GRAPH_DEFINITION.global_caches
            },
            {
                type: METRIC_SECTION_TYPE.LIST,
                title: TEXT.analyses.general.metrics.title,
                hint: TEXT.analyses.general.metrics.hint,
                metrics: [
                    {
                        name: TEXT.analyses.datatype_conversion.top_section.conversion_numbers.type.total,
                        value: (analysis) => analysis.getOccurrences().length
                    },
                    {
                        name: TEXT.analyses.datatype_conversion.top_section.conversion_numbers.type.f2f,
                        value: (analysis) => analysis.getOccurrences().filter((o) => o.type === 'F2F').length
                    },
                    {
                        name: TEXT.analyses.datatype_conversion.top_section.conversion_numbers.type.f2i,
                        value: (analysis) => analysis.getOccurrences().filter((o) => o.type === 'F2I').length
                    },
                    {
                        name: TEXT.analyses.datatype_conversion.top_section.conversion_numbers.type.i2f,
                        value: (analysis) => analysis.getOccurrences().filter((o) => o.type === 'I2F').length
                    }
                ]
            },
            {
                type: METRIC_SECTION_TYPE.LIST,
                title: TEXT.analyses.general.warp_stall_analysis.title,
                hint: TEXT.analyses.general.warp_stall_analysis.hint,
                metrics: [
                    {
                        name: METRICS.stalls_total.name
                    },
                    {
                        name: METRICS.stalls_short_scoreboard_perc.name,
                        absolute_value: (analysis) => analysis.getMetric(METRICS.stalls_total.name)
                    },
                    {
                        name: METRICS.stalls_mio_throttle_perc.name,
                        absolute_value: (analysis) => analysis.getMetric(METRICS.stalls_total.name)
                    },
                    {
                        name: METRICS.stalls_tex_throttle_perc.name,
                        absolute_value: (analysis) => analysis.getMetric(METRICS.stalls_total.name)
                    }
                ]
            }
        ]
    },
    deadlock_detection: {
        name: 'deadlock_detection',
        display_name: 'Deadlock Detection',
        use_sass: true,
        display_live_registers: false
    },
    global_atomics: {
        name: 'global_atomics',
        display_name: 'Global Atomics',
        use_sass: false,
        display_live_registers: false,
        occurrence_constructor: (o) => new GlobalAtomicsOccurrence(o),
        metrics: [
            {
                type: METRIC_SECTION_TYPE.GRAPH,
                title: TEXT.analyses.global_atomics.top_section.memory_graph.title,
                graph: MEMORY_GRAPH_DEFINITION.atomics
            },
            {
                type: METRIC_SECTION_TYPE.LIST,
                title: TEXT.analyses.global_atomics.top_section.atomics_usage.title,
                hint: TEXT.analyses.global_atomics.top_section.atomics_usage.hint,
                metrics: [
                    {
                        name: METRICS.global_atomics_count.name
                    },
                    {
                        name: METRICS.shared_atomics_count.name
                    }
                ]
            },
            {
                type: METRIC_SECTION_TYPE.LIST,
                title: TEXT.analyses.general.warp_stall_analysis.title,
                hint: TEXT.analyses.general.warp_stall_analysis.hint,
                metrics: [
                    {
                        name: METRICS.stalls_total.name
                    },
                    {
                        name: METRICS.stalls_mio_throttle_perc.name,
                        absolute_value: (analysis) => analysis.getMetric(METRICS.stalls_total.name)
                    },
                    {
                        name: METRICS.stalls_long_scoreboard_perc.name,
                        absolute_value: (analysis) => analysis.getMetric(METRICS.stalls_total.name)
                    },
                    {
                        name: METRICS.stalls_lg_throttle_perc.name,
                        absolute_value: (analysis) => analysis.getMetric(METRICS.stalls_total.name)
                    }
                ]
            }
        ]
    },
    register_spilling: {
        name: 'register_spilling',
        display_name: 'Register Spilling',
        use_sass: true,
        display_live_registers: true,
        occurrence_constructor: (o) => new RegisterSpillingOccurrence(o),
        metrics: [
            {
                type: METRIC_SECTION_TYPE.GRAPH,
                title: TEXT.analyses.register_spilling.top_section.memory_graph.title,
                graph: MEMORY_GRAPH_DEFINITION.global_local_caches
            },
            {
                type: METRIC_SECTION_TYPE.LIST,
                title: TEXT.analyses.general.metrics.title,
                hint: TEXT.analyses.general.metrics.hint,
                metrics: [
                    {
                        name: METRICS.occupancy.name
                    },
                    {
                        name: METRICS.local_loads_l1_cache_hit_perc.name
                    },
                    {
                        name: TEXT.analyses.register_spilling.top_section.lmem_impact.type.bandwidth,
                        value: (analysis) =>
                            Math.round(
                                analysis.getMetric(METRICS.general_l2_queries.name) *
                                    (analysis.getMetric(METRICS.local_l2_queries_perc.name) / 100)
                            ),
                        absolute_value: (analysis) => analysis.getMetric(METRICS.local_l2_queries_perc.name)
                    },
                    {
                        name: TEXT.analyses.register_spilling.top_section.lmem_impact.type.instruction,
                        value: (analysis) => analysis.getMetric(METRICS.local_instructions.name),
                        absolute_value: (analysis) =>
                            (analysis.getMetric(METRICS.local_instructions.name) /
                                analysis.getMetric(METRICS.general_total_instructions.name)) *
                            100
                    }
                ]
            },
            {
                type: METRIC_SECTION_TYPE.LIST,
                title: TEXT.analyses.general.warp_stall_analysis.title,
                hint: TEXT.analyses.general.warp_stall_analysis.hint,
                metrics: [
                    {
                        name: METRICS.stalls_total.name
                    },
                    {
                        name: METRICS.stalls_long_scoreboard_perc.name,
                        absolute_value: (analysis) => analysis.getMetric(METRICS.stalls_total.name)
                    },
                    {
                        name: METRICS.stalls_lg_throttle_perc.name,
                        absolute_value: (analysis) => analysis.getMetric(METRICS.stalls_total.name)
                    }
                ]
            }
        ]
    },
    use_restrict: {
        name: 'use_restrict',
        display_name: 'Use Restrict',
        use_sass: true,
        display_live_registers: true,
        occurrence_constructor: (o) => new UseRestrictOccurrence(o),
        metrics: [
            {
                type: METRIC_SECTION_TYPE.LIST,
                title: TEXT.analyses.general.metrics.title,
                hint: TEXT.analyses.general.metrics.hint,
                metrics: [
                    {
                        name: METRICS.global_instructions.name
                    },
                    {
                        name: METRICS.occupancy.name
                    }
                ]
            },
            {
                type: METRIC_SECTION_TYPE.LIST,
                title: TEXT.analyses.general.warp_stall_analysis.title,
                hint: TEXT.analyses.general.warp_stall_analysis.hint,
                metrics: [
                    {
                        name: METRICS.stalls_total.name
                    },
                    {
                        name: METRICS.stalls_long_scoreboard_perc.name,
                        absolute_value: (analysis) => analysis.getMetric(METRICS.stalls_total.name)
                    },
                    {
                        name: METRICS.stalls_imc_miss_perc.name,
                        absolute_value: (analysis) => analysis.getMetric(METRICS.stalls_total.name)
                    }
                ]
            }
        ]
    },
    use_shared: {
        name: 'use_shared',
        display_name: 'Use Shared',
        use_sass: true,
        display_live_registers: false,
        occurrence_constructor: (o) => new UseSharedOccurrence(o),
        metrics: [
            {
                type: METRIC_SECTION_TYPE.LIST,
                title: TEXT.analyses.use_shared.top_section.shared_usage.title,
                hint: TEXT.analyses.use_shared.top_section.shared_usage.hint,
                metrics: [
                    {
                        name: METRICS.shared_loads_instructions.name
                    },
                    {
                        name: METRICS.shared_loads_efficiency_perc.name
                    },
                    {
                        name: METRICS.shared_loads_bank_conflict.name
                    }
                ]
            },
            {
                type: METRIC_SECTION_TYPE.LIST,
                title: TEXT.analyses.general.warp_stall_analysis.title,
                hint: TEXT.analyses.general.warp_stall_analysis.hint,
                metrics: [
                    {
                        name: METRICS.stalls_total.name
                    },
                    {
                        name: METRICS.stalls_long_scoreboard_perc.name,
                        absolute_value: (analysis) => analysis.getMetric(METRICS.stalls_total.name)
                    },
                    {
                        name: METRICS.stalls_mio_throttle_perc.name,
                        absolute_value: (analysis) => analysis.getMetric(METRICS.stalls_total.name)
                    }
                ]
            }
        ]
    },
    use_texture: {
        name: 'use_texture',
        display_name: 'Use Texture',
        use_sass: true,
        display_live_registers: false,
        occurrence_constructor: (o) => new UseTextureOccurrence(o),
        metrics: [
            {
                type: METRIC_SECTION_TYPE.GRAPH,
                title: TEXT.analyses.use_texture.top_section.memory_graph.title,
                graph: MEMORY_GRAPH_DEFINITION.texture_memory
            },
            {
                type: METRIC_SECTION_TYPE.LIST,
                title: TEXT.analyses.general.warp_stall_analysis.title,
                hint: TEXT.analyses.general.warp_stall_analysis.hint,
                metrics: [
                    {
                        name: METRICS.stalls_total.name
                    },
                    {
                        name: METRICS.stalls_long_scoreboard_perc.name,
                        absolute_value: (analysis) => analysis.getMetric(METRICS.stalls_total.name)
                    },
                    {
                        name: METRICS.stalls_tex_throttle_perc.name,
                        absolute_value: (analysis) => analysis.getMetric(METRICS.stalls_total.name)
                    }
                ]
            }
        ]
    },
    vectorization: {
        name: 'vectorization',
        display_name: 'Vectorization',
        use_sass: true,
        display_live_registers: false,
        occurrence_constructor: (o) => new VectorizationOccurrence(o),
        metrics: [
            {
                type: METRIC_SECTION_TYPE.LIST,
                title: TEXT.analyses.vectorization.top_section.load_analysis.title,
                hint: TEXT.analyses.vectorization.top_section.load_analysis.hint,
                metrics: [
                    {
                        name: METRICS.instructions_global_loads_non_vectorized.name
                    },
                    {
                        name: METRICS.global_loads_instructions.name
                    },
                    {
                        name: METRICS.general_total_instructions.name
                    },
                    {
                        name: METRICS.occupancy.name
                    }
                ]
            },
            {
                type: METRIC_SECTION_TYPE.LIST,
                title: TEXT.analyses.general.warp_stall_analysis.title,
                hint: TEXT.analyses.general.warp_stall_analysis.hint,
                metrics: [
                    {
                        name: METRICS.stalls_total.name
                    },
                    {
                        name: METRICS.stalls_long_scoreboard_perc.name,
                        absolute_value: (analysis) => analysis.getMetric(METRICS.stalls_total.name)
                    }
                ]
            }
        ]
    },
    warp_divergence: {
        name: 'warp_divergence',
        display_name: 'Warp Divergence',
        use_sass: true,
        display_live_registers: false,
        occurrence_constructor: (o) => new WarpDivergenceOccurrence(o)
    }
};
