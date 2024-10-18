import { Occurrence } from '../renderer/src/utils/Analysis';
import { CODE_BINARY_TOKEN_COLORS } from './colors';

export class DatatypeConversionOccurrence extends Occurrence {
    constructor(occurrenceData) {
        super(occurrenceData);

        /** @type {String} */ this.type = occurrenceData['type'];
    }

    title() {
        return 'Datatype Conversion';
    }

    description() {
        return `Datatype converion found in the current line. Type of the conversion: <b>${this.type}</b>.`;
    }

    recommendations() {
        let stalls = 'short scoreboard and mio throttle stalls';
        if (this.type === 'F2F') {
            stalls = 'short scoreboard, mio throttle and tex throttle stalls';
        }
        return `Datatype conversions should be avoided whenever possible due to their performance impact. In the case of this occurrence, the datatype conversions should especially be avoided in case of high ${stalls}.`;
    }
}

export class GlobalAtomicsOccurrence extends Occurrence {
    constructor(occurrenceData) {
        super(occurrenceData);

        /** @type {Boolean} */ this.isInForLoop = occurrenceData['in_for_loop'];
        /** @type {Boolean} */ this.isGlobalAtomic = occurrenceData['is_global'];
    }

    title() {
        return this.isGlobalAtomic ? 'Global Atomic' : 'Shared Atomic';
    }

    description() {
        let result = `Use of <b>${this.isGlobalAtomic ? 'global' : 'shared'}</b> atomics found in the current code line.\nThis instruction is ${this.isInForLoop ? '' : 'not '}in a for loop.`;
        return result;
    }

