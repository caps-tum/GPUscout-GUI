<template>
    <div class="flex h-full flex-row gap-2">
        <MetricSection
            :title="TEXT.analyses.general.warp_stall_analysis.title"
            :hint="TEXT.analyses.general.warp_stall_analysis.hint"
            :analysis-data="analysisData"
            :comparison-analysis-data="comparisonAnalysisData"
            :metrics="[
                METRICS.stalls_total.name,
                METRICS.stalls_short_scoreboard_perc.name,
                METRICS.stalls_long_scoreboard_perc.name,
                METRICS.stalls_imc_miss_perc.name,
                METRICS.stalls_lg_throttle_perc.name,
                METRICS.stalls_mio_throttle_perc.name,
                METRICS.stalls_tex_throttle_perc.name
            ]"
            :values="[
                (analysis, metric) => analysis.getMetric(metric),
                (analysis, metric) => analysis.getMetric(metric),
                (analysis, metric) => analysis.getMetric(metric),
                (analysis, metric) => analysis.getMetric(metric),
                (analysis, metric) => analysis.getMetric(metric),
                (analysis, metric) => analysis.getMetric(metric),
                (analysis, metric) => analysis.getMetric(metric)
            ]"
            :absolute-values="[(analysis) => analysis.getMetric(METRICS.stalls_total.name)]"
            :expanded="true"
        />
    </div>
</template>
<script setup>
import { METRICS } from '../../../../../config/metrics';
import { TEXT } from '../../../../../config/text';
import { Analysis } from '../../../utils/Analysis';
import MetricSection from '../../ui/sections/MetricSection.vue';

defineProps({
    analysisData: Analysis,
    comparisonAnalysisData: Analysis
});
</script>
