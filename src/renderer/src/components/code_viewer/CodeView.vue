<template>
    <div class="relative flex h-full w-full flex-col overflow-x-auto bg-secondary/50">
        <p v-if="codeType === CODE_TYPE.SOURCE_CODE">Source Code</p>
        <p v-else-if="codeType === CODE_TYPE.SASS_CODE">SASS Code</p>
        <p v-if="codeType === CODE_TYPE.PTX_CODE">PTX Code</p>
        <CodeLine
            v-for="line in codeLines"
            :key="line.address"
            :tokens="line.tokens"
            :line-number="line.address"
            :live-registers="line.liveRegisters"
            :code-type="codeType"
            :highlighted-lines="highlightedLines"
            :highlighted-tokens="highlightedTokens"
            :has-stalls="Object.keys(line.stalls).length > 0 || false"
            :is-occurrence="occurrenceLines.includes(line.address)"
            :current-view="currentView"
            :selected-occurrences="selectedOccurrences"
        />
    </div>
</template>
<script setup>
import { CODE_TYPE } from '../../stores/CodeViewerStore';
import { useDataStore } from '../../stores/DataStore';
import CodeLine from './parts/CodeLine.vue';
import { computed } from 'vue';

defineProps({
    codeType: Number,
    codeLines: Array,
    highlightedLines: Object,
    highlightedTokens: Object,
    occurrenceLines: Array,
    currentView: Number
});

const dataStore = useDataStore();

const selectedOccurrences = computed(() => dataStore.getCurrentOccurrences);
</script>
<style scoped>
p {
    @apply sticky top-0 z-10 bg-secondary text-center text-text;
}

div {
    scrollbar-color: rgb(150, 142, 224) transparent;
}
</style>
