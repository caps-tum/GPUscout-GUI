<template>
    <div class="flex w-full flex-row justify-between space-x-2">
        <MetricSection
            :expanded="true"
            :title="TEXT.analyses.general.metrics.title"
            :hint="TEXT.analyses.general.metrics.hint"
            :analysis-data="analysisData"
            :comparison-analysis-data="comparisonAnalysisData"
            :metrics="[
                ANALYSIS.use_restrict.metrics.instructions_executed_global_operations,
                ANALYSIS.use_restrict.metrics.warps_active
            ]"
            :values="[(analysis, metric) => analysis.getMetric(metric), (analysis, metric) => analysis.getMetric(metric)]"
        />
        <MetricSection
            :title="TEXT.analyses.general.warp_stall_analysis.title"
            :hint="TEXT.analyses.general.warp_stall_analysis.hint"
            :analysis-data="analysisData"
            :comparison-analysis-data="comparisonAnalysisData"
            :metrics="[
                ANALYSIS.use_restrict.metrics.warps_active,
                ANALYSIS.use_restrict.metrics.warp_stalls_long_scoreboard_percent,
                ANALYSIS.use_restrict.metrics.warp_stalls_imc_miss_percent
            ]"
            :values="[
                (analysis, metric) => analysis.getMetric(metric),
                (analysis, metric) => analysis.getMetric(metric),
                (analysis, metric) => analysis.getMetric(metric)
            ]"
            :absolute-values="[(analysis) => analysis.getMetric(ANALYSIS.use_restrict.metrics.warps_active)]"
        >
        </MetricSection>
    </div>
</template>
<script setup>
import MetricSection from '../../../ui/sections/MetricSection.vue';
import { ANALYSIS } from '../../../../../../config/analyses';
import { TEXT } from '../../../../../../config/text';
import { Analysis } from '../../../../utils/Analysis';

defineProps({
    analysisData: Analysis,
    comparisonAnalysisData: Analysis
});
</script>
