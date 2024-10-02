import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useDataStore } from './DataStore';

export const CODE_TYPE = {
    NONE: 0,
    SOURCE_CODE: 1,
    SASS_CODE: 2,
    PTX_CODE: 3
};

export const useCodeViewerStore = defineStore('codeViewer', () => {
    const dataStore = useDataStore();

    const currentKernel = computed(() => dataStore.getCurrentKernel);

    const currentView = ref(CODE_TYPE.NONE);
    const currentBinary = ref(CODE_TYPE.SASS_CODE);
    const selectedLine = ref('');

    const occurrenceSourceLines = ref([]);
    const occurrenceBinaryLines = ref([]);

    const highlightedSourceLines = ref({});
    const highlightedBinaryLines = ref({});

    const highlightedSourceTokens = ref({});
    const highlightedBinaryTokens = ref({});

    const getSelectedLine = computed(() => selectedLine.value);

    const getOccurrenceSourceLines = computed(() => occurrenceSourceLines.value);
    const getOccurrenceBinaryLines = computed(() => occurrenceBinaryLines.value);

    const getCurrentView = computed(() => currentView.value);
    const getCurrentBinary = computed(() => currentBinary.value);

    const getHighlightedSourceLines = computed(() => highlightedSourceLines.value);
    const getHighlightedBinaryLines = computed(() => highlightedBinaryLines.value);

    const getHighlightedSourceTokens = computed(() => highlightedSourceTokens.value);
    const getHighlightedBinaryTokens = computed(() => highlightedBinaryTokens.value);

    function setCurrentView(view) {
        currentView.value = view;
    }

    function setCurrentBinary(binary) {
        currentBinary.value = binary;
    }

    function setOccurrenceLines(sourceLines, binaryLines) {
        resetOccurrenceLines();
        occurrenceSourceLines.value = sourceLines;
        occurrenceBinaryLines.value = binaryLines;
    }

    function setSelectedLine(line) {
        selectedLine.value = line;
        resetHighlights();

        if (currentView.value === CODE_TYPE.SASS_CODE) {
            highlightedBinaryLines.value[line] = true;
            highlightedSourceLines.value[dataStore.getGPUscoutResult().getSassToSourceLine(currentKernel.value, line)] =
                true;
        } else if (currentView.value === CODE_TYPE.PTX_CODE) {
            highlightedBinaryLines.value[line] = true;
            highlightedSourceLines.value[dataStore.getGPUscoutResult().getPtxToSourceLine(currentKernel.value, line)] = true;
        } else if (currentView.value === CODE_TYPE.SOURCE_CODE) {
            highlightedSourceLines.value[line] = true;
            const lines =
                currentBinary.value === CODE_TYPE.SASS_CODE
                    ? dataStore.getGPUscoutResult().getSourceToSassLines(currentKernel.value, line)
                    : dataStore.getGPUscoutResult().getSourceToPtxLines(currentKernel.value, line);
            for (const line of lines) {
                highlightedBinaryLines.value[line] = true;
            }
        }
    }

    function resetOccurrenceLines() {
        occurrenceSourceLines.value = occurrenceSourceLines.value.filter(() => false);
        occurrenceBinaryLines.value = occurrenceBinaryLines.value.filter(() => false);
    }

    function resetHighlights() {
        highlightedSourceLines.value = {};
        highlightedBinaryLines.value = {};
        highlightedSourceTokens.value = {};
        highlightedBinaryTokens.value = {};
    }

    return {
        getCurrentView,
        getCurrentBinary,
        getHighlightedSourceLines,
        getHighlightedBinaryTokens,
        getHighlightedBinaryLines,
        getHighlightedSourceTokens,
        setCurrentBinary,
        setOccurrenceLines,
        getSelectedLine,
        setSelectedLine,
        setCurrentView,
        resetHighlights,
        getOccurrenceBinaryLines,
        getOccurrenceSourceLines,
        resetOccurrenceLines
    };
});
