import { defineStore } from 'pinia';
import { GPUscoutResult } from '../utils/GPUscoutResult';
import { computed, ref } from 'vue';

export const useDataStore = defineStore('data', () => {
    let gpuscoutResult;

    const currentKernel = ref('');

    /** @returns {GPUscoutResult} */
    const getGPUscoutResult = () => gpuscoutResult;
    /** @returns {Object.<String, {}>} */
    const getAnalyses = () => gpuscoutResult.analyses;
    /** @returns {String[]} */
    const getKernels = () => gpuscoutResult.kernels;

    const getCurrentKernel = computed(() => currentKernel.value);

    /**
     * Initialize the store with the data from GPUscout
     * @param {String} resultData The data of the "result.json" file
     * @param {String} sassCode The sass code file
     * @param {String} sassRegisters The sass registers file
     * @param {String} ptxCode The ptx code file
     * @param {Object.<String, String>} sourceCodes The source code files
     */
    async function initialize(resultData, sassCode, sassRegisters, ptxCode, sourceCodes) {
        gpuscoutResult = new GPUscoutResult(resultData, sassCode, sassRegisters, ptxCode, sourceCodes);

        if (gpuscoutResult.kernels.length === 0) {
            alert('No kernels found!');
        }
        currentKernel.value = gpuscoutResult.kernels[0];

        console.log(gpuscoutResult.kernels);
        console.log(gpuscoutResult.analyses);

        console.log('SASS');
        console.log(gpuscoutResult.sassCodeLines);
        console.log(gpuscoutResult.sassToSourceLines);

        console.log('PTX');
        console.log(gpuscoutResult.ptxCodeLines);
        console.log(gpuscoutResult.ptxToSourceLines);

        console.log('SOURCE');
        console.log(gpuscoutResult.sourceCodeLines);
        console.log(gpuscoutResult.sourceToSassLines);
        console.log(gpuscoutResult.sourceToPtxLines);

        console.log('ANALYSES');
        console.log(gpuscoutResult.analyses);
    }

    return {
        getCurrentKernel,
        getGPUscoutResult,
        getAnalyses,
        getKernels,
        initialize
    };
});
