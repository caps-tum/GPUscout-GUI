import { defineStore } from 'pinia';
import { GPUscoutResult } from '../utils/GPUscoutResult';
import { computed, ref } from 'vue';
import { CODE_TYPE, useCodeViewerStore } from './CodeViewerStore';
import { ANALYSIS } from '../../../config/analyses';

export const useDataStore = defineStore('data', () => {
    const codeViewerStore = useCodeViewerStore();

    /** @type {GPUscoutResult} */
    let gpuscoutResult;

    const currentKernel = ref('');
    const currentAnalysis = ref('');
    const currentOccurrence = ref(null);

    /** @returns {GPUscoutResult} */
    const getGPUscoutResult = () => gpuscoutResult;
    /** @returns {Object.<String, {}>} */
    const getAnalyses = () => gpuscoutResult?.analyses || {};
    /** @returns {String[]} */
    const getKernels = () => gpuscoutResult?.kernels || [];

    const getCurrentKernel = computed(() => currentKernel.value);
    const getCurrentAnalysis = computed(() => currentAnalysis.value);
    const getCurrentOccurrence = computed(() => currentOccurrence.value);

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
        // TODO: what if 0
        setCurrentAnalysis(gpuscoutResult.getAnalysesWithOccurrences()[0]);

        console.log(gpuscoutResult.kernels);

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

    /**
     * @param {String} analysis The analysis to switch to
     */
    function setCurrentAnalysis(analysis) {
        currentAnalysis.value = analysis;
        const occurrences = gpuscoutResult.getAnalysis(analysis, currentKernel.value).getOccurrences();

        codeViewerStore.setCurrentBinary(ANALYSIS[analysis].use_sass ? CODE_TYPE.SASS_CODE : CODE_TYPE.PTX_CODE);
        codeViewerStore.updateSelectedLine();
        codeViewerStore.setOccurrenceLines(
            occurrences.map((o) => o.sourceLineNumber),
            occurrences.map((o) => o.binaryLineNumber)
        );
    }

    /**
     * @param {String} kernel The kernel to switch to
     */
    function setCurrentKernel(kernel) {
        currentKernel.value = kernel;
        setCurrentAnalysis(currentAnalysis.value);
        codeViewerStore.updateSelectedLine();
    }

    function setCurrentOccurrence(codeType, lineNumber) {
        currentOccurrence.value = gpuscoutResult
            .getAnalysis(currentAnalysis.value, currentKernel.value)
            .getOccurrence(codeType, lineNumber);
    }

    return {
        setCurrentAnalysis,
        getCurrentAnalysis,
        getCurrentKernel,
        getGPUscoutResult,
        getCurrentOccurrence,
        getAnalyses,
        getKernels,
        initialize,
        setCurrentOccurrence,
        setCurrentKernel
    };
});
