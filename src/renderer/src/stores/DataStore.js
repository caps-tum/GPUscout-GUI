/**
 * @module
 * @author Tobias Stuckenberger
 * @description This module defines the dataStore
 */
import { defineStore } from 'pinia';
import { GPUscoutResult } from '../utils/GPUscoutResult';
import { computed, ref } from 'vue';
import { CODE_TYPE, useCodeViewerStore } from './CodeViewerStore';
import { ANALYSIS } from '../../../config/analyses';
import { CONTEXT, useContextStore } from './ContextStore';

/**
 * The data store handles loading and switching between the GPUscout results, as well switching between kernels and analyses.
 */
export const useDataStore = defineStore('data', () => {
    const codeViewerStore = useCodeViewerStore();
    const contextStore = useContextStore();

    const useComparisonCode = computed(() => codeViewerStore.displayComparisonCode);

    /** @type {GPUscoutResult} */
    let gpuscoutResult;

    const currentKernel = ref('');
    const currentAnalysis = ref('');
    const currentOccurrences = ref([]);
    const comparisonResultAvailable = ref(false);

    /** @returns {GPUscoutResult} */
    const getGPUscoutResult = () => gpuscoutResult;
    /** @returns {Object.<String, {}>} */
    const getAnalyses = () => gpuscoutResult?.getAnalyses() || {};
    /** @returns {String[]} */
    const getKernels = () => gpuscoutResult?.getKernels() || [];

    /** @type {GPUscoutResult} */
    let gpuscoutComparisonResult;
    /** @returns {GPUscoutResult} */
    const getGPUscoutComparisonResult = () => gpuscoutComparisonResult;
    /** @returns {Object.<String, {}>} */
    const getComparisonAnalyses = () => gpuscoutComparisonResult?.getAnalyses() || {};
    /** @returns {String[]} */
    const getComparisonKernels = () => gpuscoutComparisonResult?.getKernels() || [];
    const hasComparisonResult = computed(() => comparisonResultAvailable.value);

    const getCurrentKernel = computed(() => currentKernel.value);
    const getCurrentAnalysis = computed(() => currentAnalysis.value);
    const getCurrentOccurrences = computed(() => currentOccurrences.value);

    /**
     * Initialize the store with the data from GPUscout
     * @param {String} resultData The data of the "result.json" file
     * @param {String} comparisonData The data of the "result.json" file of a second GPUscout result to compare to
     * @param {String} topologyData The memory topology data
     * @param {String} comparisonTopologyData The memory topology data of the comarison result
     */
    async function initialize(resultData, comparisonData, topologyData, comparisonTopologyData) {
        try {
            gpuscoutResult = new GPUscoutResult(resultData, topologyData);
            if (comparisonData) {
                gpuscoutComparisonResult = new GPUscoutResult(comparisonData, comparisonTopologyData);
                comparisonResultAvailable.value = true;
            }
        } catch (e) {
            console.error(e);
            alert(
                'An error occurred while parsing the input files. Please make sure no errors occurred during their generation.'
            );
            window.location.reload();
            return;
        }

        if (gpuscoutResult.getKernels().length === 0) {
            alert('No kernels found!');
            window.location.reload();
            return;
        }
        if (
            gpuscoutComparisonResult &&
            gpuscoutResult.getKernels().filter((k) => gpuscoutComparisonResult.getKernels().includes(k)).length === 0
        ) {
            alert(
                'The two analyses share no kernel and thus cannnot be compared. Please select a different analysis to compare to.'
            );
            window.location.reload();
            return;
        }

        setCurrentKernel(gpuscoutResult.getKernels()[0]);
    }

    /**
     * Change the currently selected analysis
     * @param {String} analysis The analysis to switch to
     */
    function setCurrentAnalysis(analysis) {
        codeViewerStore.setCurrentSourceFile(gpuscoutResult.getMainFileName(currentKernel.value));
        currentAnalysis.value = analysis;
        if (!currentAnalysis.value) {
            codeViewerStore.setOccurrenceLines([], [], [], []);
            return;
        }
        const occurrences = (useComparisonCode.value ? gpuscoutComparisonResult : gpuscoutResult)
            .getAnalysis(analysis, currentKernel.value)
            .getOccurrences();

        codeViewerStore.setCurrentBinary(ANALYSIS[analysis].use_sass ? CODE_TYPE.SASS_CODE : CODE_TYPE.PTX_CODE);
        codeViewerStore.setSassRegisterVisibility(ANALYSIS[analysis].display_live_registers);
        codeViewerStore.updateSelectedLine();
        codeViewerStore.setOccurrenceLines(
            occurrences.filter((o) => o.isWarning).map((o) => o.sourceLineNumber),
            occurrences.filter((o) => o.isWarning).map((o) => o.binaryLineNumber),
            occurrences.filter((o) => !o.isWarning).map((o) => o.sourceLineNumber),
            occurrences.filter((o) => !o.isWarning).map((o) => o.binaryLineNumber)
        );
    }

    /**
     * Change the currently selected kernel
     * @param {String} kernel The kernel to switch to
     */
    function setCurrentKernel(kernel) {
        currentKernel.value = kernel;
        comparisonResultAvailable.value = gpuscoutComparisonResult && gpuscoutComparisonResult.getKernels().includes(kernel);

        if (gpuscoutResult.getAnalysesWithOccurrences(currentKernel.value).length === 0) {
            if (
                comparisonResultAvailable.value &&
                gpuscoutComparisonResult.getAnalysesWithOccurrences(currentKernel.value).length > 0
            ) {
                contextStore.setCurrentContext(CONTEXT.ANALYSIS);
                setCurrentAnalysis(gpuscoutComparisonResult.getAnalysesWithOccurrences(currentKernel.value)[0]);
            } else {
                contextStore.setCurrentContext(CONTEXT.SUMMARY);
                setCurrentAnalysis('');
            }
        } else {
            setCurrentAnalysis(gpuscoutResult.getAnalysesWithOccurrences(currentKernel.value)[0]);
            contextStore.setCurrentContext(CONTEXT.ANALYSIS);
            codeViewerStore.updateSelectedLine();
        }
    }

    /**
     * Change the currently selected occurrence in the code view
     * @param {String} codeType The code type of the currently selected code view
     * @param {String|Number} lineNumber
     */
    function setCurrentOccurrences(codeType, lineNumber) {
        currentOccurrences.value = currentOccurrences.value.filter(() => false);
        if (currentAnalysis.value) {
            currentOccurrences.value = (useComparisonCode.value ? gpuscoutComparisonResult : gpuscoutResult)
                .getAnalysis(currentAnalysis.value, currentKernel.value)
                .getOccurrencesAt(codeType, lineNumber);
        }
    }

    return {
        getComparisonKernels,
        hasComparisonResult,
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
