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

    const currentView = ref(CODE_VIEW.NONE);
    const binaryView = ref(CODE_VIEW.PTX_CODE);
    const selectedLine = ref(0);
    const highlightedLines = ref([]);

    const getCurrentView = computed(() => currentView.value);
    const getBinaryView = computed(() => binaryView.value);

    const getSelectedLine = computed(() => selectedLine.value);
    const getHighlightedLines = computed(() => highlightedLines.value);

    function setCurrentView(view) {
        currentView.value = view;
    }

    function setSelectedLine(line) {
        selectedLine.value = line;
        highlightedLines.value = highlightedLines.value.filter(() => false);

        if (currentView.value === CODE_VIEW.SASS_CODE) {
            highlightedLines.value.push(dataStore.getSassToSourceLines()[dataStore.getKernels()[0]][line]);
        } else if (currentView.value === CODE_VIEW.PTX_CODE) {
            highlightedLines.value.push(dataStore.getPtxToSourceLines()[dataStore.getKernels()[0]][line]);
        } else if (currentView.value === CODE_VIEW.SOURCE_CODE) {
            const lines =
                binaryView.value === CODE_VIEW.SASS_CODE
                    ? dataStore.getSassToSourceLines()
                    : dataStore.getPtxToSourceLines();
            for (const l of Object.entries(lines[dataStore.getKernels()[0]])
                .filter(([, sourceLine]) => sourceLine === line)
                .map(([binaryLine]) => parseInt(binaryLine))) {
                highlightedLines.value.push(l);
            }
        }
    }

    return {
        getCurrentView,
        getBinaryView,
        getSelectedLine,
        getHighlightedLines,
        setCurrentView,
        setSelectedLine
    };
});
