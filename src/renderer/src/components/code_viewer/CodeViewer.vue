<template>
    <div class="grid h-full max-h-72 w-full grid-cols-[50%_50%] grid-rows-1 space-x-1 overflow-y-auto">
        <CodeView :code-lines="sourceCodeLines[kernels[0]]" :mode="CODE_VIEW.SOURCE_CODE" />
        <CodeView :code-lines="sassCodeLines[kernels[0]]" :mode="CODE_VIEW.SASS_CODE" />
    </div>
</template>
<script setup>
import CodeView from './CodeView.vue';
import { CODE_VIEW } from '../../stores/CodeViewerStore';
import { useDataStore } from '../../stores/DataStore';

const dataStore = useDataStore();

const sourceCodeLines = dataStore.getSourceCodeLines();
const sassCodeLines = dataStore.getSassCodeLines();

const kernels = dataStore.getKernels();
</script>
