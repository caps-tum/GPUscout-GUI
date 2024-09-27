<template>
    <div class="grid h-full max-h-72 w-full grid-cols-[50%_50%] grid-rows-1 space-x-1 overflow-y-auto">
        <CodeView
            :code-lines="dataStore.getAnalysis().getSourceCodeLines(currentKernel)"
            :code-type="CODE_VIEW.SOURCE_CODE"
            :highlighted-lines="highlightedSourceLines"
            :highlighted-tokens="highlightedSourceTokens"
        />
        <CodeView
            v-if="currentBinary === CODE_VIEW.SASS_CODE"
            :code-lines="dataStore.getAnalysis().getSassCodeLines(currentKernel)"
            :code-type="CODE_VIEW.SASS_CODE"
            :highlighted-lines="highlightedBinaryLines"
            :highlighted-tokens="highlightedBinaryTokens"
        />
        <CodeView
            v-else
            :code-lines="dataStore.getAnalysis().getPtxCodeLines(currentKernel)"
            :code-type="CODE_VIEW.PTX_CODE"
            :highlighted-lines="highlightedBinaryLines"
            :highlighted-tokens="highlightedBinaryTokens"
        />
    </div>
    <button @click="switc">Switch</button>
</template>
<script setup>
import CodeView from './CodeView.vue';
import { CODE_VIEW, useCodeViewerStore } from '../../stores/CodeViewerStore';
import { useDataStore } from '../../stores/DataStore';
import { computed } from 'vue';

const dataStore = useDataStore();
const codeViewStore = useCodeViewerStore();

const highlightedBinaryLines = computed(() => codeViewStore.getHighlightedBinaryLines);
const highlightedSourceLines = computed(() => codeViewStore.getHighlightedSourceLines);

const highlightedBinaryTokens = computed(() => codeViewStore.getHighlightedBinaryTokens);
const highlightedSourceTokens = computed(() => codeViewStore.getHighlightedSourceTokens);

const currentKernel = computed(() => dataStore.getCurrentKernel);
const currentBinary = computed(() => codeViewStore.getCurrentBinary);

function switc() {
    if (currentBinary.value === CODE_VIEW.PTX_CODE) {
        codeViewStore.setCurrentBinary(CODE_VIEW.SASS_CODE);
    } else {
        codeViewStore.setCurrentBinary(CODE_VIEW.PTX_CODE);
    }
}
</script>
