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
        return `The current instruction performs a datatype conversion. The type of the conversion is <b>${this.type}</b>.`;
    }

    recommendations() {
        let stalls = '- Short scoreboard stalls\n- Mio Throttle stalls';
        if (this.type === 'F2F') {
            stalls = '- Short scoreboard stalls\n- Mio Throttle stalls\n- Tex Throttle stalls';
        }
        return `Datatype conversions should be avoided whenever possible due to their performance impact.
In the case of a <b>${this.type}</b> coversion, high values in any of the following stalls in the current line indicate a potential performance bottleneck:\n${stalls}
After modifying the code, improvements in the mentioned warp stalls should be seen.`;
    }
}

export class GlobalAtomicsOccurrence extends Occurrence {
    constructor(occurrenceData) {
        super(occurrenceData);

        /** @type {Boolean} */ this.isInForLoop = occurrenceData['in_for_loop'];
        /** @type {Boolean} */ this.isGlobalAtomic = occurrenceData['is_global'];
    }

    title() {
        return this.isGlobalAtomic ? 'Use of Global Atomic' : 'Use of Shared Atomic';
    }

    description() {
        let result = `Use of <b>${this.isGlobalAtomic ? 'global' : 'shared'}</b> atomics found in the current line.\nThis instruction is ${this.isInForLoop ? '' : 'not '}in a for loop.`;
        return result;
    }

    recommendations() {
        return `The use of global or shared atomics can lead to increases in LG Throttle, MIO Throttle, as well as long scoreboard stalls. In the case of high LG Throttle, but low MIO Throttle stalls, shared atomics should be used, with global atomics being recommended in cases of high MIO Throttle stalls, but low LG Throttle and long scoreboard stalls.
If high values are seen in all three stall reasons, try to switch between global and shared atomics and compare the results.

Additionally, global atomics should never be used in the instruction executed is inside a for loop.
After modifying the code, improvements or only slight increases should be seen in the mentioned warp stalls, with the total number of stalls decreasing.`;
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
        return 'Register Spill';
    }

    description() {
        let result = `Register <b>${this.register}</b> spilled in the current line in <b>${this.operation}</b> operation.`;

        if (this.hasPreviousComputeInstruction) {
            result += `The previous compute instruction this register was used in was <b>${this.previousComputeInstruction}</b> in line <b>${this.previousComputeBinaryLineNumber}</b>.`;
        }

        result += `\nAt the moment of spilling, <b>${this.usedRegisters}</b> registers were in use. `;

        if (this.registerPressureIncrease > 0) {
            result += `The previous SASS instruction increased the register pressure with <b>${this.registerPressureIncrease}</b> more registers.\n`;
        } else {
            result += `The previous SASS instruction did not increase the register pressure.\n`;
        }

        return result;
    }

    recommendations() {
        return `Register spilling happens in cases, where more registers are needed than are available, so register data gets "spilled" to local memory. This can impact performance by leading to increasing memory traffic and instruction count. There are multiple cases to consider:
- <b>Bandwith limitation</b>: Code is considered bandwidth-limited in case a high percentage of L2 queries are due to local memory. This can be resolved by increasing L1 cache size, increasing available registers by thread, decreasing register usage or using non-caching loads for global memory.
- <b>Instruction limitation</b>: Code is considered instruction-limited in case a large fraction of instruction issued is due to local memory. This can be resolved by increasing available registers by thread, decreasing register usage or using non-caching loads for global memory.

In cases of general low local memory usage, register spills can also be contained by the L1 cache, significantly decreasing their performance impact.
When making changes to the code, L1 cache utilization, used and available registers, as well as occupancy should be compared, with high LG Throttle stalls and long scoreboard stalls in the current line likely also being a result of the spill.`;
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
        return this.isReadOnlyMemoryUsed ? 'Use of Restrict' : 'Use Restrict';
    }

    description() {
        if (this.isReadOnlyMemoryUsed) {
            return `Register <b>${this.register}</b> is already using read-only cache.`;
        } else {
            let result = `Register <b>${this.register}</b> is not aliased anywhere in the kernel and would thus benefit from being marked with the __restrict__ keyword.
There are currently <b>${this.usedRegisters}</b> registers used.`;
            if (this.registerPressureIncrease > 0) {
                result += `The previous SASS instruction increased the register pressure by <b>${this.registerPressureIncrease}</b> additional registers.`;
            }
            return result;
        }
    }

