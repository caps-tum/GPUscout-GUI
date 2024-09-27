import { defineStore } from 'pinia';
import { Analysis } from '../utils/analysis';
import { computed, ref } from 'vue';

export const useDataStore = defineStore('data', () => {
    let analysis;

    const currentKernel = ref('');

    /** @return {Analysis} */
    const getAnalysis = () => analysis;
    /** @return {Object.<String, {}>} */
    const getAnalyses = () => analysis.analyses;
    /** @return {String[]} */
    const getKernels = () => analysis.kernels;

    const getCurrentKernel = computed(() => currentKernel.value);

    /**
     * Initialize the store with the data from GPUscout
     * @param {String} analysisData The data of the "result.json" file
     * @param {String} sassCode The sass code file
     * @param {String} sassRegisters The sass registers file
     * @param {String} ptxCode The ptx code file
     * @param {Object.<String, String>} sourceCodes The source code files
     */
    async function initialize(analysisData, sassCode, sassRegisters, ptxCode, sourceCodes) {
        analysis = new Analysis(analysisData, sassCode, sassRegisters, ptxCode, sourceCodes);

        if (analysis.kernels.length === 0) {
            alert('No kernels found!');
        }
        currentKernel.value = analysis.kernels[0];

        console.log(analysis.kernels);
        console.log(analysis.analyses);

        console.log('SASS');
        console.log(analysis.sassCodeLines);
        console.log(analysis.sassToSourceLines);

        console.log('PTX');
        console.log(analysis.ptxCodeLines);
        console.log(analysis.ptxToSourceLines);

        console.log('SOURCE');
        console.log(analysis.sourceCodeLines);
        console.log(analysis.sourceToSassLines);
        console.log(analysis.sourceToPtxLines);
    }

    return {
        getCurrentKernel,
        getAnalysis,
        getAnalyses,
        getKernels,
        initialize
    };
});
