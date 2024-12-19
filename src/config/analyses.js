/**
 * @module
 * @author Tobias Stuckenberger
 * @description This module contains the definitions for all available analyses that should be expected from a GPUscout result.
 * In order for an analysis to be displayed in the UI, it needs to be present in both the GPUscout result and this module.
 */
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
import { Occurrence } from '../renderer/src/utils/Analysis';
import { MemoryGraph } from '../renderer/src/utils/MemoryGraphComponents';

/**
 * An enum of available metric section types
 * @type {Object.<String, String>}
 */
export const METRIC_SECTION_TYPE = {
    GRAPH: 'Graph',
    LIST: 'List'
};

/**
 * @typedef {Object} AnalysisDefinition Contains the definition of a single analysis
 * @property {String} name The name of the key of the analysis in the GPUscout result JSON file
 * @property {String} [display_name] The display name of the analysis in the interface
 * @property {Boolean} use_sass If the analysis uses SASS code (rather than PTX)
 * @property {Boolean} display_live_registers If live register information should be displayed (only on SASS code)
 * @property {Occurrence} [occurrence_constructor] A constructor for a subclass of occurrence, which parses the data of each occurrence in the json. If omitted, the default constructor will be used ({@link renderer/src/utils/Analysis.js})
 * @property {Array.<(AnalysisMetricSectionDefinition|AnalysisMetricGraphDefinition)>} [metrics] The definition of the metrics for this analysis, with each list item being either a graph of a metric section
 */

/**
 * @typedef {Object} AnalysisMetricGraphDefinition Defines a memory graph for the metrics of an analysis
 * @property {String} type The type of component in which the metrics are displayed. Is an option of {@link METRIC_SECTION_TYPE}
 * @property {String} title The title of the graph
 * @property {MemoryGraph} The memory graph definition
 */

/**
 * @typedef {Object} AnalysisMetricSectionDefinition Defines a metrics section for the metrics of an analysis
 * @property {String} type The type of component in which the metrics are displayed. Is an option of {@link METRIC_SECTION_TYPE}
 * @property {String} title The title of the metric section
 * @property {String} [hint] A secondary hint to display under the title
 * @property {AnalysisMetricDefinition[]} metrics The metrics to display in this section
 */

/**
 * @typedef {Object} AnalysisMetricDefinition Defines a metric for a metrics section
 * @property {String} name If the desired metric is defined in {@link ./metrics.js}, this should correspond to the key in the {@link METRICS} Object, if not, this defined the displayed name of the metric
 * @property {Number|String} [value] The value of the metric. Only necessary if the metric is not defined in {@link ./metrics.js}
 * @property {Number|String} [secondary_value] A secondary value of the metric. Should be absolute if value is relative and vice versa
 */

/**
 * Main definition for all available analyses
 * @type {AnalysisDefinition}
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
                        secondary_value: (analysis) =>
                            Math.round(
                                (analysis.getMetric(METRICS.stalls_total.name) *
                                    analysis.getMetric(METRICS.stalls_short_scoreboard_perc.name)) /
                                    100
                            )
                    },
                    {
                        name: METRICS.stalls_mio_throttle_perc.name,
                        secondary_value: (analysis) =>
                            Math.round(
                                (analysis.getMetric(METRICS.stalls_total.name) *
                                    analysis.getMetric(METRICS.stalls_mio_throttle_perc.name)) /
                                    100
                            )
                    },
                    {
                        name: METRICS.stalls_tex_throttle_perc.name,
                        secondary_value: (analysis) =>
                            Math.round(
                                (analysis.getMetric(METRICS.stalls_total.name) *
                                    analysis.getMetric(METRICS.stalls_tex_throttle_perc.name)) /
                                    100
                            )
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
                        secondary_value: (analysis) =>
                            Math.round(
                                (analysis.getMetric(METRICS.stalls_total.name) *
                                    analysis.getMetric(METRICS.stalls_mio_throttle_perc.name)) /
                                    100
                            )
                    },
                    {
                        name: METRICS.stalls_long_scoreboard_perc.name,
                        secondary_value: (analysis) =>
                            Math.round(
                                (analysis.getMetric(METRICS.stalls_total.name) *
                                    analysis.getMetric(METRICS.stalls_long_scoreboard_perc.name)) /
                                    100
                            )
                    },
                    {
                        name: METRICS.stalls_lg_throttle_perc.name,
                        secondary_value: (analysis) =>
                            Math.round(
                                (analysis.getMetric(METRICS.stalls_total.name) *
                                    analysis.getMetric(METRICS.stalls_lg_throttle_perc.name)) /
                                    100
                            )
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
                        secondary_value: (analysis) => analysis.getMetric(METRICS.local_l2_queries_perc.name)
                    },
                    {
                        name: TEXT.analyses.register_spilling.top_section.lmem_impact.type.instruction,
                        value: (analysis) => analysis.getMetric(METRICS.local_instructions.name),
                        secondary_value: (analysis) =>
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
                        secondary_value: (analysis) =>
                            Math.round(
                                (analysis.getMetric(METRICS.stalls_total.name) *
                                    analysis.getMetric(METRICS.stalls_long_scoreboard_perc.name)) /
                                    100
                            )
                    },
                    {
                        name: METRICS.stalls_lg_throttle_perc.name,
                        secondary_value: (analysis) =>
                            Math.round(
                                (analysis.getMetric(METRICS.stalls_total.name) *
                                    analysis.getMetric(METRICS.stalls_lg_throttle_perc.name)) /
                                    100
                            )
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
                        secondary_value: (analysis) => analysis.getMetric(METRICS.stalls_total.name)
                    },
                    {
                        name: METRICS.stalls_imc_miss_perc.name,
                        secondary_value: (analysis) => analysis.getMetric(METRICS.stalls_total.name)
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
                        secondary_value: (analysis) =>
                            Math.round(
                                (analysis.getMetric(METRICS.stalls_total.name) *
                                    analysis.getMetric(METRICS.stalls_long_scoreboard_perc.name)) /
                                    100
                            )
                    },
                    {
                        name: METRICS.stalls_mio_throttle_perc.name,
                        secondary_value: (analysis) =>
                            Math.round(
                                (analysis.getMetric(METRICS.stalls_total.name) *
                                    analysis.getMetric(METRICS.stalls_mio_throttle_perc.name)) /
                                    100
                            )
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
                        secondary_value: (analysis) =>
                            Math.round(
                                (analysis.getMetric(METRICS.stalls_total.name) *
                                    analysis.getMetric(METRICS.stalls_long_scoreboard_perc.name)) /
                                    100
                            )
                    },
                    {
                        name: METRICS.stalls_tex_throttle_perc.name,
                        secondary_value: (analysis) =>
                            Math.round(
                                (analysis.getMetric(METRICS.stalls_total.name) *
                                    analysis.getMetric(METRICS.stalls_tex_throttle_perc.name)) /
                                    100
                            )
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
                        secondary_value: (analysis) =>
                            Math.round(
                                (analysis.getMetric(METRICS.stalls_total.name) *
                                    analysis.getMetric(METRICS.stalls_long_scoreboard_perc.name)) /
                                    100
                            )
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
