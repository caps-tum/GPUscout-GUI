import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { SOURCE_CODE_COLORS } from '../globals/colors';
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
    const selectedLine = ref(0);
    const highlightedLines = ref([]);

    const sourceTokenHighlightRules = ref([[(token) => ['const'].includes(token), SOURCE_CODE_COLORS.ORANGE]]);
    const sassTokenHighlightRules = ref([]);

    const getCurrentView = computed(() => currentView.value);

    const getSelectedLine = computed(() => selectedLine.value);
    const getHighlightedLines = computed(() => highlightedLines.value);
    const getSourceTokenHighlightRules = computed(() => sourceTokenHighlightRules.value);
    const getSassTokenHighlightRules = computed(() => sassTokenHighlightRules.value);

    function setCurrentView(view) {
        currentView.value = view;
    }

    function setSelectedLine(line) {
        selectedLine.value = line;
        highlightedLines.value = highlightedLines.value.filter(() => false);

        if (currentView.value === CODE_VIEW.SASS_CODE) {
            highlightedLines.value.push(dataStore.getSassToSourceLines()[dataStore.getKernels()[0]][line]);
        } else if (currentView.value === CODE_VIEW.SOURCE_CODE) {
            for (const l of Object.entries(dataStore.getSassToSourceLines()[dataStore.getKernels()[0]])
                .filter(([, sourceLine]) => sourceLine === line)
                .map(([sassLine]) => sassLine)) {
                highlightedLines.value.push(l);
            }
        }
    }

    return {
        getCurrentView,
        getSelectedLine,
        getHighlightedLines,
        getSourceTokenHighlightRules,
        getSassTokenHighlightRules,
        setCurrentView,
        setSelectedLine
    };
});
