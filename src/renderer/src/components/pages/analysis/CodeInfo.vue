<template>
    <p class="whitespace-pre-line">{{ getOccurrenceString() }}</p>
</template>
<script setup>
import { computed } from 'vue';
import { useCodeViewerStore } from '../../../stores/CodeViewerStore';
import { Occurrence } from '../../../utils/Analysis';
import { TEXT } from '../../../../../config/text';

const props = defineProps({
    analysis: String,
    kernel: String,
    occurrence: Occurrence
});

const codeViewerStore = useCodeViewerStore();

const selectedLine = computed(() => codeViewerStore.getSelectedLine);

function getOccurrenceString() {
    if (props.occurrence) {
        return props.occurrence.description();
    } else if (!selectedLine.value) {
        return TEXT.analyses.general.code_info.no_line_selected;
    }
    return TEXT.analyses.general.code_info.no_info;
}
</script>
