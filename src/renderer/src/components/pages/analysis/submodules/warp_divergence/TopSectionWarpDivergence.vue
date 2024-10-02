<template>
    <MetricSection title="Metrics" hint="Important metrics to watch out for">
        <ButtonMetric
            title="Diverging Branches"
            hint="Percentage of branches that diverge"
            :value="analysisData.getMetric(ANALYSIS.warp_divergence.metrics.branch_divergence_percent) + '%'"
        />
    </MetricSection>
</template>
<script setup>
import ButtonMetric from '../../../../ui/buttons/ButtonMetric.vue';
import MetricSection from '../../../../ui/sections/MetricSection.vue';
import { useDataStore } from '../../../../../stores/DataStore';
import { computed } from 'vue';
import { ANALYSIS } from '../../../../../../../config/analyses';

const props = defineProps({
    kernel: String
});

const dataStore = useDataStore();

const analysisData = computed(() => dataStore.getGPUscoutResult().getAnalysis(ANALYSIS.warp_divergence.name, props.kernel));
</script>
