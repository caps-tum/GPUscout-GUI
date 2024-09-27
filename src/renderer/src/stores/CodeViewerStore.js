import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useDataStore } from './DataStore';

export const CODE_VIEW = {
    NONE: 0,
    SOURCE_CODE: 1,
    SASS_CODE: 2,
    PTX_CODE: 3
};

export const useCodeViewerStore = defineStore('codeViewer', () => {
    const dataStore = useDataStore();

    const currentKernel = computed(() => dataStore.getCurrentKernel);

    const currentView = ref(CODE_VIEW.NONE);
    const currentBinary = ref(CODE_VIEW.SASS_CODE);

    const highlightedSourceLines = ref({});
    const highlightedBinaryLines = ref({});

    const highlightedSourceTokens = ref({});
    const highlightedBinaryTokens = ref({});

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

    function setSelectedLine(line) {
        resetHighlights();

        if (currentView.value === CODE_VIEW.SASS_CODE) {
            highlightedBinaryLines.value[line] = true;
            highlightedSourceLines.value[dataStore.getAnalysis().getSassToSourceLine(currentKernel.value, line)] = true;
        } else if (currentView.value === CODE_VIEW.PTX_CODE) {
            highlightedBinaryLines.value[line] = true;
            highlightedSourceLines.value[dataStore.getAnalysis().getPtxToSourceLine(currentKernel.value, line)] = true;
        } else if (currentView.value === CODE_VIEW.SOURCE_CODE) {
            highlightedSourceLines.value[line] = true;
            const lines =
                currentBinary.value === CODE_VIEW.SASS_CODE
                    ? dataStore.getAnalysis().getSourceToSassLines(currentKernel.value, line)
                    : dataStore.getAnalysis().getSourceToPtxLines(currentKernel.value, line);
            for (const line of lines) {
                highlightedBinaryLines.value[line] = true;
            }
        }
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
        setSelectedLine,
        setCurrentView
    };
});
