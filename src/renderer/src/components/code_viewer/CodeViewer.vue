<!--
Component for the code viewer. Shows source code on the left and SASS or PTX on the right, depending on analysis.

Author: Tobias Stuckenberger
-->
<template>
    <div class="grid h-full w-full grid-cols-[50%_50%] grid-rows-1 overflow-y-auto overflow-x-hidden rounded">
        <CodeView
            :code-lines="useComparisonCode ? comparisonSourceLines : sourceLines"
            :code-type="CODE_TYPE.SOURCE_CODE"
            :highlighted-lines="highlightedSourceLines"
            :highlighted-tokens="highlightedSourceTokens"
            :scroll-to-lines="scrollToSourceLines"
            :occurrence-lines="occurrenceSourceLines"
            :info-lines="infoOccurrenceSourceLines"
            :current-view="currentView"
        />
        <CodeView
            :code-lines="
                currentBinary === CODE_TYPE.SASS_CODE
                    ? useComparisonCode
                        ? comparisonSassLines
                        : sassLines
                    : useComparisonCode
                      ? comparisonPtxLines
                      : ptxLines
            "
            :code-type="currentBinary"
            :highlighted-lines="highlightedBinaryLines"
            :highlighted-tokens="highlightedBinaryTokens"
            :scroll-to-lines="scrollToBinaryLines"
            :occurrence-lines="occurrenceBinaryLines"
            :info-lines="infoOccurrenceBinaryLines"
            :current-view="currentView"
        />
    </div>
</template>
<script setup>
import CodeView from './CodeView.vue';
import { CODE_TYPE, useCodeViewerStore } from '../../stores/CodeViewerStore';
import { useDataStore } from '../../stores/DataStore';
import { computed } from 'vue';

const dataStore = useDataStore();
const codeViewStore = useCodeViewerStore();

const occurrenceBinaryLines = computed(() => codeViewStore.getOccurrenceBinaryLines);
const occurrenceSourceLines = computed(() => codeViewStore.getOccurrenceSourceLines);

const infoOccurrenceBinaryLines = computed(() => codeViewStore.getInfoOccurrenceBinaryLines);
const infoOccurrenceSourceLines = computed(() => codeViewStore.getInfoOccurrenceSourceLines);

const scrollToSourceLines = computed(() => codeViewStore.getScrollToSourceLines);
const scrollToBinaryLines = computed(() => codeViewStore.getScrollToBinaryLines);

const highlightedBinaryLines = computed(() => codeViewStore.getHighlightedBinaryLines);
const highlightedSourceLines = computed(() => codeViewStore.getHighlightedSourceLines);

const highlightedBinaryTokens = computed(() => codeViewStore.getHighlightedBinaryTokens);
const highlightedSourceTokens = computed(() => codeViewStore.getHighlightedSourceTokens);

const currentKernel = computed(() => dataStore.getCurrentKernel);
const currentBinary = computed(() => codeViewStore.getCurrentBinary);
const currentView = computed(() => codeViewStore.getCurrentView);
const useComparisonCode = computed(() => codeViewStore.displayComparisonCode);

const sourceLines = computed(() => dataStore.getGPUscoutResult().getSourceCodeLines(currentKernel.value));
const sassLines = computed(() => dataStore.getGPUscoutResult().getSassCodeLines(currentKernel.value));
const ptxLines = computed(() => dataStore.getGPUscoutResult().getPtxCodeLines(currentKernel.value));

const comparisonSourceLines = computed(() =>
    dataStore.getGPUscoutComparisonResult()?.getSourceCodeLines(currentKernel.value)
);
const comparisonSassLines = computed(() => dataStore.getGPUscoutComparisonResult()?.getSassCodeLines(currentKernel.value));
const comparisonPtxLines = computed(() => dataStore.getGPUscoutComparisonResult()?.getPtxCodeLines(currentKernel.value));
</script>
