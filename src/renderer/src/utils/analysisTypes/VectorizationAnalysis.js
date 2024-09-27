import { Analysis, Occurrence } from '../Analysis';

export const VECTORIZATION_METRICS = {
    WARP_STALLS_LONG_SCOREBOARD_PERCENT: 'smsp__warp_issue_stalled_long_scoreboard_per_warp_active'
};

export class VectorizationAnalysis extends Analysis {
    constructor(analysisData, kernel) {
        super(analysisData, kernel, VECTORIZATION_METRICS, (occurrenceData) => new VectorizationOccurrence(occurrenceData));

        /** @type {Number} */
        this.totalNonVectorizedGlobalLoads = analysisData['total'];
    }
}

export class VectorizationOccurrence extends Occurrence {
    constructor(occurrenceData) {
        super(occurrenceData);

        /** @type {String} */
        this.register = occurrenceData['register'];
        /** @type {String[]} */
        this.unrollBinaryLineNumbers = occurrenceData['unroll_pc_offsets'] || [];
        /** @type {Number} */
        this.adjacentMemoryAccesses = occurrenceData['adjacent_memory_accesses'] || 0;
        /** @type {String} */
        this.registerLoadType = occurrenceData['register_load_type'];
        /** @type {Number} */
        this.usedRegisters = occurrenceData['used_register_count'] || 0;
        /** @type {Number} */
        this.registerPressureIncrease = occurrenceData['register_pressure_increase'] || 0;
    }
}
