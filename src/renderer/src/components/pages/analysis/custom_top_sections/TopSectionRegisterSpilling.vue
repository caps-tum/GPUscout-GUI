<template>
    <MemoryGraph
        :title="TEXT.analyses.register_spilling.top_section.memory_graph.title"
        :analysis-data="analysisData"
        :comparison-analysis-data="comparisonAnalysisData"
        :graph="MEMORY_GRAPH_DEFINITION.global_local_caches"
        :expanded="expandedSection === 1"
        @expand="expandedSection = 1"
    />
    <MetricSection
        :title="TEXT.analyses.general.metrics.title"
        :hint="TEXT.analyses.general.metrics.hint"
        :analysis-data="analysisData"
        :comparison-analysis-data="comparisonAnalysisData"
        :metrics="[
            METRICS.occupancy.name,
            METRICS.local_loads_l1_cache_hit_perc.name,
            TEXT.analyses.register_spilling.top_section.lmem_impact.type.bandwidth,
            TEXT.analyses.register_spilling.top_section.lmem_impact.type.instruction
        ]"
        :values="[
            (analysis, metric) => analysis.getMetric(metric),
            (analysis, metric) => analysis.getMetric(metric),
            (analysis) =>
                Math.round(
                    analysis.getMetric(METRICS.general_l2_queries.name) *
                        (analysis.getMetric(METRICS.local_l2_queries_perc.name) / 100)
                ),
            (analysis) => analysis.getMetric(METRICS.local_instructions.name)
        ]"
        :absolute-values="[
            () => 0,
            () => 0,
            (analysis) => analysis.getMetric(METRICS.local_l2_queries_perc.name),
            (analysis) =>
                (analysis.getMetric(METRICS.local_instructions.name) /
                    analysis.getMetric(METRICS.general_total_instructions.name)) *
                100
        ]"
        :expanded="expandedSection === 2"
        @expand="expandedSection = 2"
    />
    <MetricSection
        :title="TEXT.analyses.general.warp_stall_analysis.title"
        :hint="TEXT.analyses.general.warp_stall_analysis.hint"
        :analysis-data="analysisData"
        :comparison-analysis-data="comparisonAnalysisData"
        :metrics="[
            METRICS.stalls_total.name,
            METRICS.stalls_long_scoreboard_perc.name,
            METRICS.stalls_lg_throttle_perc.name
        ]"
        :values="[
            (analysis, metric) => analysis.getMetric(metric),
            (analysis, metric) => analysis.getMetric(metric),
            (analysis, metric) => analysis.getMetric(metric)
        ]"
        :absolute-values="[(analysis) => analysis.getMetric(METRICS.stalls_total.name)]"
        :expanded="expandedSection === 3"
        @expand="expandedSection = 3"
    />
</template>
<script setup>
import MetricSection from '../../../ui/sections/MetricSection.vue';
import { TEXT } from '../../../../../../config/text';
import { Analysis } from '../../../../utils/Analysis';
import { MEMORY_GRAPH_DEFINITION } from '../../../../../../config/memory_graphs';
import MemoryGraph from '../../../ui/memory_graph/MemoryGraph.vue';
import { ref } from 'vue';
import { METRICS } from '../../../../../../config/metrics';

defineProps({
    analysisData: Analysis,
    comparisonAnalysisData: Analysis
});

const expandedSection = ref(1);
</script>
