<template>
    <p class="whitespace-pre-line">{{ getOccurrenceString() }}</p>
    <p class="mt-2 whitespace-pre-line">{{ getStallString() }}</p>
</template>
<script setup>
import { computed } from 'vue';
import { CODE_TYPE, useCodeViewerStore } from '../../../stores/CodeViewerStore';
import { Occurrence } from '../../../utils/Analysis';
import { TEXT } from '../../../../../config/text';
import { useDataStore } from '../../../stores/DataStore';

const props = defineProps({
    analysis: String,
    kernel: String,
    occurrence: Occurrence,
    stalls: Array
});

const codeViewerStore = useCodeViewerStore();
const dataStore = useDataStore();

const selectedLine = computed(() => codeViewerStore.getSelectedLine);
const currentView = computed(() => codeViewerStore.getCurrentView);

function getOccurrenceString() {
    if (props.occurrence) {
        return props.occurrence.description();
    } else if (!selectedLine.value) {
        return TEXT.analyses.general.code_info.no_line_selected;
    } else if (
        currentView.value === CODE_TYPE.SOURCE_CODE &&
        dataStore
            .getGPUscoutResult()
            .getAnalysis(props.analysis, props.kernel)
            .getOccurrence(CODE_TYPE.SOURCE_CODE, selectedLine.value)
    ) {
        return TEXT.analyses.general.code_info.source_occurrence_selected;
    }
    return TEXT.analyses.general.code_info.no_info;
}

function getStallString() {
    if (props.stalls.length === 0) {
        return '';
    }
    let result = 'Stalls in the current line:\n';
    for (const stall of props.stalls) {
        result += stall[0] + ' ' + stall[1] + '\n';
    }
    return result;
}
</script>
