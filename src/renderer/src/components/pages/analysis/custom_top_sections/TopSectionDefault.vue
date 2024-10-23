<template>
    <MetricSection
        title="Metrics"
        hint="Important metrics to watch out for"
        :metrics="Object.keys(analysisData.getMetrics())"
        :values="Object.values(analysisData.getMetrics())"
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
