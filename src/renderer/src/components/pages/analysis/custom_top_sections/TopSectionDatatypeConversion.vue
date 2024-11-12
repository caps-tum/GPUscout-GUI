<template>
    <MemoryGraph
        :title="TEXT.analyses.register_spilling.top_section.memory_graph.title"
        :analysis-data="analysisData"
        :comparison-analysis-data="comparisonAnalysisData"
        :sections="MEMORY_GRAPH_DEFINITION.global_caches"
        :expanded="expandedSection === 1"
        @expand="expandedSection = 1"
    />

    <MetricSection
        v-if="analysisData.getOccurrences()"
        :title="TEXT.analyses.datatype_conversion.top_section.conversion_numbers.title"
        :hint="TEXT.analyses.datatype_conversion.top_section.conversion_numbers.hint"
        :analysis-data="analysisData"
        :comparison-analysis-data="comparisonAnalysisData"
        :metrics="[
            TEXT.analyses.datatype_conversion.top_section.conversion_numbers.type.total,
            TEXT.analyses.datatype_conversion.top_section.conversion_numbers.type.f2f,
            TEXT.analyses.datatype_conversion.top_section.conversion_numbers.type.f2i,
            TEXT.analyses.datatype_conversion.top_section.conversion_numbers.type.i2f
        ]"
        :values="[
            (analysis) => analysis.getOccurrences().length,
            (analysis) => analysis.getOccurrences().filter((o) => o.type === 'F2F').length,
            (analysis) => analysis.getOccurrences().filter((o) => o.type === 'F2I').length,
            (analysis) => analysis.getOccurrences().filter((o) => o.type === 'I2F').length
        ]"
        :expanded="expandedSection === 2"
        @expand="expandedSection = 2"
    >
    </MetricSection>

    <MetricSection
        :title="TEXT.analyses.general.warp_stall_analysis.title"
        :hint="TEXT.analyses.general.warp_stall_analysis.hint"
        :analysis-data="analysisData"
        :comparison-analysis-data="comparisonAnalysisData"
        :metrics="[
            ANALYSIS.datatype_conversion.metrics.warps_active,
            ANALYSIS.datatype_conversion.metrics.warp_stalls_short_scoreboard_percent,
            ANALYSIS.datatype_conversion.metrics.warp_stalls_mio_throttle_percent,
            ANALYSIS.datatype_conversion.metrics.warp_stalls_tex_throttle_percent
        ]"
        :values="[
            (analysis, metric) => analysis.getMetric(metric),
            (analysis, metric) => analysis.getMetric(metric),
            (analysis, metric) => analysis.getMetric(metric),
            (analysis, metric) => analysis.getMetric(metric)
        ]"
        :absolute-values="[(analysis) => analysis.getMetric(ANALYSIS.datatype_conversion.metrics.warps_active)]"
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

defineProps({
    analysisData: Analysis,
    comparisonAnalysisData: Analysis
});

const expandedSection = ref(2);
</script>
