<template>
    <div class="flex w-full flex-row space-x-2">
        <MetricSection
            :title="TEXT.analyses.register_spilling.top_section.lmem_impact.title"
            :hint="TEXT.analyses.register_spilling.top_section.lmem_impact.hint"
            :analysis-data="analysisData"
            :comparison-analysis-data="comparisonAnalysisData"
            :metrics="[
                TEXT.analyses.register_spilling.top_section.lmem_impact.type.bandwidth,
                TEXT.analyses.register_spilling.top_section.lmem_impact.type.instruction
            ]"
            :values="[bandwidth, instructions]"
            class="w-full"
        />
    </div>
    <div class="flex w-full flex-row space-x-2">
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
                (analysis) => analysis.getMetric(ANALYSIS.register_spilling.metrics.warps_active),
                (analysis) => analysis.getMetric(ANALYSIS.register_spilling.metrics.warp_stalls_long_scoreboard_percent),
                (analysis) => analysis.getMetric(ANALYSIS.register_spilling.metrics.warp_stalls_lg_throttle_percent)
            ]"
            :absolute-values="[(analysis) => analysis.getMetric(ANALYSIS.register_spilling.metrics.warps_active)]"
            class="w-2/3"
        />
        <MetricSection
            :title="TEXT.analyses.general.metrics.title"
            :hint="TEXT.analyses.general.metrics.hint"
            :analysis-data="analysisData"
            :comparison-analysis-data="comparisonAnalysisData"
            :metrics="[
                ANALYSIS.register_spilling.metrics.occupancy,
                ANALYSIS.register_spilling.metrics.local_memory_to_l1_cache_miss_percent
            ]"
            :values="[
                (analysis) => analysis.getMetric(ANALYSIS.register_spilling.metrics.occupancy),
                (analysis) => analysis.getMetric(ANALYSIS.register_spilling.metrics.local_memory_to_l1_cache_miss_percent)
            ]"
            class="w-1/3"
        >
        </MetricSection>
    </div>
</template>
<script setup>
import MetricSection from '../../../ui/sections/MetricSection.vue';
import { ANALYSIS } from '../../../../../../config/analyses';
import { TEXT } from '../../../../../../config/text';
import { POPUP, useContextStore } from '../../../../stores/ContextStore';
import { formatNumber, formatPercent } from '../../../../utils/formatters';
import { Analysis } from '../../../../utils/Analysis';

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
