<template>
    <MetricSection
        :title="TEXT.analyses.vectorization.top_section.load_analysis.title"
        :hint="TEXT.analyses.vectorization.top_section.load_analysis.hint"
    >
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.vectorization.metrics.non_vectorized_loads)"
            :metric="ANALYSIS.vectorization.metrics.non_vectorized_loads"
        />
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.vectorization.metrics.instructions_executed)"
            :metric="ANALYSIS.vectorization.metrics.instructions_executed"
        />
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.vectorization.metrics.instructions_executed_global_loads)"
            :metric="ANALYSIS.vectorization.metrics.instructions_executed_global_loads"
        />
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.vectorization.metrics.occupancy)"
            :metric="ANALYSIS.vectorization.metrics.occupancy"
        />
    </MetricSection>
    <MetricSection
        :title="TEXT.analyses.general.warp_stall_analysis.title"
        :hint="TEXT.analyses.general.warp_stall_analysis.hint"
        :help-string="selectedStallHelp"
    >
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.vectorization.metrics.warps_active)"
            :metric="ANALYSIS.vectorization.metrics.warps_active"
        />
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.vectorization.metrics.warp_stalls_long_scoreboard_percent)"
            :metric="ANALYSIS.vectorization.metrics.warp_stalls_long_scoreboard_percent"
            :total-stalls="analysisData.getMetric(ANALYSIS.vectorization.metrics.warps_active)"
            @click="selectedStallHelp = TEXT.analyses.vectorization.top_section.help_strings.long_scoreboard"
        />
    </MetricSection>
</template>
<script setup>
import MetricSection from '../../../ui/sections/MetricSection.vue';
import ButtonMetric from '../../../ui/buttons/ButtonMetric.vue';
import { ref } from 'vue';
import { ANALYSIS } from '../../../../../../config/analyses';
import { TEXT } from '../../../../../../config/text';
import { Analysis } from '../../../../utils/Analysis';

defineProps({
    analysisData: Analysis,
    comparisonAnalysisData: Analysis
});

const selectedStallHelp = ref('');
</script>
