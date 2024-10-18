<template>
    <div class="relative flex h-full w-full flex-col bg-secondary/50">
        <p v-if="codeType === CODE_TYPE.SOURCE_CODE">Source Code</p>
        <p v-else-if="codeType === CODE_TYPE.SASS_CODE">SASS Code</p>
        <p v-if="codeType === CODE_TYPE.PTX_CODE">PTX Code</p>
        <div class="flex h-full w-full flex-col overflow-x-auto">
            <CodeLine
                v-for="line in codeLines"
                ref="lines"
                :key="line"
                :tokens="line.tokens"
                :line-number="line.address"
                :live-registers="line.liveRegisters"
                :code-type="codeType"
                :highlighted-lines="highlightedLines"
                :highlighted-tokens="highlightedTokens"
                :scroll-to-lines="scrollToLines"
                :has-stalls="codeType === CODE_TYPE.SASS_CODE && Object.keys(line.stalls).length > 0"
                :is-occurrence="occurrenceLines.includes(line.address)"
                :current-view="currentView"
                :selected-occurrences="selectedOccurrences"
                :show-live-registers="displayLiveRegisters && codeType === CODE_TYPE.SASS_CODE"
            />
        </div>
    </div>
</template>
<script setup>
import { CODE_TYPE, useCodeViewerStore } from '../../stores/CodeViewerStore';
import { useDataStore } from '../../stores/DataStore';
import CodeLine from './parts/CodeLine.vue';
import { computed, ref } from 'vue';

defineProps({
    codeType: Number,
    codeLines: Array,
    highlightedLines: Object,
    highlightedTokens: Object,
    scrollToLines: Array,
    occurrenceLines: Array,
    currentView: Number
});

const dataStore = useDataStore();
const codeViewerStore = useCodeViewerStore();

const selectedOccurrences = computed(() => dataStore.getCurrentOccurrences);
const displayLiveRegisters = computed(() => codeViewerStore.getSassRegistersVisible);
const lines = ref(null);
</script>
<style scoped>
p {
    @apply sticky top-0 z-10 bg-secondary text-center text-text;
}
</style>
