<template>
    <MemoryGraph
        :title="TEXT.analyses.use_texture.top_section.memory_graph.title"
        :analysis-data="analysisData"
        :comparison-analysis-data="comparisonAnalysisData"
        :sections="MEMORY_GRAPH_DEFINITION.texture_memory"
        :expanded="expandedSection === 1"
        @expand="expandedSection = 1"
    />
    <MetricSection
        :title="TEXT.analyses.general.warp_stall_analysis.title"
        :hint="TEXT.analyses.general.warp_stall_analysis.hint"
        :analysis-data="analysisData"
        :comparison-analysis-data="comparisonAnalysisData"
        :metrics="[
            ANALYSIS.use_texture.metrics.warps_active,
            ANALYSIS.use_texture.metrics.warp_stalls_long_scoreboard_percent,
            ANALYSIS.use_texture.metrics.warp_stalls_tex_throttle_percent
        ]"
        :values="[
            (analysis, metric) => analysis.getMetric(metric),
            (analysis, metric) => analysis.getMetric(metric),
            (analysis, metric) => analysis.getMetric(metric)
        ]"
        :absolute-values="[(analysis) => analysis.getMetric(ANALYSIS.use_texture.metrics.warps_active)]"
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

defineProps({
    analysisData: Analysis,
    comparisonAnalysisData: Analysis
});

const expandedSection = ref(1);
</script>
