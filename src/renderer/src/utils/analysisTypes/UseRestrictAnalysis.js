import { Analysis, Occurrence } from '../Analysis';

export const USE_RESTRICT_METRICS = {
    WARP_STALLS_IMC_MISS_PERCENT: 'smsp__warp_issue_stalled_imc_miss_per_warp_active'
};

export class UseRestrictAnalysis extends Analysis {
    constructor(analysisData, kernel) {
        super(analysisData, kernel, USE_RESTRICT_METRICS, (occurrenceData) => new UseRestrictOccurrence(occurrenceData));
    }
}

export class UseRestrictOccurrence extends Occurrence {
    constructor(occurrenceData) {
        super(occurrenceData);

        /** @type {String} */
        this.register = occurrenceData['register'];
        /** @type {Boolean} */
        this.isReadOnlyMemoryUsed = occurrenceData['read_only_memory_used'];
        /** @type {Number} */
        this.usedRegisters = occurrenceData['used_register_count'] || 0;
        /** @type {Number} */
        this.registerPressureIncrease = occurrenceData['register_pressure_increase'] || 0;
    }
}
