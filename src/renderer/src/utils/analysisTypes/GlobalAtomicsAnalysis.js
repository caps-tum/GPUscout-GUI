import { Analysis, Occurrence } from '../Analysis';

export const GLOBAL_ATOMICS_METRICS = {
    WARP_STALLS_LG_THROTTLE_PERCENT: 'smsp__warp_issue_stalled_lg_throttle_per_warp_active',
    WARP_STALLS_MIO_THROTTLE_PERCENT: 'smsp__warp_issue_stalled_mio_throttle_per_warp_active',
    WARP_STALLS_LONG_SCOREBOARD_PERCENT: 'smsp__warp_issue_stalled_long_scoreboard_per_warp_active',
    KERNEL_TO_SHARED_MEMORY_BYTES: 'memory_flow/kernel_to_shared_bytes',
    GLOBAL_MEMORY_TO_L1_BYTES: 'memory_flow/global_to_l1_red_atom_bytes',
    L2_TO_DRAM_BYTES: 'memory_flow/l2_to_dram_bytes',
    L1_TO_L2_BYTES: 'memory_flow/l1_to_l2_bytes',
    L1_TO_L2_CACHE_MISS_PERCENT: 'memory_flow/l1_to_l2_cache_miss_perc',
    GLOBAL_MEMORY_TO_L1_CACHE_MISS_PERCENT: 'memory_flow/global_to_l1_cache_miss_perc'
};

export class GlobalAtomicsAnalysis extends Analysis {
    constructor(analysisData, kernel) {
        super(analysisData, kernel, GLOBAL_ATOMICS_METRICS, (occurrenceData) => new GlobalAtomicsOccurrence(occurrenceData));

        /** @type {Number} */
        this.totalGlobalAtomics = analysisData['global_atomics'];
        /** @type {Number} */
        this.totalSharedAtomics = analysisData['shared_atomics'];
    }
}

export class GlobalAtomicsOccurrence extends Occurrence {
    constructor(occurrenceData) {
        super(occurrenceData);

        /** @type {Boolean} */
        this.isInForLoop = occurrenceData['in_for_loop'];
        /** @type {Boolean} */
        this.isGlobalAtomic = occurrenceData['is_global'];
    }
}
