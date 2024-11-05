<template>
    <div class="shrink-0">
        <a class="flex h-full flex-row justify-between space-x-2 rounded bg-primary p-2 py-1 text-background">
            <div class="flex flex-row items-center justify-center">
                <p>{{ data.display_name }}</p>
                <ButtonHelp
                    v-if="data.help_text"
                    class="ml-1 self-start *:h-4 *:min-h-4 *:w-4 *:min-w-4"
                    @click="showHelpPopup"
                />
            </div>
            <div class="flex flex-row items-center justify-between text-sm">
                <p v-if="comparisonValue !== undefined" class="text-center">
                    {{ data.format_function(comparisonValue, comparisonAbsoluteValue) }}
                </p>
                <p v-if="comparisonValue !== undefined" class="px-1">vs</p>
                <p class="text-center">
                    {{ data.format_function(value, absoluteValue) }}
                </p>
            </div>
        </a>
    </div>
</template>
<script setup>
import { POPUP, useContextStore } from '../../../stores/ContextStore';
import { getMetricsData } from '../../../utils/formatters';
import ButtonHelp from './ButtonHelp.vue';

const props = defineProps({
    metric: String,
    value: [Number, String],
    comparisonValue: [Number, String],
    hint: String,
    absoluteValue: Number,
    comparisonAbsoluteValue: Number
});

const contextStore = useContextStore();
const data = getMetricsData(props.metric);

/**
 * Open the help popup with the relevant information
 */
function showHelpPopup() {
    contextStore.togglePopup(POPUP.METRIC_HELP, true, {
        metricName: data.display_name,
        helpText: data.help_text
    });
}
</script>
