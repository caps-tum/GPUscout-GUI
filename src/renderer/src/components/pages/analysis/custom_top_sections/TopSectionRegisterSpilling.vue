<template>
    <div class="flex w-full flex-row space-x-2">
        <MemoryFlowGlobalLocal :analysis-data="analysisData" :comparison-analysis-data="comparisonAnalysisData" />
        <MetricSection
            :title="TEXT.analyses.general.metrics.title"
            :hint="TEXT.analyses.general.metrics.hint"
            :analysis-data="analysisData"
            :comparison-analysis-data="comparisonAnalysisData"
            :metrics="[
                ANALYSIS.register_spilling.metrics.occupancy,
                ANALYSIS.register_spilling.metrics.local_memory_to_l1_cache_miss_percent,
                TEXT.analyses.register_spilling.top_section.lmem_impact.type.bandwidth,
                TEXT.analyses.register_spilling.top_section.lmem_impact.type.instruction
            ]"
            :values="[
                (analysis, metric) => analysis.getMetric(metric),
                (analysis, metric) => analysis.getMetric(metric),
                bandwidth,
                instructions
            ]"
        />
        <MetricSection
            :title="TEXT.analyses.general.warp_stall_analysis.title"
            :hint="TEXT.analyses.general.warp_stall_analysis.hint"
            :analysis-data="analysisData"
            :comparison-analysis-data="comparisonAnalysisData"
            :metrics="[
                ANALYSIS.register_spilling.metrics.warps_active,
                ANALYSIS.register_spilling.metrics.warp_stalls_long_scoreboard_percent,
                ANALYSIS.register_spilling.metrics.warp_stalls_lg_throttle_percent
            ]"
            :values="[
                (analysis, metric) => analysis.getMetric(metric),
                (analysis, metric) => analysis.getMetric(metric),
                (analysis, metric) => analysis.getMetric(metric)
            ]"
            :absolute-values="[(analysis) => analysis.getMetric(ANALYSIS.register_spilling.metrics.warps_active)]"
        />
    </div>
</template>
<script setup>
import MetricSection from '../../../ui/sections/MetricSection.vue';
import { ANALYSIS } from '../../../../../../config/analyses';
import { TEXT } from '../../../../../../config/text';
import { POPUP, useContextStore } from '../../../../stores/ContextStore';
import { formatNumber, formatPercent } from '../../../../utils/formatters';
import { Analysis } from '../../../../utils/Analysis';
import MemoryFlowGlobalLocal from './memory_graphs/MemoryFlowGlobalLocal.vue';

defineProps({
    analysisData: Analysis,
    comparisonAnalysisData: Analysis
});

const contextStore = useContextStore();

const bandwidth = (analysis) =>
    formatNumber(
        (analysis.getMetric(ANALYSIS.register_spilling.metrics.total_l2_queries) *
            analysis.getMetric(ANALYSIS.register_spilling.metrics.l2_queries_due_to_local_memory_percent)) /
            100
    ) +
    ' (' +
    formatPercent(analysis.getMetric(ANALYSIS.register_spilling.metrics.l2_queries_due_to_local_memory_percent)) +
    ')';

const instructions = (analysis) =>
    formatNumber(
        analysis.getMetric(ANALYSIS.register_spilling.metrics.instructions_executed_local_loads) +
            analysis.getMetric(ANALYSIS.register_spilling.metrics.instructions_executed_local_stores)
    ) +
    ' (' +
    formatPercent(
        ((analysis.getMetric(ANALYSIS.register_spilling.metrics.instructions_executed_local_loads) +
            analysis.getMetric(ANALYSIS.register_spilling.metrics.instructions_executed_local_stores)) /
            analysis.getMetric(ANALYSIS.register_spilling.metrics.instructions_executed)) *
            100
    ) +
    ')';

function openMemoryFlowPopup() {
    contextStore.togglePopup(POPUP.GLOBAL_LOCAL_MEMORY_FLOW, true);
}
</script>
