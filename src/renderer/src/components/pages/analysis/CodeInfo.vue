<template>
    <div class="flex flex-col">
        <p v-show="occurrence !== undefined" class="sticky top-0 rounded-t bg-secondary p-1 text-center text-text">
            {{ occurrence?.title() || '' }}
        </p>
        <p class="whitespace-pre-line p-1" v-html="getOccurrenceString()"></p>
        <p v-show="stalls.length > 0" class="sticky top-0 mt-2 bg-secondary p-1 text-center text-text">
            The following stalls have been detected
        </p>
        <p v-show="stalls.length > 0" class="mt-2 whitespace-pre-line p-1">{{ getStallString() }}</p>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { CODE_TYPE, useCodeViewerStore } from '../../../stores/CodeViewerStore';
import { Occurrence } from '../../../utils/Analysis';
import { TEXT } from '../../../../../config/text';
import { useDataStore } from '../../../stores/DataStore';
import { formatStall } from '../../../utils/formatters';

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
    let result = '';
    for (const stall of props.stalls) {
        result += '- ' + formatStall(stall[0]) + ': ' + stall[1] + '\n';
    }
    return result;
}
</script>
