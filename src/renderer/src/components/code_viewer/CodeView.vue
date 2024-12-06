<template>
    <div class="relative flex h-full w-full flex-col bg-secondary/50">
        <p v-if="codeType === CODE_TYPE.SOURCE_CODE">Source Code</p>
        <p v-else-if="codeType === CODE_TYPE.SASS_CODE">SASS Code</p>
        <p v-if="codeType === CODE_TYPE.PTX_CODE">PTX Code</p>
        <div class="relative flex h-full w-full flex-col overflow-x-auto">
            <CodeLine
                v-for="line in codeLines"
                :key="line"
                :tokens="line.tokens"
                :line-number="line.address"
                :file-line-number="line.fileAddress"
                :live-registers="line.liveRegisters"
                :code-type="codeType"
                :highlighted-lines="highlightedLines"
                :highlighted-tokens="highlightedTokens"
                :scroll-to-lines="scrollToLines"
                :has-stalls="codeType !== CODE_TYPE.PTX_CODE && Object.keys(line.stalls).length > 0"
                :is-occurrence="occurrenceLines.includes(line.address)"
                :is-info="infoLines.includes(line.address)"
                :current-view="currentView"
                :selected-occurrences="selectedOccurrences"
                :show-live-registers="displayLiveRegisters && codeType === CODE_TYPE.SASS_CODE"
            />
            <div class="relative m-0 flex min-h-0 grow space-x-1">
                <p class="sticky left-0 top-0 w-16 shrink-0 select-none bg-secondary px-1"></p>
            </div>
        </div>
    </div>
</template>
<script setup>
import { CODE_TYPE, useCodeViewerStore } from '../../stores/CodeViewerStore';
import { useDataStore } from '../../stores/DataStore';
import CodeLine from './parts/CodeLine.vue';
import { computed } from 'vue';

defineProps({
    codeType: Number,
    codeLines: Array,
    highlightedLines: Object,
    highlightedTokens: Object,
    scrollToLines: Array,
    occurrenceLines: Array,
    infoLines: Array,
    currentView: Number
});

const dataStore = useDataStore();
const codeViewerStore = useCodeViewerStore();

const selectedOccurrences = computed(() => dataStore.getCurrentOccurrences);
const displayLiveRegisters = computed(() => codeViewerStore.getSassRegistersVisible);
</script>
<style scoped>
p {
    @apply sticky top-0 z-10 bg-secondary text-center text-text;
}
</style>
