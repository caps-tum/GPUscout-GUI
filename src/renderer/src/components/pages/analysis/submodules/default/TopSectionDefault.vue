<template>
    <MetricSection title="Metrics" hint="Important metrics to watch out for">
        <ButtonMetric
            v-for="[metricName, metricValue] of Object.entries(analysisData.getMetrics())"
            :key="metricName"
            :title="metricName"
            hint="ToDo"
            :value="formatMetric(metricName, metricValue)"
        />
    </MetricSection>
</template>
<script setup>
import ButtonMetric from '../../../../ui/buttons/ButtonMetric.vue';
import MetricSection from '../../../../ui/sections/MetricSection.vue';
import { useDataStore } from '../../../../../stores/DataStore';
import { computed } from 'vue';
import { formatBytes, formatPercent } from '../../../../../utils/formatters';

const props = defineProps({
    kernel: String,
    analysis: String
});

const dataStore = useDataStore();

const analysisData = computed(() => dataStore.getGPUscoutResult().getAnalysis(props.analysis, props.kernel));

function formatMetric(name, value) {
    if (name.endsWith('bytes')) {
        return formatBytes(value);
    } else if (name.endsWith('perc') || name.includes('warp_issue')) {
        return formatPercent(value);
    }
    return value;
}
</script>
