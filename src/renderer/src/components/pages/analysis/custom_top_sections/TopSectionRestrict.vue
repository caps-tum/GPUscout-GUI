<template>
    <MetricSection :title="TEXT.analyses.general.metrics.title" :hint="TEXT.analyses.general.metrics.hint">
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.use_restrict.metrics.instructions_executed_global_operations)"
            :metric="ANALYSIS.use_restrict.metrics.instructions_executed_global_operations"
        />
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.use_restrict.metrics.warps_active)"
            :metric="ANALYSIS.use_restrict.metrics.warps_active"
        />
    </MetricSection>
    <MetricSection
        :title="TEXT.analyses.general.warp_stall_analysis.title"
        :hint="TEXT.analyses.general.warp_stall_analysis.hint"
        :help-string="selectedStallHelp"
    >
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.use_restrict.metrics.warps_active)"
            :metric="ANALYSIS.use_restrict.metrics.warps_active"
        />
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.use_restrict.metrics.warp_stalls_long_scoreboard_percent)"
            :metric="ANALYSIS.use_restrict.metrics.warp_stalls_long_scoreboard_percent"
            :total-stalls="analysisData.getMetric(ANALYSIS.use_restrict.metrics.warps_active)"
            @click="selectedStallHelp = TEXT.analyses.use_restrict.top_section.help_strings.long_scoreboard"
        />
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.use_restrict.metrics.warp_stalls_imc_miss_percent)"
            :metric="ANALYSIS.use_restrict.metrics.warp_stalls_imc_miss_percent"
            :total-stalls="analysisData.getMetric(ANALYSIS.use_restrict.metrics.warps_active)"
            @click="selectedStallHelp = TEXT.analyses.use_restrict.top_section.help_strings.imc_miss"
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
