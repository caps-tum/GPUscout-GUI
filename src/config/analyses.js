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
        occurrence_constructor: (o) => new DatatypeConversionOccurrence(o)
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
        occurrence_constructor: (o) => new GlobalAtomicsOccurrence(o)
    },
    register_spilling: {
        name: 'register_spilling',
        display_name: 'Register Spilling',
        use_sass: true,
        display_live_registers: true,
        occurrence_constructor: (o) => new RegisterSpillingOccurrence(o)
    },
    use_restrict: {
        name: 'use_restrict',
        display_name: 'Use Restrict',
        use_sass: true,
        display_live_registers: true,
        occurrence_constructor: (o) => new UseRestrictOccurrence(o)
    },
    use_shared: {
        name: 'use_shared',
        display_name: 'Use Shared',
        use_sass: true,
        display_live_registers: false,
        occurrence_constructor: (o) => new UseSharedOccurrence(o)
    },
    use_texture: {
        name: 'use_texture',
        display_name: 'Use Texture',
        use_sass: true,
        display_live_registers: false,
        occurrence_constructor: (o) => new UseTextureOccurrence(o)
    },
    vectorization: {
        name: 'vectorization',
        display_name: 'Vectorization',
        use_sass: true,
        display_live_registers: false,
        occurrence_constructor: (o) => new VectorizationOccurrence(o)
    },
    warp_divergence: {
        name: 'warp_divergence',
        display_name: 'Warp Divergence',
        use_sass: true,
        display_live_registers: false,
        occurrence_constructor: (o) => new WarpDivergenceOccurrence(o)
    }
};
