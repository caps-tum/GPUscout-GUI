<template>
    <div class="relative min-w-16 flex-shrink flex-grow">
        <a class="flex h-full flex-col -space-y-1 rounded bg-primary py-1 pl-2 pr-3 text-background">
            <p class="pr-6 text-lg">{{ data.display_name }}</p>
            <p class="line-clamp-2 max-w-80 text-sm text-background/50">{{ hint || data.hint || '' }}</p>
            <div class="flex justify-between" :class="getFlexDirection()">
                <p>
                    {{ data.format_function(value, absoluteValue) }}
                </p>
                <div
                    class="flex px-2"
                    :class="
                        (value <= comparisonValue && data.lower_better) || (value >= comparisonValue && !data.lower_better)
                            ? 'text-green-300 ' + getFlexDirection()
                            : 'text-red-300 ' + getFlexDirection()
                    "
                >
                    <p v-if="comparisonValue !== undefined">
                        {{ data.format_function(value - comparisonValue) }}
                    </p>
                    <p v-if="value > comparisonValue && comparisonValue !== undefined" class="-mt-1 text-2xl">&#x2B06;</p>
                    <p v-else-if="comparisonValue !== undefined" class="-mt-1 text-2xl">&#x2B07;</p>
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
    comparisonAbsoluteValue: Number,
    valueSmall: Boolean
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

/**
 * Order the elements in the correct order depending on if a comparison value is present or not
 * @returns {String}
 */
function getFlexDirection() {
    let flex = props.comparisonValue !== undefined ? 'flex-row-reverse' : 'flex-row';
    let textSize = props.valueSmall ? 'text-base' : 'text-lg';
    return flex + ' ' + textSize;
}
</script>
