<template>
    <MetricSection title="Metrics" hint="Important metrics to watch out for">
        <ButtonMetric
            v-for="[metricName, metricValue] of Object.entries(analysisData.getMetrics())"
            :key="metricName"
            :data="getMetricsData(metricName)"
            :value="metricValue"
        />
    </MetricSection>
</template>
<script setup>
import ButtonMetric from '../../../../ui/buttons/ButtonMetric.vue';
import MetricSection from '../../../../ui/sections/MetricSection.vue';
import { useDataStore } from '../../../../../stores/DataStore';
import { computed } from 'vue';
import { getMetricsData } from '../../../../../utils/formatters';

const props = defineProps({
    kernel: String,
    analysis: String
});

const dataStore = useDataStore();

const analysisData = computed(() => dataStore.getGPUscoutResult().getAnalysis(props.analysis, props.kernel));
</script>
