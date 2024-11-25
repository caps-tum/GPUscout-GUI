<template>
    <MemoryGraph
        :title="TEXT.analyses.use_texture.top_section.memory_graph.title"
        :analysis-data="analysisData"
        :comparison-analysis-data="comparisonAnalysisData"
        :graph="MEMORY_GRAPH_DEFINITION.texture_memory"
        :expanded="expandedSection === 1"
        @expand="expandedSection = 1"
    />
    <MetricSection
        :title="TEXT.analyses.general.warp_stall_analysis.title"
        :hint="TEXT.analyses.general.warp_stall_analysis.hint"
        :analysis-data="analysisData"
        :comparison-analysis-data="comparisonAnalysisData"
        :metrics="[
            METRICS.stalls_total.name,
            METRICS.stalls_long_scoreboard_perc.name,
            METRICS.stalls_tex_throttle_perc.name
        ]"
        :values="[
            (analysis, metric) => analysis.getMetric(metric),
            (analysis, metric) => analysis.getMetric(metric),
            (analysis, metric) => analysis.getMetric(metric)
        ]"
        :absolute-values="[(analysis) => analysis.getMetric(METRICS.stalls_total.name)]"
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
import { MEMORY_GRAPH_DEFINITION } from '../../../../../../config/memory_graphs';
import MemoryGraph from '../../../ui/memory_graph/MemoryGraph.vue';
import { METRICS } from '../../../../../../config/metrics';

defineProps({
    analysisData: Analysis,
    comparisonAnalysisData: Analysis
});

const expandedSection = ref(1);
</script>