    recommendations() {
        return `By marking pointers with the __restrict__ property, the compiler will be informed that data written through a pointer will not be read by another pointer, which allows for more aggressive optimizations and often leads to performance gains.
This means that restrict should be used whenever available, the only exception being in cases of already high register pressure. As using the __restrict__ keyword can further increase total used registers, it should not be used when the used register count is already near total available registers.

After modyfing the code, the total number of stalls should decrease, with increases in IMC Miss stalls being the exception. Other metrics that should be followed are the number of global memory instructions, which should decrease, as well as the occupancy, which should not go down too much (due to increased register usage).`;
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
        return this.isSharedMemory ? 'Use of Shared Memory' : 'Use Shared Memory';
    }

    description() {
        if (this.isSharedMemory) {
            if (this.isAsyncGlobalToSharedMemoryCopy) {
                return `Register <b>${this.register}</b> already uses anynchronous global to shared memory copy in the current line.`;
            } else {
                let result = `Register <b>${this.register}</b> already stores data to shared memory in the current line.`;
                if (this.instructionsToSharedMemoryStore > 0) {
                    result += `\nData loaded from global memory is stored to shared memory in the current instruction after <b>${this.instructionsToSharedMemoryStore}</b> instructions.`;
                }
                return result;
            }
        } else {
            let result = `Register <b>${this.register}</b> in the current line has <b>${this.globalLoads}</b> global loads and <b>${this.computationInstructions}</b> computation instructions.`;
            if (this.isInForLoop) {
                result += '\nAdditionally, this instruction is executed within a for loop.';
            }

            if (this.globalLoadBinaryLineNumbers.length > 0) {
                result += '\nGlobal loads of this register are found at the following addresses:';
                for (const address of this.globalLoadBinaryLineNumbers) {
                    result += `\n- <b>${address}</b>`;
                }
            }

            if (this.computationInstructionBinaryLineNumbers.length > 0) {
                result += '\nComputation instructions of this register are found at the following addresses:';
                for (const address of this.computationInstructionBinaryLineNumbers) {
                    result += `\n- <b>${address}</b>`;
                }
            }

            return result;
        }
    }

    recommendations() {
        return `Shared memory is faster than global memory and should be used when data is used frequently. This can be checked by looking at the number of computation instructions and global loads the current register is involved in. If the register is used in more computation instructions than global loads, the use of shared memory is encouraged.

If the load instruction is inside a for loop, shared memory could also improve performance.
In addition to using shared memory, anynchronous global to shared memory copy operations should be used when the store to shared memory is not performed immediately after the load from global memory.

In cases of high MIO stalls, the use of shared memory should be reduced, as data is loaded too frequently.
After modifying the code, total stalls should decrease. After switching to using shared memory, load efficiency should increase, along with the number of shared memory load operations. Any existing or new bank conflicts should be resolved, as they can impact performance significantly.`;
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
                result += ` Namely at the following addresses (in addition to the current address):\n`;
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
        return `Texture memory should be used for data that is updated rarely, and especially if data accesses have spatial locality. As using texture memory can increase both Tex Throttle and long scoreboard stalls, these should be considered before and after making changes. Another reason to use texture memory is in cases of high L1 or L2 cache miss rates, as texture memory uses its own read-only cache, eleviating pressure on the global memory caches.`;
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
            : 'Use of Vectorized Load';
    }

    description() {
        if (this.registerLoadType === 0 && this.adjacentMemoryAccesses > 0) {
            let result = `Register <b>${this.register}</b> has <b>${this.adjacentMemoryAccesses}</b> adjacent memory accesses and thus should use a vectorized load instead. In addition to the current line, adjacent memory accesses happen at the following addresses:\n`;
            for (const access of this.unrollBinaryLineNumbers) {
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
        return `Using vectorized loads can both improve performance and reduce total instructions as one instruction can replace multiple individual load instructions. Additional effects of using vectorized loads include slightly increased long scoreboard stalls, as well as a decreased ocupancy, so these metrics should be kept in mind before and after making changes. The total number of instructions and number of global load instructions should go down however, and can be used as a metric for the effectiveness of a change. Additionally, the data requested from global memory per instruction should increase.`;
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

    recommendations() {
        return `Diverging branches can impact performance negatively and thus should be avoided where possible. Along with general performance improvements, total stalls, as well as IMC and long scoreboard stalls can also decrease when problematic in the current line.`;
    }

    tokensToHighlight() {
        return {
            '*': {
                [this.targetBranch.substring(1)]: CODE_BINARY_TOKEN_COLORS.REGISTER_1
            }
        };
    }
}
