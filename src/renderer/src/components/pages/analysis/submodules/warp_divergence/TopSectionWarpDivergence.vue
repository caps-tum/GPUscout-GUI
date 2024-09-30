<template>
    <ButtonMetric
        title="Diverging Branches"
        hint="Percentage of branches that diverge"
        :value="analysisData.getMetric(WARP_DIVERGENCE_METRICS.BRANCH_DIVERGENCE_PERCENT) + '%'"
    />
</template>
<script setup>
import ButtonMetric from '../../../../ui/buttons/ButtonMetric.vue';
import { useDataStore } from '../../../../../stores/DataStore';
import { ANALYSES } from '../../../../../utils/GPUscoutResult';
import { computed } from 'vue';
import { WARP_DIVERGENCE_METRICS } from '../../../../../utils/analysisTypes/WarpDivergenceAnalysis';

const props = defineProps({
    kernel: String
});

const dataStore = useDataStore();

const analysisData = computed(() => dataStore.getGPUscoutResult().getAnalysis(ANALYSES.WARP_DIVERGENCE, props.kernel));
</script>
