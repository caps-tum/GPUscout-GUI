<!--
Component for a metric section in a analysis

Author: Tobias Stuckenberger
-->
<template>
    <div class="flex min-w-72 flex-col" :class="getOrderClass()">
        <div class="flex flex-col rounded bg-secondary/50 p-2 pt-1">
            <div class="flex flex-row items-start justify-between space-x-1">
                <p class="text-xl text-text">{{ title }}</p>
                <a v-show="!expanded" class="cursor-pointer" @click="emit('expand')">
                    <IconExpand class="mr-1 mt-1 h-4 w-4" />
                </a>
            </div>
            <p v-if="hint && expanded" class="-mt-1 text-sm text-text/50">{{ hint }}</p>
            <div
                v-if="expanded"
                class="flex max-h-56 flex-grow flex-row flex-wrap gap-x-2 gap-y-2 overflow-y-auto overflow-x-hidden"
            >
                <ButtonMetric
                    v-for="(metric, index) in metrics"
                    :key="metric"
                    :metric="metric.title || metric"
                    :hint="metric.hint"
                    :value="values[index](analysisData, metric)"
                    :comparison-value="comparisonAnalysisData ? values[index](comparisonAnalysisData, metric) : undefined"
                    :secondary-value="
                        secondaryValues
                            ? secondaryValues[Math.min(secondaryValues.length - 1, index)](analysisData, metric)
                            : undefined
                    "
                    :comparison-secondary-value="
                        secondaryValues && comparisonAnalysisData
                            ? secondaryValues[Math.min(secondaryValues.length - 1, index)](comparisonAnalysisData, metric)
                            : undefined
                    "
                />
            </div>
            <div v-else class="flex max-h-60 shrink-0 flex-grow flex-col flex-wrap gap-y-1 overflow-y-auto">
                <ButtonMetricList
                    v-for="(metric, index) in metrics"
                    :key="metric"
                    :metric="metric.title || metric"
                    :hint="metric.hint"
                    :value="values[index](analysisData, metric)"
                    :comparison-value="comparisonAnalysisData ? values[index](comparisonAnalysisData, metric) : undefined"
                />
            </div>
        </div>
        <div v-if="expanded" class="flex-grow"></div>
    </div>
    <div v-if="expanded" class="order-2 flex-grow"></div>
</template>
<script setup>
import { Analysis } from '../../../utils/Analysis';
import ButtonMetric from '../buttons/ButtonMetric.vue';
import ButtonMetricList from '../buttons/ButtonMetricList.vue';
import IconExpand from '../icons/IconExpand.vue';

const props = defineProps({
    title: String,
    hint: String,
    analysisData: Analysis,
    comparisonAnalysisData: Analysis,
    metrics: Array,
    values: Array,
    secondaryValues: Array,
    expanded: Boolean
});

const emit = defineEmits(['expand']);

/**
 * Order the elements based on the expanded state (The expanded metric section is always first)
 */
function getOrderClass() {
    return props.expanded ? 'order-1' : 'order-3';
}
</script>
