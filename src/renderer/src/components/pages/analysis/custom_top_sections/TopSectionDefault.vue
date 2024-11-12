<template>
    <MetricSection
        title="Metrics"
        hint="Important metrics to watch out for"
        :expanded="true"
        :analysis-data="analysisData"
        :comparison-analysis-data="comparisonAnalysisData"
        :metrics="Object.keys(analysisData.getOwnMetrics())"
        :values="Array(analysisData.getOwnMetrics().length).fill((analysis, metric) => analysis.getMetric(metric))"
    >
    </MetricSection>
</template>
<script setup>
import MetricSection from '../../../ui/sections/MetricSection.vue';
import { Analysis } from '../../../../utils/Analysis';

defineProps({
    analysisData: Analysis,
    comparisonAnalysisData: Analysis
});
</script>
