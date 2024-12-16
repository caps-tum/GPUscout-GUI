<!--
Component for the top metric section of the summary page, which contains a list
of predefined metrics.

Author: Tobias Stuckenberger
-->
<template>
    <div class="flex h-full flex-row gap-2">
        <div class="grid max-h-60 flex-grow grid-cols-3 gap-1 overflow-y-auto">
            <ButtonMetricList
                v-for="metric in metrics"
                :key="metric"
                :metric="metric"
                :value="result.getMetric(kernel, metric)"
                :comparison-value="comparisonResult ? comparisonResult.getMetric(kernel, metric) : undefined"
            />
        </div>
    </div>
</template>
<script setup>
import { METRICS } from '../../../../../config/metrics';
import { GPUscoutResult } from '../../../utils/GPUscoutResult';
import ButtonMetricList from '../../ui/buttons/ButtonMetricList.vue';

defineProps({
    kernel: String,
    result: GPUscoutResult,
    comparisonResult: GPUscoutResult
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
