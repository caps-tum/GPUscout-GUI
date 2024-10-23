<template>
    <div class="flex flex-col rounded bg-secondary/50 p-2 pt-1">
        <p class="text-xl text-text">{{ title }}</p>
        <p v-if="hint" class="-mt-1 text-sm text-text/50">{{ hint }}</p>
        <div class="flex flex-grow gap-x-2 gap-y-2">
            <ButtonMetric
                v-for="(metric, index) in metrics"
                :key="metric"
                :metric="metric.title || metric"
                :hint="metric.hint"
                :value="values[index](analysisData)"
                :comparison-value="values[index](comparisonAnalysisData)"
                :absolute-value="
                    absoluteValues ? absoluteValues[Math.min(absoluteValues.length - 1, index)](analysisData) : undefined
                "
                :comparison-absolute-value="
                    absoluteValues
                        ? absoluteValues[Math.min(absoluteValues.length - 1, index)](comparisonAnalysisData)
                        : undefined
                "
            />
        </div>
    </div>
</template>
<script setup>
import { Analysis } from '../../../utils/Analysis';
import ButtonMetric from '../buttons/ButtonMetric.vue';

defineProps({
    title: String,
    hint: String,
    analysisData: Analysis,
    comparisonAnalysisData: Analysis,
    metrics: Array,
    values: Array,
    absoluteValues: Array
});
</script>
