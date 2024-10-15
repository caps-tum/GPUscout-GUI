import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useDataStore } from './DataStore';
import { BINARY_TOKEN_HIGHLIGHT_COLORS, CODE_STYLES } from '../../../config/colors';

export const CODE_TYPE = {
    NONE: 0,
    SOURCE_CODE: 1,
    SASS_CODE: 2,
    PTX_CODE: 3
};

export const useCodeViewerStore = defineStore('codeViewer', () => {
    const dataStore = useDataStore();

    const currentKernel = computed(() => dataStore.getCurrentKernel);
    const currentOccurrences = computed(() => dataStore.getCurrentOccurrences);

    const currentView = ref(CODE_TYPE.NONE);
    const currentBinary = ref(CODE_TYPE.SASS_CODE);
    const selectedLine = ref('');

    const occurrenceSourceLines = ref([]);
    const occurrenceBinaryLines = ref([]);

    const scrollToSourceLines = ref([]);
    const scrollToBinaryLines = ref([]);

    const highlightedSourceLines = ref({});
    const highlightedBinaryLines = ref({});

    const highlightedSourceTokens = ref({});
    const highlightedBinaryTokens = ref({});

    const getSelectedLine = computed(() => selectedLine.value);

    const getOccurrenceSourceLines = computed(() => occurrenceSourceLines.value);
    const getOccurrenceBinaryLines = computed(() => occurrenceBinaryLines.value);

    const getScrollToSourceLines = computed(() => scrollToSourceLines.value);
    const getScrollToBinaryLines = computed(() => scrollToBinaryLines.value);

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
        if (currentBinary.value !== binary) {
            selectedLine.value = '';
            resetHighlights();
            resetOccurrenceLines();
        }
        currentBinary.value = binary;
    }

    function setOccurrenceLines(sourceLines, binaryLines) {
        resetOccurrenceLines();
        occurrenceSourceLines.value = sourceLines;
        occurrenceBinaryLines.value = binaryLines;
    }

    /**
     * @param {String|Number} line The line number to select
     * @param {Boolean} scrollTo If the line should be scrolled to in the current view
     */
    function setSelectedLine(line, scrollTo = false) {
        resetHighlights();
        if (selectedLine.value === line) {
            selectedLine.value = '';
            dataStore.setCurrentOccurrences(currentView.value, '');
            return;
        }
        selectedLine.value = line;

        // Highlight the current line in the current code view and the corresponding lines in the other code view
        if (currentView.value === CODE_TYPE.SASS_CODE) {
            highlightedBinaryLines.value[line] = CODE_STYLES.SELECTED_LINE;
            highlightedSourceLines.value[dataStore.getGPUscoutResult().getSassToSourceLine(currentKernel.value, line)] =
                CODE_STYLES.SELECTED_LINE_SECONDARY;

            scrollToSourceLines.value.push(dataStore.getGPUscoutResult().getSassToSourceLine(currentKernel.value, line));
            if (scrollTo) {
                scrollToBinaryLines.value.push(line);
            }
        } else if (currentView.value === CODE_TYPE.PTX_CODE) {
            highlightedBinaryLines.value[line] = CODE_STYLES.SELECTED_LINE;
            highlightedSourceLines.value[dataStore.getGPUscoutResult().getPtxToSourceLine(currentKernel.value, line)] =
                CODE_STYLES.SELECTED_LINE_SECONDARY;

            scrollToSourceLines.value.push(dataStore.getGPUscoutResult().getPtxToSourceLine(currentKernel.value, line));
            if (scrollTo) {
                scrollToBinaryLines.value.push(line);
            }
        } else if (currentView.value === CODE_TYPE.SOURCE_CODE) {
            highlightedSourceLines.value[line] = CODE_STYLES.SELECTED_LINE;
            const lines =
                currentBinary.value === CODE_TYPE.SASS_CODE
                    ? dataStore.getGPUscoutResult().getSourceToSassLines(currentKernel.value, line)
                    : dataStore.getGPUscoutResult().getSourceToPtxLines(currentKernel.value, line);
            for (const line of lines) {
                highlightedBinaryLines.value[line] = CODE_STYLES.SELECTED_LINE_SECONDARY;
            }

            scrollToBinaryLines.value.push(lines[0]);
            if (scrollTo) {
                scrollToSourceLines.value.push(line);
            }
        }

        dataStore.setCurrentOccurrences(currentView.value, line);
        // If a binary line has been selected, highlight the instruction
        if (currentView.value !== CODE_TYPE.SOURCE_CODE) {
            highlightedBinaryTokens.value[line] = {};
            for (const token of dataStore
                .getGPUscoutResult()
                .getInstructionTokens(currentKernel.value, currentView.value, line)) {
                highlightedBinaryTokens.value[line][token] = BINARY_TOKEN_HIGHLIGHT_COLORS[0];
            }
        }

        // Highlight the base lines of all selected occurrences
        for (const occurrence of currentOccurrences.value) {
            highlightedSourceLines.value[occurrence.sourceLineNumber] =
                currentView.value === CODE_TYPE.SOURCE_CODE
                    ? CODE_STYLES.HIGHLIGHTED_LINE_OCCURRENCE
                    : CODE_STYLES.HIGHLIGHTED_LINE_OCCURRENCE_SECONDARY;
            highlightedBinaryLines.value[occurrence.binaryLineNumber] =
                currentView.value !== CODE_TYPE.SOURCE_CODE
                    ? CODE_STYLES.HIGHLIGHTED_LINE_OCCURRENCE
                    : CODE_STYLES.HIGHLIGHTED_LINE_OCCURRENCE_SECONDARY;
        }

        // Only highlight binary stuff if only one occurrence is selected
        // (a line with an occurrence in the binary view is selected and not in the source code)
        if (!currentOccurrences.value.length !== 1) {
            return;
        }

        for (const [tokenLine, token] of Object.entries(currentOccurrences.value[0].tokensToHighlight())) {
            let keys = highlightedBinaryTokens.value[tokenLine]
                ? Object.keys(highlightedBinaryTokens.value[tokenLine]).length
                : 0;
            if (keys === 0) {
                highlightedBinaryTokens.value[tokenLine] = {};
            }

            highlightedBinaryTokens.value[tokenLine][token] = BINARY_TOKEN_HIGHLIGHT_COLORS[0];
        }
        for (const secondaryLine of currentOccurrences.value[0].linesToHighlight()) {
            highlightedBinaryLines.value[secondaryLine] = CODE_STYLES.HIGHLIGHTED_LINE_OCCURRENCE_SECONDARY;
        }
    }

    function updateSelectedLine() {
        setSelectedLine(selectedLine.value);
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
        scrollToSourceLines.value = scrollToSourceLines.value.filter(() => false);
        scrollToBinaryLines.value = scrollToBinaryLines.value.filter(() => false);
    }

    return {
        getCurrentView,
        getCurrentBinary,
        getHighlightedSourceLines,
        getHighlightedBinaryTokens,
        getHighlightedBinaryLines,
        getHighlightedSourceTokens,
        getScrollToBinaryLines,
        getScrollToSourceLines,
        setCurrentBinary,
        setOccurrenceLines,
        getSelectedLine,
        setSelectedLine,
        setCurrentView,
        resetHighlights,
        getOccurrenceBinaryLines,
        getOccurrenceSourceLines,
        resetOccurrenceLines,
        updateSelectedLine
    };
});
