<template>
    <div class="grid h-full max-h-72 w-full grid-cols-[50%_50%] grid-rows-1 space-x-1 overflow-y-auto">
        <CodeView :code-lines="sourceCodeLines[kernels[0]]" :mode="CODE_VIEW.SOURCE_CODE" />
        <CodeView
            :code-lines="binaryView === CODE_VIEW.SASS_CODE ? sassCodeLines[kernels[0]] : ptxCodeLines[kernels[0]]"
            :mode="binaryView"
        />
    </div>
</template>
<script setup>
import CodeView from './CodeView.vue';
import { CODE_VIEW, useCodeViewerStore } from '../../stores/CodeViewerStore';
import { useDataStore } from '../../stores/DataStore';
import { computed } from 'vue';

const dataStore = useDataStore();
const codeViewStore = useCodeViewerStore();

const sourceCodeLines = dataStore.getSourceCodeLines();
const sassCodeLines = dataStore.getSassCodeLines();
const ptxCodeLines = dataStore.getPtxCodeLines();

const binaryView = computed(() => codeViewStore.getBinaryView);

const kernels = dataStore.getKernels();
</script>
