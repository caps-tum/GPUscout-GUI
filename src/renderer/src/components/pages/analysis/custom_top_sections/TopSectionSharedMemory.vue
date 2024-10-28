<template>
    <MetricSection
        :title="TEXT.analyses.use_shared.top_section.shared_usage.title"
        :hint="TEXT.analyses.use_shared.top_section.shared_usage.hint"
        :analysis-data="analysisData"
        :comparison-analysis-data="comparisonAnalysisData"
        :metrics="[
            ANALYSIS.use_shared.metrics.shared_memory_load_count,
            ANALYSIS.use_shared.metrics.shared_memory_load_efficiency_percent,
            ANALYSIS.use_shared.metrics.bank_conflict
        ]"
        :values="[
            (analysis, metric) => analysis.getMetric(metric),
            (analysis, metric) => analysis.getMetric(metric),
            (analysis, metric) => analysis.getMetric(metric)
        ]"
    />
    <MetricSection
        :title="TEXT.analyses.general.warp_stall_analysis.title"
        :hint="TEXT.analyses.general.warp_stall_analysis.hint"
        :analysis-data="analysisData"
        :comparison-analysis-data="comparisonAnalysisData"
        :metrics="[
            ANALYSIS.use_shared.metrics.warps_active,
            ANALYSIS.use_shared.metrics.warp_stalls_long_scoreboard_percent,
            ANALYSIS.use_shared.metrics.warp_stalls_mio_throttle_percent
        ]"
        :values="[
            (analysis, metric) => analysis.getMetric(metric),
            (analysis, metric) => analysis.getMetric(metric),
            (analysis, metric) => analysis.getMetric(metric)
        ]"
        :absolute-values="[(analysis) => analysis.getMetric(ANALYSIS.use_shared.metrics.warps_active)]"
    >
    </MetricSection>
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
