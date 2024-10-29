<template>
    <MemoryGraph
        title="Memory graph"
        :analysis-data="analysisData"
        :comparison-analysis-data="comparisonAnalysisData"
        :sections="MEMORY_GRAPH_DEFINITION.global_local_caches"
        :expanded="expandedSection === 1"
        :class="getOrderingClass(1)"
        @expand="expandedSection = 1"
    />
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
        :absolute-values="[
            () => 0,
            () => 0,
            (analysis) => analysis.getMetric(ANALYSIS.register_spilling.metrics.l2_queries_due_to_local_memory_percent),
            (analysis) =>
                ((analysis.getMetric(ANALYSIS.register_spilling.metrics.instructions_executed_local_loads) +
                    analysis.getMetric(ANALYSIS.register_spilling.metrics.instructions_executed_local_stores)) /
                    analysis.getMetric(ANALYSIS.register_spilling.metrics.instructions_executed)) *
                100
        ]"
        :expanded="expandedSection === 2"
        :class="getOrderingClass(2)"
        @expand="expandedSection = 2"
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
        :expanded="expandedSection === 3"
        :class="getOrderingClass(3)"
        @expand="expandedSection = 3"
    />
</template>
<script setup>
import MetricSection from '../../../ui/sections/MetricSection.vue';
import { ANALYSIS } from '../../../../../../config/analyses';
import { TEXT } from '../../../../../../config/text';
import { Analysis } from '../../../../utils/Analysis';
import { MEMORY_GRAPH_DEFINITION } from '../../../../../../config/memory_graphs';
import MemoryGraph from '../../../ui/memory_graph/MemoryGraph.vue';
import { ref } from 'vue';

defineProps({
    analysisData: Analysis,
    comparisonAnalysisData: Analysis
});

const expandedSection = ref(1);

const bandwidth = (analysis) =>
    Math.round(
        (analysis.getMetric(ANALYSIS.register_spilling.metrics.total_l2_queries) *
            analysis.getMetric(ANALYSIS.register_spilling.metrics.l2_queries_due_to_local_memory_percent)) /
            100
    );

const instructions = (analysis) =>
    Math.round(
        analysis.getMetric(ANALYSIS.register_spilling.metrics.instructions_executed_local_loads) +
            analysis.getMetric(ANALYSIS.register_spilling.metrics.instructions_executed_local_stores)
    );

function getOrderingClass(section) {
    return section === expandedSection.value ? 'order-1' : 'order-2';
}
</script>
