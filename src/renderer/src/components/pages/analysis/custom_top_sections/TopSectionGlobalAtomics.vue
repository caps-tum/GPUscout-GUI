<template>
    <MemoryGraph
        :title="TEXT.analyses.global_atomics.top_section.memory_graph.title"
        :analysis-data="analysisData"
        :comparison-analysis-data="comparisonAnalysisData"
        :sections="MEMORY_GRAPH_DEFINITION.atomics"
        :expanded="expandedSection === 1"
        :class="getOrderingClass(1)"
        @expand="expandedSection = 1"
    />
    <MetricSection
        :title="TEXT.analyses.global_atomics.top_section.atomics_usage.title"
        :hint="TEXT.analyses.global_atomics.top_section.atomics_usage.hint"
        :analysis-data="analysisData"
        :comparison-analysis-data="comparisonAnalysisData"
        :metrics="[ANALYSIS.global_atomics.metrics.atom_global_count, ANALYSIS.global_atomics.metrics.atom_shared_count]"
        :values="[(analysis, metric) => analysis.getMetric(metric), (analysis, metric) => analysis.getMetric(metric)]"
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
        :expanded="expandedSection === 3"
        :class="getOrderingClass(3)"
        @expand="expandedSection = 3"
    >
    </MetricSection>
</template>
<script setup>
import MetricSection from '../../../ui/sections/MetricSection.vue';
import { ANALYSIS } from '../../../../../../config/analyses';
import { TEXT } from '../../../../../../config/text';
import { Analysis } from '../../../../utils/Analysis';
import { ref } from 'vue';
import { MEMORY_GRAPH_DEFINITION } from '../../../../../../config/memory_graphs';
import MemoryGraph from '../../../ui/memory_graph/MemoryGraph.vue';

defineProps({
    analysisData: Analysis,
    comparisonAnalysisData: Analysis
});

const expandedSection = ref(1);

function getOrderingClass(section) {
    return section === expandedSection.value ? 'order-1' : 'order-2';
}
</script>
