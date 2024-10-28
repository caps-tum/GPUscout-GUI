<template>
    <div class="flex w-full flex-row">
        <MetricSection
            :title="TEXT.analyses.global_atomics.top_section.atomics_usage.title"
            :hint="TEXT.analyses.global_atomics.top_section.atomics_usage.hint"
            :analysis-data="analysisData"
            :comparison-analysis-data="comparisonAnalysisData"
            :metrics="[ANALYSIS.global_atomics.metrics.atom_global_count, ANALYSIS.global_atomics.metrics.atom_shared_count]"
            :values="[(analysis, metric) => analysis.getMetric(metric), (analysis, metric) => analysis.getMetric(metric)]"
        />
    </div>
    <MetricSection
        :title="TEXT.analyses.general.warp_stall_analysis.title"
        :hint="TEXT.analyses.general.warp_stall_analysis.hint"
        :analysis-data="analysisData"
        :comparison-analysis-data="comparisonAnalysisData"
        :metrics="[
            ANALYSIS.global_atomics.metrics.warps_active,
            ANALYSIS.global_atomics.metrics.warp_stalls_mio_throttle_percent,
            ANALYSIS.global_atomics.metrics.warp_stalls_long_scoreboard_percent,
            ANALYSIS.global_atomics.metrics.warp_stalls_lg_throttle_percent
        ]"
        :values="[
            (analysis, metric) => analysis.getMetric(metric),
            (analysis, metric) => analysis.getMetric(metric),
            (analysis, metric) => analysis.getMetric(metric),
            (analysis, metric) => analysis.getMetric(metric)
        ]"
        :absolute-values="[(analysis) => analysis.getMetric(ANALYSIS.global_atomics.metrics.warps_active)]"
    >
    </MetricSection>
</template>
<script setup>
import MetricSection from '../../../ui/sections/MetricSection.vue';
import { ANALYSIS } from '../../../../../../config/analyses';
import { TEXT } from '../../../../../../config/text';
import { POPUP, useContextStore } from '../../../../stores/ContextStore';
import { Analysis } from '../../../../utils/Analysis';

defineProps({
    analysisData: Analysis,
    comparisonAnalysisData: Analysis
});

const contextStore = useContextStore();

function openMemoryFlowPopup() {
    contextStore.togglePopup(POPUP.GLOBAL_MEMORY_FLOW, true);
}
</script>
