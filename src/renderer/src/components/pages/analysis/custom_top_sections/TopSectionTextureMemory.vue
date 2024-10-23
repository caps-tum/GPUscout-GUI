<template>
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
            (analysis) => analysis.getMetric(ANALYSIS.use_texture.metrics.warps_active),
            (analysis) => analysis.getMetric(ANALYSIS.use_texture.metrics.warp_stalls_long_scoreboard_percent),
            (analysis) => analysis.getMetric(ANALYSIS.use_texture.metrics.warp_stalls_tex_throttle_percent)
        ]"
        :absolute-values="[(analysis) => analysis.getMetric(ANALYSIS.use_texture.metrics.warps_active)]"
    />
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
    contextStore.togglePopup(POPUP.TEXTURE_MEMORY_FLOW, true);
}
</script>
