<template>
    <div class="flex h-full flex-row gap-2">
        <div class="grid max-h-60 flex-grow grid-cols-3 gap-1 overflow-y-auto">
            <ButtonMetricList
                v-for="metric in metrics"
                :key="metric"
                :metric="metric"
                :value="analysisData.getMetric(metric)"
                :comparison-value="comparisonAnalysisData ? comparisonAnalysisData.getMetric(metric) : undefined"
            />
        </div>
    </div>
</template>
<script setup>
import { METRICS } from '../../../../../config/metrics';
import { Analysis } from '../../../utils/Analysis';
import ButtonMetricList from '../../ui/buttons/ButtonMetricList.vue';

defineProps({
    analysisData: Analysis,
    comparisonAnalysisData: Analysis
});

const metrics = [
    METRICS.stalls_total.name,
    METRICS.stalls_short_scoreboard_perc.name,
    METRICS.stalls_long_scoreboard_perc.name,
    METRICS.stalls_imc_miss_perc.name,
    METRICS.stalls_lg_throttle_perc.name,
    METRICS.stalls_mio_throttle_perc.name,
    METRICS.stalls_tex_throttle_perc.name,
    METRICS.occupancy.name,
    METRICS.general_total_instructions.name
];
</script>
