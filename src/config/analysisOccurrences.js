import { Occurrence } from '../renderer/src/utils/Analysis';

export class DatatypeConversionOccurrence extends Occurrence {
    constructor(occurrenceData) {
        super(occurrenceData);

        /** @type {String} */ this.type = occurrenceData['type'];
    }
}

export class GlobalAtomicsOccurrence extends Occurrence {
    constructor(occurrenceData) {
        super(occurrenceData);

        /** @type {Boolean} */ this.isInForLoop = occurrenceData['in_for_loop'];
        /** @type {Boolean} */ this.isGlobalAtomic = occurrenceData['is_global'];
    }
}

export class RegisterSpillingOccurrence extends Occurrence {
    constructor(occurrenceData) {
        super(occurrenceData);

        /** @type {String} */ this.register = occurrenceData['register'];
        /** @type {String} */ this.operation = occurrenceData['operation'];
        /** @type {Boolean} */ this.hasPreviousComputeInstruction =
            occurrenceData['previous_compute_instruction'] !== undefined;

        if (occurrenceData['previous_compute_instruction']) {
            /** @type {String} */ this.previousComputeInstruction =
                occurrenceData['previous_compute_instruction']['instruction'];
            /** @type {Number} */ this.previousComputeSourceLineNumber =
                occurrenceData['previous_compute_instruction']['line_number'];
            /** @type {String} */ this.previousComputeBinaryLineNumber =
                occurrenceData['previous_compute_instruction']['pc_offset'];
        }

        /** @type {Number} */ this.usedRegisters = occurrenceData['used_register_count'] || 0;
        /** @type {Number} */ this.registerPressureIncrease = occurrenceData['register_pressure_increase'] || 0;
    }
}

export class UseRestrictOccurrence extends Occurrence {
    constructor(occurrenceData) {
        super(occurrenceData);

        /** @type {String} */ this.register = occurrenceData['register'];
        /** @type {Boolean} */ this.isReadOnlyMemoryUsed = occurrenceData['read_only_memory_used'];
        /** @type {Number} */ this.usedRegisters = occurrenceData['used_register_count'] || 0;
        /** @type {Number} */ this.registerPressureIncrease = occurrenceData['register_pressure_increase'] || 0;
    }

    tokensToHighlight() {
        return [this.register];
    }
}

export class UseSharedOccurrence extends Occurrence {
    constructor(occurrenceData) {
        super(occurrenceData);

        /** @type {String} */ this.register = occurrenceData['register'];
        /** @type {Boolean} */ this.isSharedMemory = occurrenceData['uses_shared_memory'];
        /** @type {Boolean} */ this.isAsyncGlobalToSharedMemoryCopy =
            occurrenceData['uses_async_global_to_shared_memory_copy'] || false;
        /** @type {Number} */ this.instructionsToSharedMemoryStore =
            occurrenceData['instruction_count_to_shared_memory_store'] || 0;
        /** @type {Number} */ this.globalLoads = occurrenceData['global_load_count'] || 0;
        /** @type {String[]} */ this.globalLoadBinaryLineNumbers = occurrenceData['global_load_pc_offsets'] || [];
        /** @type {Number} */ this.computationInstructions = occurrenceData['computation_instruction_count'] || 0;
        /** @type {String[]} */ this.computationInstructionBinaryLineNumbers =
            occurrenceData['computation_instruction_pc_offsets'] || [];
        /** @type {Boolean} */ this.isInForLoop = occurrenceData['in_for_loop'];
    }
}

export class UseTextureOccurrence extends Occurrence {
    constructor(occurrenceData) {
        super(occurrenceData);

        /** @type {String} */ this.writtenRegister = occurrenceData['written_register'];
        /** @type {String} */ this.readRegister = occurrenceData['read_register'];
        /** @type {Boolean} */ this.isSpatialLocality = occurrenceData['spatial_locality'];
    }
}

export class VectorizationOccurrence extends Occurrence {
    constructor(occurrenceData) {
        super(occurrenceData);

        /** @type {String} */ this.register = occurrenceData['register'];
        /** @type {String[]} */ this.unrollBinaryLineNumbers = occurrenceData['unroll_pc_offsets'] || [];
        /** @type {Number} */ this.adjacentMemoryAccesses = occurrenceData['adjacent_memory_accesses'] || 0;
        /** @type {String} */ this.registerLoadType = occurrenceData['register_load_type'];
        /** @type {Number} */ this.usedRegisters = occurrenceData['used_register_count'] || 0;
        /** @type {Number} */ this.registerPressureIncrease = occurrenceData['register_pressure_increase'] || 0;
    }
}

export class WarpDivergenceOccurrence extends Occurrence {
    constructor(occurrenceData) {
        super(occurrenceData);

        /** @type {String} */ this.targetBranch = occurrenceData['target_branch'];
        /** @type {String} */ this.targetBranchStartBinaryLineNumber = occurrenceData['target_branch_start_line_number'];
    }
}
