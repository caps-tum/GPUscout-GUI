<template>
    <MetricSection
        :title="TEXT.analyses.use_shared.top_section.shared_usage.title"
        :hint="TEXT.analyses.use_shared.top_section.shared_usage.hint"
    >
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.use_shared.metrics.shared_memory_load_count)"
            :metric="ANALYSIS.use_shared.metrics.shared_memory_load_count"
        />
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.use_shared.metrics.shared_memory_load_efficiency_percent)"
            :metric="ANALYSIS.use_shared.metrics.shared_memory_load_efficiency_percent"
        />
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.use_shared.metrics.bank_conflict)"
            :metric="ANALYSIS.use_shared.metrics.bank_conflict"
        />
    </MetricSection>
    <MetricSection
        :title="TEXT.analyses.general.warp_stall_analysis.title"
        :hint="TEXT.analyses.general.warp_stall_analysis.hint"
    >
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.use_shared.metrics.warps_active)"
            :metric="ANALYSIS.use_shared.metrics.warps_active"
        />
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.use_shared.metrics.warp_stalls_long_scoreboard_percent)"
            :metric="ANALYSIS.use_shared.metrics.warp_stalls_mio_throttle_percent"
            :total-stalls="analysisData.getMetric(ANALYSIS.use_shared.metrics.warps_active)"
        />
        <ButtonMetric
            :value="analysisData.getMetric(ANALYSIS.use_shared.metrics.warp_stalls_mio_throttle_percent)"
            :metric="ANALYSIS.use_shared.metrics.warp_stalls_mio_throttle_percent"
            :total-stalls="analysisData.getMetric(ANALYSIS.use_shared.metrics.warps_active)"
        />
    </MetricSection>
</template>
<script setup>
import MetricSection from '../../../ui/sections/MetricSection.vue';
import ButtonMetric from '../../../ui/buttons/ButtonMetric.vue';
import { useDataStore } from '../../../../stores/DataStore';
import { computed, ref } from 'vue';
import { ANALYSIS } from '../../../../../../config/analyses';
import { TEXT } from '../../../../../../config/text';

const props = defineProps({
    kernel: String
});

const dataStore = useDataStore();

const analysisData = computed(() => dataStore.getGPUscoutResult().getAnalysis(ANALYSIS.vectorization.name, props.kernel));
</script>
