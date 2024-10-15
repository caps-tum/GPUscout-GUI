<template>
    <div class="flex flex-col">
        <template v-for="occurrence of occurrences" :key="occurrence">
            <p class="sticky top-0 rounded-t bg-secondary p-1 text-center text-text">
                {{ occurrence?.title() || 'No title' }}
            </p>
            <p class="whitespace-pre-line p-1" v-html="occurrence.description()"></p>
        </template>
        <p v-show="occurrences.length === 0 && Object.keys(stalls).length === 0" class="whitespace-pre-line p-1">
            {{ getNoOccurrenceString() }}
        </p>
        <p v-show="Object.keys(stalls).length > 0" class="sticky top-0 rounded-t bg-secondary p-1 text-center text-text">
            {{ TEXT.code_view.code_info.stalls_title }}
        </p>
        <p v-show="Object.keys(stalls).length > 0" class="whitespace-pre-line p-1">{{ getStallString() }}</p>
        <p
            v-show="occurrences.length === 1 && occurrences[0].recommendations().length > 0"
            class="sticky top-0 rounded-t bg-secondary p-1 text-center text-text"
        >
            {{ TEXT.code_view.code_info.recommendations_title }}
        </p>
        <p v-show="occurrences.length === 1 && occurrences[0].recommendations().length > 0" class="whitespace-pre-line p-1">
            {{ occurrences[0]?.recommendations() }}
        </p>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { useCodeViewerStore } from '../../../stores/CodeViewerStore';
import { TEXT } from '../../../../../config/text';
import { formatPercent, formatStall } from '../../../utils/formatters';

const props = defineProps({
    analysis: String,
    kernel: String,
    occurrences: Array,
    stalls: Object
});

const codeViewerStore = useCodeViewerStore();

const selectedLine = computed(() => codeViewerStore.getSelectedLine);

function getNoOccurrenceString() {
    if (!selectedLine.value) {
        return TEXT.analyses.general.code_info.no_line_selected;
    }
    return TEXT.analyses.general.code_info.no_info;
}

function getStallString() {
    const total = Object.values(props.stalls).reduce((a, b) => a + b, 0);
    let result = `${total} stall${total > 1 ? 's have' : ' has'} occurred in the current line:\n`;
    for (const [stall, value] of Object.entries(props.stalls)) {
        result += `- ${formatStall(stall)}: ${value} (${formatPercent((value / total) * 100)})\n`;
    }
    return result;
}
</script>
