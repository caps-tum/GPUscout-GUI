<template>
    <MemoryGraph
        :title="TEXT.analyses.global_atomics.top_section.memory_graph.title"
        :analysis-data="analysisData"
        :comparison-analysis-data="comparisonAnalysisData"
        :graph="MEMORY_GRAPH_DEFINITION.atomics"
        :expanded="expandedSection === 1"
        @expand="expandedSection = 1"
    />
    <MetricSection
        :title="TEXT.analyses.global_atomics.top_section.atomics_usage.title"
        :hint="TEXT.analyses.global_atomics.top_section.atomics_usage.hint"
        :analysis-data="analysisData"
        :comparison-analysis-data="comparisonAnalysisData"
        :metrics="[METRICS.global_atomics_count.name, METRICS.shared_atomics_count.name]"
        :values="[(analysis, metric) => analysis.getMetric(metric), (analysis, metric) => analysis.getMetric(metric)]"
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
            METRICS.stalls_mio_throttle_perc.name,
            METRICS.stalls_long_scoreboard_perc.name,
            METRICS.stalls_lg_throttle_perc.name
        ]"
        :values="[
            (analysis, metric) => analysis.getMetric(metric),
            (analysis, metric) => analysis.getMetric(metric),
            (analysis, metric) => analysis.getMetric(metric),
            (analysis, metric) => analysis.getMetric(metric)
        ]"
        :absolute-values="[(analysis) => analysis.getMetric(METRICS.stalls_total.name)]"
        :expanded="expandedSection === 3"
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
import { METRICS } from '../../../../../../config/metrics';

defineProps({
    analysisData: Analysis,
    comparisonAnalysisData: Analysis
});

const expandedSection = ref(1);
</script>