    recommendations() {
        return 'Shared atomics should be used in case of high long scoreboard and lg throttle, but low mio throttle, with global atomics being recommended to use in the inverse case. In case of high values in all 3 stalls, try to switch the use of atomics and check the results.';
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

    title() {
        return 'Register spill';
    }

    description() {
        let result = `Register <b>${this.register}</b> spilled in this <b>${this.operation}</b> operation.`;

        if (this.hasPreviousComputeInstruction) {
            result += `The previous compute instruction this register was used in was <b>${this.previousComputeInstruction}</b> in line <b>${this.previousComputeBinaryLineNumber}</b>.`;
        }

        result += `\nAt the moment of spilling, <b>${this.usedRegisters}</b> out of the available <b>TODO</b> registers were in use. `;

        if (this.registerPressureIncrease > 0) {
            result += `The previous SASS instruction increased the register pressure with <b>${this.registerPressureIncrease}</b> more registers.\n`;
        } else {
            result += `The previous SASS instruction did not increase the register pressure.\n`;
        }

        return result;
    }

    recommendations() {
        return `In case of high performance impacts of local memory on the bandwidth or instructions of the current kernel, try to decrease general register usage, or increase the available registers per thread.\nIf not used already, using non-caching loads for global memory can also help decrease local memory L1 cache misses.\nIn case of bandwidth limitation, increasing the L1 size is also recommended.`;
    }

    tokensToHighlight() {
        return {
            [`<=${this.binaryLineNumber}`]: {
                [this.register]: CODE_BINARY_TOKEN_COLORS.REGISTER_1
            }
        };
    }

    linesToHighlight() {
        if (this.hasPreviousComputeInstruction) {
            return [this.previousComputeBinaryLineNumber];
        }
        return [];
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

    title() {
        return this.isReadOnlyMemoryUsed ? 'Restrict Used' : 'Use Restrict';
    }

    description() {
        if (this.isReadOnlyMemoryUsed) {
            return `Register <b>${this.register}</b> is already using the read-only cache.`;
        } else {
            let result = `Register <b>${this.register}</b> is not aliased anywhere in the kernel and would thus benefit from using __restrict__.\nThere are currently <b>${this.usedRegisters}</b> out of <b>TODO</b> available registers used.`;
            if (this.registerPressureIncrease > 0) {
                result += `The previous SASS instruction increased the register pressure with <b>${this.registerPressureIncrease}</b> more registers.`;
            }
            return result;
        }
    }

    tokensToHighlight() {
        return {
            '*': {
                [this.register]: CODE_BINARY_TOKEN_COLORS.REGISTER_1
            }
        };
    }

    linesToHighlight() {
        return [];
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

    title() {
        return this.isSharedMemory ? 'Shared Memory used' : 'Use Shared Memory';
    }

    description() {
        if (this.isSharedMemory) {
            if (this.isAsyncGlobalToSharedMemoryCopy) {
                return `Register <b>${this.register}</b> already uses anynchronous global to shared memory copy in the current line.`;
            } else {
                let result = `Register <b>${this.register}</b> already stores data to shared memory in the current line.`;
                if (this.instructionsToSharedMemoryStore > 0) {
                    result += `\nData loaded from global memory is stored to shared memory at address after <b>${this.instructionsToSharedMemoryStore}</b> instructions.`;
                }
                return result;
            }
        } else {
            let result = `Register <b>${this.register}</b> in the current line has <b>${this.globalLoads}</b> global loads and <b>${this.computationInstructions}</b> computation instructions.`;
            if (this.isInForLoop) {
                result += '\nAdditionally, this instruction is executed within a for loop.';
            }

            result += '\nGlobal loads of this register are found at the following addresses:';
            for (const address of this.globalLoadBinaryLineNumbers) {
                result += `\n- <b>${address}</b>`;
            }

            result += '\nComputation instructions of this register are found at the following addresses:';
            for (const address of this.computationInstructionBinaryLineNumbers) {
                result += `\n- <b>${address}</b>`;
            }

            return result;
        }
    }

    recommendations() {
        return `Use of shared memory is encouraged if the current register is used in more computation instructions than global loads. If the load instruction is inside a for loop, shared memory could also improve performance.\nIn addition to using shared memory, anynchronous global to shared memory copy operations should be used when the shared store is not performed immediately after the load from global memory.`;
    }

    tokensToHighlight() {
        return {
            ['*']: {
                [this.register]: CODE_BINARY_TOKEN_COLORS.REGISTER_1
            }
        };
    }

    linesToHighlight() {
        return this.globalLoadBinaryLineNumbers.concat(this.computationInstructionBinaryLineNumbers);
    }
}

export class UseTextureOccurrence extends Occurrence {
    constructor(occurrenceData) {
        super(occurrenceData);

        /** @type {String} */ this.writtenRegister = occurrenceData['written_register'];
        /** @type {String} */ this.readRegister = occurrenceData['read_register'];
        /** @type {Boolean} */ this.isSpatialLocality = occurrenceData['spatial_locality'];
        /** @type {String[]} */ this.unrollBinaryLineNumbers = occurrenceData['unroll_pc_offsets'] || [];
    }

    title() {
        return 'Use Texture Memory';
    }

    description() {
        let result = `Texture memory should be used for register <b>${this.writtenRegister}</b>. The data written to this register is read from register <b>${this.readRegister}</b>.\n`;
        if (this.isSpatialLocality) {
            result += `Spatial locality has been found for the data stored in this register.`;
            if (this.unrollBinaryLineNumbers.length > 1) {
                result += ` Namely at the following addresses:\n`;
                for (const address of this.unrollBinaryLineNumbers.filter((n) => n !== this.binaryLineNumber)) {
                    result += `- <b>${address}</b>\n`;
                }
            }
        } else {
            result += 'Spatial locality has not been found for the data stored in this register.';
        }
        return result;
    }

    recommendations() {
        return 'Texture memory should be used especially when spatial locality has been found. As using texture memory can increase both long scoreboard and tex throttle stalls, these values should not be too high and kept in mind when making changes.';
    }

    linesToHighlight() {
        return this.unrollBinaryLineNumbers.filter((n) => n !== this.binaryLineNumber);
    }

    tokensToHighlight() {
        return {
            [`>=${this.binaryLineNumber}`]: {
                [this.writtenRegister]: CODE_BINARY_TOKEN_COLORS.REGISTER_1
            }
        };
    }
}

export class VectorizationOccurrence extends Occurrence {
    constructor(occurrenceData) {
        super(occurrenceData);

        /** @type {String} */ this.register = occurrenceData['register'];
        /** @type {String[]} */ this.unrollBinaryLineNumbers = occurrenceData['unroll_pc_offsets'] || [];
        /** @type {Number} */ this.adjacentMemoryAccesses = occurrenceData['adjacent_memory_accesses'] || 0;
        /** @type {String} */ this.registerLoadType = occurrenceData['register_load_type'] || 0;
        /** @type {Number} */ this.usedRegisters = occurrenceData['used_register_count'] || 0;
        /** @type {Number} */ this.registerPressureIncrease = occurrenceData['register_pressure_increase'] || 0;
    }

    title() {
        return this.registerLoadType === 0 && this.unrollBinaryLineNumbers.length > 0
            ? 'Use Vectorized Load'
            : 'Vectorized Load';
    }

    description() {
        if (this.registerLoadType === 0 && this.adjacentMemoryAccesses > 0) {
            let result = `Register <b>${this.register}</b> has <b>${this.adjacentMemoryAccesses}</b> adjacent memory accesses and thus should use a vectorized load instead. In addition to the current line, adjacent memory accesses happen at the following addresses:\n`;
            for (const access of this.unrollBinaryLineNumbers.filter((n) => n !== this.binaryLineNumber)) {
                result += `- <b>${access}</b>\n`;
            }
            return result;
        } else if (this.registerLoadType === 1) {
            return `Register <b>${this.register}</b> is already using 64-bit width vectorized load.`;
        } else if (this.registerLoadType === 2) {
            return `Register <b>${this.register}</b> is already using 128-bit width vectorized load.`;
        } else {
            return `Using vectorized load for register <b>${this.register}</b> might not improve performance.`;
        }
    }

    recommendations() {
        if (this.registerLoadType === 0 && this.adjacentMemoryAccesses > 0) {
            return 'Vectorized loads should be used instead here, when long scoreboard stalls are not too high. As using vectorized loads can increase long scoreboard stalls, keep this metric in mind before and after applying changes.';
        }
        return '';
    }

    tokensToHighlight() {
        return {
            '*': {
                [this.register]: CODE_BINARY_TOKEN_COLORS.REGISTER_1
            }
        };
    }

    linesToHighlight() {
        return this.unrollBinaryLineNumbers.filter((n) => n !== this.binaryLineNumber);
    }
}

export class WarpDivergenceOccurrence extends Occurrence {
    constructor(occurrenceData) {
        super(occurrenceData);

        /** @type {String} */ this.targetBranch = occurrenceData['target_branch'];
        /** @type {String} */ this.targetBranchStartSourceLineNumber = occurrenceData['target_branch_start_line_number'];
    }

    title() {
        return 'Warp Divergence';
    }

    description() {
        return `Conditional branching detected in the current line with target branch <b>${this.targetBranch}</b> starting at line number <b>${this.targetBranchStartSourceLineNumber}</b>.`;
    }

    tokensToHighlight() {
        return {
            '*': {
                [this.targetBranch.substring(1)]: CODE_BINARY_TOKEN_COLORS.REGISTER_1
            }
        };
    }
}
