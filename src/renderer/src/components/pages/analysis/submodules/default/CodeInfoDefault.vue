<template>
    <p class="whitespace-pre-line">{{ getOccurrenceString() }}</p>
</template>
<script setup>
import { Occurrence } from '../../../../../utils/Analysis';

const props = defineProps({
    kernel: String,
    selectedLine: [Number, String],
    currentView: Number,
    occurrence: Occurrence
});

function getOccurrenceString() {
    if (props.occurrence) {
        let resultString = 'Problem found:';
        for (const [key, value] of Object.entries(props.occurrence.data)) {
            resultString += `\n- ${key}: ${value}`;
        }
        return resultString;
    }
    return 'No info available for this code line. Select a highlighted line in the binary code to get information.';
}
</script>
