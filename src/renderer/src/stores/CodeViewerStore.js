/**
 * @module
 * @author Tobias Stuckenberger
 * @description This module defines the codeViewerStore
 */
import { defineStore } from 'pinia';
import { computed, nextTick, ref } from 'vue';
import { useDataStore } from './DataStore';
import { CODE_BINARY_TOKEN_COLORS, CODE_STYLES } from '../../../config/colors.js';

/**
 * An enum of all available code types
 * @type {Object.<String, Number>}
 */
export const CODE_TYPE = {
    NONE: 0,
    SOURCE_CODE: 1,
    SASS_CODE: 2,
    PTX_CODE: 3
};

/**
 * The code viewer store handles all component-spanning responsibilities that are part of the code viewer component.
 * This includes highlighting and scrolling of code lines, as well as switching between code versions, among other things.
 */
export const useCodeViewerStore = defineStore('codeViewer', () => {
    const dataStore = useDataStore();

    const currentKernel = computed(() => dataStore.getCurrentKernel);
    const currentOccurrences = computed(() => dataStore.getCurrentOccurrences);
    const currentAnalysis = computed(() => dataStore.getCurrentAnalysis);

    const currentView = ref(CODE_TYPE.NONE);
    const currentBinary = ref(CODE_TYPE.SASS_CODE);
    const sassRegistersVisible = ref(false);
    const selectedLine = ref('');
    const useComparisonCode = ref(false);

    const currentSourceFile = ref('');

    const occurrenceSourceLines = ref([]);
    const occurrenceBinaryLines = ref([]);

    const infoOccurrenceSourceLines = ref([]);
    const infoOccurrenceBinaryLines = ref([]);

    const scrollToSourceLines = ref([]);
    const scrollToBinaryLines = ref([]);

    const highlightedSourceLines = ref({});
    const highlightedBinaryLines = ref({});

    const highlightedSourceTokens = ref({});
    const highlightedBinaryTokens = ref({});

    const getSelectedLine = computed(() => selectedLine.value);
    const getSassRegistersVisible = computed(() => sassRegistersVisible.value);
    const displayComparisonCode = computed(() => useComparisonCode.value);

    const getCurrentSourceFile = computed(() => currentSourceFile.value);

    const getOccurrenceSourceLines = computed(() => occurrenceSourceLines.value);
    const getOccurrenceBinaryLines = computed(() => occurrenceBinaryLines.value);

    const getInfoOccurrenceSourceLines = computed(() => infoOccurrenceSourceLines.value);
    const getInfoOccurrenceBinaryLines = computed(() => infoOccurrenceBinaryLines.value);

    const getScrollToSourceLines = computed(() => scrollToSourceLines.value);
    const getScrollToBinaryLines = computed(() => scrollToBinaryLines.value);

    const getCurrentView = computed(() => currentView.value);
    const getCurrentBinary = computed(() => currentBinary.value);

    const getHighlightedSourceLines = computed(() => highlightedSourceLines.value);
    const getHighlightedBinaryLines = computed(() => highlightedBinaryLines.value);

    const getHighlightedSourceTokens = computed(() => highlightedSourceTokens.value);
    const getHighlightedBinaryTokens = computed(() => highlightedBinaryTokens.value);

    /**
     * Toggles the use of comparison code in the code viewer
     * @param {Boolean} useComparison
     */
    function setUseComparisonCode(useComparison) {
        useComparisonCode.value = useComparison;
        resetHighlights();
        resetOccurrenceLines();
        selectedLine.value = '';
        dataStore.setCurrentOccurrences(currentView.value, '');
        dataStore.setCurrentAnalysis(currentAnalysis.value);
    }

    /**
     * @param {String} fileName The name of the source file that sould be displayed
     */
    function setCurrentSourceFile(fileName) {
        currentSourceFile.value = fileName;
        setSelectedLine(selectedLine.value);
    }

    /**
     * @param {Boolean} visible If SASS register information should be visible
     */
    function setSassRegisterVisibility(visible) {
        sassRegistersVisible.value = visible;
    }

    /**
     * @param {String} view The currently selected code view
     */
    function setCurrentView(view) {
        if (currentView.value === view) return;
        currentView.value = view;
    }

    /**
     * @param {String} binary The currently visible binary code
     */
    function setCurrentBinary(binary) {
        if (currentBinary.value !== binary) {
            selectedLine.value = '';
            resetHighlights();
            resetOccurrenceLines();
        }
        currentBinary.value = binary;
    }

    /**
     * @param {Array[]} sourceLines The source lines associated with the current occurrence
     * @param {Array[]|Number[]} binaryLines The binary lines associated with the current occurrence
     */
    function setOccurrenceLines(sourceLines, binaryLines, infoSourceLines, infoBinaryLines) {
        resetOccurrenceLines();
        occurrenceSourceLines.value = sourceLines;
        occurrenceBinaryLines.value = binaryLines;
        infoOccurrenceSourceLines.value = infoSourceLines;
        infoOccurrenceBinaryLines.value = infoBinaryLines;
    }

    /**
     * @param {String|Number} line The line number to select
     * @param {Boolean} scrollToCurrentView If the line should be scrolled to in the current view
     */
    async function setSelectedLine(line, scrollToCurrentView = false) {
        resetHighlights();
        if (selectedLine.value === line) {
            selectedLine.value = '';
            dataStore.setCurrentOccurrences(currentView.value, '');
            return;
        }
        const gpuscoutResult = displayComparisonCode.value
            ? dataStore.getGPUscoutComparisonResult()
            : dataStore.getGPUscoutResult();
        selectedLine.value = line;

        if (currentView.value === CODE_TYPE.SASS_CODE && gpuscoutResult.getSassToSourceLine(currentKernel.value, line)) {
            currentSourceFile.value = gpuscoutResult.getSassToSourceLine(currentKernel.value, line)[0];
            await nextTick();
        } else if (
            currentView.value === CODE_TYPE.PTX_CODE &&
            gpuscoutResult.getPtxToSourceLine(currentKernel.value, line)
        ) {
            currentSourceFile.value = gpuscoutResult.getPtxToSourceLine(currentKernel.value, line)[0];
            await nextTick();
        }

        // Highlight the current line in the current code view and the corresponding lines in the other code view
        if (currentView.value === CODE_TYPE.SASS_CODE) {
            highlightedBinaryLines.value[line] = CODE_STYLES.SELECTED_LINE;
            if (gpuscoutResult.getSassToSourceLine(currentKernel.value, line)) {
                highlightedSourceLines.value[gpuscoutResult.getSassToSourceLine(currentKernel.value, line)[1]] =
                    CODE_STYLES.SELECTED_LINE_SECONDARY;

                scrollToSourceLines.value.push(gpuscoutResult.getSassToSourceLine(currentKernel.value, line)[1]);
            }
            if (scrollToCurrentView) {
                scrollToBinaryLines.value.push(line);
            }
        } else if (currentView.value === CODE_TYPE.PTX_CODE) {
            highlightedBinaryLines.value[line] = CODE_STYLES.SELECTED_LINE;
            if (gpuscoutResult.getPtxToSourceLine(currentKernel.value, line)) {
                highlightedSourceLines.value[gpuscoutResult.getPtxToSourceLine(currentKernel.value, line)[1]] =
                    CODE_STYLES.SELECTED_LINE_SECONDARY;

                scrollToSourceLines.value.push(gpuscoutResult.getPtxToSourceLine(currentKernel.value, line)[1]);
            }
            if (scrollToCurrentView) {
                scrollToBinaryLines.value.push(line);
            }
        } else if (currentView.value === CODE_TYPE.SOURCE_CODE) {
            highlightedSourceLines.value[line] = CODE_STYLES.SELECTED_LINE;
            const lines =
                currentBinary.value === CODE_TYPE.SASS_CODE
                    ? gpuscoutResult.getSourceToSassLines(currentKernel.value, line, currentSourceFile.value)
                    : gpuscoutResult.getSourceToPtxLines(currentKernel.value, line, currentSourceFile.value);
            for (const line of lines) {
                highlightedBinaryLines.value[line] = CODE_STYLES.SELECTED_LINE_SECONDARY;
            }

            // scrollToBinaryLines.value.push(lines[0]);
            if (scrollToCurrentView) {
                scrollToSourceLines.value.push(line);
            }
        }

        dataStore.setCurrentOccurrences(currentView.value, line, currentSourceFile.value);

        // Highlight the base lines of all selected occurrences
        for (const occurrence of currentOccurrences.value) {
            const color = occurrence.isWarning ? CODE_STYLES.HIGHLIGHTED_LINE_OCCURRENCE : CODE_STYLES.HIGHLIGHTED_LINE_INFO;
            highlightedSourceLines.value[occurrence.sourceLineNumber] = color;
            highlightedBinaryLines.value[occurrence.binaryLineNumber] = color;
            // Highlight the instruction
            highlightedBinaryTokens.value[occurrence.binaryLineNumber] = {};
            for (const token of gpuscoutResult.getInstructionTokens(
                currentKernel.value,
                currentBinary.value,
                occurrence.binaryLineNumber
            )) {
                highlightedBinaryTokens.value[occurrence.binaryLineNumber][token] = CODE_BINARY_TOKEN_COLORS.INSTRUCTION;
            }
        }

        // Only highlight binary stuff if only one occurrence is selected
        // (a line with an occurrence in the binary view is selected and not in the source code)
        // Also scroll to the occurrence in the sass code if we are in source code view
        if (currentOccurrences.value.length !== 1) {
            if (currentView.value === CODE_TYPE.SOURCE_CODE) {
                const lines =
                    currentBinary.value === CODE_TYPE.SASS_CODE
                        ? gpuscoutResult.getSourceToSassLines(currentKernel.value, line, currentSourceFile.value)
                        : gpuscoutResult.getSourceToPtxLines(currentKernel.value, line, currentSourceFile.value);
                scrollToBinaryLines.value.push(lines.toSorted()[0]);
            }
            return;
        } else {
            if (currentView.value === CODE_TYPE.SOURCE_CODE) {
                scrollToBinaryLines.value.push(currentOccurrences.value[0].binaryLineNumber);
            }
        }

        // Highlight all relevant tokens for this occurrence
        for (const [tokenLine, tokens] of Object.entries(currentOccurrences.value[0].tokensToHighlight())) {
            if (!highlightedBinaryTokens.value[tokenLine]) {
                highlightedBinaryTokens.value[tokenLine] = {};
            }
            for (const [token, color] of Object.entries(tokens)) {
                highlightedBinaryTokens.value[tokenLine][token] = color;
            }
        }

        // Highlight all relevant secondary lines for this occurrence as well as the instruction in each line
        const tempHighlightedBinaryTokens = JSON.parse(JSON.stringify(highlightedBinaryTokens.value));
        const tempHighlightedSourceLines = JSON.parse(JSON.stringify(highlightedSourceLines.value));
        for (const secondaryLine of currentOccurrences.value[0].linesToHighlight().filter((_, i) => i < 50)) {
            const color = currentOccurrences.value[0].isWarning
                ? CODE_STYLES.HIGHLIGHTED_LINE_OCCURRENCE_SECONDARY
                : CODE_STYLES.HIGHLIGHTED_LINE_INFO_SECONDARY;
            tempHighlightedBinaryTokens[secondaryLine] = color;

            if (currentBinary.value === CODE_TYPE.SASS_CODE) {
                tempHighlightedSourceLines[gpuscoutResult.getSassToSourceLine(currentKernel.value, secondaryLine)[1]] =
                    color;
            } else {
                tempHighlightedSourceLines[gpuscoutResult.getPtxToSourceLine(currentKernel.value, secondaryLine)[1]] = color;
            }
            tempHighlightedSourceLines[currentOccurrences.value[0].sourceLineNumber] = currentOccurrences.value[0].isWarning
                ? CODE_STYLES.HIGHLIGHTED_LINE_OCCURRENCE
                : CODE_STYLES.HIGHLIGHTED_LINE_INFO;

            tempHighlightedBinaryTokens[secondaryLine] = {};
            for (const token of gpuscoutResult.getInstructionTokens(
                currentKernel.value,
                currentBinary.value,
                secondaryLine
            )) {
                tempHighlightedBinaryTokens[secondaryLine][token] = CODE_BINARY_TOKEN_COLORS.INSTRUCTION;
            }
        }
        highlightedSourceLines.value = tempHighlightedSourceLines;
        highlightedBinaryTokens.value = tempHighlightedBinaryTokens;
    }

    /**
     * Refresh the value of the selected line
     */
    function updateSelectedLine() {
        setSelectedLine(selectedLine.value);
    }

    /**
     * Clear all highlighted lines of the current occurrence
     */
    function resetOccurrenceLines() {
        occurrenceSourceLines.value = occurrenceSourceLines.value.filter(() => false);
        occurrenceBinaryLines.value = occurrenceBinaryLines.value.filter(() => false);
        infoOccurrenceSourceLines.value = infoOccurrenceSourceLines.value.filter(() => false);
        infoOccurrenceBinaryLines.value = infoOccurrenceBinaryLines.value.filter(() => false);
    }

    /**
     * Reset all highlights of lines and tokens
     */
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
        displayComparisonCode,
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
        updateSelectedLine,
        setUseComparisonCode,
        getSassRegistersVisible,
        setSassRegisterVisibility,
        getInfoOccurrenceBinaryLines,
        getInfoOccurrenceSourceLines,
        getCurrentSourceFile,
        setCurrentSourceFile
    };
});
