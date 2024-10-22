<template>
    <MetricSection title="Metrics" hint="Important metrics to watch out for">
        <ButtonMetric
            v-for="[metricName, metricValue] of Object.entries(analysisData.getMetrics())"
            :key="metricName"
            :metric="metricName"
            :value="metricValue"
        />
    </MetricSection>
</template>
<script setup>
import ButtonMetric from '../../../ui/buttons/ButtonMetric.vue';
import MetricSection from '../../../ui/sections/MetricSection.vue';
import { Analysis } from '../../../../utils/Analysis';

defineProps({
    analysisData: Analysis,
    comparisonAnalysisData: Analysis
});
</script>
