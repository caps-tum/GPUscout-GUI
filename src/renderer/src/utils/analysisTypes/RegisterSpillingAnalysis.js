import { Analysis, Occurrence } from '../Analysis';

export const REGISTER_SPILLING_METRICS = {
    WARP_STALLS_LG_THROTTLE_PERCENT: 'smsp__warp_issue_stalled_lg_throttle_per_warp_active',
    WARP_STALLS_LONG_SCOREBOARD_PERCENT: 'smsp__warp_issue_stalled_long_scoreboard_per_warp_active',
    KERNEL_TO_SHARED_MEMORY_BYTES: 'memory_flow/kernel_to_shared_bytes',
    L2_QUERIES_DUE_TO_LOCAL_MEMORY_PERCENT: 'l2_queries_due_to_mem_perc',
    GLOBAL_LOADS_COUNT: 'memory_flow/num_loads',
    GLOBAL_MEMORY_TO_L1_BYTES: 'memory_flow/global_to_l1_bytes',
    GLOBAL_MEMORY_TO_L1_CACHE_MISS_PERCENT: 'memory_flow/global_to_l1_cache_miss_perc',
    GLOBAL_MEMORY_L1_TO_L2_BYTES: 'memory_flow/global_l1_to_l2_bytes',
    LOCAL_MEMORY_TO_L1_BYTES: 'memory_flow/local_to_l1_bytes',
    LOCAL_MEMORY_TO_L1_CACHE_MISS_PERCENT: 'memory_flow/local_to_l1_cache_miss_perc',
    LOCAL_MEMORY_L1_TO_L2_BYTES: 'memory_flow/local_l1_to_l2_bytes',
    L1_TO_L2_CACHE_MISS_PERCENT: 'memory_flow/l1_to_l2_cache_miss_perc',
    L2_TO_DRAM_BYTES: 'memory_flow/l2_to_dram_bytes'
};

export class RegisterSpillingAnalysis extends Analysis {
    constructor(analysisData, kernel) {
        super(
            analysisData,
            kernel,
            REGISTER_SPILLING_METRICS,
            (occurrenceData) => new RegisterSpillingOccurrence(occurrenceData)
        );
    }
}

export class RegisterSpillingOccurrence extends Occurrence {
    constructor(occurrenceData) {
        super(occurrenceData);

        /** @type {String} */
        this.register = occurrenceData['register'];
        /** @type {String} */
        this.operation = occurrenceData['operation'];

        if (occurrenceData['previous_compute_instruction']) {
            /** @type {String} */
            this.previousComputeInstruction = occurrenceData['previous_compute_instruction']['instruction'];
            /** @type {Number} */
            this.previousComputeSourceLineNumber = occurrenceData['previous_compute_instruction']['line_number'];
            /** @type {String} */
            this.previousComputeBinaryLineNumber = occurrenceData['previous_compute_instruction']['pc_offset'];
        }

        /** @type {Number} */
        this.usedRegisters = occurrenceData['used_register_count'] || 0;
        /** @type {Number} */
        this.registerPressureIncrease = occurrenceData['register_pressure_increase'] || 0;
    }
}
