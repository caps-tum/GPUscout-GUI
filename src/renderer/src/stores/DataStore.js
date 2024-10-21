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
    const currentOccurrences = ref([]);

    /** @returns {GPUscoutResult} */
    const getGPUscoutResult = () => gpuscoutResult;
    /** @returns {Object.<String, {}>} */
    const getAnalyses = () => gpuscoutResult?.analyses || {};
    /** @returns {String[]} */
    const getKernels = () => gpuscoutResult?.kernels || [];

    /** @type {GPUscoutResult} */
    let gpuscoutComparisonResult;
    /** @returns {GPUscoutResult} */
    const getGPUscoutComparisonResult = () => gpuscoutComparisonResult;
    /** @returns {Object.<String, {}>} */
    const getComparisonAnalyses = () => gpuscoutComparisonResult?.analyses || {};
    /** @returns {String[]} */
    const getComparisonKernels = () => gpuscoutComparisonResult?.kernels || [];

    const getCurrentKernel = computed(() => currentKernel.value);
    const getCurrentAnalysis = computed(() => currentAnalysis.value);
    const getCurrentOccurrences = computed(() => currentOccurrences.value);

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
        codeViewerStore.setSassRegisterVisibility(ANALYSIS[analysis].display_live_registers);
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

    function setCurrentOccurrences(codeType, lineNumber) {
        currentOccurrences.value = currentOccurrences.value.filter(() => false);
        currentOccurrences.value = gpuscoutResult
            .getAnalysis(currentAnalysis.value, currentKernel.value)
            .getOccurrencesAt(codeType, lineNumber);
    }

    return {
        getComparisonKernels,
        getComparisonAnalyses,
        getGPUscoutComparisonResult,
        setCurrentAnalysis,
        getCurrentAnalysis,
        getCurrentKernel,
        getGPUscoutResult,
        getCurrentOccurrences,
        getAnalyses,
        getKernels,
        initialize,
        setCurrentOccurrences,
        setCurrentKernel
    };
});
