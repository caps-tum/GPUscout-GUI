<template>
    <div class="relative min-w-16 flex-shrink flex-grow">
        <a class="flex h-full flex-col -space-y-1 rounded bg-primary py-1 pl-2 pr-3 text-background">
            <p class="pr-6 text-lg">{{ data.display_name }}</p>
            <p class="line-clamp-1 text-sm text-background/50">{{ hint || data.hint || '' }}</p>
            <div class="flex flex-row justify-between text-lg">
                <p>
                    {{ data.format_function(value, absoluteValue) }}
                </p>
                <div class="flex flex-row px-2">
                    <p v-if="value > comparisonValue && comparisonValue !== undefined" class="-mt-1 text-2xl text-red-400">
                        &#x2B06;
                    </p>
                    <p v-else-if="comparisonValue !== undefined" class="-mt-1 text-2xl text-green-400">&#x2B07;</p>
                    <p
                        v-if="comparisonValue !== undefined"
                        :class="value > comparisonValue ? 'text-red-400' : 'text-green-400'"
                    >
                        {{ data.format_function(value - comparisonValue) }}
                    </p>
                </div>
                <p v-if="comparisonValue !== undefined">
                    {{ data.format_function(comparisonValue, comparisonAbsoluteValue) }}
                </p>
            </div>
        </a>
        <ButtonHelp v-if="data.help_text" class="absolute right-2 top-2" @click="showHelpPopup" />
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

function showHelpPopup() {
    contextStore.togglePopup(POPUP.METRIC_HELP, true, {
        metricName: data.display_name,
        helpText: data.help_text
    });
}
</script>
