<template>
    <div class="relative flex h-full w-full flex-col overflow-x-auto bg-secondary/50">
        <CodeLine
            v-for="line in codeLines"
            :key="line.address"
            :tokens="line.tokens"
            :line-number="line.address"
            :code-type="codeType"
            :highlighted-lines="highlightedLines"
            :highlighted-tokens="highlightedTokens"
            :is-occurrence="occurrenceLines.includes(line.address)"
            :current-view="currentView"
            :selected-occurrence="selectedOccurrence"
        />
    </div>
</template>
<script setup>
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

const selectedOccurrence = computed(() => dataStore.getCurrentOccurrence);
</script>
