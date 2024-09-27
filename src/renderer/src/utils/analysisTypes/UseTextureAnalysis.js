import { Analysis, Occurrence } from '../Analysis';

export const USE_TEXTURE_METRICS = {
    WARP_STALLS_TEX_THROTTLE_PERCENT: 'smsp__warp_issue_stalled_tex_throttle_per_warp_active',
    WARP_STALLS_LONG_SCOREBOARD_PERCENT: 'smsp__warp_issue_stalled_long_scoreboard_per_warp_active',
    KERNEL_TO_TEXTURE_MEMORY_INSTRUCTION_COUNT: 'texture_data_memory_flow/kernel_to_tex_instr',
    TEXTURE_MEMORY_TO_L1_BYTES: 'texture_data_memory_flow/tex_to_l1_bytes',
    TEXTURE_MEMORY_TO_L1_CACHE_MISS_PERCENT: 'texture_data_memory_flow/tex_to_l1_cache_miss_perc',
    L1_TO_L2_CACHE_MISS_PERCENT: 'texture_data_memory_flow/l1_to_l2_cache_miss_perc',
    L1_TO_L2_BYTES: 'texture_data_memory_flow/l1_to_l2_bytes',
    L2_TO_DRAM_BYTES: 'texture_data_memory_flow/l2_to_dram_bytes'
};

export class UseTextureAnalysis extends Analysis {
    constructor(analysisData, kernel) {
        super(analysisData, kernel, USE_TEXTURE_METRICS, (occurrenceData) => new UseTextureOccurrence(occurrenceData));

        /** @type {Boolean} */
        this.isTextureMemoryUsed = analysisData['texture_memory_used'];
    }
}

export class UseTextureOccurrence extends Occurrence {
    constructor(occurrenceData) {
        super(occurrenceData);

        /** @type {String} */
        this.writtenRegister = occurrenceData['written_register'];
        /** @type {String} */
        this.readRegister = occurrenceData['read_register'];
        /** @type {Boolean} */
        this.isSpatialLocality = occurrenceData['spatial_locality'];
    }
}
