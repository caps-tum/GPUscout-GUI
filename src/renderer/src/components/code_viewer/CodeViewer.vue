<template>
    <div class="grid h-full max-h-72 w-full grid-cols-[50%_50%] grid-rows-1 space-x-1 overflow-y-auto">
        <CodeView
            :code-lines="dataStore.getGPUscoutResult().getSourceCodeLines(currentKernel)"
            :code-type="CODE_TYPE.SOURCE_CODE"
            :highlighted-lines="highlightedSourceLines"
            :highlighted-tokens="highlightedSourceTokens"
        />
        <CodeView
            v-if="currentBinary === CODE_TYPE.SASS_CODE"
            :code-lines="dataStore.getGPUscoutResult().getSassCodeLines(currentKernel)"
            :code-type="CODE_TYPE.SASS_CODE"
            :highlighted-lines="highlightedBinaryLines"
            :highlighted-tokens="highlightedBinaryTokens"
        />
        <CodeView
            v-else
            :code-lines="dataStore.getGPUscoutResult().getPtxCodeLines(currentKernel)"
            :code-type="CODE_TYPE.PTX_CODE"
            :highlighted-lines="highlightedBinaryLines"
            :highlighted-tokens="highlightedBinaryTokens"
        />
    </div>
    <button @click="switc">Switch</button>
</template>
<script setup>
import CodeView from './CodeView.vue';
import { CODE_TYPE, useCodeViewerStore } from '../../stores/CodeViewerStore';
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
    if (currentBinary.value === CODE_TYPE.PTX_CODE) {
        codeViewStore.setCurrentBinary(CODE_TYPE.SASS_CODE);
    } else {
        codeViewStore.setCurrentBinary(CODE_TYPE.PTX_CODE);
    }
}
</script>
