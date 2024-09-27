import { Analysis, Occurrence } from '../Analysis';

export const USE_SHARED_METRICS = {
    WARP_STALLS_MIO_THROTTLE_PERCENT: 'smsp__warp_issue_stalled_mio_throttle_per_warp_active',
    WARP_STALLS_LONG_SCOREBOARD_PERCENT: 'smsp__warp_issue_stalled_long_scoreboard_per_warp_active',
    SHARED_MEMORY_LOAD_COUNT: 'data_memory_flow/shared_mem_load_operations',
    SHARED_MEMORY_LOAD_EFFICIENCY_PERCENT: 'bank_conflict/shared_mem_load_efficiency_perc',
    BANK_CONFLICT: 'bank_conflict/bank_conflict'
};

export class UseSharedAnalysis extends Analysis {
    constructor(analysisData, kernel) {
        super(analysisData, kernel, USE_SHARED_METRICS, (occurrenceData) => new UseSharedOccurrence(occurrenceData));
    }
}

export class UseSharedOccurrence extends Occurrence {
    constructor(occurrenceData) {
        super(occurrenceData);

        /** @type {String} */
        this.register = occurrenceData['register'];
        /** @type {Boolean} */
        this.isSharedMemory = occurrenceData['uses_shared_memory'];
        /** @type {Boolean} */
        this.isAsyncGlobalToSharedMemoryCopy = occurrenceData['uses_async_global_to_shared_memory_copy'] || false;
        /** @type {Number} */
        this.instructionsToSharedMemoryStore = occurrenceData['instruction_count_to_shared_memory_store'] || 0;
        /** @type {Number} */
        this.globalLoads = occurrenceData['global_load_count'] || 0;
        /** @type {String[]} */
        this.globalLoadBinaryLineNumbers = occurrenceData['global_load_pc_offsets'] || [];
        /** @type {Number} */
        this.computationInstructions = occurrenceData['computation_instruction_count'] || 0;
        /** @type {String[]} */
        this.computationInstructionBinaryLineNumbers = occurrenceData['computation_instruction_pc_offsets'] || [];
        /** @type {Boolean} */
        this.isInForLoop = occurrenceData['in_for_loop'];
    }
}
