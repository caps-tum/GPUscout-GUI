import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { SOURCE_CODE_COLORS } from '../globals/colors';

export const CODE_VIEW = {
  NONE: 0,
  SOURCE_CODE: 1,
  BINARY_CODE: 2
};

export const useCodeViewerStore = defineStore('codeViewer', () => {
  const currentView = ref(CODE_VIEW.NONE);
  const selectedLine = ref(0);
  const highlightedLines = ref([]);

  const sourceTokenHighlightRules = ref([
    [(token) => ['const'].includes(token), SOURCE_CODE_COLORS.ORANGE]
  ]);
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
    highlightedLines.value.push(line);
    highlightedLines.value.push(line + 1);
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
