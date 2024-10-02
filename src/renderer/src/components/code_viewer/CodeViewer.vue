<template>
    <div class="grid h-full w-full grid-cols-[50%_50%] grid-rows-1 space-x-1 overflow-y-auto overflow-x-hidden">
        <CodeView
            :code-lines="dataStore.getGPUscoutResult().getSourceCodeLines(currentKernel)"
            :code-type="CODE_TYPE.SOURCE_CODE"
            :highlighted-lines="highlightedSourceLines"
            :highlighted-tokens="highlightedSourceTokens"
            :occurrence-lines="occurrenceSourceLines"
        />
        <CodeView
            v-if="currentBinary === CODE_TYPE.SASS_CODE"
            :code-lines="dataStore.getGPUscoutResult().getSassCodeLines(currentKernel)"
            :code-type="CODE_TYPE.SASS_CODE"
            :highlighted-lines="highlightedBinaryLines"
            :highlighted-tokens="highlightedBinaryTokens"
            :occurrence-lines="occurrenceBinaryLines"
        />
        <CodeView
            v-else
            :code-lines="dataStore.getGPUscoutResult().getPtxCodeLines(currentKernel)"
            :code-type="CODE_TYPE.PTX_CODE"
            :highlighted-lines="highlightedBinaryLines"
            :highlighted-tokens="highlightedBinaryTokens"
            :occurrence-lines="occurrenceBinaryLines"
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

const highlightedBinaryLines = computed(() => codeViewStore.getHighlightedBinaryLines);
const highlightedSourceLines = computed(() => codeViewStore.getHighlightedSourceLines);

const highlightedBinaryTokens = computed(() => codeViewStore.getHighlightedBinaryTokens);
const highlightedSourceTokens = computed(() => codeViewStore.getHighlightedSourceTokens);

const currentKernel = computed(() => dataStore.getCurrentKernel);
const currentBinary = computed(() => codeViewStore.getCurrentBinary);
</script>
