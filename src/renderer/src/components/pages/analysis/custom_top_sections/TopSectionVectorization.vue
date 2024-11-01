<template>
    <MetricSection
        :title="TEXT.analyses.vectorization.top_section.load_analysis.title"
        :hint="TEXT.analyses.vectorization.top_section.load_analysis.hint"
        :analysis-data="analysisData"
        :comparison-analysis-data="comparisonAnalysisData"
        :metrics="[
            ANALYSIS.vectorization.metrics.non_vectorized_loads,
            ANALYSIS.vectorization.metrics.instructions_executed,
            ANALYSIS.vectorization.metrics.instructions_executed_global_loads,
            ANALYSIS.vectorization.metrics.occupancy
        ]"
        :values="[
            (analysis, metric) => analysis.getMetric(metric),
            (analysis, metric) => analysis.getMetric(metric),
            (analysis, metric) => analysis.getMetric(metric),
            (analysis, metric) => analysis.getMetric(metric)
        ]"
        :expanded="expandedSection === 1"
        @expand="expandedSection = 1"
    />
    <MetricSection
        :title="TEXT.analyses.general.warp_stall_analysis.title"
        :hint="TEXT.analyses.general.warp_stall_analysis.hint"
        :analysis-data="analysisData"
        :comparison-analysis-data="comparisonAnalysisData"
        :metrics="[
            ANALYSIS.vectorization.metrics.warps_active,
            ANALYSIS.vectorization.metrics.warp_stalls_long_scoreboard_percent
        ]"
        :values="[(analysis, metric) => analysis.getMetric(metric), (analysis, metric) => analysis.getMetric(metric)]"
        :absolute-values="[(analysis) => analysis.getMetric(ANALYSIS.vectorization.metrics.warps_active)]"
        :expanded="expandedSection === 2"
        @expand="expandedSection = 2"
    />
</template>
<script setup>
import MetricSection from '../../../ui/sections/MetricSection.vue';
import { ANALYSIS } from '../../../../../../config/analyses';
import { TEXT } from '../../../../../../config/text';
import { Analysis } from '../../../../utils/Analysis';
import { ref } from 'vue';

defineProps({
    analysisData: Analysis,
    comparisonAnalysisData: Analysis
});

const expandedSection = ref(1);
</script>
